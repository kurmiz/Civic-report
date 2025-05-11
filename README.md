# Civic Report

A comprehensive platform for citizens to report civic issues, track their resolution, and engage with local authorities.

## 📋 Project Overview

Civic Report is a full-stack web application that enables citizens to report local issues (such as potholes, broken streetlights, garbage collection problems, etc.) to relevant authorities. The platform facilitates communication between citizens and local government departments, tracks the status of reported issues, and provides analytics on issue resolution.

### Key Features

- **User Authentication**: Secure signup and login system
- **Issue Reporting**: Submit issues with location, category, description, and photos
- **Interactive Map**: View reported issues on a map interface
- **Issue Tracking**: Follow the status of reported issues
- **Comments & Updates**: Engage in discussions about specific issues
- **Admin Panel**: Administrative interface for managing issues, departments, and users
- **Department Management**: Assign issues to appropriate departments
- **Statistics & Analytics**: View data on issue reporting and resolution

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Leaflet (for maps)
- React Hook Form
- React Hot Toast (for notifications)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Express Validator
- Helmet, XSS-Clean, HPP (for security)

### Additional Services
- Supabase (for storage)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/civic-report.git
   cd civic-report
   ```

2. **Install dependencies for the main project**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install admin panel dependencies (if needed)**
   ```bash
   cd admin-panel
   npm install
   cd ..
   ```

### Configuration

1. **Set up environment variables**

   Create or modify the following `.env` files:

   **Root directory (.env)**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   **Backend directory (backend/.env)**
   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/citizen-report
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

   **Admin Panel directory (admin-panel/.env) - if needed**
   ```
   PORT=3001
   REACT_APP_API_URL=http://localhost:5001/api
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   npm run backend
   # or
   cd backend
   npm run dev
   ```
   The backend server will run on http://localhost:5001

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

3. **Start the admin panel (if needed)**
   ```bash
   cd admin-panel
   npm start
   ```
   The admin panel will run on http://localhost:3001

## 📁 Project Structure

```
civic-report/
├── .env                  # Environment variables for the frontend
├── backend/              # Backend server code
│   ├── src/
│   │   ├── config/       # Database and other configurations
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── server.js     # Main server file
│   └── .env              # Environment variables for the backend
├── admin-panel/          # Admin interface
│   └── src/              # Admin panel source code
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── contexts/         # Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API service functions
│   ├── styles/           # CSS and style files
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main App component
└── package.json          # Project dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev`: Start the frontend development server
- `npm run build`: Build the frontend for production
- `npm run backend`: Start the backend server
- `npm run start:backend`: Start the backend server in production mode
- `npm run lint`: Run ESLint to check code quality

## 🧪 Testing

*Add testing instructions when implemented*

## 🚢 Deployment

*Add deployment instructions when ready*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work - [YourGitHubUsername](https://github.com/YourGitHubUsername)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc.
