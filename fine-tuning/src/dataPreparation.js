const fs = require('fs');

// Function to read training data
function readTrainingData(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.trim().split('\n');
    return lines.map(line => JSON.parse(line));
  } catch (error) {
    console.error('Error reading training data:', error);
    return null;
  }
}

// Function to validate message format
function validateMessage(message) {
  return (
    message &&
    typeof message === 'object' &&
    ['system', 'user', 'assistant'].includes(message.role) &&
    typeof message.content === 'string' &&
    message.content.trim().length > 0
  );
}

// Function to validate training data
function validateTrainingData(data) {
  if (!Array.isArray(data)) {
    console.error('Invalid data format: data must be an array of message objects');
    return false;
  }

  for (const conversation of data) {
    if (!conversation.messages || !Array.isArray(conversation.messages)) {
      console.error('Invalid conversation format: messages array is missing');
      return false;
    }

    for (const message of conversation.messages) {
      if (!validateMessage(message)) {
        console.error('Invalid message format:', message);
        return false;
      }
    }
  }

  return true;
}

// Function to prepare data for fine-tuning
function prepareForFineTuning(data) {
  return data.map(conversation => ({
    messages: conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  }));
}

// Function to save prepared data
function savePreparedData(data, outputPath) {
  try {
    const jsonlContent = data.map(item => JSON.stringify(item)).join('\n');
    fs.writeFileSync(outputPath, jsonlContent);
    console.log(`Data saved successfully to ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error saving prepared data:', error);
    return false;
  }
}

module.exports = {
  readTrainingData,
  validateTrainingData,
  prepareForFineTuning,
  savePreparedData
}; 