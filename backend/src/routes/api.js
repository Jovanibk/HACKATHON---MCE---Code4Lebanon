const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { syncData } = require('../services/surveyService');

router.get('/summary', analyticsController.getSummary);
router.get('/dissemination', analyticsController.getDissemination);
router.get('/interests', analyticsController.getInterests);
router.get('/geography', analyticsController.getGeography);
router.get('/learners', analyticsController.getLearners);
router.get('/learner/:id', analyticsController.getLearnerById);

router.post('/sync', async (req, res, next) => {
  try {
    await syncData();
    res.json({ message: 'Sync triggered successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
