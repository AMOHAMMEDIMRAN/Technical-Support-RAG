from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM
import chromadb
from chromadb.config import Settings
import torch
import pandas as pd
import os

app = FastAPI(title="Minimal RAG")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
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

@app.post("/load_project")
def load_project():

    file_path = os.path.join(BASE_DIR, "data", "Project.csv")

    if not os.path.exists(file_path):
        return {"error": "Project.csv not found inside data folder"}

    df = pd.read_csv(file_path)

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

    embeddings = embedding_model.encode(chunks).tolist()
    ids = [f"project_{i}" for i in range(len(chunks))]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )

    return {"projects_loaded": len(chunks)}

@app.post("/ask")
def ask_question(req: AskRequest):

    query_embedding = embedding_model.encode([req.question]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=3
    )

    if not results["documents"] or not results["documents"][0]:
        return {"error": "No data found. Call /load_project first."}

    retrieved_docs = results["documents"][0]
    
    # Fast mode: Return context directly as answer
    # Skip LLM generation for speed
    answer = "Based on the projects in our database, here are the most relevant results:\n\n"
    for i, doc in enumerate(retrieved_docs, 1):
        answer += f"{i}. {doc[:200]}...\n\n"
    
    return {
        "question": req.question,
        "answer": answer.strip(),
        "context": retrieved_docs
    }

@app.get("/")
def health():
    return {"status": "RAG running successfully"}