import api from '../utils/api';

/**
 * Service for handling Course-related API calls.
 */
export const coursesService = {
  /**
   * Fetch courses list.
   * @param {object|URLSearchParams} params - Filter options
   * @returns {Promise<object>} Courses list
   */
  getList: (params) => {
    const config = params instanceof URLSearchParams ? { params } : { params };
    return api.get('/courses', config).then(r => r.data);
  },

  /**
   * Fetch specific course by slug.
   * @param {string} slug - Course slug
   * @returns {Promise<object>} Course details
   */
  getDetail: (slug) => api.get(`/courses/${slug}`).then(r => r.data),

  /**
   * Fetch similar courses based on stream.
   * @param {string} stream - Course stream
   * @param {number} [limit=4] - Number of items to return
   * @returns {Promise<object>} Similar courses list
   */
  getSimilar: (stream, limit = 4) =>
    api.get(`/courses?stream=${stream}&limit=${limit}`).then(r => r.data),
};

export default coursesService;
