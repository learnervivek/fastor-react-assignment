import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  Percent,
  Wallet,
  ShoppingBag,
  LogOut,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Store,
} from 'lucide-react';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import RestaurantCard from '../components/RestaurantCard';
import RestaurantSkeleton from '../components/RestaurantSkeleton';
import LocationModal from '../components/modals/LocationModal';
import OffersModal from '../components/modals/OffersModal';
import WalletModal from '../components/modals/WalletModal';
import DriverTrackingModal from '../components/modals/DriverTrackingModal';
import CancelOrderModal from '../components/modals/CancelOrderModal';
import BestSellersModal from '../components/modals/BestSellersModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getRestaurants } from '../services/restaurantService';

const BEST_SELLERS = [
  {
    id: 'bs1',
    name: 'Sushi Roll',
    restaurantName: 'Tokyo Artisan Sushi Bar',
    category: 'Japanese Cuisine',
    price: '$103.0',
    rating: '4.9',
    prepTime: '20 mins',
    calories: '380 kcal',
    isVeg: false,
    ingredients: 'Fresh Atlantic salmon, ripe avocado, seasoned sushi rice, toasted nori seaweed, Japanese mayo',
    description: 'Masterfully hand-rolled sushi featuring sashimi-grade fresh salmon, Hass avocado, and seasoned short-grain rice with pickled ginger and wasabi.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80',
    portion: 'Personal (4 Slides)',
  },
  {
    id: 'bs2',
    name: 'Spicy Rice Bowl',
    restaurantName: 'Bangkok Wok & Bowls',
    category: 'Asian Specialty',
    price: '$50.0',
    rating: '4.8',
    prepTime: '15 mins',
    calories: '490 kcal',
    isVeg: true,
    ingredients: 'Jasmine rice, wok-tossed baby corn, edamame, chili crisp oil, organic tofu, scallions',
    description: 'Steaming fragrant jasmine rice loaded with crisp garden vegetables, golden pan-fried tofu, and our signature fiery chili crisp glaze.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    portion: 'Medium (8 Slides)',
  },
  {
    id: 'bs3',
    name: 'Lasagna',
    restaurantName: 'Bella Italia Kitchen',
    category: 'Italian Cuisine',
    price: '$12.99',
    rating: '4.9',
    prepTime: '20 mins',
    calories: '510 kcal',
    isVeg: true,
    ingredients: 'Semolina pasta sheets, whole milk ricotta, slow-cooked pomodoro, parmesan, fresh basil',
    description: 'Golden oven-baked lasagna layered with velvety ricotta cheese, San Marzano marinara sauce, and melted mozzarella.',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&auto=format&fit=crop&q=80',
    portion: 'Personal (4 Slides)',
  },
  {
    id: 'bs4',
    name: 'Cupcake Dessert',
    restaurantName: 'Sweet Tooth Artisan Bakery',
    category: 'Bakery & Sweets',
    price: '$8.20',
    rating: '4.7',
    prepTime: '5 mins',
    calories: '280 kcal',
    isVeg: true,
    ingredients: 'Madagascar vanilla bean, organic flour, French butter, fresh raspberry frosting',
    description: 'Delicate moist vanilla bean cake crowned with whipped raspberry buttercream and delicate edible gold flakes.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80',
    portion: 'Personal (4 Slides)',
  },
  {
    id: 'bs5',
    name: 'Pepperoni Pizza',
    restaurantName: 'Mother India Pizzeria',
    category: 'Pizzeria',
    price: '$14.00',
    rating: '5.0',
    prepTime: '22 mins',
    calories: '680 kcal',
    isVeg: false,
    ingredients: 'Artisanal sourdough crust, San Marzano tomato sauce, smoky pepperoni, aged mozzarella',
    description: 'Crispy stone-baked thin crust pizza generously topped with spicy dry-cured pepperoni and bubbly whole milk mozzarella cheese.',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&auto=format&fit=crop&q=80',
    portion: 'Jumbo (12 Slides)',
  },
];

