"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import styles from "./dashboard.module.css";
import Header from "../components/Header";
import KpiCards from "../components/KpiCards";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import RecentTransactions from "../components/RecentTransactions";
import NewTransactionModal from "../components/NewTransactionModal";
import { initialTransactions } from "../data/initialTransactions";
import {
  calculateMetrics,
  calculateMonthlyTrend,
  getAvailableMonths
} from "../lib/formatters";

const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1jge5e8wq8vn2DLHmM9ckL7bWXZ8-qbicg214sX0Xm4Q/edit?gid=0#gid=0";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [spreadsheetTitle, setSpreadsheetTitle] = useState("My dashboard database");
  const [selectedMonth, setSelectedMonth] = useState("2026-10"); // Default to latest active month
  const [lastSyncTime, setLastSyncTime] = useState("Just now");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch transactions from Google Sheets via API route
  const syncGoogleSheets = useCallback(async (isManualRefresh = false) => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/transactions", { cache: "no-store" });
      const data = await res.json();

      if (data.success && Array.isArray(data.transactions) && data.transactions.length > 0) {
        setTransactions(data.transactions);
        if (data.spreadsheetTitle) {
          setSpreadsheetTitle(data.spreadsheetTitle);
        }

        const now = new Date();
        const formatted = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        setLastSyncTime(formatted);

        if (isManualRefresh) {
          showToast(`Synchronized ${data.transactions.length} records from Google Sheets.`);
        }
      } else if (isManualRefresh) {
        showToast("Using local dataset (Google Sheets did not return rows).");
      }
    } catch (err) {
      console.error("Error fetching Google Sheets:", err);
      if (isManualRefresh) {
        showToast("Sync failed; keeping existing data.");
      }
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    syncGoogleSheets(false);
  }, [syncGoogleSheets]);

  // Extract available months dynamically from current transaction records
  const availableMonths = useMemo(() => {
    return getAvailableMonths(transactions);
  }, [transactions]);

  // If currently selected month isn't in available months, adjust to first or "ALL"
  useEffect(() => {
    if (availableMonths.length > 0 && selectedMonth !== "ALL") {
      const exists = availableMonths.some((m) => m.key === selectedMonth);
      if (!exists) {
        setSelectedMonth(availableMonths[0].key);
      }
    }
  }, [availableMonths, selectedMonth]);

  // Determine active month label for UI display
  const selectedMonthObj = availableMonths.find((m) => m.key === selectedMonth);
  const selectedMonthLabel = selectedMonth === "ALL"
    ? "All Recorded Months"
    : (selectedMonthObj ? selectedMonthObj.label : selectedMonth);

  // Filter transactions by selected month (or all if ALL selected)
  const currentMonthTransactions = useMemo(() => {
    if (selectedMonth === "ALL") {
      return transactions;
    }
    return transactions.filter((tx) => tx.Date && tx.Date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  // Recalculate KPIs based on filtered transaction subset
  const metrics = useMemo(() => {
    return calculateMetrics(currentMonthTransactions);
  }, [currentMonthTransactions]);

  // Calculate monthly trend across entire history for trend comparison
  const monthlyTrends = useMemo(() => {
    return calculateMonthlyTrend(transactions);
  }, [transactions]);

  // Manual refresh handler
  const handleRefresh = () => {
    syncGoogleSheets(true);
  };

  // Add transaction handler
  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Added ${newTx.Transaction_ID}: ${newTx.Description}`);
  };

  const nextTxnId = `TXN${String(transactions.length + 1).padStart(3, "0")}`;

  return (
    <main className={styles.dashboardContainer} id="finance-dashboard-root">
      {/* 1. Header with Title, Finance Indicator, Month Filter, Google Sheets Badge, Sync Button */}
      <Header
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        availableMonths={availableMonths}
        onRefresh={handleRefresh}
        onOpenNewTxnModal={() => setIsModalOpen(true)}
        lastSyncTime={lastSyncTime}
        isLive={true}
        spreadsheetTitle={spreadsheetTitle}
      />

      {/* 2. Four KPI Cards */}
      <KpiCards
        metrics={metrics}
        selectedMonthLabel={selectedMonthLabel}
      />

      {/* 3. Charts Grid: Monthly Income vs Expenses Trend & Expenses by Category */}
      <section className={styles.chartsGrid} aria-label="Visual Financial Analytics">
        {/* Monthly Trend Chart */}
        <MonthlyTrendChart trends={monthlyTrends} />

        {/* Expenses by Category Chart */}
        <ExpenseChart
          expenseByCategory={metrics.expenseByCategory}
          totalExpense={metrics.totalExpense}
          selectedMonthLabel={selectedMonthLabel}
        />
      </section>

      {/* 4. Recent Transactions Table */}
      <section className={styles.transactionsSection} aria-label="Transaction Ledger">
        <RecentTransactions
          transactions={currentMonthTransactions}
          selectedMonthLabel={selectedMonthLabel}
        />
      </section>

      {/* 5. Polished Footer with Google Sheets Integration details */}
      <footer className={styles.footer}>
        <div className={styles.footerDisclaimer}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--income-green-light)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>
            Database:{" "}
            <a
              href={SPREADSHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--income-green-light)", textDecoration: "underline", fontWeight: 600 }}
            >
              {spreadsheetTitle} (Google Sheets) &nearr;
            </a>{" "}
            &bull; Service Account Auth
          </span>
        </div>
        <div className={styles.footerInfo}>
          <span>Domain: <strong>Finance Intelligence</strong></span>
          <span>Currency: <strong>USD ($)</strong></span>
          <span>Loaded: <strong>{transactions.length} Transactions</strong></span>
        </div>
      </footer>

      {/* 6. New Transaction Modal */}
      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        nextId={nextTxnId}
      />

      {/* 7. Feedback Toast */}
      {toastMessage && (
        <div className={styles.toastNotification} role="status" aria-live="polite">
          <span className={styles.toastSuccessDot}></span>
          {toastMessage}
        </div>
      )}
    </main>
  );
}
