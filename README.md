# To-Do List - Full Stack Application

![CI/CD Pipeline](https://github.com/YOUR_USERNAME/todo-list-fullstack/actions/workflows/ci-cd.yml/badge.svg)

A complete full-stack to-do list application built following professional SDLC practices.

## 🚀 Features

- ✅ Create, Read, Update, Delete (CRUD) tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Real-time task statistics
- ✅ Responsive design
- ✅ PostgreSQL database
- ✅ RESTful API architecture

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- dotenv for environment variables

**Development Tools:**
- Git for version control
- npm for package management
- nodemon for development

## 📋 Prerequisites

- Node.js (v16+)
- PostgreSQL (v14+)
- npm

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/todo-list-fullstack.git
cd todo-list-fullstack
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database:
```bash
psql postgres
CREATE DATABASE todolist_db;
CREATE USER todo_user WITH PASSWORD 'todo_password123';
GRANT ALL PRIVILEGES ON DATABASE todolist_db TO todo_user;
\c todolist_db
GRANT ALL ON SCHEMA public TO todo_user;
\q
```

4. Run database schema:
```bash
psql -U todo_user -d todolist_db -f database/schema.sql
```

5. Create `.env` file in root directory:
```
DB_USER=todo_user
DB_HOST=localhost
DB_NAME=todolist_db
DB_PASSWORD=todo_password123
DB_PORT=5432
PORT=3000
NODE_ENV=development
```

## 🚀 Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. Open `client/index.html` in your browser

## 📁 Project Structure
```
todo-list-fullstack/
├── client/              # Frontend
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── server/              # Backend
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── models/
│   │   └── taskModel.js
│   ├── routes/
│   │   └── taskRoutes.js
│   └── server.js
├── database/
│   └── schema.sql
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get single task |
| POST | /api/tasks | Create new task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/health | Health check |

## 📝 SDLC Phases Implemented

1. ✅ **Requirements & Planning** - Documented in REQUIREMENTS.md
2. ✅ **Design** - API design documented in API_DESIGN.md
3. ✅ **Development** - Full-stack implementation
4. ✅ **Testing** - Manual API testing with curl
5. ⏳ **DevOps** - Docker & CI/CD (Next phase)
6. ⏳ **Maintenance** - Monitoring (Next phase)

## 👨‍💻 Author

Built as a learning project to understand enterprise SDLC practices.

## 📄 License

ISC