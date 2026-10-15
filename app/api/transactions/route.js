import { NextResponse } from "next/server";
import { fetchTransactionsFromGoogleSheets } from "../../../lib/googleSheets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await fetchTransactionsFromGoogleSheets();
    return NextResponse.json({
      success: true,
      source: "Google Sheets",
      spreadsheetTitle: result.spreadsheetTitle,
      sheetName: result.sheetName,
      spreadsheetId: result.spreadsheetId,
      count: result.transactions.length,
      transactions: result.transactions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching Google Sheets transactions:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch from Google Sheets",
      },
      { status: 500 }
    );
  }
}
