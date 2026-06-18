/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SheetMetadata {
  title: string;
  sheets: {
    title: string;
    sheetId: number;
    rowCount: number;
    columnCount: number;
  }[];
}

const SHEETS_API_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Create a new Google Spreadsheet
 */
export async function createSpreadsheet(
  accessToken: string,
  title: string,
  headers: string[] = []
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // Build body with initial sheet title and possibly header row styling
  const body: any = {
    properties: {
      title: title,
    },
  };

  if (headers.length > 0) {
    body.sheets = [
      {
        properties: {
          title: 'Sheet1',
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: headers.map((h) => ({
                  userEnteredValue: { stringValue: h },
                  userEnteredFormat: {
                    textFormat: { bold: true },
                    backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                  },
                })),
              },
            ],
          },
        ],
      },
    ];
  }

  const response = await fetch(`${SHEETS_API_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal membuat spreadsheet (${response.status})`);
  }

  const data = await response.json();
  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
  };
}

/**
 * Get spreadsheet details including title and list of sheets
 */
export async function getSpreadsheetDetails(
  accessToken: string,
  spreadsheetId: string
): Promise<SheetMetadata> {
  const fields = 'properties.title,sheets.properties(title,sheetId,gridProperties)';
  const response = await fetch(`${SHEETS_API_URL}/${spreadsheetId}?fields=${encodeURIComponent(fields)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal memuat detail spreadhseet (${response.status})`);
  }

  const data = await response.json();
  return {
    title: data.properties?.title || 'Spreadsheet Tanpa Judul',
    sheets: (data.sheets || []).map((s: any) => ({
      title: s.properties?.title || 'Sheet1',
      sheetId: s.properties?.sheetId || 0,
      rowCount: s.properties?.gridProperties?.rowCount || 1000,
      columnCount: s.properties?.gridProperties?.columnCount || 26,
    })),
  };
}

/**
 * Read table range values from spreadsheet
 */
export async function getSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string
): Promise<any[][]> {
  const response = await fetch(`${SHEETS_API_URL}/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal mengambil baris data (${response.status})`);
  }

  const data = await response.json();
  return data.values || [];
}

/**
 * Completely overwrite values in a range
 */
export async function updateSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<void> {
  const body = {
    range: range,
    majorDimension: 'ROWS',
    values: values,
  };

  const response = await fetch(
    `${SHEETS_API_URL}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal memperbarui data sheet (${response.status})`);
  }
}

/**
 * Append row values to a sheet
 */
export async function appendSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<void> {
  const body = {
    range: range,
    majorDimension: 'ROWS',
    values: values,
  };

  const response = await fetch(
    `${SHEETS_API_URL}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal menyisipkan baris baru (${response.status})`);
  }
}

/**
 * Add a new sheet tab to the spreadsheet
 */
export async function createNewSheetTab(
  accessToken: string,
  spreadsheetId: string,
  tabTitle: string
): Promise<void> {
  const body = {
    requests: [
      {
        addSheet: {
          properties: {
            title: tabTitle,
          },
        },
      },
    ],
  };

  const response = await fetch(`${SHEETS_API_URL}/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gagal menambah tab baru (${response.status})`);
  }
}
