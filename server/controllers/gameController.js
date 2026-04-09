const crypto = require('crypto');
const Player = require('../models/Player');
const Session = require('../models/Session');
const Score = require('../models/Score');

// Start a new session
exports.startSession = async (req, res) => {
  try {
    const { playerName } = req.body;
    
    // Find or create player
    let player;
    if (playerName) {
      player = await Player.findOne({ name: playerName });
    }
    
    if (!player) {
      player = await Player.create({ name: playerName || 'Anonymous' });
    }

    const sessionId = crypto.randomBytes(16).toString('hex');
    
    const session = await Session.create({
      sessionId,
      playerId: player._id,
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        playerName: player.name,
        playerId: player._id
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// End a session
exports.endSession = async (req, res) => {
  try {
    const { sessionId, score } = req.body;

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    session.endTime = Date.now();
    session.score = score;
    session.status = 'completed';
    await session.save();

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Save a score
exports.saveScore = async (req, res) => {
  try {
    const { playerId, score } = req.body;

    if (!playerId || score === undefined) {
      return res.status(400).json({ success: false, error: 'Please provide playerId and score' });
    }

    const newScore = await Score.create({
      playerId,
      score,
    });

    res.status(201).json({ success: true, data: newScore });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const topScores = await Score.find()
      .sort({ score: -1 })
      .limit(10)
      .populate('playerId', 'name');

    res.status(200).json({
      success: true,
      data: topScores.map(s => ({
        name: s.playerId ? s.playerId.name : 'Unknown',
        score: s.score,
        date: s.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get game config
exports.getConfig = (req, res) => {
  // Game difficulty config from backend
  const config = {
    gravity: 0.6,
    jumpForce: -10,
    obstacleSpeed: 5,
    spawnRate: 1500, // ms between spawns
    speedMultiplier: 1.001 // Increase speed slightly per frame
  };

  res.status(200).json({ success: true, data: config });
};

// Get session by ID
exports.getSession = async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.id }).populate('playerId', 'name');
    
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
