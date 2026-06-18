/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  modifiedTime?: string;
  size?: string;
  iconLink?: string;
  owners?: {
    displayName: string;
    photoLink?: string;
  }[];
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3';

/**
 * List files and folders with optional search and parents filter
 */
export async function listFiles(
  accessToken: string,
  folderId: string = 'root',
  searchKeyword: string = '',
  filterType: string = 'semua'
): Promise<DriveFile[]> {
  let queryParts: string[] = ['trashed = false'];

  // Add folder parent restriction
  queryParts.push(`'${folderId}' in parents`);

  // Add search modifier
  if (searchKeyword.trim()) {
    const escaped = searchKeyword.replace(/'/g, "\\'");
    queryParts.push(`name contains '${escaped}'`);
  }

  // Add type filter
  if (filterType === 'folder') {
    queryParts.push("mimeType = 'application/vnd.google-apps.folder'");
  } else if (filterType === 'document') {
    queryParts.push("(mimeType = 'application/pdf' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or mimeType = 'application/msword' or mimeType = 'text/plain')");
  } else if (filterType === 'spreadsheet') {
    queryParts.push("(mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType = 'application/vnd.ms-excel')");
  } else if (filterType === 'media') {
    queryParts.push("(mimeType contains 'image/' or mimeType contains 'video/' or mimeType contains 'audio/')");
  }

  // Combine query
  const qStr = queryParts.join(' and ');
  const fields = 'files(id, name, mimeType, webViewLink, webContentLink, modifiedTime, size, iconLink, owners(displayName, photoLink))';
  const url = `${DRIVE_API_URL}/files?q=${encodeURIComponent(qStr)}&fields=${encodeURIComponent(fields)}&orderBy=folder,name_natural&pageSize=100`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal mengambil daftar berkas (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Create a new folder
 */
export async function createFolder(
  accessToken: string,
  folderName: string,
  parentId: string = 'root'
): Promise<DriveFile> {
  const metadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentId ? [parentId] : undefined,
  };

  const response = await fetch(`${DRIVE_API_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal membuat folder baru (${response.status})`);
  }

  return response.json();
}

/**
 * Delete a file or folder from Google Drive
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const response = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal menghapus berkas (${response.status})`);
  }
}

/**
 * Upload a file to Google Drive using a real multipart request
 */
export async function uploadDriveFile(
  accessToken: string,
  file: File,
  parentId: string = 'root'
): Promise<DriveFile> {
  // Create metadata JSON block
  const metadata = {
    name: file.name,
    parents: [parentId],
  };

  // Build a multipart requestbody manually to support both text metadata and binary blob
  const boundary = '3d0f1a2b3c4d5e6f';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart = 
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    JSON.stringify(metadata) + '\r\n';

  // Read file as ArrayBuffer
  const fileReader = new FileReader();
  
  const fileBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
    fileReader.onerror = () => reject(fileReader.error);
    fileReader.readAsArrayBuffer(file);
  });

  // Re-encode everything as Uint8Array
  const encoder = new TextEncoder();
  const headerBytes = encoder.encode(delimiter + metadataPart + delimiter + `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`);
  const footerBytes = encoder.encode(closeDelimiter);

  const requestPayload = new Uint8Array(headerBytes.length + fileBuffer.byteLength + footerBytes.length);
  requestPayload.set(headerBytes, 0);
  requestPayload.set(new Uint8Array(fileBuffer), headerBytes.length);
  requestPayload.set(footerBytes, headerBytes.length + fileBuffer.byteLength);

  const response = await fetch(`${DRIVE_UPLOAD_URL}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,modifiedTime,size,iconLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: requestPayload,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal mengunggah berkas (${response.status})`);
  }

  return response.json();
}
