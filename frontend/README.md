# 📝 LifeNote

A modern, full-stack note-taking application built with the MERN stack. Create, organize, and share your thoughts seamlessly with both private and global note features.

---

## 🌟 Features

- ✍️ **Create Notes** - Write and save personal or global notes
- 🔒 **Private Notes** - Secure, authenticated note storage (login required)
- 🌍 **Global Feed** - Share notes publicly with the community
- 📝 **Edit & Delete** - Full control over your private notes
- 🤖 **AI Summarization** - Generate summaries of your notes using Google Gemini
- ⚡ **Rate Limiting** - Fair usage protection with Upstash Redis
- 🎨 **Beautiful UI** - Responsive design with Tailwind CSS & DaisyUI
- 🔐 **JWT Authentication** - Secure user authentication and authorization

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Fast build tool with HMR
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Upstash Redis** - Rate limiting
- **Google Gemini API** - AI summarization
- **CORS** - Cross-origin resource sharing

---

## 📦 Project Structure

```
LifeNote/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   ├── NoteNotFound.jsx
│   │   │   └── RateLimitedUI.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── NoteContext.jsx
│   │   ├── lib/
│   │   │   ├── axios.js
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CreatePage.jsx
│   │   │   └── NoteDetail.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── UserController.js
│   │   │   ├── NotesController.js
│   │   │   └── AIController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Note.js
│   │   ├── routes/
│   │   │   ├── UserRoutes.js
│   │   │   ├── NotesRoutes.js
│   │   │   └── AIRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── rateLimiter.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── upstash.js
│   │   └── server.js
│   ├── package.json
│   └── .env
│
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Upstash Redis account
- Google Gemini API key (for AI summarization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/y8done/Notes.git
   cd Notes
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies
   npm run build
   ```

3. **Setup Backend**
   ```bash
   cd backend
   ```
   
   Create a `.env` file:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   UPSTASH_REDIS_REST_URL=your_upstash_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
   NODE_ENV=development
   ```

   Start the backend:
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   ```
   
   Create a `.env.local` file (optional):
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

   Start the frontend:
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📚 API Endpoints

### User Routes (`/api/user`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register a new user | ❌ |
| POST | `/login` | Login user | ❌ |

### Notes Routes (`/api/notes`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/global` | Get all global notes | ❌ |
| POST | `/global` | Create a global note | ❌ |
| GET | `/` | Get user's private notes | ✅ |
| POST | `/` | Create a private note | ✅ |
| GET | `/:id` | Get note by ID | ❌ |
| PUT | `/:id` | Update private note | ✅ |
| DELETE | `/:id` | Delete private note | ✅ |

### AI Routes (`/api/ai`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/summarize` | Generate note summary | ❌ |

---

## 🔑 Key Features Explained

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Token stored in localStorage for persistence

### Notes Management
- **Private Notes**: Only accessible to authenticated users
- **Global Notes**: Publicly visible to all users
- **Full CRUD**: Create, read, update, and delete operations
- **Ownership Check**: Users can only edit/delete their own private notes

### Rate Limiting
- Uses Upstash Redis for distributed rate limiting
- 100 requests per minute per IP address
- Sliding window algorithm
- Graceful error handling with user-friendly messages

### AI Summarization
- Powered by Google Gemini 2.5 Flash
- Summarize note content with one click
- Error handling for empty content

---

## 🎮 Usage Guide

### Creating a Note
1. Click the **"Create"** button in the navbar
2. Enter a title and content
3. Toggle **"Post to Global Feed?"** to make it public
4. Click **"Save Private Note"** or **"Publish Global Note"**

### Viewing Notes
- **Global Feed**: View all public notes (no login required)
- **My Private Notes**: View only your personal notes (login required)
- Click any note to view full details

### Editing Notes
1. Open a private note
2. Edit the title or content
3. Click **"Save Changes"**
4. Global notes are read-only

### Deleting Notes
1. Open a private note
2. Click the **"Delete Note"** button
3. Confirm the deletion

### Summarizing Notes
1. Open any note
2. Click **"Summarize Note"** button
3. View the AI-generated summary below the content

---

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Password hashing with bcryptjs
- ✅ Authorization checks for private notes
- ✅ Rate limiting to prevent abuse
- ✅ CORS configuration
- ✅ Input validation
- ✅ Secure HTTP-only storage recommended (can be enhanced)

---

## 🚨 Error Handling

The application includes comprehensive error handling:
- **Rate Limit (429)**: Shows a user-friendly rate limit message
- **Authentication (401)**: Redirects to login page
- **Not Found (404)**: Shows "Note not found" message
- **Server Error (500)**: Generic error message with logging
- **Validation Errors**: Toast notifications for user feedback

---

## 📝 Environment Variables

### Backend `.env`
```
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_google_gemini_api_key
UPSTASH_REDIS_REST_URL=https://your-region-your-hash.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
NODE_ENV=development
```

### Frontend `.env.local` (Optional)
```
VITE_API_URL=http://localhost:5001/api
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register a new user
- [ ] Login with credentials
- [ ] Create a private note
- [ ] Create a global note
- [ ] Edit a private note
- [ ] Delete a private note
- [ ] View global feed
- [ ] Summarize a note
- [ ] Test rate limiting (make 100+ requests)
- [ ] Logout and verify redirect

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify `MONGO_URI` in `.env`
- Check MongoDB cluster network access
- Ensure IP is whitelisted

### JWT/Authentication Issues
- Clear localStorage and re-login
- Verify `JWT_SECRET` matches between login and routes
- Check token expiration time

### Rate Limiting Not Working
- Verify Upstash credentials in `.env`
- Check Redis connection
- Review rate limiting logs in console

### AI Summarization Failing
- Verify `GEMINI_API_KEY` is valid
- Check API quota/billing status
- Ensure note content is not empty

### CORS Issues
- Verify `origin` in backend CORS config matches frontend URL
- Check `VITE_API_URL` environment variable

---

## 📈 Performance Optimizations

- Vite for fast development and optimized builds
- React context for state management (no unnecessary re-renders)
- Lazy loading of routes
- Tailwind CSS for minimal CSS bundle
- Rate limiting to prevent server overload

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 👨‍💻 Author

**y8done**

- GitHub: [github.com/y8done/Notes](https://github.com/y8done/Notes)
- Issues: [Report a bug](https://github.com/y8done/Notes/issues)

---

## 💬 Support

If you encounter any issues or have questions:
- Open an [GitHub Issue](https://github.com/y8done/Notes/issues)
- Check existing documentation
- Review error messages and logs

---

## 🎯 Future Enhancements

- [ ] Note categories/tags
- [ ] Search functionality
- [ ] Note sharing with specific users
- [ ] Rich text editor
- [ ] Note export (PDF, Markdown)
- [ ] Dark mode toggle
- [ ] User profiles
- [ ] Note collaboration
- [ ] Mobile app version

---

> "The palest ink is better than the best memory." — Chinese Proverb

**Happy note-taking! 🚀**