"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  host: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      console.log("Attempting to fetch properties...");
      const response = await fetch("http://localhost:5000/api/properties");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Properties fetched successfully:", data.length);
      setProperties(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to server";
      console.error("Error details:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white-800">Available Properties</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {property.images && property.images[0] && (
                <div className="relative h-48">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {property.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {property.description}
                </p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-600 font-bold">
                    ${property.price}/night
                  </span>
                  <span className="text-gray-500">
                    {property.location.city}, {property.location.country}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{property.bedrooms} beds</span>
                  <span>{property.bathrooms} baths</span>
                  <span>Up to {property.maxGuests} guests</span>
                </div>
                
                {property.amenities && property.amenities.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="text-gray-500 text-sm">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <button
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                  onClick={() => window.location.href = `/properties/${property._id}`}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No properties available at the moment.
            </p>
          </div>
        )}
      </div>
    </>
  );
}