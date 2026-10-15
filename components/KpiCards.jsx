"use client";

import styles from "./kpi.module.css";
import { formatCurrency } from "../lib/formatters";

export default function KpiCards({ metrics, selectedMonthLabel }) {
  const { totalIncome, totalExpense, netSavings, savingsRate, topSpendingCategory } = metrics;
  const isNetPositive = netSavings >= 0;

  const cycleLabel = selectedMonthLabel || "Selected Cycle";

  return (
    <section aria-label="Key Financial Performance Indicators" className={styles.kpiGrid}>
      {/* 1. Total Monthly Income */}
      <div className={`${styles.kpiCard} ${styles.kpiIncome}`} id="kpi-total-income">
        <div>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Total Monthly Income</span>
            <div className={`${styles.iconWrapper} ${styles.iconIncome}`} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </div>
          </div>
          <div className={styles.cardValueRow}>
            <span className={styles.cardValue}>{formatCurrency(totalIncome)}</span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <span className={`${styles.badge} ${styles.badgeGreen}`}>
            + Verified Inflows
          </span>
          <span className={styles.metaText}>{cycleLabel}</span>
        </div>
      </div>

      {/* 2. Total Monthly Expenses */}
      <div className={`${styles.kpiCard} ${styles.kpiExpense}`} id="kpi-total-expenses">
        <div>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Total Monthly Expenses</span>
            <div className={`${styles.iconWrapper} ${styles.iconExpense}`} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>
          </div>
          <div className={styles.cardValueRow}>
            <span className={styles.cardValue}>{formatCurrency(totalExpense)}</span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <span className={`${styles.badge} ${styles.badgeRed}`}>
            Total Outflows
          </span>
          <span className={styles.metaText}>
            {totalIncome > 0 ? `${((totalExpense / totalIncome) * 100).toFixed(0)}% of income` : "0%"}
          </span>
        </div>
      </div>

      {/* 3. Net Savings Balance (income minus expenses) */}
      <div className={`${styles.kpiCard} ${styles.kpiSavings}`} id="kpi-net-savings">
        <div>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Net Savings Balance</span>
            <div className={`${styles.iconWrapper} ${styles.iconSavings}`} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <circle cx="12" cy="12" r="2"></circle>
                <path d="M6 12h.01M18 12h.01"></path>
              </svg>
            </div>
          </div>
          <div className={styles.cardValueRow}>
            <span className={styles.cardValue} style={{ color: isNetPositive ? "var(--accent-teal-light)" : "var(--expense-rose-light)" }}>
              {isNetPositive ? "+" : ""}{formatCurrency(netSavings)}
            </span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <span className={`${styles.badge} ${isNetPositive ? styles.badgeTeal : styles.badgeRed}`}>
            {isNetPositive ? `+${savingsRate}% saved` : "Deficit"}
          </span>
          <span className={styles.metaText}>Income &minus; Expenses</span>
        </div>
      </div>

      {/* 4. Top Spending Category (highest total expense) */}
      <div className={`${styles.kpiCard} ${styles.kpiTopCategory}`} id="kpi-top-spending-category">
        <div>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Top Spending Category</span>
            <div className={`${styles.iconWrapper} ${styles.iconTopCategory}`} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
          </div>
          <div className={styles.cardValueRow}>
            <span className={styles.cardValueTopCat}>{topSpendingCategory.category}</span>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <span className={`${styles.badge} ${styles.badgeAmber}`}>
            {formatCurrency(topSpendingCategory.amount)}
          </span>
          <span className={styles.metaText}>{topSpendingCategory.percentageOfExpenses}% of spent</span>
        </div>
      </div>
    </section>
  );
}
