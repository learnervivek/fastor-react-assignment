import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../services/apiClient';
import { getRestaurants, getRestaurantById } from '../services/restaurantService';

vi.mock('../services/apiClient');

describe('restaurantService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('throws an error if no auth token is found in localStorage', async () => {
    await expect(getRestaurants('118', 1)).rejects.toThrow(
      'Authentication required: No active session token found'
    );
  });

  it('sends city_id, page_no, and Bearer token in headers', async () => {
    localStorage.setItem('fastor_auth_token', 'mock_valid_token');

    apiClient.get.mockResolvedValueOnce({
      data: {
        status: 'Success',
        status_code: 200,
        data: {
          results: [
            {
              restaurant_id: '75',
              restaurant_name: 'VYB',
              address_complete: 'Delhi, India',
              logo: 'https://example.com/logo.png',
            },
          ],
          meta: {
            total_pages: 3,
            total_count: 56,
          },
        },
      },
    });

    const data = await getRestaurants('118', 2);
    expect(data.results.length).toBe(1);
    expect(data.meta.total_count).toBe(56);

    const [url, config] = apiClient.get.mock.calls[0];
    expect(url).toBe('/m/restaurant');
    expect(config.params.city_id).toBe('118');
    expect(config.params.page_no).toBe(2);
    expect(config.headers.Authorization).toBe('Bearer mock_valid_token');
  });

  it('getRestaurantById returns matched restaurant record', async () => {
    localStorage.setItem('fastor_auth_token', 'mock_valid_token');

    apiClient.get.mockResolvedValueOnce({
      data: {
        status: 'Success',
        status_code: 200,
        data: {
          results: [
            { restaurant_id: '74', restaurant_name: 'Mother India' },
            { restaurant_id: '75', restaurant_name: 'VYB' },
          ],
        },
      },
    });

    const found = await getRestaurantById('75', '118');
    expect(found).not.toBeNull();
    expect(found.restaurant_name).toBe('VYB');
  });
});

