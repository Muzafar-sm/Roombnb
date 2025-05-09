"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function CreatePropertyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: {
      city: "",
      country: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
    images: [""], // Start with one empty image URL field
    amenities: [""], // Start with one empty amenity field
    maxGuests: "",
    bedrooms: "",
    bathrooms: "",
  });

  // Check if user is authenticated and is a host
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-20 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="mb-6">Please sign in to create a property listing.</p>
            <button
              onClick={() => router.push("/signin")}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  const handleAmenityChange = (index, value) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities[index] = value;
    setFormData({
      ...formData,
      amenities: updatedAmenities,
    });
  };

  const addAmenityField = () => {
    setFormData({
      ...formData,
      amenities: [...formData.amenities, ""],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert string values to numbers
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        maxGuests: Number(formData.maxGuests),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        // Filter out empty values
        images: formData.images.filter(img => img.trim() !== ""),
        amenities: formData.amenities.filter(amenity => amenity.trim() !== ""),
      };

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create property");
      }

      const data = await response.json();
      router.push(`/properties/${data._id}`);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Your Property Listing</h1>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl text-gray-800 font-semibold">Basic Information</h2>
              
              <div>
                <label className="block text-gray-800 mb-2" htmlFor="title">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                  placeholder="e.g., Cozy Apartment in Downtown"
                />
              </div>
              
              <div>
                <label className="block text-gray-800 mb-2" htmlFor="description">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                  placeholder="Describe your property..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-800 mb-2" htmlFor="price">
                  Price per Night (USD) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                  placeholder="e.g., 100"
                />
              </div>
            </div>
            
            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-xl text-gray-800 font-semibold">Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 mb-2" htmlFor="location.city">
                    City *
                  </label>
                  <input
                    type="text"
                    id="location.city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                    placeholder="e.g., New York"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-800 mb-2" htmlFor="location.country">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="location.country"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                    placeholder="e.g., USA"
                  />
                </div>
              </div>
            </div>
            
            {/* Property Details */}
            <div className="space-y-4">
              <h2 className="text-xl  text-gray-800 font-semibold">Property Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-800 mb-2" htmlFor="maxGuests">
                    Max Guests *
                  </label>
                  <input
                    type="number"
                    id="maxGuests"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-800 mb-2" htmlFor="bedrooms">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="bathrooms">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                  />
                </div>
              </div>
            </div>
            
            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-xl text-gray-800 font-semibold">Images</h2>
              
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                    placeholder="Image URL"
                  />
                </div>
              ))}
              
              <button
                type="button"
                onClick={addImageField}
                className="text-blue-600 hover:text-blue-800"
              >
                + Add another image
              </button>
            </div>
            
            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-xl text-gray-800 font-semibold">Amenities</h2>
              
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={amenity}
                    onChange={(e) => handleAmenityChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md hover:shadow-lg transition-shadow duration-300"
                    placeholder="e.g., WiFi, Pool, Kitchen"
                  />
                </div>
              ))}
              
              <button
                type="button"
                onClick={addAmenityField}
                className="text-blue-600 hover:text-blue-800"
              >
                + Add another amenity
              </button>
            </div>
            
            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400"
              >
                {loading ? "Creating..." : "Create Property"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}