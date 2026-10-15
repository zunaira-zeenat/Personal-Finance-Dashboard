"use client";

import { useState } from "react";
import styles from "./modal.module.css";

export default function NewTransactionModal({ isOpen, onClose, onAddTransaction, nextId }) {
  const [formData, setFormData] = useState({
    Transaction_ID: nextId || `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
    Category: "Food",
    Description: "",
    Amount_USD: "",
    Type: "Expense",
    Date: new Date().toISOString().split("T")[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.Description || !formData.Amount_USD) return;

    onAddTransaction({
      ...formData,
      Amount_USD: parseFloat(formData.Amount_USD) || 0
    });

    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            Add New Transaction
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Transaction Type</label>
            <div className={styles.typeToggleGroup}>
              <button
                type="button"
                className={`${styles.typeBtn} ${formData.Type === "Expense" ? styles.typeBtnExpenseActive : ""}`}
                onClick={() => setFormData({ ...formData, Type: "Expense", Category: formData.Category === "Salary" ? "Food" : formData.Category })}
              >
                Expense (-)
              </button>
              <button
                type="button"
                className={`${styles.typeBtn} ${formData.Type === "Income" ? styles.typeBtnIncomeActive : ""}`}
                onClick={() => setFormData({ ...formData, Type: "Income", Category: "Salary" })}
              >
                Income (+)
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modal-tx-id" className={styles.label}>Transaction ID</label>
            <input
              id="modal-tx-id"
              className={styles.input}
              type="text"
              value={formData.Transaction_ID}
              onChange={(e) => setFormData({ ...formData, Transaction_ID: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modal-category" className={styles.label}>Category</label>
            <select
              id="modal-category"
              className={styles.select}
              value={formData.Category}
              onChange={(e) => setFormData({ ...formData, Category: e.target.value })}
            >
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Salary">Salary</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modal-description" className={styles.label}>Description</label>
            <input
              id="modal-description"
              className={styles.input}
              type="text"
              placeholder="e.g. Whole Foods Organic Market"
              value={formData.Description}
              onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modal-amount" className={styles.label}>Amount (USD)</label>
            <input
              id="modal-amount"
              className={styles.input}
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.Amount_USD}
              onChange={(e) => setFormData({ ...formData, Amount_USD: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="modal-date" className={styles.label}>Date</label>
            <input
              id="modal-date"
              className={styles.input}
              type="date"
              value={formData.Date}
              onChange={(e) => setFormData({ ...formData, Date: e.target.value })}
              required
            />
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" id="submit-new-transaction-btn" className={styles.submitBtn}>
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
