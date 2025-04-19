FROM chromadb/chroma:latest

# Create directory for ChromaDB data
RUN mkdir -p /chroma/chroma

# Expose ChromaDB port
EXPOSE 8000

# Set environment variables
ENV CHROMA_SERVER_HOST=0.0.0.0
ENV CHROMA_SERVER_HTTP_PORT=8000
ENV CHROMA_SERVER_CORS_ALLOW_ORIGINS=* 