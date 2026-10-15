# 💰 Personal Finance Dashboard

A web-based dashboard built with **Next.js** that helps users visualize and monitor their financial activity using data stored in Google Sheets.

The dashboard presents financial information through summary cards, charts, and recent transaction records, making it easier to understand spending patterns and track financial activity.

## ✨ Features

* 📊 **Financial Overview** — View key financial metrics in one place.
* 💵 **Income and Expenses** — Monitor incoming and outgoing transactions.
* 📈 **Data Visualization** — Explore financial information through charts.
* 🧾 **Recent Transactions** — Review recent financial records.
* 🔄 **Google Sheets Integration** — Retrieve financial data from Google Sheets.
* 📱 **Responsive Interface** — Designed for convenient use across different screen sizes.

## 🛠️ Technologies Used

* **Next.js** — Web application framework
* **React** — User interface development
* **JavaScript** — Application logic
* **CSS** — Styling and layout
* **Google Sheets API** — Financial data integration
* **Node.js** — JavaScript runtime

## 📁 Project Structure

```text
Personal-Finance-Dashboard/
├── app/                 # Application pages and styles
├── components/          # Reusable UI components
├── data/                # Data-related files
├── lib/                 # Google Sheets integration and utilities
├── .gitignore           # Excluded files and folders
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies and scripts
├── package-lock.json    # Dependency lock file
└── README.md            # Project documentation
```

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/zunaira-zeenat/Personal-Finance-Dashboard.git
```

### 2. Open the Project Directory

```bash
cd Personal-Finance-Dashboard
```

### 3. Install Dependencies

Make sure Node.js and npm are installed on your computer.

```bash
npm install
```

### 4. Configure Google Sheets API

This project uses Google Sheets API to retrieve financial data.

To configure the integration:

1. Create or select a project in Google Cloud Console.
2. Enable the Google Sheets API.
3. Create a service account and generate its credentials.
4. Give the service account access to the Google Sheet.
5. Configure the credentials securely for your local environment.

**Security note:** Never upload service-account JSON files, private keys, or other secrets to a public GitHub repository. For deployment, use secure environment variables and configure the application to read credentials from them.

### 5. Run the Development Server

```bash
npm run dev
```

Open the following address in your browser:

```text
http://localhost:3000
```

## 🌐 Deployment

This project is intended for deployment using **Vercel**.

Deployment steps:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables securely.
4. Deploy the application.
5. Test the dashboard and its Google Sheets integration.

**Important:** Before deployment, ensure the application supports reading Google Sheets credentials from environment variables rather than depending on a local credentials file.

## 🔐 Security

* Keep service-account credentials private.
* Never commit `.env` files or private keys.
* Grant the service account only the permissions it needs.
* Avoid storing sensitive personal or financial information in a publicly accessible Google Sheet.
* Review access permissions before sharing the application publicly.

## 🎯 Project Goal

The goal of this project is to build a practical financial dashboard that combines web development, data visualization, and Google Sheets API integration in a single application.

## 👩‍💻 Author

**Zunaira Zeenat**

BS Information Technology Student | Aspiring AI & Machine Learning Developer

GitHub: [zunaira-zeenat](https://github.com/zunaira-zeenat)

---

⭐ If you find this project interesting, feel free to explore the repository!
