
# Virtual Notice Board

A modern, real-time digital notice board application built with the MERN stack. Transform the way educational institutions and organizations share information with this feature-rich platform that enables instant communication, file sharing, and targeted announcements.

## 🚀 Key Features

- **Role-Based Access Control** - Admin, Faculty, and Student roles with granular permissions
- **Rich Notice Management** - Create, categorize, and prioritize notices with file attachments
- **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- **Password Recovery** - Forgot password functionality with email verification
- **Email Notifications** - Automated email notifications for important updates
- **View Analytics** - Track notice views and engagement metrics
- **Responsive Design** - Modern UI built with React, Vite, and Tailwind CSS
- **Targeted Messaging** - Send notices to specific user groups or all users

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for secure authentication
- **bcrypt** for password hashing

### Frontend
- **React 19** with modern hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

## 📋 Prerequisites

- Node.js 18+
- MongoDB 5.0+
- npm or yarn

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Laxman67/virtual-notice-board
   cd virtual-notice-board
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev

   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🏗️ Project Structure

```
virtual-notice-board/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── controller/         # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   └── api/           # API utilities
└── docs/                  # Documentation
```

## 🔐 Authentication & Security

- JWT-based authentication with secure token management
- Role-based access control (Admin/Faculty/Student)
- Password hashing with bcrypt (12 salt rounds)
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Helmet.js for security headers

## 📊 User Roles & Permissions

- **Admin**: Full system access, user management, system configuration
- **Faculty**: Create/edit/delete notices, view analytics
- **Student**: View notices based on target audience, receive notifications

## 🔄 Real-time Features

- Instant notice updates across all connected clients
- Real-time notifications for new notices
- Live view tracking and analytics
- Role-based room subscriptions

## 📱 Features Highlights

- **Notice Management**: Create notices with rich text, attachments, categories, and priorities
- **Password Recovery**: Secure forgot password flow with email verification
- **Email Notifications**: Automated email system for user communications
- **Targeted Distribution**: Send notices to specific roles or all users
- **File Attachments**: Upload and share documents, images, and media
- **Analytics Dashboard**: Track notice views, engagement, and user activity
- **Search & Filter**: Find notices quickly with advanced filtering
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Inspired by the need for efficient communication in educational institutions
- Special thanks to all contributors who help improve this project

---

**Transform communication in your institution with Virtual Notice Board - where information flows instantly and securely!** 📢✨
