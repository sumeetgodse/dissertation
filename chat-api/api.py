from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from rag_app import RAGSystem
from fastapi.middleware.cors import CORSMiddleware

# Initialize RAG system
rag_system = RAGSystem()

# Create FastAPI app
app = FastAPI(title="RAG API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3
    conversation_id: Optional[str] = None


class QueryResponse(BaseModel):
    query: str
    answer: str
    conversation_id: str


@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Query the RAG system with a question.

    - **query**: The question you want to ask
    - **top_k**: Number of most relevant documents to retrieve (default: 3)
    - **conversation_id**: Optional ID to maintain conversation context
    """
    try:
        response, conv_id = rag_system.query(
            request.query, request.top_k, request.conversation_id
        )
        return QueryResponse(
            query=request.query, answer=response, conversation_id=conv_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
