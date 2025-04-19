import { ChromaManager } from './chroma-setup.js';
import { processDocument } from './document-processor.js';
import { QueryProcessor } from './query-processor.js';
import * as readline from 'readline';

interface QueryResult {
  rank: number;
  similarityScore: number | string;
  content: string;
}

const sampleDocument = `Canadian Rockies Train Tours Information:

1. Complete Canadian Rockies by Rail:
- 8-day journey from Vancouver to Calgary
- Two-day scenic train ride on Rocky Mountaineer (Vancouver to Jasper)
- Overnight stop in Kamloops
- Highlights: Icefields Parkway, Lake Louise, Banff National Park
- Concludes with transfer to Calgary

2. Vancouver to Toronto Train Trip:
- 11-day, 10-night journey
- Combines Rocky Mountaineer and VIA Rail's The Canadian
- Rocky Mountaineer: Vancouver to Banff (daylight travel)
- VIA Rail: Jasper to Toronto (overnight sleeper)
- Optional excursions: gondola ride, guided hikes, helicopter tour
- Includes hotel stays and private sleeper cabins
- All meals, transfers, and activities included

3. Essential Rockies by Train:
- 6-day, 5-night journey (Vancouver to Calgary)
- 2-day scenic daylight ride on Rocky Mountaineer
- Vancouver to Lake Louise via Kamloops
- Features GoldLeaf or SilverLeaf service
- Includes gourmet meals and guided activities
- Explores Banff National Park

4. Best Value Rockies Vacation by Rail:
- 6-day, 5-night trip (Calgary to Vancouver)
- Overnight journey on VIA Rail's The Canadian (Jasper to Vancouver)
- Explores Banff and Jasper National Parks
- Travels Icefields Parkway
- Activities: gondola rides, e-bike tours, glacier adventures
- Includes hotels and private sleeper cabin

5. Canadian Rockies Discovery Tour:
- 8-day, 7-night vacation (Calgary roundtrip)
- Focus on Jasper and Banff National Parks
- Mix of coach and rail travel
- Highlights: Icefields Parkway, Maligne Lake, Banff Gondola
- Activities: wildlife viewing, canoeing, river rafting
- Hotel accommodations in Jasper and Banff

6. Cross Country Train Trip:
- 9-day, 8-night journey (Toronto to Vancouver)
- 4 days/nights on VIA Rail's The Canadian
- Private sleeper cabin with full meal service
- Stops: Toronto, Niagara Falls, Canadian Shield, Prairie Provinces, Rockies
- Includes guided tours in Toronto and Vancouver
- Optional excursions to Victoria or Whistler

7. Northern Wilderness Rail Adventure:
- 9-day, 8-night trip (Calgary to Vancouver)
- 2.5 days on Rocky Mountaineer (Rainforest to Gold Rush route)
- Jasper to Vancouver via Quesnel and Whistler
- Activities: heli-tour, e-bike eco tours, Maligne Lake cruise
- GoldLeaf service with panoramic views and gourmet meals
- Concludes with Sea to Sky train ride

8. Coast to Coast by Rail:
- 20-day, 19-night trans-Canada adventure (Halifax to Vancouver)
- Five distinct train experiences
- Combines VIA Rail's Ocean, Corridor, and Canadian routes with Rocky Mountaineer
- Cities: Halifax, Quebec City, Montreal, Toronto, Lake Louise, Banff, Vancouver
- Activities: food tours, city walks, glacier adventures, Niagara Falls
- Features multiple overnight sleeper trains and luxury service options`;

async function processUserQuery(queryProcessor: QueryProcessor, query: string) {
  try {
    const results = await queryProcessor.processQuery(query);
    
    // Display results
    console.log("\nQuery Results:");
    results.forEach((result: QueryResult, index: number) => {
      console.log(`\nResult ${index + 1}:`);
      console.log(`Similarity Score: ${result.similarityScore}`);
      console.log(`Content: ${result.content}`);
    });
  } catch (error) {
    console.error("Error processing query:", error);
  }
}

async function main() {
  try {
    // Initialize ChromaDB manager
    const chromaManager = new ChromaManager();
    
    // Process the document
    const { chunks, embeddings } = await processDocument(sampleDocument);
    
    // Store documents in ChromaDB
    await chromaManager.storeDocuments(chunks, embeddings);
    
    // Initialize query processor
    const queryProcessor = new QueryProcessor(chromaManager);
    
    // Create readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("Welcome to the Canadian Train Tours Information System!");
    console.log("Type your question about train tours (or 'exit' to quit):");

    const askQuestion = () => {
      rl.question("> ", async (query) => {
        if (query.toLowerCase() === 'exit') {
          rl.close();
          return;
        }

        await processUserQuery(queryProcessor, query);
        askQuestion(); // Ask for another question
      });
    };

    askQuestion();
  } catch (error) {
    console.error("Error in RAG implementation:", error);
  }
}

main(); 