# NomadStay - Modern Hotel Booking Platform

A modern hotel booking platform inspired by Airbnb but with a unique design focused on digital nomads and younger travelers. Built with Next.js, Node.js, and MongoDB.
🌐[Live Server](https://roombnb.vercel.app/)

 ## When u guys open the live server ,there will be The "dangerous site" warning you're seeing in Google Chrome means that Google has flagged your website as potentially harmful. But its becoz i haven't added SSL/Https config becoz its requires spending money 😑. Dont worry just traverse through the site u dont need to pay and all 😉😂
## Features

- 🏠 Property listings with glassmorphism design
- 🔍 Advanced search with filters
- 📅 Booking system
- 👥 Host and guest roles
- ⭐ Review system
- 📱 Responsive design
- 🔐 Authentication system

## Tech Stack

- **Frontend:**
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Query

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nomadstay
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:

   Create `.env` file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nomadstay
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

   Create `.env.local` file in the frontend directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Run the development servers:

   In the backend directory:
   ```bash
   npm run dev
   ```

   In the frontend directory:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`
   The backend API will be available at `http://localhost:5000`

## Project Structure

```
nomadstay/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/      # App router pages
│   │   │   └── ...  # Additional directories and files
│   │   └── public/   # Static assets
│   └── README.md
│
├── backend/          # Node.js backend application
│   ├── src/
│   │   ├── models/   # MongoDB models
│   │   ├── routes/   # API routes
│   │   ├── middleware/# Custom middleware
│   │   └── index.ts  # Entry point
│   └── .env         # Environment variables
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property (host only)
- `PUT /api/properties/:id` - Update property (host only)
- `DELETE /api/properties/:id` - Delete property (host only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
