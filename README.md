# Backend API Documentation

## Overview
This repository contains the backend API for the Techerudite Assessment. The API is built to handle various operations and provide endpoints for client applications.

## Features
- RESTful API design
- CRUD operations
- JSON-based responses
- Error handling

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL (database used)

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/Techerudite-Assessment.git
    ```
2. Navigate to the backend directory:
    ```bash
    cd Backend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Configure environment variables in a `.env` file:
    ```plaintext
    PORT=8000
    DATABASE_URL=your_database_url
    JWT_SECRET=your_jwt_secret
    SALT_ROUNDS = 12;
    SECRET_KEY = 'techerudite'
    DB_HOST = 'localhost'
    DB_USER = <user>
    DB_PASSWORD = <oassword>
    DB_NAME = 'techerudite_assessment'
    ```

## Usage
Start the server:
```bash
npm start
```
The server will run on `http://localhost:8000`.

## API Routes

### Authentication
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login a user
- **GET** `/api/auth/verify?token=<token>` - Valid Token
- **PATCH** `/api/auth/verify?token=<token>` - Verify Email


## Folder Structure
```
Backend/
├── config/
├── controllers/
├── models/
├── routes/
├── utils/
├── .env
├── constants.js
├── index.js
└── README.md
```

## Contact
For any queries, please contact [prajapatineel122002@gmail.com].
