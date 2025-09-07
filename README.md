# 📝 ThinkBoard Notes

Welcome to **ThinkBoard Notes** — a modern, fast, and simple note-taking web app powered by React, Express, and MongoDB.  
Capture thoughts, organize ideas, and never lose your notes again!

---

## 🚀 What is ThinkBoard Notes?

ThinkBoard Notes lets you:
- ✍️ **Create, edit, and delete notes** with a beautiful, responsive UI.
- 📑 **View all your notes** in a grid layout.
- 🔍 **Open, update, and remove notes** with intuitive controls.
- ⚡️ **Enjoy speedy performance** thanks to cutting-edge tech: Vite, React, Express, MongoDB, and Upstash for rate limiting.

---

## 🌟 Live Demo (Coming Soon)

> Want to see it in action?  
> _Stay tuned for a hosted demo!_

---

## 🖥️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express.js + MongoDB
- **Rate Limiting:** Upstash Redis
- **Notifications:** react-hot-toast

---

## 🧑‍💻 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/y8done/Notes.git
cd Notes
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and PORT
npm start
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎮 Interactive Features

<details>
  <summary>📝 Create a Note</summary>
  
  - Click the <b>New Note</b> button in the navbar.
  - Fill in the <b>Title</b> and <b>Content</b>, then save!
</details>

<details>
  <summary>⚡️ Rate Limiting</summary>
  
  - If you see “Rate Limit Reached”, wait a moment before trying again!
  - This keeps the app speedy and fair for everyone.
</details>

<details>
  <summary>🗑️ Delete a Note</summary>
  
  - Open a note, click <b>Delete</b>, and confirm.
  - Gone forever (well, until you write a new one)!
</details>

---

## 📚 Project Structure

```plaintext
Notes/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Note CRUD logic
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routes
│   │   ├── config/        # DB & Rate limiting
│   │   └── ...            
└── frontend/
    ├── src/
    │   ├── pages/         # Home, Create, Detail
    │   ├── components/    # Navbar, NoteCard, etc
    │   ├── lib/           # Axios setup
    │   └── ...
```

---

## 💡 Contribute

1. **Fork** & **Clone**  
2. **Create a branch**  
3. **Push your changes**  
4. **Open a Pull Request**  
   _We love new ideas!_

---

## 👀 Eye Candy

![GitHub repo size](https://img.shields.io/github/repo-size/y8done/Notes)
![Last commit](https://img.shields.io/github/last-commit/y8done/Notes)
![Issues](https://img.shields.io/github/issues/y8done/Notes)
![Pull Requests](https://img.shields.io/github/issues-pr/y8done/Notes)

---

## 💬 Questions & Feedback

Open an [issue](https://github.com/y8done/Notes/issues) or join the [discussion](https://github.com/y8done/Notes/discussions)!

---

> “The palest ink is better than the best memory.”  
> — Chinese proverb

---

**Happy Notetaking! 🚀**
