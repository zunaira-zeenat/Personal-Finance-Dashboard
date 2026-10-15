import fs from "fs";
import path from "path";
import crypto from "crypto";

const SPREADSHEET_ID = "1jge5e8wq8vn2DLHmM9ckL7bWXZ8-qbicg214sX0Xm4Q";
const CREDENTIALS_FILENAME = "reflected-mark-510906-k4-f506b71a2c63.json";

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Generates an OAuth 2.0 access token using the service account RSA private key
 */
async function getServiceAccountToken(credentials) {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && tokenExpiresAt > now + 60) {
    return cachedToken;
  }

  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: credentials.token_uri || "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const base64Url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
  const unsignedToken = `${base64Url(header)}.${base64Url(claimSet)}`;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(unsignedToken);
  const signature = sign.sign(credentials.private_key, "base64url");
  const jwt = `${unsignedToken}.${signature}`;

  const tokenRes = await fetch(credentials.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    throw new Error(`Failed to obtain Google OAuth token: ${errorText}`);
  }

  const tokenData = await tokenRes.json();
  cachedToken = tokenData.access_token;
  tokenExpiresAt = now + (tokenData.expires_in || 3600);

  return cachedToken;
}

/**
 * Fetches transaction rows from the Google Sheet
 */
export async function fetchTransactionsFromGoogleSheets() {
  const credentialsPath = path.join(process.cwd(), CREDENTIALS_FILENAME);

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Credentials file not found at: ${credentialsPath}`);
  }

  const credentialsRaw = fs.readFileSync(credentialsPath, "utf8");
  const credentials = JSON.parse(credentialsRaw);

  const accessToken = await getServiceAccountToken(credentials);

  // Fetch sheet metadata to determine sheet name
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 0 },
    }
  );

  if (!metaRes.ok) {
    const err = await metaRes.text();
    throw new Error(`Google Sheets metadata fetch failed: ${err}`);
  }

  const metaData = await metaRes.json();
  const sheetName = metaData.sheets?.[0]?.properties?.title || "Expenses";
  const spreadsheetTitle = metaData.properties?.title || "My dashboard database";

  // Fetch values
  const valuesRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(
      sheetName
    )}!A1:Z1000`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 0 },
    }
  );

  if (!valuesRes.ok) {
    const err = await valuesRes.text();
    throw new Error(`Google Sheets values fetch failed: ${err}`);
  }

  const valuesData = await valuesRes.json();
  const rows = valuesData.values || [];

  if (rows.length < 2) {
    return {
      spreadsheetTitle,
      sheetName,
      transactions: [],
    };
  }

  // Header row
  const headers = rows[0].map((h) => String(h).trim().toLowerCase());
  const idIdx = headers.indexOf("transaction_id");
  const catIdx = headers.indexOf("category");
  const descIdx = headers.indexOf("description");
  const amountIdx = headers.indexOf("amount_usd");
  const typeIdx = headers.indexOf("type");
  const dateIdx = headers.indexOf("date");

  const transactions = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || !row[0]) continue;

    const rawId = idIdx !== -1 && row[idIdx] ? String(row[idIdx]).trim() : `TXN${String(i).padStart(3, "0")}`;
    const rawCategory = catIdx !== -1 && row[catIdx] ? String(row[catIdx]).trim() : "Other";
    const rawDesc = descIdx !== -1 && row[descIdx] ? String(row[descIdx]).trim() : "";
    const rawAmount = amountIdx !== -1 && row[amountIdx] ? parseFloat(String(row[amountIdx]).replace(/[^0-9.-]+/g, "")) : 0;
    const rawType = typeIdx !== -1 && row[typeIdx] ? String(row[typeIdx]).trim() : "Expense";
    const rawDate = dateIdx !== -1 && row[dateIdx] ? String(row[dateIdx]).trim() : "";

    transactions.push({
      Transaction_ID: rawId,
      Category: rawCategory,
      Description: rawDesc,
      Amount_USD: isNaN(rawAmount) ? 0 : rawAmount,
      Type: rawType.toLowerCase() === "income" ? "Income" : "Expense",
      Date: rawDate,
    });
  }

  return {
    spreadsheetTitle,
    sheetName,
    spreadsheetId: SPREADSHEET_ID,
    transactions,
  };
}
