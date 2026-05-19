/*
 *  Copyright © 2025 My personal.
 *
 * All rights reserved.
 */

import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';

let blobServiceClient = null;
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const accountNameEnv = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKeyEnv = process.env.AZURE_STORAGE_ACCOUNT_KEY;

if (connectionString) {
  blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
} else if (accountNameEnv && accountKeyEnv) {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountNameEnv, accountKeyEnv);
  blobServiceClient = new BlobServiceClient(`https://${accountNameEnv}.blob.core.windows.net`, sharedKeyCredential);
} else {
  blobServiceClient = null; // not configured; functions will validate and throw when used
}

const containerName = process.env.AZURE_BLOB_CONTAINER_NAME || 'portfolio-pdfs';

/**
 * Get or create the container
 */
const getContainerClient = async () => {
  if (!blobServiceClient) {
    throw new Error('Azure Storage not configured (missing connection string or account credentials)');
  }

  const containerClient = blobServiceClient.getContainerClient(containerName);
  try {
    await containerClient.getProperties();
  } catch (error) {
    if (error && (error.statusCode === 404 || error.code === 'ContainerNotFound')) {
      await blobServiceClient.createContainer(containerName);
    } else {
      throw error;
    }
  }
  return containerClient;
};

/**
 * Generate a SAS URL for uploading a PDF
 * @param {string} blobName - Name of the blob (filename)
 * @param {number} expirationHours - How long the URL is valid (default: 1 hour)
 * @returns {Promise<string>} - SAS URL for uploading
 */
export const generateUploadUrl = async (blobName, expirationHours = 1) => {
  try {
    let accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || (blobServiceClient && blobServiceClient.accountName);
    let accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

    // If account name/key not provided directly, try to parse them from the connection string
    if ((!accountName || !accountKey) && connectionString) {
      const parts = connectionString.split(';').reduce((acc, part) => {
        const [k, v] = part.split('=');
        if (k && v) acc[k] = v;
        return acc;
      }, {});
      accountName = accountName || parts.AccountName || parts.Accountname;
      accountKey = accountKey || parts.AccountKey || parts.Accountkey;
    }

    if (!accountName || !accountKey) {
      throw new Error('Azure Storage credentials not configured for SAS generation (need account name and key)');
    }

    const expiration = new Date();
    expiration.setHours(expiration.getHours() + expirationHours);

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const sasOptions = {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('racwd'),
      expiresOn: expiration,
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
    const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

    return sasUrl;
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw new Error('Failed to generate upload URL');
  }
};

/**
 * Generate a SAS URL for reading a PDF (public read)
 * @param {string} blobName - Name of the blob (filename)
 * @param {number} expirationDays - How long the URL is valid (default: 30 days)
 * @returns {Promise<string>} - SAS URL for reading
 */
export const generateReadUrl = async (blobName, expirationDays = 30) => {
  try {
    let accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || (blobServiceClient && blobServiceClient.accountName);
    let accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    if ((!accountName || !accountKey) && connectionString) {
      const parts = connectionString.split(';').reduce((acc, part) => {
        const [k, v] = part.split('=');
        if (k && v) acc[k] = v;
        return acc;
      }, {});
      accountName = accountName || parts.AccountName || parts.Accountname;
      accountKey = accountKey || parts.AccountKey || parts.Accountkey;
    }

    if (!accountName || !accountKey) {
      throw new Error('Azure Storage credentials not configured for SAS generation (need account name and key)');
    }

    const expiration = new Date();
    expiration.setDate(expiration.getDate() + expirationDays);

    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    const sasOptions = {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'),
      expiresOn: expiration,
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
    const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;

    return sasUrl;
  } catch (error) {
    console.error('Error generating read URL:', error);
    throw new Error('Failed to generate read URL');
  }
};

/**
 * Delete a blob
 * @param {string} blobName - Name of the blob to delete
 * @returns {Promise<void>}
 */
export const deleteBlob = async (blobName) => {
  try {
    const containerClient = await getContainerClient();
    const blobClient = containerClient.getBlobClient(blobName);
    await blobClient.delete();
  } catch (error) {
    console.error('Error deleting blob:', error);
    throw new Error('Failed to delete blob');
  }
};

/**
 * Generate a unique blob name for a PDF
 * @param {string} originalFileName - Original filename
 * @returns {string} - Unique blob name
 */
export const generateBlobName = (originalFileName) => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const ext = originalFileName.split('.').pop() || 'pdf';
  const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}-${timestamp}-${randomId}.${ext}`;
};

/**
 * Get blob URL directly (without SAS - for public blobs)
 * @param {string} blobName - Name of the blob
 * @returns {string} - Direct blob URL
 */
export const getBlobUrl = (blobName) => {
  const accountName = blobServiceClient.accountName;
  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
};
