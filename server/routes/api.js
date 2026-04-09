const express = require('express');
const router = express.Router();
const {
  startSession,
  endSession,
  saveScore,
  getLeaderboard,
  getConfig,
  getSession
} = require('../controllers/gameController');

router.post('/session/start', startSession);
router.post('/session/end', endSession);
router.post('/score', saveScore);
router.get('/leaderboard', getLeaderboard);
router.get('/config', getConfig);
router.get('/session/:id', getSession);

module.exports = router;
