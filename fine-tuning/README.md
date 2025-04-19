# OpenAI Fine-tuning Helper

A modular Node.js application for fine-tuning OpenAI models with your custom training data.

## Project Structure

```
.
├── src/
│   ├── dataPreparation.js   # Data validation and preparation
│   ├── fileManagement.js    # File upload and management
│   ├── fineTuning.js        # Fine-tuning job management
│   └── index.js             # Main entry point
├── training_data.jsonl      # Your training data
├── .env                     # Environment variables
└── README.md               # This file
```

## Prerequisites

- Node.js (v14 or later)
- OpenAI API key
- Training data in JSONL format

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## Training Data Format

Your training data should be in JSONL format, with each line containing a JSON object with a `messages` array. Example:

```jsonl
{"messages": [{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": "Hello!"}, {"role": "assistant", "content": "Hi there! How can I help you today?"}]}
```

## Usage

1. Place your training data in `training_data.jsonl`
2. Run the fine-tuning process:
   ```bash
   node src/index.js
   ```

The script will:
1. Validate your training data
2. Prepare it for fine-tuning
3. Upload it to OpenAI
4. Create and monitor a fine-tuning job

## Available Functions

### Data Preparation (`dataPreparation.js`)
- `readTrainingData(filePath)`: Read and parse JSONL training data
- `validateTrainingData(data)`: Validate data format
- `prepareForFineTuning(data)`: Format data for OpenAI
- `savePreparedData(data, outputPath)`: Save prepared data

### File Management (`fileManagement.js`)
- `uploadFile(filePath)`: Upload file to OpenAI
- `listFiles()`: List uploaded files
- `getFileDetails(fileId)`: Get file details
- `deleteFile(fileId)`: Delete file

### Fine-tuning (`fineTuning.js`)
- `createFineTuningJob(fileId, options)`: Create fine-tuning job
- `listFineTuningJobs()`: List all jobs
- `getJobStatus(jobId)`: Get job status
- `cancelFineTuningJob(jobId)`: Cancel job
- `monitorFineTuningProgress(jobId)`: Monitor job progress

## Configuration

Edit the CONFIG object in `src/index.js` to customize:
- Training data path
- Prepared data path
- Model selection
- Hyperparameters

## Error Handling

The application includes comprehensive error handling and logging. Check the console output for detailed information about any issues that occur during the fine-tuning process.

## License

MIT 