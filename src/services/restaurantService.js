import apiClient from './apiClient';

const DEFAULT_CITY_ID = import.meta.env.VITE_DEFAULT_CITY_ID || '118';

/**
 * Fetch restaurants from Fastor staging API
 *
 * @param {string|number} cityId City identifier (default: 118)
 * @param {number} pageNo Page number for pagination (default: 1)
 * @returns {Promise<{ results: Array, meta: { total_pages: number, total_count: number } }>}
 */
export const getRestaurants = async (cityId = DEFAULT_CITY_ID, pageNo = 1) => {
  const token = localStorage.getItem('fastor_auth_token');
  if (!token) {
    throw new Error('Authentication required: No active session token found. Please sign in with OTP.');
  }

  let response;
  try {
    response = await apiClient.get('/m/restaurant', {
      params: {
        city_id: cityId,
        page_no: pageNo,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw new Error(err.friendlyMessage || err.message || 'Unable to fetch restaurant directory.');
  }

  const payload = response.data;

  // Validate API response envelope
  if (!payload || payload.status !== 'Success' || payload.status_code !== 200) {
    const errorMsg =
      payload?.error_message ||
      payload?.message ||
      `Failed to fetch restaurants (status: ${payload?.status_code || response.status})`;
    throw new Error(errorMsg);
  }

  const results = payload?.data?.results || [];
  const meta = payload?.data?.meta || {
    total_pages: 1,
    total_count: results.length,
  };

  return {
    results,
    meta,
  };
};

/**
 * Get restaurant by ID by querying the staging restaurant list
 *
 * @param {string|number} restaurantId
 * @param {string|number} cityId
 */
export const getRestaurantById = async (restaurantId, cityId = DEFAULT_CITY_ID) => {
  const { results } = await getRestaurants(cityId, 1);
  let found = results.find((item) => String(item.restaurant_id) === String(restaurantId));

  if (!found) {
    try {
      const page2 = await getRestaurants(cityId, 2);
      found = page2.results.find((item) => String(item.restaurant_id) === String(restaurantId));
    } catch {
      // ignore
    }
  }

  return found || null;
};
