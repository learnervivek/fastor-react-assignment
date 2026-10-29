import React, { useState } from 'react';
import { X, Flame, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ALL_BEST_SELLERS = [
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
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80',
    portion: 'Personal (4 Slides)',
    description: 'Masterfully hand-rolled sushi featuring sashimi-grade fresh salmon, Hass avocado, and seasoned short-grain rice with pickled ginger and wasabi.',
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
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    portion: 'Medium (8 Slides)',
    description: 'Steaming fragrant jasmine rice loaded with crisp garden vegetables, golden pan-fried tofu, and our signature fiery chili crisp glaze.',
  },
  {
    id: 'bs3',
    name: 'Classic Lasagna',
    restaurantName: 'Bella Italia Kitchen',
    category: 'Italian Cuisine',
    price: '$12.99',
    rating: '4.9',
    prepTime: '20 mins',
    calories: '510 kcal',
    isVeg: true,
    ingredients: 'Semolina pasta sheets, whole milk ricotta, slow-cooked pomodoro, parmesan, fresh basil',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&auto=format&fit=crop&q=80',
    portion: 'Personal (4 Slides)',
    description: 'Golden oven-baked lasagna layered with velvety ricotta cheese, San Marzano marinara sauce, and melted mozzarella.',
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
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80',
    portion: 'Personal (4 Slides)',
    description: 'Delicate moist vanilla bean cake crowned with whipped raspberry buttercream and delicate edible gold flakes.',
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
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&auto=format&fit=crop&q=80',
    portion: 'Jumbo (12 Slides)',
    description: 'Crispy stone-baked thin crust pizza generously topped with spicy dry-cured pepperoni and bubbly whole milk mozzarella cheese.',
  },
  {
    id: 'bs6',
    name: 'Strawberry Shake',
    restaurantName: 'Sugandham Beverages & Cafe',
    category: 'Beverage & Dessert',
    price: '₹20.00',
    rating: '4.9',
    prepTime: '12 mins',
    calories: '320 kcal',
    isVeg: true,
    ingredients: 'Fresh Himalayan strawberries, full cream milk, vanilla bean ice cream',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80',
    portion: 'Regular',
    description: 'Thick, creamy hand-spun shake infused with real strawberry puree and topped with a fresh strawberry garnish.',
  },
  {
    id: 'bs7',
    name: 'Chicken Burger',
    restaurantName: 'VYB Gourmet Grill',
    category: 'Fast Food',
    price: '₹20.00',
    rating: '4.8',
    prepTime: '15 mins',
    calories: '540 kcal',
    isVeg: false,
    ingredients: 'Crispy seasoned chicken breast, iceberg lettuce, house honey mustard, sesame brioche bun',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    portion: 'Regular',
    description: 'Golden fried chicken breast stacked with fresh garden greens and savory house mayo on a warm toasted brioche bun.',
  },
  {
    id: 'bs8',
    name: 'Truffle Pasta',
    restaurantName: 'Bella Italia Kitchen',
    category: 'Italian Cuisine',
    price: '$24.50',
    rating: '4.9',
    prepTime: '18 mins',
    calories: '540 kcal',
    isVeg: true,
    ingredients: 'Durum wheat fettuccine, Parmigiano-Reggiano, French cultured butter, black truffle shavings',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281294?w=400&auto=format&fit=crop&q=80',
    portion: 'Regular',
    description: 'Fettuccine pasta tossed in creamy black truffle oil and aged parmesan cheese with fresh cracked pepper.',
  },
];

export const BestSellersModal = ({ isOpen, onClose, restaurantId = '75' }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = ALL_BEST_SELLERS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectDish = (item) => {
    onClose();
    navigate(`/restaurant/${restaurantId}`, { state: { item } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-brand-orange">
              <Flame className="w-4 h-4 fill-brand-orange" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Best Seller Menu</h3>
              <p className="text-[11px] text-gray-400">Top rated dishes loved by customers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-3.5 flex items-center bg-gray-100 rounded-xl px-3 py-2 text-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search best sellers..."
            className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          )}
        </div>

        {/* Dishes List */}
        <div className="mt-3.5 space-y-3 overflow-y-auto flex-1 pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectDish(item)}
              className="p-3 rounded-2xl border border-gray-100 hover:border-brand-orange/40 bg-white hover:bg-orange-50/20 transition-all cursor-pointer flex items-center space-x-3 group shadow-xs"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-brand-orange transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-xs font-black text-brand-orange ml-2">{item.price}</span>
                </div>

                <p className="text-[10px] text-gray-400 truncate mt-0.5">{item.description}</p>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded-md">
                    ★ {item.rating} • {item.category}
                  </span>
                  <span className="text-[11px] font-bold text-brand-orange flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Order</span>
                    <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellersModal;

