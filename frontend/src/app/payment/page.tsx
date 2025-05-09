"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeProvider } from "@/contexts/StripeContext";

function PaymentForm({ property, totalPrice, propertyId, nights }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isElementsReady, setIsElementsReady] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success?property_id=${propertyId}&nights=${nights}`,
        },
        redirect: 'if_required',
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Send booking info to your backend
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          propertyId,
          nights,
          totalAmount: totalPrice
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }
      
      // Payment successful
      alert("Payment successful! Your booking has been confirmed.");
      router.push("/");
    } catch (err) {
      setError(err.message || "Payment processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Card Information</label>
        <div className="w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600">
          <PaymentElement 
            id="payment-element"
            options={{
              layout: {
                type: 'tabs',
                defaultCollapsed: false,
              },
            }}
            onReady={() => setIsElementsReady(true)}
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || !elements || !isElementsReady || loading}
        className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 font-medium"
      >
        {loading ? "Processing payment..." : `Pay $${totalPrice}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [propertyId, setPropertyId] = useState("");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nights, setNights] = useState(1);
  
  useEffect(() => {
    const id = searchParams.get("propertyId");
    if (!id) {
      setError("Property ID is missing");
      setLoading(false);
      return;
    }
    
    setPropertyId(id);
    fetchPropertyDetails(id);
  }, [searchParams]);

  const fetchPropertyDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch property details");
      }
      
      const data = await response.json();
      setProperty(data);
    } catch (err) {
      setError(err.message || "Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const handleNightsChange = (e) => {
    setNights(parseInt(e.target.value) || 1);
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

  if (error || !property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error || "Property not found"}
          </div>
        </div>
      </>
    );
  }

  const totalPrice = property.price * nights;

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Complete Your Booking</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Property Summary */}
            <div>
              <div className="bg-blue-50 p-6 rounded-xl mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Booking Summary</h2>
                
                <div className="flex items-start mb-4">
                  {property.images && property.images[0] && (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-24 h-24 object-cover rounded-lg mr-4"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-800">{property.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {property.location.city}, {property.location.country}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Price per night</span>
                    <span>${property.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Number of nights</span>
                    <select 
                      value={nights} 
                      onChange={handleNightsChange}
                      className="border rounded px-2 py-1"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 14, 30].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Form */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Payment Details</h3>
              <StripeProvider amount={totalPrice}>
                <PaymentForm 
                  property={property}
                  totalPrice={totalPrice}
                  propertyId={propertyId}
                  nights={nights}
                />
              </StripeProvider>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}