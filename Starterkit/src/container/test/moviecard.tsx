import React from 'react';

interface MovieCardProps {
  title: string;
  bgName: string;
  year: string;
  runtime: string;
  director: string;
  writer: string;
  imdbRating: number;
  poster?: string;
  onSeeMore: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, bgName, year, runtime, director, writer, imdbRating, poster, onSeeMore }) => {
  return (
    <div className="flex border border-gray-200 rounded p-4 shadow">
      {/* Poster on the left */}
      <div className="w-1/4">
        <img
          src={poster || 'https://via.placeholder.com/100x150'}
          alt={title}
          className="object-cover rounded"
        />
      </div>
      
      {/* Details on the right */}
      <div className="w-3/4 pl-4">
        <h3 className="text-lg font-semibold">{title} / {bgName}</h3>
        <p className="text-gray-600"><strong> Година: </strong>{year}</p>
        <p className="text-gray-600"><strong> Продължителност: </strong>{runtime}</p>
        <p className="text-gray-600"><strong> Режисьори:</strong> {director}</p>
        <p className="text-gray-600"><strong> Сценаристи: </strong>{writer}</p>
        <p className="text-gray-600"><strong> Рейтинг в IMDB: </strong>{imdbRating}</p>

        {/* See More button */}
        <button
          onClick={onSeeMore}
          className="text-blue-500 hover:text-blue-700 mt-2 text-sm border border-black"
        >
          Вижте повече
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
