"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import API_URL from "@/utils/api";

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

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log("Fetching property details for ID:", id);
        console.log("ID type:", typeof id, "ID length:", id?.length);
        
        if (!id) {
          throw new Error("Property ID is missing");
        }
        
        const apiUrl = `${API_URL}/api/properties/${id}`;
        console.log("API URL:", apiUrl);
        
        const response = await fetch(apiUrl);
        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries([...response.headers]));
        
        // In your fetchProperty function
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response text:", errorText);
          
          let errorData = {};
          let errorMessage = `Failed to fetch property details: ${response.status}`;
          
          try {
            errorData = JSON.parse(errorText);
            if ((errorData as {error?: string}).error) {
              if (response.status === 400) {
                errorMessage = "Invalid property ID format. Please use a valid property ID.";
              } else if (response.status === 404) {
                errorMessage = "Property not found. It may have been removed.";
              } else {
                errorMessage = (errorData as {error: string}).error;
              }
            }
          } catch (e) {
            console.error("Failed to parse error response as JSON");
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log("Received property details:", data);
        setProperty(data);
      } catch (err: Error | unknown) {
        console.error("Error fetching property details:", err);
        setError(err instanceof Error ? err.message : "Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    } else {
      setLoading(false);
      setError("Property ID is missing");
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-red-50 text-red-500 p-4 rounded-lg">
              {error}
            </div>
          </div>
        ) : property ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
            {/* Property Images */}
            <div className="relative h-96">
              {property.images && property.images[0] ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            
            {/* Property Details */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
                <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-semibold">{property.rating}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                {property.location.city}, {property.location.country}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <p className="text-gray-500">Bedrooms</p>
                  <p className="text-xl font-semibold">{property.bedrooms}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <p className="text-gray-500">Bathrooms</p>
                  <p className="text-xl font-semibold">{property.bathrooms}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <p className="text-gray-500">Max Guests</p>
                  <p className="text-xl font-semibold">{property.maxGuests}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
              
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div 
                        key={index}
                        className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700 flex items-center"
                      >
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">${property.price}</span>
                    <span className="text-gray-500"> / night</span>
                  </div>
                  <button 
                    className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                    onClick={() => window.location.href = `/payment?propertyId=${property._id}`}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-gray-500">Property not found</div>
          </div>
        )}
      </main>
    </>
  );
}