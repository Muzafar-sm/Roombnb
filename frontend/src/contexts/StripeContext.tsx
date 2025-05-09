"use client";

import { ReactNode, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Your publishable key - safe to use in frontend code
const stripePromise = loadStripe('pk_test_51RMSo2H0RP1nZqUwZRcUBW3Et9WTlgJkB3XIB3oCqWZUX8eAlnU9zDS1fd503rogoWHNnf1Bp6JDxMbJPBd1syJJ00E4Ifm52d');

interface StripeProviderProps {
  children: ReactNode;
  amount: number;
}

export function StripeProvider({ children, amount }: StripeProviderProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Skip API call if amount is 0 or not provided
    if (!amount || amount <= 0) {
      console.log("Skipping payment intent creation for zero amount");
      setLoading(false);
      return;
    }
    
    // Get the authentication token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      setError("You must be logged in to make a payment. Please sign in and try again.");
      setLoading(false);
      return;
    }
    
    // Convert amount to cents if it's in dollars
    const amountInCents = Math.round(amount * 100);
    console.log("Creating payment intent for amount:", amountInCents);
    
    // Create a PaymentIntent as soon as the page loads
    fetch("http://localhost:5000/api/payment/create-payment-intent", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Add the token here
      },
      body: JSON.stringify({ amount: amountInCents }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Received client secret:", data);
        if (!data.clientSecret) {
          console.error("No clientSecret received from backend");
          setError("Payment setup failed. Please try again later.");
        }
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error creating payment intent:", err);
        setError("Payment setup failed: " + err.message);
        setLoading(false);
      });
  }, [amount]);

  // Display error message if authentication failed
  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
        <p className="font-medium">{error}</p>
        <button 
          onClick={() => window.location.href = '/signin'}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Only render Elements if we have a clientSecret and amount > 0
  if (amount <= 0) {
    return <>{children}</>; // Just render children without Stripe Elements
  }
  
  if (loading || !clientSecret) {
    return <div>Loading payment system...</div>;
  }

  return (
    <Elements 
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
          }
        }
      }}
    >
      {children}
    </Elements>
  );
}