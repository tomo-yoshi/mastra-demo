import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { MDocument } from "@mastra/rag";

export interface ProcessedDocument {
  chunks: string[];
  embeddings: number[][];
}

export async function processDocument(document: string): Promise<ProcessedDocument> {
  // Create document and chunk it
  const doc = MDocument.fromText(document);
  const chunks = await doc.chunk({ strategy: "recursive", size: 512, overlap: 50 });
  console.log(`Created ${chunks.length} chunks from the document`);

  // Generate embeddings
  const { embeddings } = await embedMany({
    values: chunks.map(chunk => chunk.text),
    model: openai.embedding("text-embedding-3-small"),
  });

  return {
    chunks: chunks.map(chunk => chunk.text),
    embeddings: embeddings.map(e => Array.from(e.values()))
  };
}

export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const { embeddings } = await embedMany({
    values: [query],
    model: openai.embedding("text-embedding-3-small")
  });
  return Array.from(embeddings[0].values());
} 