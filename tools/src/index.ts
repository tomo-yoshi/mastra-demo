import { tools } from './tools.js';
import { Agent } from "@mastra/core/agent";
import { Mastra } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

export const assistantAgent = new Agent({
    name: "Assistant Agent",
    instructions:
      "You are a helpful assistant that can provide weather information and perform mathematical calculations. " +
      "When asked about the weather, use the weather information tool to fetch the data. " +
      "When asked to perform calculations, use the calculator tool.",
    model: openai("gpt-4o-mini"),
    tools: {
      weatherInfo: tools.weatherInfo,
      calculator: tools.calculator
    },
});

export const mastra = new Mastra({
    agents: { assistantAgent },
});

async function main() {
    const agent = mastra.getAgent("assistantAgent");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Welcome to the AI chat! Type 'exit' to quit.");
    
    const chat = async () => {
        rl.question("You: ", async (input) => {
            if (input.toLowerCase() === 'exit') {
                rl.close();
                return;
            }

            const response = await agent.generate(input);
            console.log("AI:", response.text);
            console.log();
            chat();
        });
    };

    chat();
}

main();