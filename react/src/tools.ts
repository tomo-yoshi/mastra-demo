import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const weatherInfo = createTool({
  id: 'getWeatherForecast',
  description: 'Fetches current weather for a given city',
  inputSchema: z.object({
    city: z.string().describe("The name of the city to get the weather for"),
  }),
  execute: async ({ context: { city } }) => {
    try {
      console.log('Executing weatherInfo tool');
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`);
      if (!res.ok) {
        const error = await res.json();
        return `Error fetching weather for ${city}: ${error.error?.message || 'Unknown error'}`;
      }
      const data = await res.json();
      if (!data.current?.condition?.text || !data.current?.temp_c) {
        return `Error: Received invalid data format for ${city}`;
      }
      return `Current weather in ${city}: ${data.current.condition.text}, ${data.current.temp_c}°C`;
    } catch (error) {
      return `Error fetching weather for ${city}: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
});

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

export const getVancouverDate = createTool({
  id: 'getVancouverDate',
  description: 'Gets the current date in Vancouver',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      console.log('Executing getVancouverDate tool');
      const vancouverDate = new Date().toLocaleString('en-CA', {
        timeZone: 'America/Vancouver',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return `Today's date in Vancouver is ${vancouverDate}`;
    } catch (error) {
      return `Error getting Vancouver date: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  },
});

export const tools = {
  weatherInfo: weatherInfo,
  calculator: calculator,
  getVancouverDate: getVancouverDate
}; 