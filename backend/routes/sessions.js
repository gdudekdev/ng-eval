const express = require('express');
const router = express.Router();
const sessionModel = require('../models/sessionModel');
const productModel = require('../models/productModel');
const { calculateLeaderboard } = require('../utils/scoring');

router.get('/', async (req, res) => {
  try {
    const sessions = await sessionModel.getSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await sessionModel.getSessionById(parseInt(id));

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nom, createur } = req.body;

    if (!nom || !createur) {
      return res.status(400).json({ error: 'Session name and creator are required' });
    }

    const products = await productModel.getProducts();
    const selectedProductIds = [];
    const shuffled = products.sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(4, shuffled.length); i++) {
      selectedProductIds.push(shuffled[i].id);
    }

    const session = await sessionModel.createSession({
      nom,
      createur,
      produits: selectedProductIds,
    });

    res.status(201).json({
      ...session,
      participantCount: 0
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

router.post('/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { utilisateur } = req.body;

    if (!utilisateur) {
      return res.status(400).json({ error: 'User email is required' });
    }

    const session = await sessionModel.getSessionById(parseInt(id));

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.closed) {
      return res.status(403).json({ error: 'Session is closed and cannot accept new participants' });
    }

    const userExists = session.participants?.some(p => p.utilisateur === utilisateur);

    if (!userExists) {
      const emptyResponses = Array(session.produits.length).fill(null);

      await sessionModel.addParticipant(parseInt(id), {
        utilisateur,
        reponses: emptyResponses,
      });
    }

    const updatedSession = await sessionModel.getSessionById(parseInt(id));
    res.status(200).json(updatedSession);
  } catch (error) {
    console.error('Error joining session:', error);
    res.status(500).json({ error: 'Failed to join session' });
  }
});

router.put('/:id/responses', async (req, res) => {
  try {
    const { id } = req.params;
    const { utilisateur, reponses } = req.body;

    if (!utilisateur || !reponses) {
      return res.status(400).json({ error: 'User email and responses are required' });
    }

    const participant = await sessionModel.updateParticipantResponses(
      parseInt(id),
      utilisateur,
      reponses
    );

    res.json(participant);
  } catch (error) {
    console.error('Error updating responses:', error);
    res.status(500).json({ error: 'Failed to update responses' });
  }
});

router.get('/:id/leaderboard', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await sessionModel.getSessionById(parseInt(id));

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.participants || session.participants.length === 0) {
      return res.json([]);
    }

    const leaderboard = await calculateLeaderboard(session, productModel);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error calculating leaderboard:', error);
    res.status(500).json({ error: 'Failed to calculate leaderboard' });
  }
});

router.get('/closed/list', async (req, res) => {
  try {
    const sessions = await sessionModel.getClosedSessions();
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching closed sessions:', error);
    res.status(500).json({ error: 'Failed to fetch closed sessions' });
  }
});

router.put('/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await sessionModel.closeSession(parseInt(id));
    res.json(session);
  } catch (error) {
    console.error('Error closing session:', error);
    res.status(500).json({ error: 'Failed to close session' });
  }
});

module.exports = router;

