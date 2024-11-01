import React from 'react';

interface MovieCardProps {
  title: string;
  year: string;
  director: string;
  writer: string;
  poster?: string;
  onSeeMore: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, year, director, writer, poster, onSeeMore }) => {
  return (
    <div className="flex border border-gray-200 rounded p-4 shadow">
      {/* Poster on the left */}
      <div className="w-1/4">
        <img
          src={poster || 'https://via.placeholder.com/100x150'}
          alt={title}
          className="w-full h-full object-cover rounded"
        />
      </div>
      
      {/* Details on the right */}
      <div className="w-3/4 pl-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">Year: {year}</p>
        <p className="text-gray-600">Director: {director}</p>
        <p className="text-gray-600">Writer: {writer}</p>

        {/* See More button */}
        <button
          onClick={onSeeMore}
          className="text-blue-500 hover:text-blue-700 mt-2 text-sm"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
