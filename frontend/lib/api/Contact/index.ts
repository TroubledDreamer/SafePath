import { BaseAPI } from '../BaseAPI';
import { ActivityAllowedVariation } from '../../types/api/ActivityAllowedVariation';

const LActivityAllowedVariationApi = new BaseAPI<ActivityAllowedVariation>('/activity-allowed-variation/');
export default LActivityAllowedVariationApi;
