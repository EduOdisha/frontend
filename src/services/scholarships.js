import api from '../utils/api';

/**
 * Service for handling Scholarship-related API calls.
 */
export const scholarshipsService = {
  /**
   * Fetch featured scholarships.
   * @param {number} [limit=3] - Number of items to return
   * @returns {Promise<Array>} List of featured scholarships
   */
  getFeatured: (limit = 3) => 
    api.get(`/scholarships?limit=${limit}&isFeatured=true`).then(r => r.data.data),

  /**
   * Fetch a paginated/filtered list of scholarships.
   * @param {object|URLSearchParams} params - Search/Filter parameters
   * @returns {Promise<object>} Scholarships list and metadata
   */
  getList: (params) => {
    const config = params instanceof URLSearchParams ? { params } : { params };
    return api.get('/scholarships', config).then(r => r.data);
  },

  /**
   * Fetch detailed information for a scholarship by slug.
   * @param {string} slug - Scholarship unique slug
   * @returns {Promise<object>} Scholarship details
   */
  getDetail: (slug) => api.get(`/scholarships/${slug}`).then(r => r.data),
};

export default scholarshipsService;
