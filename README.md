# Event Locator Application

A multi-user event locator application built with Node.js that allows users to discover events based on location and preferences.

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
- **Database**: PostgreSQL with PostGIS
- **Authentication**: Passport.js with JWT
- **Message Queue**: Redis Pub/Sub
- **Internationalization**: i18next
- **Testing**: Jest
- **Maps**: Google Maps API

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher) with PostGIS extension
- Redis
- Google Maps API key

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

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Set up the database:
   ```bash
   npm run db:setup
   ```
5. Run migrations:
   ```bash
   npm run migrate
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Run tests:

```bash
npm test
```

## API Documentation

API documentation is available at `/api-docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
