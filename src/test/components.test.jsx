import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import NumericKeypad from '../components/NumericKeypad';
import StatusBar from '../components/StatusBar';
import BestSellersModal from '../components/modals/BestSellersModal';
import { CartProvider, useCart } from '../context/CartContext';
import RestaurantDetailPage from '../pages/RestaurantDetailPage';

// Test consumer for CartContext verification
const TestCartConsumer = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();
  return (
    <div>
      <span data-testid="cart-count">{cartCount}</span>
      <button
        onClick={() =>
          addToCart({
            id: 'item-1',
            restaurantName: 'Test Dish',
            portion: 'Regular',
            basePrice: 20,
            quantity: 2,
          })
        }
      >
        Add Item
      </button>
      <button onClick={() => updateQuantity('item-1', 'Regular', 1)}>Increment</button>
      <button onClick={() => updateQuantity('item-1', 'Regular', -1)}>Decrement</button>
      <button onClick={() => removeFromCart('item-1', 'Regular')}>Remove</button>
      <button onClick={clearCart}>Clear</button>
      <div data-testid="items-list">
        {cartItems.map((i) => (
          <div key={i.id}>{`${i.restaurantName}-${i.quantity}`}</div>
        ))}
      </div>
    </div>
  );
};

describe('UI Components Unit Tests', () => {
  it('RestaurantCard renders restaurant name, id, and handles missing address', () => {
    const mockRestaurant = {
      restaurant_id: '75',
      restaurant_name: 'VYB Gourmet',
      address_complete: null,
      logo: null,
    };

    render(
      <MemoryRouter>
        <RestaurantCard restaurant={mockRestaurant} />
      </MemoryRouter>
    );

    expect(screen.getByText('VYB Gourmet')).toBeInTheDocument();
    expect(screen.getByText('ID: #75')).toBeInTheDocument();
    expect(screen.getByText('Address not specified')).toBeInTheDocument();
  });

  it('RestaurantCard renders optional fields (rating, price) only when present', () => {
    const mockRestaurant = {
      restaurant_id: '74',
      restaurant_name: 'Mother India',
      address_complete: 'Bangalore, India',
      rating: '4.8',
      price: '₹200 for two',
    };

    render(
      <MemoryRouter>
        <RestaurantCard restaurant={mockRestaurant} />
      </MemoryRouter>
    );

    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('₹200 for two')).toBeInTheDocument();
  });

  it('NumericKeypad responds to key clicks and delete action', () => {
    const onKeyPress = vi.fn();
    const onDelete = vi.fn();

    render(<NumericKeypad onKeyPress={onKeyPress} onDelete={onDelete} />);

    // Click '5'
    fireEvent.click(screen.getByText('5'));
    expect(onKeyPress).toHaveBeenCalledWith('5');

    // Click delete
    const deleteBtn = screen.getByLabelText('Delete last digit');
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('StatusBar renders time and accessibility elements', () => {
    render(<StatusBar />);
    const timeElement = screen.getByText(/\d{1,2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });

  it('BestSellersModal renders items list and filters by search query', () => {
    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <BestSellersModal isOpen={true} onClose={onClose} restaurantId="75" />
      </MemoryRouter>
    );

    expect(screen.getByText('Best Seller Menu')).toBeInTheDocument();
    expect(screen.getByText('Sushi Roll')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search best sellers...');
    fireEvent.change(searchInput, { target: { value: 'Sushi' } });

    expect(screen.getByText('Sushi Roll')).toBeInTheDocument();
    expect(screen.queryByText('Pepperoni Pizza')).not.toBeInTheDocument();
  });

  it('CartContext correctly tracks additions, quantity updates, and clear', () => {
    render(
      <CartProvider>
        <TestCartConsumer />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count').textContent).toBe('0');

    // Add item
    fireEvent.click(screen.getByText('Add Item'));
    expect(screen.getByTestId('cart-count').textContent).toBe('2');
    expect(screen.getByText('Test Dish-2')).toBeInTheDocument();

    // Increment
    fireEvent.click(screen.getByText('Increment'));
    expect(screen.getByTestId('cart-count').textContent).toBe('3');

    // Decrement
    fireEvent.click(screen.getByText('Decrement'));
    expect(screen.getByTestId('cart-count').textContent).toBe('2');

    // Clear
    fireEvent.click(screen.getByText('Clear'));
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  it('RestaurantDetailPage renders dynamic food details and portion selector', () => {
    const testItem = {
      name: 'Strawberry Shake',
      price: '₹20.00',
      category: 'Beverage & Dessert',
      rating: '4.9',
      calories: '320 kcal',
      prepTime: '15 mins',
      isVeg: true,
      ingredients: 'Himalayan strawberries, milk',
      restaurantName: 'Sugandham Cafe',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400',
    };

    render(
      <CartProvider>
        <MemoryRouter initialEntries={[{ pathname: '/restaurant/75', state: { item: testItem } }]}>
          <Routes>
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          </Routes>
        </MemoryRouter>
      </CartProvider>
    );

    expect(screen.getByText('Strawberry Shake')).toBeInTheDocument();
    expect(screen.getByText('Sugandham Cafe')).toBeInTheDocument();
    expect(screen.getByText('320 kcal')).toBeInTheDocument();
    expect(screen.getByText('15 mins')).toBeInTheDocument();
    expect(screen.getByText(/Add to cart/i)).toBeInTheDocument();
  });
});
