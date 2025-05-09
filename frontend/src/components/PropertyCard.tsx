'use client';

import Image from "next/image";
import Link from "next/link";
import PropertyCardViewButton from "./PropertyCardViewButton";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
}

export default function PropertyCard({
  id,
  title,
  location,
  price,
  rating,
  imageUrl,
}: PropertyCardProps) {
  return (
    <Link href={`/properties/${id}`}>
      <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="relative h-64">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-gray-900">{rating}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-4">{location}</p>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-gray-900">${price}</span>
              <span className="text-gray-500 ml-1">/ night</span>
            </div>
            <PropertyCardViewButton propertyId={id} />
          </div>
        </div>
      </div>
    </Link>
  );
}