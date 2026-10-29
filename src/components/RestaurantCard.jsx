import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Store, Star } from 'lucide-react';

export const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const {
    restaurant_id,
    restaurant_name,
    logo,
    address_complete,
    rating,
    cuisine,
    price,
    cost_for_two,
  } = restaurant;

  const hasLogo = logo && logo !== 'null' && typeof logo === 'string' && logo.trim().length > 0;
  const hasAddress =
    address_complete &&
    address_complete !== 'null' &&
    typeof address_complete === 'string' &&
    address_complete.trim().length > 0;

  // Clean initials fallback if logo fails to load
  const initials = restaurant_name
    ? restaurant_name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'R';

  const handleClick = () => {
    navigate(`/restaurant/${restaurant_id}`, { state: { restaurant } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-soft transition-all cursor-pointer flex items-start space-x-3.5 group focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
      aria-label={`View ${restaurant_name || 'Restaurant'}`}
    >
      {/* Restaurant Image / Logo container */}
      <div className="w-18 h-18 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 relative flex items-center justify-center">
        {hasLogo && !imageError ? (
          <img
            src={logo}
            alt={restaurant_name || 'Restaurant Logo'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-brand-orange/10 to-brand-orange/20 flex flex-col items-center justify-center text-brand-orange font-bold text-base select-none">
            <Store className="w-5 h-5 mb-0.5 opacity-80" />
            <span className="text-[10px] tracking-wider">{initials}</span>
          </div>
        )}
      </div>

      {/* Restaurant Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-bold text-brand-dark truncate group-hover:text-brand-orange transition-colors">
            {restaurant_name || 'Unnamed Restaurant'}
          </h4>

          {/* Render price only if available in API response */}
          {(price || cost_for_two) && (
            <span className="text-xs font-bold text-brand-dark shrink-0 ml-2">
              {price || cost_for_two}
            </span>
          )}
        </div>

        {/* Address */}
        <p className="text-[11px] text-gray-500 truncate mt-1 flex items-center">
          <MapPin className="w-3 h-3 text-gray-400 mr-1 shrink-0" />
          <span className="truncate">
            {hasAddress ? address_complete : 'Address not specified'}
          </span>
        </p>

        {/* Optional Cuisine & Rating, rendered only if fields actually exist in API record */}
        {(cuisine || rating) && (
          <div className="mt-1.5 flex items-center space-x-2 text-[10px]">
            {rating && (
              <span className="flex items-center text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
                <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                {rating}
              </span>
            )}
            {cuisine && <span className="text-gray-400">• {cuisine}</span>}
          </div>
        )}

        {/* Bottom Metadata & Action CTA */}
        <div className="mt-2.5 flex items-center justify-between pt-0.5">
          <span className="text-[10px] text-gray-400 font-medium">
            ID: #{restaurant_id}
          </span>

          <span className="px-2.5 py-1 text-[11px] font-bold text-brand-orange bg-brand-orange/10 rounded-full group-hover:bg-brand-orange group-hover:text-white transition-all flex items-center space-x-0.5">
            <span>Explore Menu</span>
            <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;

