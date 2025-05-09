"use client";

import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">About NomadStay</h1>
          
          <div className="prose prose-lg">
            <p className="text-gray-600 mb-6">
              NomadStay is a modern hotel booking platform designed specifically for digital nomads
              and modern travelers. We understand the unique needs of remote workers and
              provide accommodations that combine comfort, functionality, and style.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Our mission is to connect digital nomads with perfect living spaces that inspire
              creativity and productivity while offering all the comforts of home.
            </p>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Carefully curated properties with high-speed internet</li>
              <li>Dedicated workspaces in every accommodation</li>
              <li>Long-term stay options with flexible booking</li>
              <li>Community events and networking opportunities</li>
              <li>24/7 support for both hosts and guests</li>
            </ul>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Join Our Community</h2>
            <p className="text-gray-600 mb-6">
              Whether you're a digital nomad looking for your next home or a property owner
              wanting to host remote workers, NomadStay is your platform for meaningful
              connections and comfortable stays.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}