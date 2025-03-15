import os
import google.generativeai as genai
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_community.vectorstores import (
    FAISS,
)  # Using FAISS instead of Chroma for better compatibility
import uuid
from datetime import datetime
from typing import Dict, List, Tuple

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
print(f"API Key loaded from .env file: {GOOGLE_API_KEY}")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=GOOGLE_API_KEY)
# llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY)
embed_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001", google_api_key=GOOGLE_API_KEY
)


class RAGSystem:
    def __init__(self, data_dir="data", index_dir="vector_index"):
        self.data_dir = data_dir
        self.index_dir = index_dir
        self.vector_store = None
        self.conversations: Dict[str, List[Dict[str, str]]] = {}
        self.initialize_vector_store()

    def load_documents(self):
        """Load documents from the data directory"""
        documents = []
        print("Loading documents...")

        for filename in os.listdir(self.data_dir):
            file_path = os.path.join(self.data_dir, filename)
            try:
                if filename.endswith(".pdf"):
                    loader = PyPDFLoader(file_path)
                    documents.extend(loader.load())
                elif filename.endswith((".txt", ".csv")):
                    loader = TextLoader(file_path, encoding="utf-8")
                    documents.extend(loader.load())
            except Exception as e:
                print(f"Error loading {filename}: {e}")

        print(f"Loaded {len(documents)} documents")
        return documents

    def split_documents(self, documents):
        """Split documents into chunks"""
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", ". ", " ", ""],
        )
        chunks = splitter.split_documents(documents)
        print(f"Split into {len(chunks)} chunks")
        return chunks

    def initialize_vector_store(self):
        """Initialize or load the vector store"""
        if os.path.exists(self.index_dir):
            print("Loading existing vector store...")
            self.vector_store = FAISS.load_local(
                self.index_dir, embed_model, allow_dangerous_deserialization=True
            )
        else:
            print("Creating new vector store...")
            documents = self.load_documents()
            chunks = self.split_documents(documents)

            print("Creating embeddings and vector store...")
            self.vector_store = FAISS.from_documents(chunks, embed_model)
            # Save the vector store
            os.makedirs(self.index_dir, exist_ok=True)
            self.vector_store.save_local(self.index_dir)

    def generate_response(self, query, context, conversation_history=None):
        """Generate a response using Gemini"""
        history_text = ""
        if conversation_history:
            history_text = "Previous conversation:\n"
            for msg in conversation_history:
                history_text += f"User: {msg['user']}\nAssistant: {msg['assistant']}\n"
            history_text += "\n"

        prompt = f"""You are a helpful AI assistant. Answer the question based on the provided context and conversation history.
If you find the answer in the context, provide it with specific details.
If the context doesn't contain the exact information to answer the question, say so clearly.

{history_text}
Context:
{context}

Question: {query}

Please provide a clear and specific answer based on the context above."""

        try:
            response = llm.invoke(prompt)
            return response.content
        except Exception as e:
            return f"Error generating response: {e}"

    def format_context(self, docs_and_scores):
        """Format the retrieved documents and their scores into a readable context"""
        formatted_docs = []
        for i, (doc, score) in enumerate(docs_and_scores, 1):
            formatted_docs.append(
                f"Document {i} (Relevance: {score:.4f}):\n{doc.page_content.strip()}"
            )
        return "\n\n".join(formatted_docs)

    def query(self, user_query: str, top_k=3, conversation_id=None) -> Tuple[str, str]:
        """Process a query and return relevant information along with conversation ID"""
        print(f"\nQuery: {user_query}")

        # Generate or retrieve conversation ID
        if not conversation_id:
            conversation_id = str(uuid.uuid4())

        # Initialize conversation history if needed
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []

        # Get relevant documents with similarity scores
        docs_and_scores = self.vector_store.similarity_search_with_score(
            user_query, k=top_k
        )

        if not docs_and_scores:
            print("No relevant documents found")
            return "No relevant documents found.", conversation_id

        # Format context from retrieved documents
        context = self.format_context(docs_and_scores)

        # Generate response using conversation history
        response = self.generate_response(
            user_query, context, self.conversations[conversation_id]
        )

        # Update conversation history
        self.conversations[conversation_id].append(
            {
                "user": user_query,
                "assistant": response,
                "timestamp": datetime.now().isoformat(),
            }
        )

        print("\nAnswer:", response)
        return response, conversation_id


def main():
    # Initialize the RAG system
    rag = RAGSystem()

    # Interactive query loop
    while True:
        query = input("\nEnter your query (or 'exit' to quit): ")
        if query.lower() == "exit":
            break

        rag.query(query)


if __name__ == "__main__":
    main()
