import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Minus,
  Plus,
  Check,
  Loader2,
  Store,
  Star,
  Clock,
  Flame,
  ShieldCheck,
  MapPin,
  Utensils,
  Navigation,
} from 'lucide-react';
import StatusBar from '../components/StatusBar';
import HomeIndicator from '../components/HomeIndicator';
import { useCart } from '../context/CartContext';
import { getRestaurantById } from '../services/restaurantService';

const SIGNATURE_DISHES = [
  {
    name: 'Gourmet Truffle Smash Burger',
    price: '₹22.00',
    category: 'Gourmet Burgers',
    rating: '4.8',
    prepTime: '18 mins',
    calories: '520 kcal',
    isVeg: false,
    ingredients: 'Double smashed patty, aged cheddar, black truffle aioli, toasted brioche bun',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    description: 'Juicy hand-crafted double smash patty topped with melted cheddar, sautéed mushrooms, and house truffle aioli on a toasted brioche bun.',
  },
  {
    name: 'Artisanal Woodfired Margherita',
    price: '₹18.00',
    category: 'Neapolitan Pizzeria',
    rating: '4.9',
    prepTime: '15 mins',
    calories: '460 kcal',
    isVeg: true,
    ingredients: 'San Marzano tomatoes, fresh buffalo mozzarella, hand-picked sweet basil, extra virgin olive oil',
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
    description: 'Classic Italian woodfired pizza made with slow-fermented sourdough crust, sweet San Marzano tomato sauce, and creamy buffalo mozzarella.',
  },
  {
    name: 'Royal Dum Handi Biryani',
    price: '₹26.00',
    category: 'Awadhi Cuisine',
    rating: '4.9',
    prepTime: '25 mins',
    calories: '610 kcal',
    isVeg: false,
    ingredients: 'Aged long-grain basmati, slow-braised marinated meat, saffron milk, caramelized shallots, mint',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    description: 'Slow-cooked in a sealed clay handi with royal saffron and whole aromatic spices. Served with chilled burani raita and mirchi ka salan.',
  },
  {
    name: 'Creamy Truffle Alfredo Fettuccine',
    price: '₹24.00',
    category: 'Italian Pasta',
    rating: '4.8',
    prepTime: '18 mins',
    calories: '540 kcal',
    isVeg: true,
    ingredients: 'Durum wheat fettuccine, Parmigiano-Reggiano, French cultured butter, black truffle shavings',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281294?w=800&auto=format&fit=crop&q=80',
    description: 'Silky handcrafted fettuccine coated in rich emulsion of 24-month aged parmesan cheese, velvety butter, and shaved Italian truffles.',
  },
  {
    name: 'Paneer Tikka Roll & Masala Fries',
    price: '₹16.00',
    category: 'Street Eats & Rolls',
    rating: '4.7',
    prepTime: '12 mins',
    calories: '410 kcal',
    isVeg: true,
    ingredients: 'Chargrilled cottage cheese, pickled onions, spicy mint chutney, flaky roomali wrap',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    description: 'Tender cubes of cottage cheese marinated in spiced yogurt, smoked over charcoal and rolled in a crisp flaky paratha.',
  },
  {
    name: 'Crispy Peri Peri Chicken Box',
    price: '₹23.00',
    category: 'Fast Casual',
    rating: '4.8',
    prepTime: '15 mins',
    calories: '580 kcal',
    isVeg: false,
    ingredients: "Buttermilk marinated chicken tenders, African bird's eye chili seasoning, garlic dip",
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80',
    description: 'Golden fried crispy chicken coated with zesty peri-peri dust, served with tangy garlic dip and seasoned fries.',
  },
  {
    name: 'Steamed Dim Sum Feast (6 Pcs)',
    price: '₹19.00',
    category: 'Pan-Asian',
    rating: '4.9',
    prepTime: '15 mins',
    calories: '320 kcal',
    isVeg: true,
    ingredients: 'Translucent crystal skin, water chestnuts, shitake mushrooms, scallion ginger chili oil',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&auto=format&fit=crop&q=80',
    description: 'Handcrafted delicate crystal dumplings steamed to perfection and served with house Sichuan chili crisp sauce.',
  },
  {
    name: 'Strawberry Cream Hand-Spun Shake',
    price: '₹15.00',
    category: 'Beverages & Desserts',
    rating: '4.9',
    prepTime: '10 mins',
    calories: '310 kcal',
    isVeg: true,
    ingredients: 'Himalayan strawberries, organic whole milk, rich vanilla custard gelato',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    description: 'Creamy milkshake blended with fresh crushed strawberries, whole milk, and scoops of artisanal vanilla ice cream.',
  },
];

