import os
import re
from typing import Any, Dict, List, Optional

import chromadb
import pandas as pd
import torch
from chromadb.config import Settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForCausalLM, AutoTokenizer

app = FastAPI(title="Minimal RAG")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "chroma")
EMBEDDING_MODEL_NAME = "BAAI/bge-small-en-v1.5"
GENERATION_MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
MAX_PROJECT_ROWS = int(os.getenv("MAX_PROJECT_ROWS", "300"))
RETRIEVAL_CANDIDATES = int(os.getenv("RETRIEVAL_CANDIDATES", "12"))
MAX_CONTEXT_DOCS = int(os.getenv("MAX_CONTEXT_DOCS", "4"))
MAX_ANSWER_SENTENCES = int(os.getenv("MAX_ANSWER_SENTENCES", "4"))

COMMON_GLOSSARY: Dict[str, str] = {
    "saas": "SaaS means Software as a Service. It is software hosted by a provider and accessed over the internet, usually through a subscription model.",
    "paas": "PaaS means Platform as a Service. It provides a managed platform for building and deploying applications without managing the underlying infrastructure.",
    "iaas": "IaaS means Infrastructure as a Service. It offers virtualized compute, storage, and networking resources on demand.",
    "devops": "DevOps is a set of practices that combines software development and IT operations to improve delivery speed, reliability, and collaboration.",
    "finops": "FinOps is a cloud financial operations practice that helps teams manage, optimize, and govern cloud costs.",
    "sso": "SSO means Single Sign-On. It allows users to log in once and access multiple systems without signing in repeatedly.",
}

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
GENERATION_DTYPE = torch.float16 if DEVICE == "cuda" else torch.float32

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME, device=DEVICE)

client = chromadb.Client(
    Settings(persist_directory=DB_PATH, is_persistent=True)
)

collection = client.get_or_create_collection(name="rag_collection")

tokenizer = AutoTokenizer.from_pretrained(GENERATION_MODEL_NAME)

model = AutoModelForCausalLM.from_pretrained(
    GENERATION_MODEL_NAME,
    torch_dtype=GENERATION_DTYPE,
)
model.to(DEVICE)
model.eval()

class AskRequest(BaseModel):
    question: str
    top_k: Optional[int] = None
    strict_grounding: bool = True


class LoadProjectsResponse(BaseModel):
    projects_loaded: int
    max_rows: int


class LoadProjectsRequest(BaseModel):
    max_rows: Optional[int] = None

def clean_text(text: str) -> str:
    return " ".join(str(text).split())


def tokenize(text: str) -> List[str]:
    return re.findall(r"\b[a-z0-9]+\b", text.lower())


def keyword_overlap_score(question: str, document: str) -> float:
    q_tokens = set(tokenize(question))
    if not q_tokens:
        return 0.0
    d_tokens = set(tokenize(document))
    if not d_tokens:
        return 0.0
    overlap = q_tokens.intersection(d_tokens)
    return len(overlap) / max(1, len(q_tokens))


def build_query_variants(question: str) -> List[str]:
    question = clean_text(question)
    if not question:
        return []

    variants = [question]

    replacements = {
        "project": "initiative",
        "projects": "initiatives",
        "app": "application",
        "apps": "applications",
        "tech": "technology",
        "platform": "stack",
        "description": "details",
    }

    expanded = question
    for source, target in replacements.items():
        expanded = re.sub(rf"\b{re.escape(source)}\b", target, expanded, flags=re.IGNORECASE)

    expanded = clean_text(expanded)
    if expanded and expanded.lower() != question.lower():
        variants.append(expanded)

    without_stopwords = " ".join(
        token
        for token in tokenize(question)
        if token not in {"the", "a", "an", "is", "are", "of", "for", "to", "in", "on"}
    )
    without_stopwords = clean_text(without_stopwords)
    if without_stopwords and without_stopwords.lower() != question.lower():
        variants.append(without_stopwords)

    deduped: List[str] = []
    seen = set()
    for q in variants:
        key = q.lower()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(q)

    return deduped[:3]


def extract_definition_term(question: str) -> str:
    normalized = clean_text(question).lower()

    patterns = [
        r"what\s+is\s+mean\s+by\s+([a-z0-9\-\+\.]{2,30})",
        r"what\s+does\s+([a-z0-9\-\+\.]{2,30})\s+mean",
        r"meaning\s+of\s+([a-z0-9\-\+\.]{2,30})",
        r"define\s+([a-z0-9\-\+\.]{2,30})",
        r"what\s+is\s+([a-z0-9\-\+\.]{2,30})",
    ]

    for pattern in patterns:
        match = re.search(pattern, normalized)
        if match:
            return match.group(1).strip().lower()

    if re.fullmatch(r"[a-z0-9\-\+\.]{2,30}", normalized):
        return normalized

    return ""


def extract_sentences(text: str) -> List[str]:
    chunks = re.split(r"(?<=[.!?])\s+|\n+", clean_text(text))
    sentences = [chunk.strip() for chunk in chunks if chunk.strip()]
    return sentences


