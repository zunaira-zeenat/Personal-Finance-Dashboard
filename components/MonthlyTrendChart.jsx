"use client";

import { useState } from "react";
import styles from "./trend.module.css";
import { formatCurrency, formatCompactCurrency } from "../lib/formatters";

export default function MonthlyTrendChart({ trends = [] }) {
  const [activeMonthKey, setActiveMonthKey] = useState(
    trends.length > 0 ? trends[trends.length - 1].monthKey : null
  );

  if (!trends || trends.length === 0) {
    return (
      <div className={styles.trendCard} id="monthly-trend-card">
        <h2 className={styles.chartTitle}>Monthly Income vs. Expenses</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "1rem" }}>No trend data available.</p>
      </div>
    );
  }

  // Calculate scaling
  const maxVal = Math.max(
    ...trends.map((t) => Math.max(t.income, t.expense)),
    1000
  );
  // Round up to nice upper bound
  const yUpper = Math.ceil(maxVal / 2000) * 2000;

  const svgWidth = 540;
  const svgHeight = 220;
  const paddingLeft = 52;
  const paddingRight = 24;
  const paddingTop = 24;
  const paddingBottom = 40;

  const chartAreaWidth = svgWidth - paddingLeft - paddingRight;
  const chartAreaHeight = svgHeight - paddingTop - paddingBottom;
  const baselineY = svgHeight - paddingBottom;

  const numMonths = trends.length;
  const colSlotWidth = chartAreaWidth / numMonths;
  const barWidth = Math.min(22, (colSlotWidth - 18) / 2);
  const barGap = 4;

  // Horizontal grid lines
  const gridTicks = [0, yUpper * 0.33, yUpper * 0.66, yUpper];

  const activeTrend = trends.find((t) => t.monthKey === activeMonthKey) || trends[trends.length - 1];

  return (
    <div className={styles.trendCard} id="monthly-trend-card">
      <div className={styles.cardHeader}>
        <div className={styles.titleArea}>
          <h2 className={styles.chartTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            Monthly Income vs. Expenses Trend
          </h2>
          <span className={styles.chartSubtitle}>
            Side-by-side cash flow trajectory across recorded billing periods
          </span>
        </div>

        <div className={styles.legendArea}>
          <div className={styles.legendItem}>
            <span
              className={styles.legendIndicator}
              style={{ backgroundColor: "var(--income-green)" }}
            ></span>
            <span>Income</span>
          </div>
          <div className={styles.legendItem}>
            <span
              className={styles.legendIndicator}
              style={{ backgroundColor: "var(--expense-rose)" }}
            ></span>
            <span>Expenses</span>
          </div>
        </div>
      </div>

      <div className={styles.svgContainer}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className={styles.chartSvg}
          role="img"
          aria-label="Monthly Income versus Expenses bar chart"
        >
          {/* Grid lines & Y-axis labels */}
          {gridTicks.map((val, i) => {
            const y = baselineY - (val / yUpper) * chartAreaHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  className={styles.gridLine}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className={styles.axisText}
                >
                  {formatCompactCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Grouped Bars per Month */}
          {trends.map((item, idx) => {
            const colCenterX = paddingLeft + (idx + 0.5) * colSlotWidth;
            const hIncome = Math.max(2, (item.income / yUpper) * chartAreaHeight);
            const hExpense = Math.max(2, (item.expense / yUpper) * chartAreaHeight);

            const xIncome = colCenterX - barWidth - barGap / 2;
            const xExpense = colCenterX + barGap / 2;

            const yIncome = baselineY - hIncome;
            const yExpense = baselineY - hExpense;

            const isActive = item.monthKey === activeMonthKey;

            return (
              <g
                key={item.monthKey}
                onMouseEnter={() => setActiveMonthKey(item.monthKey)}
                onClick={() => setActiveMonthKey(item.monthKey)}
                style={{ cursor: "pointer" }}
              >
                {/* Active Column Highlight Box */}
                {isActive && (
                  <rect
                    x={colCenterX - colSlotWidth / 2 + 4}
                    y={paddingTop - 6}
                    width={colSlotWidth - 8}
                    height={chartAreaHeight + 10}
                    fill="rgba(20, 184, 166, 0.05)"
                    stroke="rgba(20, 184, 166, 0.2)"
                    rx="6"
                  />
                )}

                {/* Income Bar */}
                <rect
                  x={xIncome}
                  y={yIncome}
                  width={barWidth}
                  height={hIncome}
                  rx="3"
                  className={styles.barIncome}
                />

                {/* Expense Bar */}
                <rect
                  x={xExpense}
                  y={yExpense}
                  width={barWidth}
                  height={hExpense}
                  rx="3"
                  className={styles.barExpense}
                />

                {/* Month X-Axis Label */}
                <text
                  x={colCenterX}
                  y={baselineY + 18}
                  className={styles.monthLabel}
                  style={{
                    fill: isActive ? "#ffffff" : "var(--text-secondary)",
                    fontWeight: isActive ? 700 : 500
                  }}
                >
                  {item.monthLabel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Active Month Detail Bar / Tooltip */}
      {activeTrend && (
        <div className={styles.tooltipCard} id="trend-active-month-detail">
          <div className={styles.tooltipMonthName}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{activeTrend.fullLabel}</span>
          </div>

          <div className={styles.tooltipStats}>
            <div className={styles.statItem}>
              <span style={{ color: "var(--text-muted)" }}>Income:</span>
              <span className={styles.statValue} style={{ color: "var(--income-green-light)" }}>
                {formatCurrency(activeTrend.income)}
              </span>
            </div>

            <div className={styles.statItem}>
              <span style={{ color: "var(--text-muted)" }}>Expenses:</span>
              <span className={styles.statValue} style={{ color: "var(--expense-rose-light)" }}>
                {formatCurrency(activeTrend.expense)}
              </span>
            </div>

            <div className={styles.statItem}>
              <span style={{ color: "var(--text-muted)" }}>Net Savings:</span>
              <span className={styles.statValue} style={{ color: "var(--accent-teal-light)" }}>
                {activeTrend.net >= 0 ? "+" : ""}{formatCurrency(activeTrend.net)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
