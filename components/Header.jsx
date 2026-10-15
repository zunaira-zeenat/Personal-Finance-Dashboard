"use client";

import { useState } from "react";
import styles from "./header.module.css";

const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1jge5e8wq8vn2DLHmM9ckL7bWXZ8-qbicg214sX0Xm4Q/edit?gid=0#gid=0";

export default function Header({
  selectedMonth,
  onMonthChange,
  availableMonths = [],
  onRefresh,
  onOpenNewTxnModal,
  lastSyncTime,
  isLive = true,
  spreadsheetTitle = "My dashboard database",
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 650);
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <div className={styles.indicatorRow}>
          <div className={styles.domainBadge} id="domain-indicator">
            <span className={styles.pulseDot} aria-hidden="true"></span>
            Finance Domain
          </div>

          {/* Google Sheets Live Database Badge */}
          <a
            href={SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sampleDataBadge}
            id="google-sheets-badge"
            title="Open database in Google Sheets"
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              borderColor: "rgba(16, 185, 129, 0.3)",
              color: "var(--income-green-light)",
              cursor: "pointer",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="8" y1="13" x2="16" y2="13"></line>
              <line x1="8" y1="17" x2="16" y2="17"></line>
            </svg>
            Google Sheets: {spreadsheetTitle} &nearr;
          </a>
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleGradient}>Personal Finance Dashboard</span>
        </h1>
        <p className={styles.subtitle}>
          Live cash flow & expenditures integrated directly from your Google Sheets database
        </p>
      </div>

      <div className={styles.controlsArea}>
        {/* Month Filter */}
        <div className={styles.monthSelectorWrapper}>
          <label htmlFor="dashboard-month-filter" className={styles.monthSelectorLabel}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Month:
          </label>
          <select
            id="dashboard-month-filter"
            className={styles.monthSelect}
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            aria-label="Filter dashboard by month"
          >
            <option value="ALL">All Recorded Months</option>
            {availableMonths.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          id="refresh-dashboard-btn"
          className={styles.refreshBtn}
          onClick={handleRefreshClick}
          aria-label="Refresh data from Google Sheets"
          title={`Last synchronized: ${lastSyncTime || "Just now"}`}
        >
          <svg
            className={`${styles.refreshIcon} ${isRefreshing ? styles.spinning : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
          <span>{isRefreshing ? "Syncing..." : "Sync Sheets"}</span>
        </button>

        {/* New Transaction Button */}
        <button
          type="button"
          id="add-transaction-btn"
          className={styles.newTxnBtn}
          onClick={onOpenNewTxnModal}
          aria-label="Record a new transaction"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>New Record</span>
        </button>
      </div>
    </header>
  );
}
