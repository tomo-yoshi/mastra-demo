const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to create fine-tuning job
async function createFineTuningJob(fileId, options = {}) {
  try {
    const defaultOptions = {
      model: 'gpt-4.1-mini-2025-04-14',
      hyperparameters: {
        n_epochs: 3
      }
    };

    const jobConfig = {
      training_file: fileId,
      ...defaultOptions,
      ...options
    };

    const fineTuningJob = await openai.fineTuning.jobs.create(jobConfig);
    console.log('Fine-tuning job created successfully:', fineTuningJob.id);
    return fineTuningJob;
  } catch (error) {
    console.error('Error creating fine-tuning job:', error);
    throw error;
  }
}

// Function to list fine-tuning jobs
async function listFineTuningJobs() {
  try {
    const jobs = await openai.fineTuning.jobs.list();
    return jobs.data;
  } catch (error) {
    console.error('Error listing fine-tuning jobs:', error);
    throw error;
  }
}

// Function to get fine-tuning job status
async function getJobStatus(jobId) {
  try {
    const job = await openai.fineTuning.jobs.retrieve(jobId);
    return job;
  } catch (error) {
    console.error('Error retrieving job status:', error);
    throw error;
  }
}

// Function to cancel fine-tuning job
async function cancelFineTuningJob(jobId) {
  try {
    const response = await openai.fineTuning.jobs.cancel(jobId);
    console.log('Fine-tuning job cancelled:', jobId);
    return response;
  } catch (error) {
    console.error('Error cancelling fine-tuning job:', error);
    throw error;
  }
}

// Function to monitor fine-tuning job progress
async function monitorFineTuningProgress(jobId, interval = 60000) {
  try {
    let job = await getJobStatus(jobId);
    console.log(`Initial status: ${job.status}`);

    while (job.status === 'running' || job.status === 'validating_files') {
      await new Promise(resolve => setTimeout(resolve, interval));
      job = await getJobStatus(jobId);
      console.log(`Current status: ${job.status}`);
      
      if (job.status === 'succeeded') {
        console.log('Fine-tuning completed successfully!');
        console.log('Fine-tuned model:', job.fine_tuned_model);
      } else if (job.status === 'failed') {
        console.error('Fine-tuning failed:', job.error);
      }
    }

    return job;
  } catch (error) {
    console.error('Error monitoring fine-tuning progress:', error);
    throw error;
  }
}

module.exports = {
  createFineTuningJob,
  listFineTuningJobs,
  getJobStatus,
  cancelFineTuningJob,
  monitorFineTuningProgress
}; 