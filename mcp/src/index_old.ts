import { MCPServer } from "@mastra/mcp";
import { calculator } from './tools.js';
import dotenv from 'dotenv';

dotenv.config();

const server = new MCPServer({
  name: "My Calculator Server",
  version: "1.0.0",
  // @ts-ignore
  tools: { calculator },
});

await server.startStdio();