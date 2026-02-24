const { query } = require('../db');

const createSession = async (sessionData) => {
  const { nom, createur, produits } = sessionData;
  const produitsJson = JSON.stringify(produits);

  const result = await query(
    'INSERT INTO sessions (nom, createur, produits) VALUES ($1, $2, $3) RETURNING *',
    [nom, createur, produitsJson]
  );

  return {
    ...result.rows[0],
    produits: JSON.parse(result.rows[0].produits),
  };
};

const getSessions = async () => {
  const result = await query('SELECT * FROM sessions WHERE closed = false OR closed IS NULL ORDER BY created_at DESC');

  const sessionsWithParticipantCount = await Promise.all(
    result.rows.map(async (session) => {
      try {
        const participantsResult = await query(
          'SELECT COUNT(*) as count FROM participants WHERE session_id = $1',
          [session.id]
        );

        const participantCount = participantsResult.rows[0]?.count || 0;

        return {
          ...session,
          produits: JSON.parse(session.produits),
          participantCount: parseInt(participantCount),
        };
      } catch (error) {
        console.error(`Error processing session ${session.id}:`, error);
        return {
          ...session,
          produits: JSON.parse(session.produits),
          participantCount: 0,
        };
      }
    })
  );

  return sessionsWithParticipantCount;
};

const getSessionById = async (id) => {
  const sessionResult = await query('SELECT * FROM sessions WHERE id = $1', [id]);

  if (sessionResult.rows.length === 0) {
    return null;
  }

  const session = sessionResult.rows[0];

  const participantsResult = await query(
    'SELECT utilisateur, reponses FROM participants WHERE session_id = $1 ORDER BY created_at',
    [id]
  );

  return {
    ...session,
    produits: JSON.parse(session.produits),
    participants: participantsResult.rows.map(p => ({
      utilisateur: p.utilisateur,
      reponses: JSON.parse(p.reponses),
    })),
  };
};

const addParticipant = async (sessionId, participantData) => {
  const { utilisateur, reponses } = participantData;
  const reponsesJson = JSON.stringify(reponses);

  const result = await query(
    'INSERT INTO participants (session_id, utilisateur, reponses) VALUES ($1, $2, $3) RETURNING *',
    [sessionId, utilisateur, reponsesJson]
  );

  return {
    utilisateur: result.rows[0].utilisateur,
    reponses: JSON.parse(result.rows[0].reponses),
  };
};

const updateParticipantResponses = async (sessionId, utilisateur, reponses) => {
  const reponsesJson = JSON.stringify(reponses);

  const result = await query(
    'UPDATE participants SET reponses = $1 WHERE session_id = $2 AND utilisateur = $3 RETURNING *',
    [reponsesJson, sessionId, utilisateur]
  );

  if (result.rows.length === 0) {
    throw new Error('Participant not found');
  }

  return {
    utilisateur: result.rows[0].utilisateur,
    reponses: JSON.parse(result.rows[0].reponses),
  };
};

const closeSession = async (id) => {
  const result = await query(
    'UPDATE sessions SET closed = true WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error('Session not found');
  }

  return {
    ...result.rows[0],
    produits: JSON.parse(result.rows[0].produits),
  };
};

const getClosedSessions = async () => {
  const result = await query('SELECT * FROM sessions WHERE closed = true ORDER BY created_at DESC');

  const sessionsWithParticipantCount = await Promise.all(
    result.rows.map(async (session) => {
      try {
        const participantsResult = await query(
          'SELECT COUNT(*) as count FROM participants WHERE session_id = $1',
          [session.id]
        );

        const participantCount = participantsResult.rows[0]?.count || 0;

        return {
          ...session,
          produits: JSON.parse(session.produits),
          participantCount: parseInt(participantCount),
        };
      } catch (error) {
        console.error(`Error processing session ${session.id}:`, error);
        return {
          ...session,
          produits: JSON.parse(session.produits),
          participantCount: 0,
        };
      }
    })
  );

  return sessionsWithParticipantCount;
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  addParticipant,
  updateParticipantResponses,
  closeSession,
  getClosedSessions,
};



