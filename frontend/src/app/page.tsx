"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";

// Define Property interface
interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    country: string;
  };
  images: string[];
  rating: number;
}

// Add Location interface for search results
interface LocationSuggestion {
  id: string;
  name: string;
  country: string;
}

const featuredProperties = [
  {
    id: "1",
    title: "Modern Loft in Downtown",
    location: "New York, USA",
    price: 150,
    rating: 4.9,
    imageUrl: "/assets/property-1.jpg",
  },
  {
    id: "2",
    title: "Beachfront Villa",
    location: "Bali, Indonesia",
    price: 300,
    rating: 4.8,
    imageUrl: "/assets/property-2.jpg",
  },
  {
    id: "3",
    title: "Mountain View Cabin",
    location: "Swiss Alps",
    price: 200,
    rating: 4.7,
    imageUrl: "/assets/property-3.jpg",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LocationSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allLocations, setAllLocations] = useState<LocationSuggestion[]>([]);

  // Fetch properties when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      fetchProperties();
    }
  }, [selectedCategory]);

  // Fetch all locations for search suggestions
  useEffect(() => {
    fetchAllLocations();
  }, []);

  const fetchAllLocations = async () => {
    try {
      console.log("Fetching locations from API...");
      const response = await fetch("http://localhost:5000/api/properties");
      
      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }
      
      const data = await response.json();
      console.log("API data received:", data);
      
      // Extract unique locations from properties
      const locations: LocationSuggestion[] = data.map((property: Property) => ({
        id: property._id,
        name: property.location.city,
        country: property.location.country
      }));
      
      // Remove duplicates (if multiple properties in same city)
      const uniqueLocations = Array.from(new Set(locations.map(loc => loc.name)))
        .map(name => locations.find(loc => loc.name === name));
      
      console.log("Unique locations extracted:", uniqueLocations);
      setAllLocations(uniqueLocations as LocationSuggestion[]);
    } catch (err) {
      console.error("Error fetching locations:", err);
      // Initialize with empty array instead of falling back to hardcoded data
      setAllLocations([]);
    }
  };

  // Filter search results based on input with debouncing
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length === 0) {
      setShowDropdown(false);
      return;
    }
    
    console.log("Filtering with query:", query);
    console.log("Available locations:", allLocations);
    
    // Filter locations that CONTAIN the query (not just starting with it)
    const filteredResults = allLocations.filter(location => {
      const nameMatch = location.name.toLowerCase().includes(query.toLowerCase());
      const countryMatch = location.country.toLowerCase().includes(query.toLowerCase());
      return nameMatch || countryMatch;
    });
    
    console.log("Filtered results:", filteredResults);
    setSearchResults(filteredResults);
    setShowDropdown(true);
  };

  // Handle location selection from dropdown
  const handleLocationSelect = (location: LocationSuggestion) => {
    setSearchQuery(`${location.name}, ${location.country}`);
    setShowDropdown(false);
    // You could also navigate to the property or filter properties by this location
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/properties");
      
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      
      const data = await response.json();
      
      // Filter properties based on selected category
      // Since there's no explicit category field, we'll filter based on the title
      const filteredProperties = data.filter((property: Property) => {
        const title = property.title.toLowerCase();
        
        if (selectedCategory === "Apartments") {
          return title.includes("apartment");
        } else if (selectedCategory === "Houses") {
          return title.includes("house") || 
                 (title.includes("home") && !title.includes("apartment") && !title.includes("villa") && !title.includes("studio"));
        } else if (selectedCategory === "Villas") {
          return title.includes("villa");
        } else if (selectedCategory === "Studios") {
          return title.includes("studio");
        }
        return true;
      });
      
      setProperties(filteredProperties);
    } catch (err: any) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const clearFilter = () => {
    setSelectedCategory(null);
    setProperties([]);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Hero Section */}
        <section className="relative h-[600px] rounded-3xl overflow-hidden mb-16">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src="/assets/hero-image.jpg"
            alt="Luxury accommodation"
            fill
            className="object-cover"
            priority
          />
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Discover unique accommodations for digital nomads and modern travelers
            </p>
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-full p-2 flex items-center relative">
              <input
                type="text"
                placeholder="Where do you want to stay?"
                className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-white placeholder-white/70"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                Search
              </button>
              
              {/* Search Results Dropdown - Modified to always show when typing */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-30">
                  <ul className="max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((location) => (
                        <li 
                          key={location.id}
                          className="px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-white"
                          onClick={() => handleLocationSelect(location)}
                        >
                          {location.name}, {location.country}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        No locations found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Apartments", "Houses", "Villas", "Studios"].map((category) => (
              <div
                key={category}
                className="relative h-40 rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div className={`absolute inset-0 ${selectedCategory === category ? 'bg-blue-500/50' : 'bg-black/30 group-hover:bg-black/40'} transition-all duration-300`} />
                <Image
                  src={`/assets/category-${category.toLowerCase()}.jpg`}
                  alt={category}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">{category}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filtered Properties Section */}
        {selectedCategory && (
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">{selectedCategory}</h2>
              <button 
                onClick={clearFilter}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <span>Clear Filter</span>
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
                {error}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard 
                    key={property._id}
                    id={property._id}
                    title={property.title}
                    location={`${property.location.city}, ${property.location.country}`}
                    price={property.price}
                    rating={property.rating}
                    imageUrl={property.images[0] || "/assets/property-placeholder.jpg"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No {selectedCategory.toLowerCase()} found. Try another category.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
