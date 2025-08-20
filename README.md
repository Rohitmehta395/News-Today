# News Today — MERN News Aggregator

This is a full-stack **MERN** (MongoDB, Express, React, Node.js) project named **News Today**, a news aggregator that fetches live news via NewsAPI.org. 

##  Features

- Browse top headlines by categories (Business, Technology, Sports, Entertainment, Health, Science, General)
- Search for news articles by query (powered by NewsAPI's `everything` endpoint)
- View detailed article pages with snippet and a button to open the original source
- User authentication: **Register** and **Login** using JSON Web Tokens (JWT)
- Responsive UI built with **React**, **Vite**, **Tailwind CSS**
- Modular project structure: separate `frontend/` and `backend/` directories

---

##  Project Structure

```
News-Today/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── server.js
│   └── package.json
|
└── frontend/
    ├── src/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

##  Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or via a cloud service like Atlas)
- [NewsAPI.org](https://newsapi.org) API key

### Setup Instructions

#### 1. Clone the repository

```bash
git clone https://github.com/Rohitmehta395/News-Today.git
cd News-Today
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file with:

```
NEWS_API_KEY=your_newsapi_key_here
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

By default, it runs on:  `http://localhost:5000`

#### 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:5173 in your browser to view the app.

---

##  Usage Overview

- **Home Page**: Browse multiple news categories.
- **Category Page**: Click a category in the header to view its latest headlines.
- **Search**: Use the search bar to lookup news by keywords.
- **Article Detail**: Click “Read Full Article →” to see title, snippet, and open the source in a new tab.
- **Auth**:
  - Click **Register** in the header to create an account.
  - After logging in, user remains authenticated via JWT.
  - Optionally, you can protect certain routes or display user-specific UI.

---

##  Technologies Used

| Frontend                  | Backend                        |
|---------------------------|--------------------------------|
| React + Vite              | Node.js + Express              |
| Tailwind CSS              | MongoDB + Mongoose             |
| React Router (v6)         | JSON Web Tokens (JWT)          |
| Axios (for API calls)     | bcrypt (password hashing)      |

---

##  Deployment (Optional)

You can deploy this app by:

1. Hosting the backend (Node) on services like **Render**, **Railway**, or **Heroku**.
2. Hosting the frontend (React) on **Vercel** or **Netlify**, configured to proxy `/api` routes to your backend.

---

##  Contributing

Feel free to open issues or submit PRs! Whether it's code improvements, UI tweaks, or feature requests—your contributions are welcome.

---

### Thanks for checking out **News Today**!  
If you found this useful, I'd appreciate a ⭐. Let me know if you want help deploying it or adding new features.
