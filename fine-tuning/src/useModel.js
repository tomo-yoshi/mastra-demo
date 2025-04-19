require('dotenv').config();
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Get a chat completion from the fine-tuned model
 * @param {string} modelId - The ID of your fine-tuned model (ft:gpt-3.5-turbo-0125:...)
 * @param {string} userMessage - The user's input message
 * @param {string} systemPrompt - Optional system prompt
 * @returns {Promise<string>} The model's response
 */
async function getChatCompletion(modelId, userMessage, systemPrompt = "You are a helpful assistant specializing in Canadian train tours.") {
  try {
    const completion = await openai.chat.completions.create({
      model: modelId,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error getting chat completion:', error);
    throw error;
  }
}

/**
 * Interactive chat session with the fine-tuned model
 * @param {string} modelId - The ID of your fine-tuned model
 */
async function startInteractiveChat(modelId) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\nStarting chat with fine-tuned model. Type "exit" to end the conversation.\n');

  const askQuestion = () => {
    readline.question('You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('Ending chat session.');
        readline.close();
        return;
      }

      try {
        const response = await getChatCompletion(modelId, input);
        console.log('\nAssistant:', response, '\n');
        askQuestion();
      } catch (error) {
        console.error('Error:', error.message);
        readline.close();
      }
    });
  };

  askQuestion();
}

// Example usage
async function main() {
  if (process.argv.length < 3) {
    console.error('Please provide your fine-tuned model ID as an argument.');
    console.error('Usage: node useModel.js <model-id>');
    console.error('Example: node useModel.js ft:gpt-3.5-turbo-0125:personal::7qyhnj8h');
    process.exit(1);
  }

  const modelId = process.argv[2];

  try {
    // Start interactive chat
    await startInteractiveChat(modelId);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the interactive chat if this file is run directly
if (require.main === module) {
  main();
}

module.exports = {
  getChatCompletion,
  startInteractiveChat
}; 