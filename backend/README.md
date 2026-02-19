# Virtual Notice Board - Backend

A robust Node.js/Express backend for the Virtual Notice Board application with real-time features, JWT authentication, and role-based access control.

## 🚀 Features

- **JWT Authentication** with secure password hashing
- **Role-Based Access Control** (Admin, Faculty, Student)
- **Real-time Updates** using Socket.IO
- **Notice Management** with categories, priorities, and target audiences
- **User Management** with admin controls
- **File Upload Support** via Cloudinary
- **View Tracking & Analytics**
- **Comprehensive Validation** using express-validator
- **Error Handling & Logging**

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js           # MongoDB connection
├── controller/
│   ├── auth.controller.js    # Authentication logic
│   ├── notice.controller.js  # Notice CRUD operations
│   └── user.controller.js    # User management
├── middleware/
│   ├── authenticateToken.js  # JWT verification
│   └── role.middleware.js    # Role-based access
├── models/
│   ├── User.model.js         # User schema
│   ├── Notice.model.js       # Notice schema
│   └── Category.model.js     # Category schema
├── routes/
│   ├── auth.routes.js        # Authentication endpoints
│   ├── notice.routes.js      # Notice endpoints
│   └── user.routes.js        # User endpoints
├── sockets/
│   ├── handlers/
│   │   └── notice.handler.js # Real-time notice events
│   ├── index.js              # Socket initialization
│   └── socketManager.js      # Online user management
├── utils/
│   ├── jwt.js                # JWT utilities
│   └── cloudinary-config.js  # File upload config
├── app.js                    # Express app setup
├── server.js                 # Server startup
└── package.json
```

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd virtual-notice-board/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/virtual-notice-board

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d

   # Cloudinary Configuration (optional)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Start MongoDB** (make sure it's running on your system)

5. **Run the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Public |
| GET | `/api/auth/profile` | Get current user profile | Protected |
| PUT | `/api/auth/profile` | Update user profile | Protected |
| PUT | `/api/auth/change-password` | Change password | Protected |

### Notice Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/notices` | Get all notices (with filters) | Protected |
| GET | `/api/notices/:id` | Get single notice | Protected |
| POST | `/api/notices` | Create new notice | Faculty/Admin |
| PUT | `/api/notices/:id` | Update notice | Owner/Admin |
| DELETE | `/api/notices/:id` | Delete notice | Owner/Admin |
| GET | `/api/notices/stats` | Get notice statistics | Admin |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| GET | `/api/users/stats` | Get user statistics | Admin |

## 🔐 Authentication & Authorization

### JWT Token Structure
```json
{
  "userId": "user_id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role Hierarchy
- **ADMIN**: Full access to all resources
- **FACULTY**: Can create/edit/delete own notices
- **STUDENT**: Can view notices based on target audience

### Header Format
```
Authorization: Bearer <jwt_token>
```

## 🔄 Real-time Events

### Notice Events
- `create-notice`: New notice created
- `update-notice`: Notice updated
- `delete-notice`: Notice deleted
- `view-notice`: Notice viewed (analytics)
- `join-notice-room`: Join role-specific room
- `send-notification`: Send notifications

### Socket Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join role-specific room
socket.emit('join-notice-room', user.role);

// Listen for new notices
socket.on('new-notice', (notice) => {
  console.log('New notice:', notice);
});
```

## 📊 Data Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String, // Hashed
  role: 'ADMIN' | 'FACULTY' | 'STUDENT',
  avatar: String,
  department: String,
  isActive: Boolean,
  lastLogin: Date,
  emailVerified: Boolean
}
```

### Notice Model
```javascript
{
  title: String,
  description: String,
  category: ObjectId,
  postedBy: ObjectId,
  targetAudience: ['ADMIN', 'FACULTY', 'STUDENT', 'ALL'],
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
  attachments: [Object],
  isActive: Boolean,
  isPinned: Boolean,
  expiresAt: Date,
  viewCount: Number,
  viewedBy: [{ user: ObjectId, viewedAt: Date }],
  tags: [String]
}
```

### Category Model
```javascript
{
  name: String,
  description: String,
  color: String,
  icon: String,
  isActive: Boolean,
  createdBy: ObjectId
}
```

## 🛠️ Development

### Scripts
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

### Environment Variables
- `NODE_ENV`: Development/Production mode
- `PORT`: Server port (default: 5000)
- `FRONTEND_URL`: CORS allowed origin
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 12)
- JWT token expiration and validation
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- Rate limiting (recommended for production)

## 📝 Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Validation errors (if applicable)
}
```

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set strong `JWT_SECRET`
4. Configure CORS for production domain
5. Set up reverse proxy (nginx/Apache)
6. Configure SSL/TLS

### PM2 Configuration
```json
{
  "name": "digital-notice-board-api",
  "script": "server.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production",
    "PORT": 5000
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
