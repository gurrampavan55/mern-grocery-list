# Grocery List MERN Backend

Backend API for the Grocery List application built with Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. MongoDB Setup

You have two options:

**Option A: Local MongoDB Installation**
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service
- Update `.env` with your MongoDB URI (default: `mongodb://localhost:27017/grocery_list`)

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string and update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery_list?retryWrites=true&w=majority
```

### 3. Environment Variables

Update `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/grocery_list
PORT=5000
NODE_ENV=development
```

### 4. Run the Server

**Development (with auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### GET /api/items
Get all grocery items
```bash
curl http://localhost:5000/api/items
```

### GET /api/items/:id
Get single item by ID

### POST /api/items
Create new item
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"text":"Milk"}'
```

### PUT /api/items/:id
Update item
```bash
curl -X PUT http://localhost:5000/api/items/[id] \
  -H "Content-Type: application/json" \
  -d '{"text":"Milk","completed":true}'
```

### DELETE /api/items/:id
Delete item
```bash
curl -X DELETE http://localhost:5000/api/items/[id]
```

## Project Structure
```
Backend/
├── config/
│   └── db.js           # MongoDB connection
├── models/
│   └── GroceryItem.js  # Item schema
├── routes/
│   └── groceryRoutes.js # API routes
├── server.js           # Main server file
├── package.json
├── .env                # Environment variables
└── README.md
```
