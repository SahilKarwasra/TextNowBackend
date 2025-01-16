# TextNow Backend

TextNow is a messaging application backend built with Node.js, Express.js, and MongoDB. This backend supports features such as user authentication, real-time messaging, and media storage via Cloudinary.

## Features
- User authentication with JWT.
- Secure MongoDB database integration.
- Cloudinary for media uploads and storage.
- Real-time communication using WebSockets(Socket.IO).
- Scalable architecture for development and production environments.

## Prerequisites
Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/atlas/database) (Atlas or local instance)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/SahilKarwasra/TextNowBackend.git
cd textnow-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following environment variables:

```env
MONGO_URI = *
PORT = 5001
JWT_SECRET = *
NODE_ENV = *
CLOUDINARY_CLOUD_NAME = *
CLOUDINARY_API_KEY = *
CLOUDINARY_API_SECRET = *
```
> **Note:** Replace sensitive values like `JWT_SECRET` and `CLOUDINARY_API_SECRET` with your secure credentials.

### 4. Run the Server
```bash
npm start
```
The server will start on `http://localhost:5001` by default.

## API Endpoints

# TextNow Backend

TextNow is a messaging application backend built with Node.js, Express.js, and MongoDB. This backend supports features such as user authentication, real-time messaging, and media storage via Cloudinary.

## Features
- User authentication with JWT.
- Secure MongoDB database integration.
- Cloudinary for media uploads and storage.
- Real-time communication using WebSockets.
- Scalable architecture for development and production environments.

## Prerequisites
Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/atlas/database) (Atlas or local instance)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/textnow-backend.git
cd textnow-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following environment variables:

```env
MONGO_URI = mongodb+srv://sahilkarwasra11:FTf8DjmyR1m9UOEo@chatapp.wxzk5.mongodb.net/chat_db?retryWrites=true&w=majority&appName=ChatApp
PORT = 5001
JWT_SECRET = MYSECRET
NODE_ENV = development
CLOUDINARY_CLOUD_NAME = dussx35i5
CLOUDINARY_API_KEY = 376819987198266
CLOUDINARY_API_SECRET = KP4QIfnCvLEfVSvNIjzZM8PNxJ4
```
> **Note:** Replace sensitive values like `JWT_SECRET` and `CLOUDINARY_API_SECRET` with your secure credentials.

### 4. Run the Server
```bash
npm start
```
The server will start on `http://localhost:5001` by default.

## API Endpoints

### Authentication Routes
- `POST /auth/signup` - Register a new user.
- `POST /auth/login` - Authenticate and log in a user.
- `POST /auth/logout` - Log out a user.
- `PUT /auth/update-profile` - Update user profile (protected).
- `GET /auth/check` - Check user authentication status (protected).

### Messaging Routes
- `GET /messages/users` - Get users for the sidebar (protected).
- `GET /messages/:id` - Get messages for a specific conversation (protected).
- `POST /messages/send/:id` - Send a new message to a conversation (protected).
## Scripts
- `npm start` - Start the server in production mode.
- `npm run dev` - Start the server in development mode with hot reloading.

## Technologies Used
- **Node.js** - JavaScript runtime.
- **Express.js** - Backend framework.
- **Socket.IO** - Real Time Connection.
- **MongoDB** - NoSQL database.
- **JWT** - JSON Web Tokens for authentication.
- **Cloudinary** - Media storage and management.

## Deployment
To deploy the backend, ensure the following:

1. Update the `.env` file with production values.
2. Use a process manager like [PM2](https://pm2.keymetrics.io/) for production stability.
3. Configure your hosting provider (e.g., Render, Vercel) with environment variables.

## License
This project is licensed under the [MIT License](LICENSE).

## Contributing
Feel free to fork this repository and submit pull requests for improvements or bug fixes.

---
For any issues or inquiries, contact [sahilkarwasra11@gmail.com](mailto:sahilkarwasra11@gmail.com).
