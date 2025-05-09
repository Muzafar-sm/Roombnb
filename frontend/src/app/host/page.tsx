"use client";

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HostPage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Become a Host</h1>

          {!user ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-6">
                Please sign in or create an account to become a host.
              </p>
              <div className="space-x-4">
                <Link
                  href="/signin"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-block bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600">
                Share your space with travelers and earn extra income as a NomadStay host.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4">Why Host on NomadStay?</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>• Earn extra income from your property</li>
                    <li>• Meet interesting people from around the world</li>
                    <li>• Flexible hosting schedule</li>
                    <li>• 24/7 host support</li>
                  </ul>
                </div>

                <div className="bg-white/50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li>1. List your property details</li>
                    <li>2. Add high-quality photos</li>
                    <li>3. Set your availability and house rules</li>
                    <li>4. Start accepting bookings</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg cursor-pointer"
                  onClick={() => window.location.href = '/properties/new'}
                >
                  Create Your Listing
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}