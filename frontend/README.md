# NomadStay - Modern Hotel Booking Platform
NomadStay is a full-stack hotel booking application built with Next.js, Express, and MongoDB. It provides a seamless experience for travelers to find and book accommodations, and for property owners to list their spaces.

## Features
### For Travelers
- Search Functionality : Find properties by location, with an intuitive autocomplete search bar
- Property Browsing : View detailed property listings with high-quality images
- Category Filtering : Filter properties by type (Apartments, Houses, Villas, Studios)
- Secure Booking : Complete bookings with integrated Stripe payment processing
- User Accounts : Register, login, and manage your profile and bookings
- Password Management : Reset and change passwords securely
### For Hosts
- 🏠 Property listings with glassmorphism design
- 🔍 Advanced search with filters
- 📅 Booking system
- 👥 Host and guest roles
- ⭐ Review system
- 📱 Responsive design
- 🔐 Authentication system
- 🔄 Token refresh for role updates
## Tech Stack
### Frontend
- Next.js 15 : React framework with App Router
- TypeScript : For type safety
- Tailwind CSS : For responsive styling
- Stripe Elements : For payment processing
### Backend
- Node.js & Express : For API development
- MongoDB : For database storage
- JWT Authentication : For secure user authentication
- Stripe API : For payment processing
## Getting Started
### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Stripe account for payment processing
### Installation
1. Clone the repository
   
   
   git clone https://github.com/yourusername/nomadstay.git
   
   cd nomadstay
2. Install dependencies
      
   # Install frontend dependencies
   
   cd frontend
   
   npm install
   
   # Install backend dependencies
   
   cd ../backend
   
   npm install
3. Set up environment variables
   
   Create .env file in the backend directory:
   
   plaintext
   
  
   
   PORT=5000
   
   MONGODB_URI=mongodb://localhost:27017/nomadstay
   
   JWT_SECRET=your_jwt_secret_key
   
   STRIPE_SECRET_KEY=your_stripe_secret_key
   
   NODE_ENV=development
   
   Create .env.local file in the frontend directory:
   
   
   NEXT_PUBLIC_API_URL= http://localhost:5000
   
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pub lishable_
   
   key
4. Seed the database (optional)
      # In the backend directory
   ```bash
   npm run seed
   ```
5. Start the development servers
   
   In the backend directory:
   ```bash  
   npm run dev
   ```
   In the frontend directory:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:3000 The backend API will be available at http://localhost:5000
## Project Structure
nomadstay/

├── frontend/          # Next.js frontend application

│   ├── src/

│   │   ├── app/       # App router pages

│   │   ├── components/ # Reusable UI components

│   │   ├── contexts/   # React context providers

│   │   └── utils/      # Utility functions

│   └── public/         # Static assets

│

├── backend/           # Node.js backend application

│   ├── src/

│   │   ├── models/    # MongoDB models

│   │   ├── routes/    # API routes

│   │   ├── middleware/# Custom middleware

│   │   └── index.ts   # Entry point

│   └── .env           # Environment variables

Fold

## API Endpoints
### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth/me - Get current user info
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password with token
### Properties
- GET /api/properties - Get all properties
- GET /api/properties/:id - Get a specific property
- POST /api/properties - Create a new property (auth required)
- PUT /api/properties/:id - Update a property (auth required)
- DELETE /api/properties/:id - Delete a property (auth required)
### Bookings
- POST /api/bookings - Create a new booking (auth required)
- GET /api/bookings - Get user's bookings (auth required)
### Payments
- POST /api/payment/create-payment-intent - Create a Stripe payment intent (auth required)
## Deployment
### Frontend (Vercel)
1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy
### Backend (Various options)
- Deploy to Render, Railway, Heroku, or similar platforms
- Configure environment variables on your hosting platform
- Ensure CORS is properly configured for your frontend domain
## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch ( git checkout -b feature/amazing-feature )
3. Commit your changes ( git commit -m 'Add some amazing feature' )
4. Push to the branch ( git push origin feature/amazing-feature )
5. Open a Pull Request
## License
This project is licensed under the MIT License - see the LICENSE file for details.


## Acknowledgements
- Next.js
- Express
- MongoDB
- Stripe
- Tailwind CSS
- Unsplash for the beautiful images