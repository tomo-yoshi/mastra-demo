const fs = require('fs');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to upload file to OpenAI
async function uploadFile(filePath) {
  try {
    const file = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: 'fine-tune'
    });
    console.log('File uploaded successfully. File ID:', file.id);
    return file;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Function to list uploaded files
async function listFiles() {
  try {
    const files = await openai.files.list();
    return files.data;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

// Function to retrieve file details
async function getFileDetails(fileId) {
  try {
    const file = await openai.files.retrieve(fileId);
    return file;
  } catch (error) {
    console.error('Error retrieving file details:', error);
    throw error;
  }
}

// Function to delete file
async function deleteFile(fileId) {
  try {
    const response = await openai.files.del(fileId);
    console.log('File deleted successfully:', fileId);
    return response;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

module.exports = {
  uploadFile,
  listFiles,
  getFileDetails,
  deleteFile
}; 