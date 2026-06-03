import api from '../utils/api';

/**
 * Service for handling Blog-related API calls.
 */
export const blogsService = {
  /**
   * Fetch published blogs (typically for homepage featured).
   * @param {number} [limit=3] - Number of items to return
   * @returns {Promise<Array>} List of published blogs
   */
  getPublished: (limit = 3) => 
    api.get(`/blogs?limit=${limit}&isPublished=true`).then(r => r.data.data),

  /**
   * Fetch blogs list, optionally filtered by category.
   * @param {string} [category] - Optional category filter
   * @returns {Promise<object>} Blogs list
   */
  getList: (category = '') => {
    const categoryParam = category ? `?category=${category}` : '';
    return api.get(`/blogs${categoryParam}`).then(r => r.data);
  },

  /**
   * Fetch a single blog post by slug.
   * @param {string} slug - Blog post slug
   * @returns {Promise<object>} Blog details
   */
  getDetail: (slug) => api.get(`/blogs/${slug}`).then(r => r.data),
};

export default blogsService;
