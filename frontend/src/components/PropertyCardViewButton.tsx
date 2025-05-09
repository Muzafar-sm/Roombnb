'use client';

interface PropertyCardViewButtonProps {
  propertyId: string;
}

export default function PropertyCardViewButton({ propertyId }: PropertyCardViewButtonProps) {
  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any parent Link's navigation
    e.stopPropagation(); // Stop event bubbling
    
    // Check if it's a valid MongoDB ObjectId (24 chars)
    if (propertyId && propertyId.length === 24) {
      window.location.href = `/properties/${propertyId}`;
    } else {
      // For invalid IDs, redirect to the properties list
      console.error("Invalid property ID format:", propertyId);
      window.location.href = '/properties';
    }
  };

  return (
    <button 
      className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition cursor-pointer"
      onClick={handleViewDetails}
    >
      View Details
    </button>
  );
}