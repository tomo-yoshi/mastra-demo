# Tools Demo with LangChain

This project demonstrates how to use tools with LangChain. It includes two example tools:
1. A weather tool that fetches current weather for a given city
2. A calculator tool that performs basic mathematical calculations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the tools directory with your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
```

## Usage

The project demonstrates how to:
- Define tools using LangChain's DynamicTool
- Set up an agent with multiple tools
- Handle tool execution and responses

Example tools are defined in `tools.ts`:
- `getWeatherForecast`: Fetches weather data for a city
- `calculator`: Performs basic mathematical calculations

The main agent configuration is in `agent.ts`, where tools are registered and the agent is initialized.

## Running the Demo

```bash
npm start
```

Note: You'll need:
1. An OpenAI API key for the language model
2. A Weather API key from [WeatherAPI.com](https://www.weatherapi.com/) for the weather tool 