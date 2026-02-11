from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM
import chromadb
from chromadb.config import Settings
import torch
import pandas as pd
import os

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

embedding_model = SentenceTransformer("BAAI/bge-small-en-v1.5")

client = chromadb.Client(
    Settings(persist_directory=DB_PATH, is_persistent=True)
)

collection = client.get_or_create_collection(name="rag_collection")

tokenizer = AutoTokenizer.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")

model = AutoModelForCausalLM.from_pretrained(
    "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    torch_dtype=torch.float32
)

class AskRequest(BaseModel):
    question: str

def clean_text(text: str) -> str:
    return " ".join(str(text).split())


def load_project_data():
    file_path = os.path.join(BASE_DIR, "data", "Project.csv")

    if not os.path.exists(file_path):
        print("Project.csv not found")
        return
# load data how much you
    df = pd.read_csv(file_path).head(5)

    try:
        collection.delete(where={})
    except:
        pass

    chunks = []

    for _, row in df.iterrows():
        text = f"""
Project Title: {row.get('title', '')}
Description: {row.get('description', '')}
Platform: {row.get('platform', '')}
App Type: {row.get('appType', '')}
"""
        chunks.append(clean_text(text))

    embeddings = embedding_model.encode(
        chunks,
        batch_size=8
    ).tolist()

    ids = [f"project_{i}" for i in range(len(chunks))]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )

    print(f"{len(chunks)} projects loaded successfully")

@app.on_event("startup")
def startup_event():
    print("Loading project data on startup...")
    load_project_data()

@app.post("/ask")
def ask_question(req: AskRequest):

    query_embedding = embedding_model.encode([req.question]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=3
    )

    if not results["documents"] or not results["documents"][0]:
        return {"error": "No data found."}

    retrieved_docs = results["documents"][0]
    context = "\n\n".join([clean_text(doc) for doc in retrieved_docs])

    prompt = f"""
You are a project database assistant.
Answer ONLY using the provided context.
Do NOT invent information.

Context:
{context}

Question:
{req.question}

Answer:
"""

    inputs = tokenizer(prompt, return_tensors="pt")

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=150,
            temperature=0.2,
            do_sample=False
        )

    full_output = tokenizer.decode(outputs[0], skip_special_tokens=True)

    if "Answer:" in full_output:
        answer = full_output.split("Answer:")[-1].strip()
    else:
        answer = full_output.strip()

    return {
        "question": req.question,
        "answer": answer
    }

@app.get("/")
def health():
    return {"status": "RAG running successfully"}
