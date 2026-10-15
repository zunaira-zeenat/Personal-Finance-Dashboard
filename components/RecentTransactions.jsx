"use client";

import { useState } from "react";
import styles from "./transactions.module.css";
import { formatCurrency, formatDate } from "../lib/formatters";
import { CATEGORY_COLORS } from "../data/initialTransactions";

export default function RecentTransactions({ transactions, selectedMonthLabel }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL"); // ALL, Income, Expense
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [showAll, setShowAll] = useState(false);

  // Sort by Date descending, then ID descending
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateComparison = new Date(b.Date).getTime() - new Date(a.Date).getTime();
    if (dateComparison !== 0) return dateComparison;
    return b.Transaction_ID.localeCompare(a.Transaction_ID);
  });

  // Filter based on controls (search + type + category)
  const filtered = sortedTransactions.filter((tx) => {
    const matchesSearch =
      tx.Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.Transaction_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.Category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "ALL" || tx.Type === filterType;
    const matchesCat = filterCategory === "ALL" || tx.Category === filterCategory;

    return matchesSearch && matchesType && matchesCat;
  });

  // 5 newest records by default, or all if toggled
  const displayedRecords = showAll ? filtered : filtered.slice(0, 5);

  const dynamicCategories = Array.from(new Set(transactions.map((tx) => tx.Category))).filter(Boolean).sort();
  const categoriesList = ["ALL", ...dynamicCategories];

  return (
    <div className={styles.tableCard} id="recent-transactions-card">
      <div className={styles.cardHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.titleBadgeRow}>
            <h2 className={styles.tableTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Recent Transactions
            </h2>
            {/* Live Google Sheets Source Pill */}
            <span className={styles.samplePill} style={{ borderColor: "rgba(16, 185, 129, 0.3)", color: "var(--income-green-light)" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Google Sheets Live
            </span>
          </div>

          <span className={styles.tableSubtitle}>
            {showAll
              ? `Displaying all ${displayedRecords.length} records (${selectedMonthLabel || "All Months"})`
              : `Displaying newest 5 entries (${filtered.length} total in ${selectedMonthLabel || "selection"})`}
          </span>
        </div>

        <div className={styles.controlsGroup}>
          {/* Search Filter */}
          <input
            type="text"
            id="transaction-search-input"
            className={styles.searchInput}
            placeholder="Search description, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search transactions"
          />

          {/* Type Filter */}
          <select
            id="transaction-type-filter"
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            aria-label="Filter by Type"
          >
            <option value="ALL">All Types</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expense Only</option>
          </select>

          {/* Category Filter */}
          <select
            id="transaction-category-filter"
            className={styles.filterSelect}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            aria-label="Filter by Category"
          >
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "ALL" ? "All Categories" : cat}
              </option>
            ))}
          </select>

          {/* View All / Top 5 Toggle */}
          <button
            type="button"
            id="toggle-view-all-records-btn"
            className={styles.viewAllBtn}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Top 5" : "View All"}
          </button>
        </div>
      </div>

      <div className={styles.tableResponsive}>
        <table className={styles.table} aria-label="Recent Transactions Table">
          <thead>
            <tr>
              <th scope="col">Transaction ID</th>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Type</th>
              <th scope="col" style={{ textAlign: "right" }}>Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            {displayedRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyState}>
                  No matching transactions found in the active sample set.
                </td>
              </tr>
            ) : (
              displayedRecords.map((tx) => {
                const isIncome = tx.Type === "Income";
                const catStyle = CATEGORY_COLORS[tx.Category] || {
                  bg: "rgba(255, 255, 255, 0.06)",
                  text: "#e2e8f0",
                  border: "rgba(255, 255, 255, 0.12)"
                };

                return (
                  <tr key={tx.Transaction_ID}>
                    <td className={styles.txnId}>{tx.Transaction_ID}</td>
                    <td className={styles.dateCol}>{formatDate(tx.Date)}</td>
                    <td className={styles.descriptionCol}>{tx.Description}</td>
                    <td>
                      <span
                        className={styles.categoryBadge}
                        style={{
                          backgroundColor: catStyle.bg,
                          color: catStyle.text,
                          border: `1px solid ${catStyle.border}`
                        }}
                      >
                        {tx.Category}
                      </span>
                    </td>
                    <td>
                      {/* Color-coded Income / Expense Badge */}
                      <span
                        className={`${styles.typeBadge} ${
                          isIncome ? styles.typeIncome : styles.typeExpense
                        }`}
                      >
                        {isIncome ? (
                          <>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="19" x2="12" y2="5"></line>
                              <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                            Income
                          </>
                        ) : (
                          <>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <polyline points="19 12 12 19 5 12"></polyline>
                            </svg>
                            Expense
                          </>
                        )}
                      </span>
                    </td>
                    <td
                      className={`${styles.amountCol} ${
                        isIncome ? styles.amountIncome : styles.amountExpense
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(tx.Amount_USD)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