const getSignatureDishForRestaurant = (restaurant) => {
  if (!restaurant) return SIGNATURE_DISHES[0];
  const name = (restaurant.restaurant_name || '').toLowerCase();
  if (name.includes('vyb')) return SIGNATURE_DISHES[0];
  if (name.includes('mother india') || name.includes('thali') || name.includes('dhaba') || name.includes('des')) return SIGNATURE_DISHES[2];
  if (name.includes('buddy') || name.includes('pizza')) return SIGNATURE_DISHES[1];
  if (name.includes('beverage') || name.includes('shake') || name.includes('sugandham')) return SIGNATURE_DISHES[7];

  const numId = parseInt(restaurant.restaurant_id || '0', 10);
  const index = !isNaN(numId) && numId > 0 ? numId % SIGNATURE_DISHES.length : 0;
  return SIGNATURE_DISHES[index];
};

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();

  const passedItem = location.state?.item || null;
  const passedRestaurant = location.state?.restaurant || null;

  const [restaurant, setRestaurant] = useState(passedRestaurant);
  const [loading, setLoading] = useState(!passedItem && !passedRestaurant);
  const [imageError, setImageError] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Default quantity
  const [quantity, setQuantity] = useState(passedItem ? 1 : 2);
  const [selectedOption, setSelectedOption] = useState('opt1');
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (!passedItem && !restaurant && id) {
      const loadRestaurant = async () => {
        setLoading(true);
        try {
          const res = await getRestaurantById(id);
          if (res) {
            setRestaurant(res);
          } else {
            setRestaurant({
              restaurant_id: id,
              restaurant_name: 'Fastor Partner Kitchen',
              address_complete: 'Model Town, New Delhi, India',
            });
          }
        } catch (err) {
          console.error('Failed to load restaurant details:', err);
        } finally {
          setLoading(false);
        }
      };
      loadRestaurant();
    }
  }, [id, passedItem, restaurant]);

  // Determine signature dish for the restaurant if not arriving with a specific dish item
  const signatureDish = getSignatureDishForRestaurant(restaurant);

  // Determine Title, Source, Category & Rating
  const title = passedItem?.name || signatureDish.name;
  const restaurantSource =
    passedItem?.restaurantName ||
    restaurant?.restaurant_name ||
    'Fastor Verified Kitchen';
  const category = passedItem?.category || signatureDish.category;
  const rating = passedItem?.rating || signatureDish.rating;
  const isVeg = passedItem?.isVeg !== undefined ? passedItem.isVeg : signatureDish.isVeg;
  const calories = passedItem?.calories || signatureDish.calories;
  const prepTime = passedItem?.prepTime || signatureDish.prepTime;
  const ingredients = passedItem?.ingredients || signatureDish.ingredients;
  const description = passedItem?.description || signatureDish.description;

  // Determine Raw Price & Currency
  const rawPriceString = passedItem?.price || restaurant?.price || signatureDish.price;
  const currencySymbol = rawPriceString.includes('$') ? '$' : '₹';
  const numericBasePrice = parseFloat(rawPriceString.replace(/[^0-9.]/g, '')) || 18.0;

  // Dynamic portion options based on currency
  const portionOptions =
    currencySymbol === '$'
      ? [
          { id: 'opt1', name: 'Personal (4 Slides)', extraPrice: 0.0, priceLabel: '$0.00' },
          { id: 'opt2', name: 'Medium (8 Slides)', extraPrice: 3.0, priceLabel: '$3.00' },
          { id: 'opt3', name: 'Familiar (10 Slides)', extraPrice: 6.0, priceLabel: '$6.00' },
          { id: 'opt4', name: 'Jumbo (12 Slides)', extraPrice: 10.0, priceLabel: '$10.00' },
        ]
      : [
          { id: 'opt1', name: 'Personal (Regular)', extraPrice: 0.0, priceLabel: '₹0.00' },
          { id: 'opt2', name: 'Medium Portion', extraPrice: 5.0, priceLabel: '+₹5.00' },
          { id: 'opt3', name: 'Large Portion', extraPrice: 10.0, priceLabel: '+₹10.00' },
          { id: 'opt4', name: 'Jumbo Combo', extraPrice: 15.0, priceLabel: '+₹15.00' },
        ];

  // Determine Hero Image
  const displayImage = passedItem?.image || signatureDish.image;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((q) => q + 1);
  };

  const activePortion = portionOptions.find((o) => o.id === selectedOption) || portionOptions[0];
  const unitPrice = numericBasePrice + (activePortion?.extraPrice || 0);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart({
      id: `${id || 'item'}-${selectedOption}`,
      restaurantId: id,
      restaurantName: title,
      portion: activePortion?.name,
      basePrice: numericBasePrice,
      extraPrice: activePortion?.extraPrice || 0,
      quantity,
      specialInstructions,
    });

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      navigate('/');
    }, 1200);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <StatusBar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white justify-between">
      <div>
        <StatusBar />

        {/* Hero Image Container */}
        <div className="px-5 pt-1">
          <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
            {!imageError ? (
              <img
                src={displayImage}
                alt={title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-brand-orange/10 to-brand-orange/20 flex flex-col items-center justify-center text-brand-orange">
                <Store className="w-12 h-12 mb-1 opacity-80" />
                <span className="text-xs font-bold">{title}</span>
              </div>
            )}

            {/* Floating Back Arrow */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-brand-orange shadow-md hover:bg-white active:scale-95 transition-all"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 pt-5 pb-4 space-y-4">
          {/* Recent Order Context Banner if clicked from popular past orders */}
          {passedItem?.orderId && (
            <div className="p-3 bg-blue-50/80 border border-blue-200/60 rounded-2xl flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                    Order {passedItem.orderId}
                  </span>
                  <span className="text-xs font-semibold text-blue-950">
                    {passedItem.status} • {passedItem.date}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                {passedItem.itemsCount}
              </span>
            </div>
          )}

          {/* Price & Quantity Selector Row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-brand-orange tracking-tight">
                {currencySymbol}
                {unitPrice.toFixed(2)}
              </span>
              {quantity > 1 && (
                <span className="text-[11px] text-brand-gray ml-2 font-medium">
                  (Total: {currencySymbol}
                  {totalPrice.toFixed(2)})
                </span>
              )}
            </div>

            {/* Quantity Controller [- quantity +] */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleDecrease}
                className="w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <span className="text-base font-bold text-brand-dark w-4 text-center">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                className="w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Title, Veg/Non-Veg Badge & Category */}
          <div>
            <div className="flex items-center space-x-2">
              {/* Veg / Non-Veg Icon */}
              <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center p-0.5">
                <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {category}
              </span>
              <span className="text-[11px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.2 rounded flex items-center">
                <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                {rating}
              </span>
            </div>

            <h1 className="text-xl font-bold text-brand-dark tracking-tight mt-1">
              {title}
            </h1>
            <p className="mt-1.5 text-xs text-brand-gray leading-relaxed">
              {description}
            </p>
          </div>

          {/* Restaurant Source Card */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                <Store className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-gray-900 truncate">{restaurantSource}</h4>
                <p className="text-[10px] text-gray-400 flex items-center mt-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 mr-0.5 text-brand-orange shrink-0" />
                  <span className="truncate">
                    {restaurant?.address_complete && restaurant.address_complete !== 'null'
                      ? restaurant.address_complete
                      : 'Model Town, New Delhi • Verified Fastor Kitchen'}
                  </span>
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center space-x-0.5 shrink-0 ml-2">
              <ShieldCheck className="w-3 h-3 mr-0.5" /> FSSAI
            </span>
          </div>

          {/* Food Details & Nutrition Highlights */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="p-2 bg-neutral-50 rounded-xl text-center">
              <Clock className="w-3.5 h-3.5 mx-auto text-brand-orange mb-0.5" />
              <span className="text-[10px] text-gray-400 block">Prep Time</span>
              <span className="text-xs font-bold text-gray-800">{prepTime}</span>
            </div>
            <div className="p-2 bg-neutral-50 rounded-xl text-center">
              <Flame className="w-3.5 h-3.5 mx-auto text-brand-orange mb-0.5" />
              <span className="text-[10px] text-gray-400 block">Calories</span>
              <span className="text-xs font-bold text-gray-800">{calories}</span>
            </div>
            <div className="p-2 bg-neutral-50 rounded-xl text-center">
              <Utensils className="w-3.5 h-3.5 mx-auto text-brand-orange mb-0.5" />
              <span className="text-[10px] text-gray-400 block">Type</span>
              <span className="text-xs font-bold text-gray-800">
                {isVeg ? 'Vegetarian' : 'Non-Veg'}
              </span>
            </div>
          </div>

          {/* Key Ingredients */}
          {ingredients && (
            <div className="text-xs">
              <span className="font-bold text-gray-900 block mb-1">Key Ingredients:</span>
              <p className="text-gray-500 text-[11px] leading-relaxed bg-orange-50/30 p-2.5 rounded-xl border border-orange-100/50">
                {ingredients}
              </p>
            </div>
          )}

          {/* Portion Customization Section */}
          <div>
            <h3 className="text-base font-bold text-brand-dark tracking-tight mb-3">
              Personal portion
            </h3>

            <div className="space-y-3">
              {portionOptions.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className="flex items-center justify-between py-1.5 cursor-pointer group select-none"
                  >
                    <span
                      className={`text-xs transition-colors ${
                        isSelected
                          ? 'font-bold text-brand-dark'
                          : 'font-medium text-gray-600 group-hover:text-brand-dark'
                      }`}
                    >
                      {opt.name}
                    </span>

                    <div className="flex-1 mx-3 border-b border-dotted border-gray-200" />

                    <div className="flex items-center space-x-2.5 shrink-0">
                      <span className="text-xs font-semibold text-gray-500">
                        {opt.priceLabel}
                      </span>

                      {/* Custom Circular Radio Button */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-brand-orange bg-white'
                            : 'border-brand-orange/60 group-hover:border-brand-orange'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-brand-orange" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kitchen Instructions input */}
          <div className="pt-2">
            <span className="text-xs font-bold text-gray-900 block mb-1.5">
              Special Instructions
            </span>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. less spicy, extra napkins, contact-free delivery"
              className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-orange"
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Add to Cart Button & Home Indicator */}
      <div className="p-5 pt-3 bg-white border-t border-gray-100">
        {addedToast && (
          <div className="mb-2 p-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-xs font-semibold flex items-center justify-center space-x-1.5 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>Added to cart! Redirecting to menu...</span>
          </div>
        )}

        {/* Primary CTA: Add to cart with dynamic total */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full h-13 py-3.5 px-4 rounded-2xl font-bold text-white text-base bg-brand-orange hover:bg-brand-orange-hover active:scale-[0.99] transition-all shadow-md flex items-center justify-center space-x-2"
        >
          <span>
            Add to cart • {currencySymbol}
            {totalPrice.toFixed(2)}
          </span>
        </button>

        {/* iOS Home Indicator Bar */}
        <HomeIndicator className="pt-2 pb-0" />
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
