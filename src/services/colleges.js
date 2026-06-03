import api from '../utils/api';

/**
 * Service for handling College-related API calls.
 */
export const collegesService = {
  /**
   * Fetch featured colleges.
   * @returns {Promise<Array>} List of featured colleges
   */
  getFeatured: () => api.get('/colleges/featured').then(r => r.data.data),

  /**
   * Fetch a paginated/filtered list of colleges.
   * @param {object|URLSearchParams} params - Search/Filter parameters
   * @returns {Promise<object>} Colleges list and pagination metadata
   */
  getList: (params) => {
    // If params is already URLSearchParams, pass it directly, otherwise let axios format object params
    const config = params instanceof URLSearchParams ? { params } : { params };
    return api.get('/colleges', config).then(r => r.data);
  },

  /**
   * Fetch detailed information for a specific college by its slug.
   * @param {string} slug - College unique slug
   * @returns {Promise<object>} College details
   */
  getDetail: (slug) => api.get(`/colleges/${slug}`).then(r => r.data),

  /**
   * Fetch public stats for colleges (e.g. counts).
   * @returns {Promise<object>} Public stats data
   */
  getPublicStats: () => api.get('/colleges/public-stats').then(r => r.data),

  /**
   * Fetch similar colleges based on category.
   * @param {string} category - College category
   * @param {number} [limit=4] - Number of items to return
   * @returns {Promise<object>} Similar colleges list
   */
  getSimilar: (category, limit = 4) => 
    api.get(`/colleges?category=${category}&limit=${limit}`).then(r => r.data),
};

export default collegesService;