def get_definition_from_context(term: str, selected_docs: List[Dict[str, Any]]) -> str:
    if not term:
        return ""

    candidates: List[str] = []
    for item in selected_docs:
        for sentence in extract_sentences(item.get("document", "")):
            if re.search(rf"\b{re.escape(term)}\b", sentence, flags=re.IGNORECASE):
                candidates.append(sentence)

    if not candidates:
        return ""

    candidates.sort(
        key=lambda sentence: keyword_overlap_score(term, sentence),
        reverse=True,
    )

    return candidates[0]


def truncate_answer(answer: str, max_sentences: int) -> str:
    sentences = extract_sentences(answer)
    if not sentences:
        return clean_text(answer)

    limited = sentences[:max_sentences]
    return " ".join(limited).strip()


def build_project_text(row: pd.Series, column_order: List[str]) -> str:
    lines: List[str] = []
    for col in column_order:
        value = clean_text(row.get(col, ""))
        if value:
            lines.append(f"{col}: {value}")
    return "\n".join(lines)


def load_project_data(max_rows: int = MAX_PROJECT_ROWS) -> int:
    file_path = os.path.join(BASE_DIR, "data", "Project.csv")

    if not os.path.exists(file_path):
        print("Project.csv not found")
        return 0

    df = pd.read_csv(file_path).fillna("")
    if df.empty:
        print("Project.csv is empty")
        return 0

    limited_df = df.head(max_rows)

    try:
        collection.delete(where={})
    except Exception:
        pass

    preferred_columns = ["title", "description", "platform", "appType"]
    dynamic_columns = [
        col
        for col in limited_df.columns.tolist()
        if col not in preferred_columns
    ]
    selected_columns = preferred_columns + dynamic_columns

    chunks: List[str] = []
    ids: List[str] = []
    metadatas: List[Dict[str, Any]] = []

    for row_idx, row in limited_df.iterrows():
        text = build_project_text(row, selected_columns)
        text = clean_text(text)
        if not text:
            continue

        title = clean_text(row.get("title", "")) or f"Project row {row_idx + 1}"
        source = f"project_row_{row_idx + 1}"

        chunks.append(text)
        ids.append(source)
        metadatas.append(
            {
                "title": title,
                "source": source,
                "row": int(row_idx + 1),
            }
        )

    if not chunks:
        print("No valid rows found to index")
        return 0

    embeddings = embedding_model.encode(
        chunks,
        batch_size=16,
        normalize_embeddings=True,
    ).tolist()

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas,
    )

    print(f"{len(chunks)} projects loaded successfully (max_rows={max_rows})")
    return len(chunks)


def rerank_results(question: str, results: Dict[str, Any]) -> List[Dict[str, Any]]:
    documents = (results.get("documents") or [[]])[0]
    metadatas = (results.get("metadatas") or [[]])[0]
    distances = (results.get("distances") or [[]])[0]

    ranked: List[Dict[str, Any]] = []

    for idx, doc in enumerate(documents):
        distance = float(distances[idx]) if idx < len(distances) else 1.0
        semantic_score = 1.0 / (1.0 + max(distance, 0.0))
        lexical_score = keyword_overlap_score(question, doc)
        combined_score = 0.78 * semantic_score + 0.22 * lexical_score

        metadata = metadatas[idx] if idx < len(metadatas) else {}

        ranked.append(
            {
                "document": doc,
                "metadata": metadata,
                "semantic_score": semantic_score,
                "lexical_score": lexical_score,
                "combined_score": combined_score,
            }
        )

    ranked.sort(key=lambda item: item["combined_score"], reverse=True)
    return ranked


def retrieve_and_rerank(question: str, n_results: int) -> List[Dict[str, Any]]:
    variants = build_query_variants(question)
    if not variants:
        return []

    query_embeddings = embedding_model.encode(
        variants,
        normalize_embeddings=True,
    ).tolist()

    query_results = collection.query(
        query_embeddings=query_embeddings,
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )

    merged: Dict[str, Dict[str, Any]] = {}

    all_documents = query_results.get("documents") or []
    all_metadatas = query_results.get("metadatas") or []
    all_distances = query_results.get("distances") or []

    for query_index, variant in enumerate(variants):
        docs = all_documents[query_index] if query_index < len(all_documents) else []
        metas = all_metadatas[query_index] if query_index < len(all_metadatas) else []
        dists = all_distances[query_index] if query_index < len(all_distances) else []

        for idx, doc in enumerate(docs):
            metadata = metas[idx] if idx < len(metas) else {}
            distance = float(dists[idx]) if idx < len(dists) else 1.0
            semantic_score = 1.0 / (1.0 + max(distance, 0.0))
            lexical_score = keyword_overlap_score(question, doc)

            variant_weight = 1.0 if query_index == 0 else 0.87
            combined_score = (0.8 * semantic_score + 0.2 * lexical_score) * variant_weight

            source = str(
                (metadata or {}).get("source")
                or (metadata or {}).get("title")
                or f"variant_{query_index}_idx_{idx}"
            )

            current = merged.get(source)
            candidate = {
                "document": doc,
                "metadata": metadata,
                "semantic_score": semantic_score,
                "lexical_score": lexical_score,
                "combined_score": combined_score,
                "query_variant": variant,
            }

            if current is None or candidate["combined_score"] > current["combined_score"]:
                merged[source] = candidate

    ranked = sorted(merged.values(), key=lambda item: item["combined_score"], reverse=True)
    return ranked


