# Event Locator API

A platform for discovering and managing local events.

## Features

- User Management (Registration, Login, Preferences)
- Event Management (CRUD operations)
- Location-Based Search
- Category Filtering
- Multilingual Support (i18n)
- Notification System
- Event Ratings and Reviews
- Google Maps Integration
- Favorite Events
- Real-time Updates

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: Passport.js with JWT
- **Message Queue**: Redis Pub/Sub
- **Internationalization**: i18next
- **Testing**: Jest
- **Maps**: Google Maps API

## Prerequisites

- Node.js >= 18.0.0
- MongoDB
- Redis
- Render.com account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

## Project Structure

```
event-locator/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js           # Main application file
├── tests/               # Test files
├── docs/                # Documentation
├── .env.example         # Example environment variables
├── package.json         # Project dependencies
└── README.md           # Project documentation
```

## Database Schema

Below is the database schema for the Event Locator App:

![Database Schema](./images/Igboerika%20Onochie%20Event%20Locator%20App%20(1).png)

## Endpoints on Swagger UI

Below is the Swagger UI for the Event Locator App:

![Swagger UI](./images/Swagger%20UI%20endpoints.png)

## Deployment to Render.com

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Create a new Web Service on Render.com:

   - Connect your repository
   - Set the following:
     - Name: event-locator-api
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Node Version: 18.x

3. Add the following environment variables in Render.com:

   - `NODE_ENV`: production
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `REDIS_HOST`: Your Redis host
   - `REDIS_PORT`: 6379
   - `REDIS_PASSWORD`: Your Redis password
   - `PORT`: 10000

4. Deploy your application

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Access the API documentation at:
   ```
   http://localhost:3001/api-docs
   ```

## API Documentation

The API documentation is available at `/api-docs` endpoint when the server is running.

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## License

ISC
