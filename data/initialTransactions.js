// Initial fallback transactions matching Google Sheets database structure
export const initialTransactions = [
  { Transaction_ID: "TXN001", Category: "Salary", Description: "Monthly salary", Amount_USD: 1800, Type: "Income", Date: "2026-09-01" },
  { Transaction_ID: "TXN002", Category: "Rent", Description: "Apartment rent", Amount_USD: 600, Type: "Expense", Date: "2026-09-02" },
  { Transaction_ID: "TXN003", Category: "Food", Description: "Grocery shopping", Amount_USD: 120, Type: "Expense", Date: "2026-09-03" },
  { Transaction_ID: "TXN004", Category: "Entertainment", Description: "Movie and dinner", Amount_USD: 45, Type: "Expense", Date: "2026-09-05" },
  { Transaction_ID: "TXN005", Category: "Salary", Description: "Freelance payment", Amount_USD: 350, Type: "Income", Date: "2026-09-07" },
  { Transaction_ID: "TXN006", Category: "Food", Description: "Restaurant", Amount_USD: 65, Type: "Expense", Date: "2026-09-08" },
  { Transaction_ID: "TXN007", Category: "Transport", Description: "Fuel", Amount_USD: 70, Type: "Expense", Date: "2026-09-10" },
  { Transaction_ID: "TXN008", Category: "Bills", Description: "Electricity bill", Amount_USD: 90, Type: "Expense", Date: "2026-09-11" },
  { Transaction_ID: "TXN009", Category: "Shopping", Description: "Clothes", Amount_USD: 110, Type: "Expense", Date: "2026-09-13" },
  { Transaction_ID: "TXN010", Category: "Salary", Description: "Monthly salary", Amount_USD: 1800, Type: "Income", Date: "2026-10-01" },
  { Transaction_ID: "TXN011", Category: "Rent", Description: "Apartment rent", Amount_USD: 600, Type: "Expense", Date: "2026-10-02" },
  { Transaction_ID: "TXN012", Category: "Food", Description: "Grocery shopping", Amount_USD: 140, Type: "Expense", Date: "2026-10-03" },
  { Transaction_ID: "TXN013", Category: "Entertainment", Description: "Streaming subscription", Amount_USD: 20, Type: "Expense", Date: "2026-10-03" },
  { Transaction_ID: "TXN014", Category: "Transport", Description: "Fuel", Amount_USD: 75, Type: "Expense", Date: "2026-10-04" },
  { Transaction_ID: "TXN015", Category: "Bills", Description: "Internet bill", Amount_USD: 40, Type: "Expense", Date: "2026-10-04" },
  { Transaction_ID: "TXN016", Category: "Shopping", Description: "Shoes", Amount_USD: 85, Type: "Expense", Date: "2026-10-05" },
  { Transaction_ID: "TXN017", Category: "Salary", Description: "Freelance payment", Amount_USD: 300, Type: "Income", Date: "2026-10-05" },
  { Transaction_ID: "TXN018", Category: "Food", Description: "Restaurant", Amount_USD: 55, Type: "Expense", Date: "2026-10-05" },
  { Transaction_ID: "TXN019", Category: "Transport", Description: "Ride service", Amount_USD: 30, Type: "Expense", Date: "2026-10-06" },
  { Transaction_ID: "TXN020", Category: "Entertainment", Description: "Weekend activity", Amount_USD: 50, Type: "Expense", Date: "2026-10-06" },
];

export const CATEGORY_COLORS = {
  Salary: {
    bg: "rgba(16, 185, 129, 0.12)",
    text: "#34d399",
    border: "rgba(16, 185, 129, 0.25)",
    chartColor: "#10b981",
  },
  Rent: {
    bg: "rgba(244, 63, 94, 0.12)",
    text: "#fb7185",
    border: "rgba(244, 63, 94, 0.25)",
    chartColor: "#f43f5e",
  },
  Food: {
    bg: "rgba(245, 158, 11, 0.12)",
    text: "#fbbf24",
    border: "rgba(245, 158, 11, 0.25)",
    chartColor: "#f59e0b",
  },
  Entertainment: {
    bg: "rgba(20, 184, 166, 0.12)",
    text: "#2dd4bf",
    border: "rgba(20, 184, 166, 0.25)",
    chartColor: "#14b8a6",
  },
  Transport: {
    bg: "rgba(14, 165, 233, 0.12)",
    text: "#38bdf8",
    border: "rgba(14, 165, 233, 0.25)",
    chartColor: "#0ea5e9",
  },
  Bills: {
    bg: "rgba(139, 92, 246, 0.12)",
    text: "#a78bfa",
    border: "rgba(139, 92, 246, 0.25)",
    chartColor: "#8b5cf6",
  },
  Shopping: {
    bg: "rgba(236, 72, 153, 0.12)",
    text: "#f472b6",
    border: "rgba(236, 72, 153, 0.25)",
    chartColor: "#ec4899",
  },
  Other: {
    bg: "rgba(148, 163, 184, 0.12)",
    text: "#cbd5e1",
    border: "rgba(148, 163, 184, 0.25)",
    chartColor: "#94a3b8",
  },
};
