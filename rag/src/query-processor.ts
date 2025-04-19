import { ChromaManager } from './chroma-setup.js';
import { generateQueryEmbedding } from './document-processor.js';

export interface QueryResult {
  rank: number;
  similarityScore: number | string;
  content: string;
}

export class QueryProcessor {
  private chromaManager: ChromaManager;

  constructor(chromaManager: ChromaManager) {
    this.chromaManager = chromaManager;
  }

  async processQuery(query: string, nResults: number = 3): Promise<QueryResult[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await generateQueryEmbedding(query);
      
      // Query ChromaDB
      const results = await this.chromaManager.queryCollection(queryEmbedding, nResults);
      
      // Format and return results
      return this.formatResults(results);
    } catch (error) {
      console.error("Error processing query:", error);
      throw error;
    }
  }

  private formatResults(results: any): QueryResult[] {
    const formattedResults = results.documents[0]?.map((document: string | null, index: number) => {
      if (document) {
        return {
          rank: index + 1,
          similarityScore: results.distances?.[0]?.[index] ?? 'N/A',
          content: document
        };
      }
      return null;
    }).filter(Boolean);

    // Sort results by similarity score in descending order
    return formattedResults.sort((a: QueryResult, b: QueryResult) => {
      const scoreA = typeof a.similarityScore === 'number' ? a.similarityScore : 0;
      const scoreB = typeof b.similarityScore === 'number' ? b.similarityScore : 0;
      return scoreB - scoreA;
    });
  }
} 