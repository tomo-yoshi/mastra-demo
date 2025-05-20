import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const calculator = createTool({
  id: 'calculator',
  description: 'Performs basic mathematical calculations',
  inputSchema: z.object({
    expression: z.string().describe("The mathematical expression to evaluate"),
  }),
  execute: async ({ context: { expression } }) => {
    try {
      console.log('Executing calculator tool');
      const result = eval(expression);
      return `The result of ${expression} is ${result}`;
    } catch (error) {
      return `Error calculating ${expression}: ${error}`;
    }
  },
});
