require('dotenv').config();
const path = require('path');
const fs = require('fs');
const dataPrep = require('./dataPreparation');
const fileManager = require('./fileManagement');
const fineTuning = require('./fineTuning');

// Configuration
const CONFIG = {
  trainingDataPath: path.join(__dirname, '../training_data.jsonl'),
  preparedDataPath: path.join(__dirname, '../prepared_data.jsonl'),
  model: 'gpt-4.1-mini-2025-04-14',
  hyperparameters: {
    n_epochs: 3
  }
};

// Validate environment and files
function validateEnvironment() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in .env file');
  }

  if (!fs.existsSync(CONFIG.trainingDataPath)) {
    throw new Error(`Training data file not found at ${CONFIG.trainingDataPath}`);
  }

  // Create directory for prepared data if it doesn't exist
  const preparedDir = path.dirname(CONFIG.preparedDataPath);
  if (!fs.existsSync(preparedDir)) {
    fs.mkdirSync(preparedDir, { recursive: true });
  }
}

async function runFineTuning() {
  try {
    // Step 0: Validate environment
    console.log('Validating environment...');
    validateEnvironment();

    // Step 1: Read and validate training data
    console.log('Reading training data...');
    const trainingData = dataPrep.readTrainingData(CONFIG.trainingDataPath);
    if (!trainingData) {
      throw new Error('Failed to read training data');
    }
    console.log(`Found ${trainingData.length} training examples`);

    // Step 2: Validate the data
    console.log('Validating training data...');
    if (!dataPrep.validateTrainingData(trainingData)) {
      throw new Error('Training data validation failed');
    }
    console.log('Training data validation passed');

    // Step 3: Prepare data for fine-tuning
    console.log('Preparing data for fine-tuning...');
    const preparedData = dataPrep.prepareForFineTuning(trainingData);
    console.log(`Prepared ${preparedData.length} examples for fine-tuning`);
    
    // Step 4: Save prepared data
    console.log('Saving prepared data...');
    if (!dataPrep.savePreparedData(preparedData, CONFIG.preparedDataPath)) {
      throw new Error('Failed to save prepared data');
    }
    console.log(`Saved prepared data to ${CONFIG.preparedDataPath}`);

    // Step 5: Upload file to OpenAI
    console.log('Uploading file to OpenAI...');
    const file = await fileManager.uploadFile(CONFIG.preparedDataPath);
    console.log(`File uploaded with ID: ${file.id}`);

    // Step 6: Create fine-tuning job
    console.log('Creating fine-tuning job...');
    const fineTuningJob = await fineTuning.createFineTuningJob(file.id, {
      model: CONFIG.model,
      hyperparameters: CONFIG.hyperparameters
    });
    console.log(`Fine-tuning job created with ID: ${fineTuningJob.id}`);

    // Step 7: Monitor progress
    console.log('Monitoring fine-tuning progress...');
    await fineTuning.monitorFineTuningProgress(fineTuningJob.id);

  } catch (error) {
    console.error('Error in fine-tuning process:', error.message);
    process.exit(1);
  }
}

// Run the fine-tuning process
if (require.main === module) {
  console.log('Starting fine-tuning process...');
  runFineTuning().catch(console.error);
} 