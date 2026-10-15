export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
}

export function formatCompactCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(amount || 0);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  return dateString;
}

export function getAvailableMonths(transactions) {
  const monthMap = new Map();

  transactions.forEach((tx) => {
    if (!tx.Date) return;
    const [yearStr, monthStr] = tx.Date.split("-");
    const key = `${yearStr}-${monthStr}`;
    if (!monthMap.has(key)) {
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1;
      const d = new Date(year, month, 1);
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const shortLabel = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      monthMap.set(key, { key, label, shortLabel, year, month: month + 1 });
    }
  });

  // Sort descending (latest month first)
  return Array.from(monthMap.values()).sort((a, b) => b.key.localeCompare(a.key));
}

export function calculateMetrics(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  const expenseByCategory = {};

  transactions.forEach((tx) => {
    const amount = Number(tx.Amount_USD) || 0;
    if (tx.Type === "Income") {
      totalIncome += amount;
    } else if (tx.Type === "Expense") {
      totalExpense += amount;
      expenseByCategory[tx.Category] = (expenseByCategory[tx.Category] || 0) + amount;
    }
  });

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : "0.0";

  let topCategoryName = "None";
  let topCategoryAmount = 0;

  for (const [category, sum] of Object.entries(expenseByCategory)) {
    if (sum > topCategoryAmount) {
      topCategoryAmount = sum;
      topCategoryName = category;
    }
  }

  return {
    totalIncome,
    totalExpense,
    netSavings,
    savingsRate,
    topSpendingCategory: {
      category: topCategoryName,
      amount: topCategoryAmount,
      percentageOfExpenses: totalExpense > 0 ? ((topCategoryAmount / totalExpense) * 100).toFixed(1) : "0"
    },
    expenseByCategory
  };
}

export function calculateMonthlyTrend(transactions) {
  const trendMap = new Map();

  transactions.forEach((tx) => {
    if (!tx.Date) return;
    const [yearStr, monthStr] = tx.Date.split("-");
    const key = `${yearStr}-${monthStr}`;
    if (!trendMap.has(key)) {
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1;
      const d = new Date(year, month, 1);
      const monthShort = d.toLocaleDateString("en-US", { month: "short" });
      trendMap.set(key, {
        monthKey: key,
        monthLabel: `${monthShort} '${String(year).slice(2)}`,
        fullLabel: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        income: 0,
        expense: 0
      });
    }

    const entry = trendMap.get(key);
    const amount = Number(tx.Amount_USD) || 0;
    if (tx.Type === "Income") {
      entry.income += amount;
    } else if (tx.Type === "Expense") {
      entry.expense += amount;
    }
  });

  // Sort ascending chronologically for trend chart
  return Array.from(trendMap.values())
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
    .map((item) => ({
      ...item,
      net: item.income - item.expense,
      savingsRate: item.income > 0 ? (((item.income - item.expense) / item.income) * 100).toFixed(0) : "0"
    }));
}
