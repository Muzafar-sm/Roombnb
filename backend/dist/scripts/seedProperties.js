"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Property_1 = __importDefault(require("../models/Property"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sampleProperties = [
    {
        title: "Luxury Beachfront Villa",
        description: "Stunning beachfront villa with panoramic ocean views, private pool, and modern amenities. Perfect for a luxurious getaway.",
        location: {
            city: "Miami",
            country: "USA",
            coordinates: {
                lat: 25.7617,
                lng: -80.1918
            }
        },
        price: 450,
        images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
        ],
        amenities: ["Pool", "WiFi", "Air Conditioning", "Kitchen", "Beach Access", "Parking"],
        maxGuests: 8,
        bedrooms: 4,
        bathrooms: 3,
        rating: 4.8
    },
    {
        title: "Cozy Mountain Cabin",
        description: "Charming cabin nestled in the mountains, featuring a wood-burning fireplace, hot tub, and breathtaking views.",
        location: {
            city: "Denver",
            country: "USA",
            coordinates: {
                lat: 39.7392,
                lng: -104.9903
            }
        },
        price: 250,
        images: [
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
        ],
        amenities: ["Fireplace", "Hot Tub", "WiFi", "Kitchen", "Hiking Trails", "Parking"],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 2,
        rating: 4.9
    },
    {
        title: "Modern City Apartment",
        description: "Stylish apartment in the heart of the city, close to restaurants, shopping, and public transportation.",
        location: {
            city: "New York",
            country: "USA",
            coordinates: {
                lat: 40.7128,
                lng: -74.0060
            }
        },
        price: 200,
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        amenities: ["WiFi", "Air Conditioning", "Gym Access", "Doorman", "Parking"],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 2,
        rating: 4.7
    },
    {
        title: "Seaside Cottage",
        description: "Quaint cottage steps from the beach, featuring a private garden and outdoor dining area.",
        location: {
            city: "San Diego",
            country: "USA",
            coordinates: {
                lat: 32.7157,
                lng: -117.1611
            }
        },
        price: 175,
        images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        ],
        amenities: ["Garden", "WiFi", "Kitchen", "Beach Access", "BBQ Grill"],
        maxGuests: 4,
        bedrooms: 2,
        bathrooms: 1,
        rating: 4.6
    },
    {
        title: "Luxury Penthouse Suite",
        description: "Exclusive penthouse with panoramic city views, private terrace, and high-end finishes throughout.",
        location: {
            city: "Los Angeles",
            country: "USA",
            coordinates: {
                lat: 34.0522,
                lng: -118.2437
            }
        },
        price: 600,
        images: [
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80"
        ],
        amenities: ["Terrace", "Pool", "Gym", "Concierge", "Parking", "Air Conditioning"],
        maxGuests: 6,
        bedrooms: 3,
        bathrooms: 3,
        rating: 4.9
    }
];
async function seedProperties() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hotelbooking");
        console.log("Connected to MongoDB");
        let host = await User_1.default.findOne({ role: "host" });
        if (!host) {
            host = await User_1.default.create({
                firstName: "John",
                lastName: "Doe",
                email: "host@example.com",
                password: "password123",
                role: "host"
            });
            console.log("Created host user");
        }
        await Property_1.default.deleteMany({});
        console.log("Cleared existing properties");
        const propertiesWithHost = sampleProperties.map(property => ({
            ...property,
            host: host._id
        }));
        await Property_1.default.insertMany(propertiesWithHost);
        console.log("Added sample properties");
        console.log("Seeding completed successfully");
    }
    catch (error) {
        console.error("Error seeding database:", error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log("Disconnected from MongoDB");
    }
}
seedProperties();
//# sourceMappingURL=seedProperties.js.map