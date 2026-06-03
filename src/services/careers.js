import api from '../utils/api';

/**
 * Service for handling Career guidance related API calls.
 */
export const careersService = {
  /**
   * Fetch all career profiles/guidance data.
   * @returns {Promise<object>} Career list data
   */
  getList: () => api.get('/careers').then(r => r.data),
};

export default careersService;
