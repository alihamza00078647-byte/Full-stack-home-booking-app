# 🏠 Airbnb Architecture Clone

A full-stack, responsive vacation rental platform built with a focus on **premium UI/UX** and **scalable backend architecture**. This project replicates the core user flow of Airbnb, from high-end property discovery to dynamic booking logic.

[**Live Demo**](#) | [**Report Bug**](#) | [**Request Feature**](#)

---

## ✨ Key Features

- **Minimalist Property Discovery** — A clean, grid-based interface with a focus on whitespace and high-quality imagery, mimicking the Airbnb "luxury" aesthetic.
- **Dynamic Search & Filtering** — Custom-coded search functionality allowing users to filter by category, location, and date.
- **Robust Image Handling** — Backend integration using **Multer** and **Sharp** to process, optimize, and store images in unique, timestamped batch folders.
- **Responsive Core Components** — Fully custom CSS navigation bars, listing cards, and interactive comment sections — built without bloated frameworks for performance and deep styling control.
- **MVC Architecture** — A clean separation of concerns between models, views, and controllers for easy scalability and maintenance.

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | HTML5, Modern CSS (Tailwind), EJS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Utilities** | Multer, Validator.js |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB or MySQL instance

### Installation

```bash
# Clone the repository
git clone https://github.com/alihamza00078647-byte/airbnb-clone.git

# Navigate to project directory
cd airbnb-clone

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URI and port

# Run the application
npm start
