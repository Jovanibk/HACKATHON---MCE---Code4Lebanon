const analyticsService = process.env.USE_MOCK_DATA === 'true' 
  ? require('../services/mockAnalyticsService')
  : (process.env.DATA_SOURCE === 'API' ? require('../services/liveApiService') : require('../services/analyticsService'));

const getSummary = async (req, res, next) => {
  try {
    const data = await analyticsService.getSummary();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getDissemination = async (req, res, next) => {
  try {
    const data = await analyticsService.getDissemination();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getInterests = async (req, res, next) => {
  try {
    const data = await analyticsService.getInterests();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getGeography = async (req, res, next) => {
  try {
    const data = await analyticsService.getGeography();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getLearners = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      region: req.query.region,
      search: req.query.search,
    };
    const data = await analyticsService.getLearners(page, limit, filters);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getLearnerById = async (req, res, next) => {
  try {
    const data = await analyticsService.getLearnerById(req.params.id);
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Learner not found' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getDissemination,
  getInterests,
  getGeography,
  getLearners,
  getLearnerById,
};
