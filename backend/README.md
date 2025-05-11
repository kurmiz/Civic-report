# Citizen Report Backend API

This is the backend API for the Citizen Report application, providing authentication and user management functionality.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/citizen_report
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   USE_COOKIE=false
   CLIENT_URL=http://localhost:5173
   ```

3. Start the server:
   ```
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- **Register a new user**
  - `POST /api/auth/register`
  - Body: `{ name, email, password }`

- **Login user**
  - `POST /api/auth/login`
  - Body: `{ email, password }`

- **Get current user**
  - `GET /api/auth/me`
  - Headers: `Authorization: Bearer <token>`

- **Update user profile**
  - `PUT /api/auth/updateprofile`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name, email, bio, location, avatar_url }`

- **Change password**
  - `PUT /api/auth/changepassword`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ currentPassword, newPassword }`

- **Logout user**
  - `GET /api/auth/logout`

## Database

The application uses MongoDB as its database. Make sure you have MongoDB installed and running locally, or use a cloud-based MongoDB service like MongoDB Atlas.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. When a user registers or logs in, a token is generated and returned to the client. This token should be included in the Authorization header for protected routes.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Joi
- XSS protection
- Rate limiting
- HTTP parameter pollution prevention
- Security headers with Helmet
- CORS configuration

## Error Handling

The API includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- Not found errors
- Server errors

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true|false,
  "message": "Optional message",
  "data": {} // Data object (for successful responses)
}
```

## Testing the API

You can test the API using tools like Postman or curl. Example curl commands:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```
