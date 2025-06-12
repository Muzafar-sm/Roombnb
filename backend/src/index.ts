// Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

// Then import everything else
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/properties";
import paymentRoutes from "./routes/payment";

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://roombnb.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Root route handler
app.get('/', (_req, res) => {
  res.json({ 
    message: 'Welcome to RoomBnB API',
    status: 'online',
    version: '1.0.0'
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/payment", paymentRoutes);

// Error handling middleware (must be after routes)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000,
  family: 4, // Force IPv4
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  w: 'majority' as const
};

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    // Log a sanitized version of the URI (without credentials)
    const sanitizedUri = MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@');
    console.log('MongoDB URI:', sanitizedUri);
    
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    console.log("Connected to MongoDB successfully");

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    process.exit(1);
  }
};

startServer();