const INITIAL_POPULAR_ITEMS = [
  {
    id: 'pop1',
    orderId: '#FST-8902',
    name: 'Strawberry Shake',
    restaurantName: 'Sugandham Beverages & Cafe',
    category: 'Beverage & Dessert',
    date: '29 Nov, 01:20 pm',
    itemsCount: '2 items',
    price: '₹20.00',
    status: 'Out for Delivery',
    statusColor: 'green',
    rating: '4.9',
    calories: '320 kcal',
    prepTime: '15 mins',
    isVeg: true,
    ingredients: 'Fresh Himalayan strawberries, full cream milk, vanilla bean ice cream',
    description: 'Thick, creamy hand-spun shake infused with real strawberry puree and topped with a fresh strawberry garnish.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'pop2',
    orderId: '#FST-8905',
    name: 'Chicken Burger',
    restaurantName: 'VYB Gourmet Grill',
    category: 'Fast Food',
    date: '17 Oct, 01:20 pm',
    itemsCount: '1 item',
    price: '₹20.00',
    status: 'Delivered',
    statusColor: 'blue',
    rating: '4.8',
    calories: '540 kcal',
    prepTime: '20 mins',
    isVeg: false,
    ingredients: 'Crispy seasoned chicken breast, iceberg lettuce, house honey mustard, sesame brioche bun',
    description: 'Golden fried chicken breast stacked with fresh garden greens and savory house mayo on a warm toasted brioche bun.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'pop3',
    orderId: '#FST-8912',
    name: 'Pepperoni Pizza Melt',
    restaurantName: 'Mother India Pizzeria',
    category: 'Pizzeria',
    date: '28 Oct, 08:45 pm',
    itemsCount: '1 item',
    price: '₹24.00',
    status: 'Preparing',
    statusColor: 'amber',
    rating: '5.0',
    calories: '680 kcal',
    prepTime: '25 mins',
    isVeg: false,
    ingredients: 'Artisanal sourdough crust, San Marzano tomato sauce, spicy pepperoni, whole milk mozzarella',
    description: 'Stone-baked thin crust pizza loaded with smoky pepperoni slices and bubbly melted mozzarella.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'pop4',
    orderId: '#FST-8919',
    name: 'Classic Truffle Lasagna',
    restaurantName: 'Bella Italia Kitchen',
    category: 'Italian Cuisine',
    date: '27 Oct, 02:10 pm',
    itemsCount: '1 item',
    price: '₹22.00',
    status: 'Delivered',
    statusColor: 'blue',
    rating: '4.9',
    calories: '490 kcal',
    prepTime: '20 mins',
    isVeg: true,
    ingredients: 'Durum wheat pasta sheets, ricotta, pomodoro sauce, parmesan, white truffle oil',
    description: 'Rich oven-baked pasta layers enveloped in velvety ricotta cheese and slow-simmered pomodoro sauce.',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&auto=format&fit=crop&q=80',
  },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  // Location State
  const [selectedLocation, setSelectedLocation] = useState({
    id: '118',
    name: 'Model Town, New Delhi',
    state: 'Delhi NCR',
  });
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Header Modals
  const [offersModalOpen, setOffersModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  // Order Action Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [bestSellersModalOpen, setBestSellersModalOpen] = useState(false);

  // Live Restaurants from Fastor Staging API
  const [restaurants, setRestaurants] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({ total_pages: 1, total_count: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Active Tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('restaurants'); // default to real API restaurants
  const [activeBannerDot, setActiveBannerDot] = useState(0);

  // Popular items state (allows cancelling items)
  const [popularItems, setPopularItems] = useState(INITIAL_POPULAR_ITEMS);

  // Fetch restaurants via restaurantService
  const fetchRestaurantList = useCallback(async (cityId, page) => {
    setLoading(true);
    setError(null);

    try {
      const { results, meta } = await getRestaurants(cityId, page);
      setRestaurants(results);
      setPaginationMeta(meta);
    } catch (err) {
      console.error('Restaurant fetch error:', err);
      // Report genuine error without using fake fallback records
      setError(
        err.response?.data?.error_message ||
        err.response?.data?.message ||
        err.message ||
        'Unable to load restaurants from Fastor staging server.'
      );
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRestaurantList(selectedLocation.id, currentPage);
  }, [selectedLocation.id, currentPage, fetchRestaurantList]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (paginationMeta.total_pages || 1)) {
      setCurrentPage(newPage);
      // Scroll to top of restaurant list
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const handleLocationChange = (newLocation) => {
    setSelectedLocation(newLocation);
    setCurrentPage(1); // reset to page 1 for new city
  };

  const displayName = user?.user_name && user.user_name !== 'Guest' ? user.user_name : 'Karan';

  const handleConfirmCancelOrder = (orderId) => {
    setPopularItems((prev) => prev.filter((item) => item.id !== orderId));
    alert('Order cancelled successfully.');
  };

  // Search filtering
  const filteredPopular = popularItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRestaurants = restaurants.filter((r) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = r.restaurant_name?.toLowerCase().includes(q);
    const addressMatch = r.address_complete?.toLowerCase().includes(q);
    return nameMatch || addressMatch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFE] justify-between">
      <div>
        <StatusBar />

        {/* Top Header Section */}
        <div className="px-5 pt-1 pb-3">
          {/* Location row */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setLocationModalOpen(true)}
              className="text-left group focus:outline-none"
            >
              <span className="text-[11px] font-medium text-brand-gray block tracking-wider">
                Current Locations
              </span>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="text-sm font-bold text-brand-dark tracking-tight">
                  {selectedLocation.name}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-brand-orange transition-colors" />
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Log Out"
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* User Search Bar & Action Badges */}
          <div className="mt-3.5 flex items-center justify-between gap-3">
            {/* Search input with user's name as placeholder */}
            <div className="flex-1 flex items-center bg-[#F4F5F7] h-12 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-brand-orange/30 transition-all">
              <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={displayName}
                className="w-full bg-transparent text-sm font-medium text-brand-dark placeholder-gray-500 focus:outline-none"
                aria-label="Search restaurants"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-gray-400 hover:text-gray-600 px-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Action Badge 1: Offers (Coral) */}
            <button
              type="button"
              onClick={() => setOffersModalOpen(true)}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#FF9E7A] flex items-center justify-center text-white shadow-sm hover:opacity-95 active:scale-95 transition-all shrink-0"
              aria-label="Offers"
            >
              <Percent className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Action Badge 2: Wallet / Cart (Sky blue) */}
            <button
              type="button"
              onClick={() => setWalletModalOpen(true)}
              className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5E9EFF] to-[#7BB3FF] flex items-center justify-center text-white shadow-sm hover:opacity-95 active:scale-95 transition-all shrink-0"
              aria-label="Wallet and Cart"
            >
              {cartCount > 0 ? (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                </>
              ) : (
                <Wallet className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="space-y-6 pb-6">
          {/* SECTION 1: Best Seller Section */}
          <div>
            <div className="px-5 flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-brand-dark tracking-tight">Best Seller</h2>
              <button
                type="button"
                onClick={() => setBestSellersModalOpen(true)}
                className="text-xs font-semibold text-brand-orange hover:underline focus:outline-none"
              >
                View all
              </button>
            </div>

            {/* Horizontal scroll cards */}
            <div className="flex space-x-3 overflow-x-auto px-5 pb-2 no-scrollbar">
              {BEST_SELLERS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const targetId = restaurants[0]?.restaurant_id || '75';
                    navigate(`/restaurant/${targetId}`, { state: { item } });
                  }}
                  className="shrink-0 w-24 group cursor-pointer"
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shadow-sm transition-transform duration-200 group-hover:scale-[1.03]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      {item.price}
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-brand-dark truncate">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Promotional Banner Slider */}
          <div className="px-5">
            <div
              onClick={() => {
                const targetId = restaurants[0]?.restaurant_id || '75';
                navigate(`/restaurant/${targetId}`, {
                  state: {
                    item: {
                      name: 'Special Pepperoni Pizza',
                      price: '₹14.00',
                      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
                    },
                  },
                });
              }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF5722] via-[#FF6636] to-[#FF7B4D] text-white p-5 cursor-pointer shadow-soft transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full border-[6px] border-white/20"></div>
              <div className="absolute -top-8 right-24 w-28 h-28 rounded-full bg-white/10 blur-lg"></div>

              <div className="flex items-center justify-between relative z-10">
                <div className="max-w-[55%]">
                  <p className="text-xs font-medium text-white/95 leading-snug">
                    Experience our delicious new dish
                  </p>
                  <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-white drop-shadow-xs">
                    30% OFF
                  </h3>
                </div>

                <div className="w-28 h-28 shrink-0 relative">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80"
                    alt="Pizza Special"
                    className="w-full h-full object-cover rounded-2xl shadow-md rotate-3"
                  />
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center space-x-1.5 mt-3">
                {[0, 1, 2, 3].map((dot) => (
                  <button
                    key={dot}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBannerDot(dot);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeBannerDot === dot
                        ? 'w-6 bg-white'
                        : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Slide ${dot + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: Live Fastor Restaurant Listing */}
          <div className="px-5">
            {/* Header & Tabs */}
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <h2 className="text-lg font-bold text-brand-dark tracking-tight">
                  Restaurants Feed
                </h2>
                <span className="text-[11px] text-brand-gray block">
                  {paginationMeta.total_count > 0
                    ? `${paginationMeta.total_count} restaurants in ${selectedLocation.name}`
                    : 'Fastor verified partners'}
                </span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('restaurants')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeTab === 'restaurants'
                      ? 'bg-white text-brand-orange shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Live API
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('popular')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeTab === 'popular'
                      ? 'bg-white text-brand-orange shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Popular Items
                </button>
              </div>
            </div>

            {/* TAB 1: Live Fastor Staging API Listing */}
            {activeTab === 'restaurants' && (
              <div className="space-y-3">
                {/* 1. Loading Skeletons */}
                {loading && <RestaurantSkeleton count={4} />}

                {/* 2. Meaningful Error State with Retry */}
                {!loading && error && (
                  <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3 animate-fadeIn">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                    <div>
                      <h3 className="text-sm font-bold text-red-800">
                        Unable to fetch restaurant directory
                      </h3>
                      <p className="text-xs text-red-600 mt-1 max-w-xs mx-auto leading-relaxed">
                        {error}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchRestaurantList(selectedLocation.id, currentPage)}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-orange text-white text-xs font-bold rounded-xl shadow-xs hover:bg-brand-orange-hover transition-colors active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Request</span>
                    </button>
                  </div>
                )}

                {/* 3. Empty State */}
                {!loading && !error && filteredRestaurants.length === 0 && (
                  <div className="p-8 bg-gray-50 border border-gray-100 rounded-2xl text-center space-y-2 animate-fadeIn">
                    <Store className="w-8 h-8 text-gray-400 mx-auto" />
                    <h4 className="text-sm font-bold text-gray-800">No restaurants found</h4>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      {searchQuery
                        ? `No results match "${searchQuery}". Try a different keyword.`
                        : 'No dining partners are available in this sector at the moment.'}
                    </p>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mt-2 text-xs font-bold text-brand-orange hover:underline"
                      >
                        Clear search filter
                      </button>
                    )}
                  </div>
                )}

                {/* 4. Live Restaurant Cards List */}
                {!loading && !error && filteredRestaurants.length > 0 && (
                  <>
                    <div className="space-y-3">
                      {filteredRestaurants.map((restaurant) => (
                        <RestaurantCard
                          key={restaurant.restaurant_id}
                          restaurant={restaurant}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {paginationMeta.total_pages > 1 && !searchQuery && (
                      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-brand-gray font-medium">
                          Page <span className="font-bold text-brand-dark">{currentPage}</span> of{' '}
                          <span className="font-bold text-brand-dark">{paginationMeta.total_pages}</span>
                        </span>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || loading}
                            className={`p-2 rounded-xl border text-xs font-bold flex items-center space-x-1 transition-all ${
                              currentPage > 1
                                ? 'bg-white border-gray-200 text-brand-dark hover:bg-gray-50'
                                : 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            aria-label="Previous Page"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Prev</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= paginationMeta.total_pages || loading}
                            className={`p-2 rounded-xl border text-xs font-bold flex items-center space-x-1 transition-all ${
                              currentPage < paginationMeta.total_pages
                                ? 'bg-white border-gray-200 text-brand-dark hover:bg-gray-50'
                                : 'bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            aria-label="Next Page"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB 2: Popular Order Items from Figma */}
            {activeTab === 'popular' && (
              <div className="space-y-3">
                {filteredPopular.length === 0 ? (
                  <div className="p-6 bg-gray-50 rounded-2xl text-center text-xs text-gray-500">
                    No popular items match your search.
                  </div>
                ) : (
                  filteredPopular.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        const targetId = restaurants[0]?.restaurant_id || '75';
                        navigate(`/restaurant/${targetId}`, { state: { item } });
                      }}
                      className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-soft transition-all cursor-pointer flex flex-col space-y-2.5 group"
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className="w-18 h-18 rounded-2xl overflow-hidden bg-gray-100 shrink-0 relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {/* Veg/Non-Veg indicator */}
                          <div className="absolute top-1.5 left-1.5 w-4 h-4 bg-white/90 backdrop-blur-xs rounded-md flex items-center justify-center p-0.5 shadow-xs">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-bold text-brand-dark truncate group-hover:text-brand-orange transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-brand-orange font-semibold truncate">
                                {item.restaurantName}
                              </p>
                            </div>
                            <span className="text-sm font-black text-brand-dark ml-2">
                              {item.price}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-1">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span>{item.itemsCount}</span>
                            <span>•</span>
                            <span className="font-medium text-gray-500">{item.orderId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Banner & Action Buttons */}
                      <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              item.status === 'Out for Delivery'
                                ? 'bg-green-50 text-green-700'
                                : item.status === 'Preparing'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            ● {item.status}
                          </span>
                          <span className="text-[10px] text-gray-400">★ {item.rating}</span>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {item.status !== 'Delivered' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(item);
                                setCancelModalOpen(true);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-white bg-brand-coral hover:bg-brand-orange-hover rounded-full transition-all shadow-xs active:scale-95"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(item);
                              setTrackingModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-brand-coral bg-brand-coral-light hover:bg-brand-coral-light/80 rounded-full transition-all active:scale-95"
                          >
                            Track
                          </button>
                          <span className="text-[11px] font-bold text-brand-orange pl-1 group-hover:translate-x-0.5 transition-transform flex items-center">
                            Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* iOS Home Indicator Bar */}
      <HomeIndicator className="pb-2" />

      {/* Modals */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={handleLocationChange}
      />
      <OffersModal isOpen={offersModalOpen} onClose={() => setOffersModalOpen(false)} />
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      <DriverTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        orderItem={selectedOrder}
      />
      <CancelOrderModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        orderItem={selectedOrder}
        onConfirmCancel={handleConfirmCancelOrder}
      />
      <BestSellersModal
        isOpen={bestSellersModalOpen}
        onClose={() => setBestSellersModalOpen(false)}
        restaurantId={restaurants[0]?.restaurant_id || '75'}
      />
    </div>
  );
};

export default DashboardPage;