@app.on_event("startup")
def startup_event():
    print("Loading project data on startup...")
    loaded = load_project_data(MAX_PROJECT_ROWS)
    print(f"RAG index ready with {loaded} rows")


@app.post("/ask")
def ask_question(req: AskRequest):
    question = clean_text(req.question)
    if not question:
        return {"error": "Question cannot be empty."}

    definition_term = extract_definition_term(question)

    if definition_term in COMMON_GLOSSARY:
        return {
            "question": question,
            "answer": COMMON_GLOSSARY[definition_term],
            "context": ["built_in_glossary"],
            "confidence": 0.99,
            "retrieved_count": 0,
            "grounded": True,
        }

    dynamic_top_k = req.top_k if req.top_k is not None else MAX_CONTEXT_DOCS
    dynamic_top_k = max(1, min(8, int(dynamic_top_k)))

    ranked = retrieve_and_rerank(question, RETRIEVAL_CANDIDATES)

    if not ranked:
        return {"error": "No data found."}

    selected = ranked[:dynamic_top_k]

    if definition_term:
        definition_from_context = get_definition_from_context(definition_term, selected)
        if definition_from_context:
            return {
                "question": question,
                "answer": truncate_answer(definition_from_context, 2),
                "context": [
                    (item.get("metadata", {}) or {}).get("title", "unknown")
                    for item in selected
                ],
                "confidence": round(max(0.0, min(1.0, selected[0].get("combined_score", 0.0))), 3),
                "retrieved_count": len(selected),
                "grounded": True,
            }

    context_blocks = []
    sources = []

    for item in selected:
        metadata = item.get("metadata", {}) or {}
        source = metadata.get("source", "unknown_source")
        title = metadata.get("title", source)
        row = metadata.get("row")
        source_label = f"{title} (row {row})" if row else str(title)
        sources.append(source_label)
        context_blocks.append(f"[{source}] {clean_text(item['document'])}")

    context = "\n\n".join(context_blocks)

    prompt = f"""
You are a project database assistant.
Answer ONLY using the provided context.
If the context is insufficient, say you do not have enough project data.
Keep answer concise and factual.
Use at most {MAX_ANSWER_SENTENCES} short sentences.
Do not output numbered or bulleted lists unless the user asks for a list.

Context:
{context}

Question:
{question}

Answer:
"""

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=2048,
    )
    inputs = {key: value.to(model.device) for key, value in inputs.items()}

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=96,
            temperature=0.2,
            do_sample=False,
            repetition_penalty=1.1,
            no_repeat_ngram_size=3,
        )

    generated_tokens = outputs[0][inputs["input_ids"].shape[1] :]
    answer = tokenizer.decode(generated_tokens, skip_special_tokens=True).strip()

    if not answer:
        full_output = tokenizer.decode(outputs[0], skip_special_tokens=True)
        if "Answer:" in full_output:
            answer = full_output.split("Answer:")[-1].strip()
        else:
            answer = full_output.strip()

    answer = re.sub(r"^Answer:\s*", "", answer, flags=re.IGNORECASE).strip()
    answer = truncate_answer(answer, MAX_ANSWER_SENTENCES)

    confidence = 0.0
    if selected:
        confidence = sum(item["combined_score"] for item in selected) / len(selected)
    confidence = round(max(0.0, min(1.0, confidence)), 3)

    if req.strict_grounding and confidence < 0.25:
        return {
            "question": question,
            "answer": "I do not have enough high-confidence project data to answer that reliably.",
            "context": sources,
            "confidence": confidence,
            "retrieved_count": len(selected),
            "grounded": False,
        }

    return {
        "question": question,
        "answer": answer,
        "context": sources,
        "confidence": confidence,
        "retrieved_count": len(selected),
        "grounded": True,
    }


@app.post("/load_project", response_model=LoadProjectsResponse)
def reload_project_data(payload: Optional[LoadProjectsRequest] = None):
    max_rows = payload.max_rows if payload and payload.max_rows else MAX_PROJECT_ROWS
    max_rows = max(1, min(5000, int(max_rows)))
    loaded = load_project_data(max_rows)
    return {
        "projects_loaded": loaded,
        "max_rows": max_rows,
    }

@app.get("/")
def health():
    return {"status": "RAG running successfully"}


@app.get("/stats")
def stats():
    count = collection.count()
    return {
        "indexed_documents": count,
        "max_project_rows_default": MAX_PROJECT_ROWS,
        "retrieval_candidates": RETRIEVAL_CANDIDATES,
        "max_context_docs_default": MAX_CONTEXT_DOCS,
        "device": DEVICE,
        "embedding_model": EMBEDDING_MODEL_NAME,
        "generation_model": GENERATION_MODEL_NAME,
    }
