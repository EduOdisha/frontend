import api from '../utils/api';

/**
 * Service for handling Exam-related API calls.
 */
export const examsService = {
  /**
   * Fetch entrance exams.
   * @param {object|URLSearchParams} params - Filter options
   * @returns {Promise<object>} Exams list
   */
  getList: (params) => {
    const config = params instanceof URLSearchParams ? { params } : { params };
    return api.get('/exams', config).then(r => r.data);
  },

  /**
   * Fetch specific exam by slug.
   * @param {string} slug - Exam slug
   * @returns {Promise<object>} Exam details
   */
  getDetail: (slug) => api.get(`/exams/${slug}`).then(r => r.data),
};

export default examsService;
