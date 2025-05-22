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
      "You think step-by-step. Use this loop: " +
      "Thought: ... " +
      "Action: ... " +
      "Observation: ... " +
      "Repeat until done." +
      "Please split the process into steps as much as possible. But you do not have to ask for confirmation when repeating the loop or proceeding to the next step." +
      "Please show all reasoning processes using the Thought/Action/Observation pattern." +
    //   "You can use the getVancouverDate tool to get the current date in Vancouver." +
    //   "When asked about the weather, use the weather information tool to fetch the data. " +
      "When asked to perform calculations, use the calculator tool.",
    model: openai("gpt-4o-mini"),
    tools: {
    //   weatherInfo: tools.weatherInfo,
      calculator: tools.calculator,
    //   getVancouverDate: tools.getVancouverDate
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
