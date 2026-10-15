"use client";

import { useState } from "react";
import styles from "./chart.module.css";
import { formatCurrency } from "../lib/formatters";
import { CATEGORY_COLORS } from "../data/initialTransactions";

export default function ExpenseChart({ expenseByCategory = {}, totalExpense = 0, selectedMonthLabel }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [chartView, setChartView] = useState("donut"); // "donut" | "bars"

  const defaultPalette = ["#f43f5e", "#f59e0b", "#14b8a6", "#3b82f6", "#10b981", "#8b5cf6"];

  const categories = Object.entries(expenseByCategory).map(([category, amount], index) => {
    const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
    const colorInfo = CATEGORY_COLORS[category] || {
      chartColor: defaultPalette[index % defaultPalette.length]
    };
    return {
      category,
      amount,
      percentage: Number(percentage.toFixed(1)),
      color: colorInfo.chartColor
    };
  }).sort((a, b) => b.amount - a.amount);

  // SVG Donut calculation
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const slices = categories.map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += cat.percentage;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const activeDisplay = hoveredCategory
    ? categories.find((c) => c.category === hoveredCategory)
    : null;

  return (
    <div className={styles.chartCard} id="expense-category-chart-card">
      <div className={styles.cardHeader}>
        <div className={styles.titleGroup}>
          <h2 className={styles.chartTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
              <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
            </svg>
            Expenses by Category
          </h2>
          <span className={styles.chartSubtitle}>
            {selectedMonthLabel ? `Breakdown for ${selectedMonthLabel}` : "Breakdown across active period"}
          </span>
        </div>

        <div className={styles.viewToggle}>
          <button
            type="button"
            id="chart-view-donut-btn"
            className={`${styles.toggleBtn} ${chartView === "donut" ? styles.toggleBtnActive : ""}`}
            onClick={() => setChartView("donut")}
          >
            Donut
          </button>
          <button
            type="button"
            id="chart-view-bars-btn"
            className={`${styles.toggleBtn} ${chartView === "bars" ? styles.toggleBtnActive : ""}`}
            onClick={() => setChartView("bars")}
          >
            Bars
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
          No expense records recorded for this cycle.
        </div>
      ) : chartView === "donut" ? (
        <div className={styles.chartContent}>
          {/* Donut Graphic */}
          <div className={styles.donutWrapper} id="expense-donut-chart">
            <svg viewBox="0 0 190 190" className={styles.donutSvg}>
              {slices.map((slice) => (
                <circle
                  key={slice.category}
                  cx="95"
                  cy="95"
                  r={radius}
                  className={styles.donutSlice}
                  stroke={slice.color}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  onMouseEnter={() => setHoveredCategory(slice.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              ))}
            </svg>

            <div className={styles.centerText}>
              <span className={styles.centerLabel}>
                {activeDisplay ? activeDisplay.category : "Total Expenses"}
              </span>
              <span className={styles.centerValue}>
                {activeDisplay
                  ? formatCurrency(activeDisplay.amount)
                  : formatCurrency(totalExpense)}
              </span>
              <span className={styles.centerSub}>
                {activeDisplay ? `${activeDisplay.percentage}% share` : "100% Outflow"}
              </span>
            </div>
          </div>

          {/* Breakdown Legend List */}
          <div className={styles.breakdownList} id="expense-category-breakdown-list">
            {categories.map((cat) => (
              <div
                key={cat.category}
                className={`${styles.breakdownItem} ${hoveredCategory === cat.category ? styles.breakdownItemActive : ""}`}
                onMouseEnter={() => setHoveredCategory(cat.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className={styles.itemHeader}>
                  <div className={styles.categoryTag}>
                    <span
                      className={styles.colorIndicator}
                      style={{ backgroundColor: cat.color }}
                    ></span>
                    <span>{cat.category}</span>
                  </div>
                  <div className={styles.amountGroup}>
                    <span className={styles.itemAmount}>{formatCurrency(cat.amount)}</span>
                    <span className={styles.itemPercent}>({cat.percentage}%)</span>
                  </div>
                </div>

                <div className={styles.progressBarTrack}>
                  <div
                    className={styles.progressBarFill}
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Bar Chart Comparative View */
        <div className={styles.barChartView} id="expense-category-bars-view">
          {categories.map((cat) => (
            <div key={cat.category} className={styles.barChartItem}>
              <div className={styles.itemHeader}>
                <div className={styles.categoryTag}>
                  <span
                    className={styles.colorIndicator}
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  <span>{cat.category}</span>
                </div>
                <div className={styles.amountGroup}>
                  <span className={styles.itemAmount}>{formatCurrency(cat.amount)}</span>
                  <span className={styles.itemPercent}>({cat.percentage}%)</span>
                </div>
              </div>

              <div className={styles.progressBarTrack} style={{ height: "8px" }}>
                <div
                  className={styles.progressBarFill}
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
