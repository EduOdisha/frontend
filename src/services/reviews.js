import api from '../utils/api';

/**
 * Service for handling Review-related API calls.
 */
export const reviewsService = {
  /**
   * Fetch platform reviews (e.g. testimonials).
   * @param {number} [limit=6] - Number of reviews to fetch
   * @returns {Promise<Array>} List of platform reviews
   */
  getPlatformReviews: (limit = 6) => 
    api.get(`/platform-reviews?limit=${limit}`).then(r => r.data.data),

  /**
   * Fetch current user's platform review if any.
   * @returns {Promise<object|null>} User's platform review
   */
  getMyReview: () => api.get('/platform-reviews/my-review').then(r => r.data.data),

  /**
   * Fetch reviews for a specific college.
   * @param {string} collegeId - College ID
   * @returns {Promise<object>} Reviews list
   */
  getCollegeReviews: (collegeId) => api.get(`/reviews/college/${collegeId}`).then(r => r.data),
};

export default reviewsService;
