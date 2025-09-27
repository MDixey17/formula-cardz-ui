# Formula Cardz UI 🖥️

The **Formula Cardz Website** is the web-based public facing platform for Formula 1 trading card collectors to track values, collections, and rare discoveries.

---

## 📑 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [License](#-license)
- [Related Projects](#-related-projects)
- [Acknowledgements](#-acknowledgments)

---

## 📖 About

Formula Cardz is a platform for Formula 1 trading card collectors to track market values, rare discoveries, and personal collections. The core feature that makes Formula Cardz so unique is the 1/1 tracker that is automatically updated weekly by scraping data from popular graders such as PSA and BGS. There is also support for system administrators to update asynchronously to provide a live tracking experience.

---

## ✨ Features

- **Authentication**: JWT-based user authentication system
- **Cards**: Comprehensive card data model and search capabilities
- **Collections**: Track owned cards and their details
- **Price Tracking**: Historical price data from various sources
- **Card Battles**: Voting system for card popularity
- **Grail Lists**: Track cards users want to acquire
- **Marketplace**: Listings from various sources
- **Card Drops**: Upcoming product releases
- **One of One Tracking**: Track which 1/1s have been found in various sets

---

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Infrastructure**: Render, AWS

---

## 🚀 Getting Started

```bash
git clone https://github.com/MDixey17/formula-cardz-ui.git
cd formula-cardz-ui
npm install
npm run dev
```

---

## 📂 Project Structure

```plaintext
formula-cardz-ui/
|── src/
|   |── components/     # Custom React Components
|   |── constants/      # Tailwind CSS Constants for Different Parallels
|   |── context/        # App and Theme Contexts
|   |── pages/          # Components for Different Pages
|   |── service/        # Service Objects Responsible for Making All API Calls
|   |── types/          # Custom Type Definitions
|   |── utils/          # Utility Function Definition and Implementations
|   |── App.tsx         # Main Route Handling and Rendering
|   |── index.css       # Import Tailwind CSS Plugin
|   |── main.tsx        # Render App Component
|   |── vite-env.d.ts
|── index.html
|── package.json
|── postcss.config.js   # Plugin configuration for Tailwind CSS and Auto Prefixer
|── README.md
|── tailwind.config.js  # Plugin configuration for Tailwind CSS
|── tsconfig.app.json   # TypeScript Configurations
|── tsconfig.json       # TypeScript Configurations
|── tsconfig.node.json  # TypeScript Configurations
|── vite.config.ts      # Configuration for Running the Vite Application
```

---

## 📜 License

This project is licensed under the MIT License.

---

## 🌍 Related Projects

- [formula-cardz-schedulers](https://github.com/MDixey17/formula-cardz-schedulers)
- [formula-cardz-api](https://github.com/MDixey17/formula-cardz-api)
- [formula-cardz-app](https://github.com/MDixey17/formula-cardz-app)

---

## 🙏 Acknowledgments

- Special thanks to [justaninchident_cards](https://www.instagram.com/justaninchident_cards), [kceecards](https://www.instagram.com/kceecards), and [GridCardsUK](https://www.instagram.com/gridcardsuk) for providing 1/1 status data.