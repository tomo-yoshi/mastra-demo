import { ChromaClient } from "chromadb";
import { OpenAIEmbeddingFunction } from 'chromadb';

export class ChromaManager {
  private client: ChromaClient;
  private collectionName: string;
  private embeddingFunction: OpenAIEmbeddingFunction;

  constructor(host: string = process.env.CHROMA_SERVER_HOST || "http://localhost:8000", collectionName: string = "sample_collection") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set. Please set it in your .env file.");
    }

    this.client = new ChromaClient({ path: host });
    this.collectionName = collectionName;
    this.embeddingFunction = new OpenAIEmbeddingFunction({
      openai_api_key: apiKey,
      openai_model: 'text-embedding-3-small'
    });
  }

  async initializeCollection() {
    // Delete existing collection if it exists
    try {
      await this.client.deleteCollection({ name: this.collectionName });
      console.log(`Deleted existing collection: ${this.collectionName}`);
    } catch (error) {
      // Collection doesn't exist, which is fine
      console.log(`No existing collection to delete: ${this.collectionName}`);
    }

    // Create new collection
    return await this.client.createCollection({
      name: this.collectionName,
      metadata: { "hnsw:space": "cosine" },
      embeddingFunction: this.embeddingFunction
    });
  }

  async storeDocuments(chunks: string[], embeddings: number[][]) {
    const collection = await this.initializeCollection();
    
    await collection.add({
      ids: chunks.map((_, index) => index.toString()),
      documents: chunks,
      embeddings: embeddings
    });
    
    console.log("Successfully stored embeddings in Chroma");
    return collection;
  }

  async queryCollection(queryEmbedding: number[], nResults: number = 3) {
    const collection = await this.client.getCollection({ 
      name: this.collectionName,
      embeddingFunction: this.embeddingFunction
    });
    
    return await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: nResults
    });
  }
} 