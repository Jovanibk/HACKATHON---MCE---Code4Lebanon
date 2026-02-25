const db = require('../config/db');

const getSummary = async () => {
  const queries = {
    totalLearners: 'SELECT COUNT(*) FROM learners',
    completionRate: `
      SELECT 
        (COUNT(CASE WHEN completion_status = 'Completed' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)) as rate 
      FROM provider_status`,
    totalPerTrack: `
      SELECT t.track_name, COUNT(lpd.id) as count 
      FROM tracks t 
      LEFT JOIN learner_program_data lpd ON t.id = lpd.track_id 
      GROUP BY t.track_name`,
    totalPerRegion: `
      SELECT region, COUNT(*) as count 
      FROM learners 
      GROUP BY region`
  };

  const [totalLearners, completionRate, totalPerTrack, totalPerRegion] = await Promise.all([
    db.query(queries.totalLearners),
    db.query(queries.completionRate),
    db.query(queries.totalPerTrack),
    db.query(queries.totalPerRegion),
  ]);

  return {
    totalLearners: parseInt(totalLearners.rows[0].count),
    completionRate: parseFloat(completionRate.rows[0].rate || 0).toFixed(2),
    totalPerTrack: totalPerTrack.rows,
    totalPerRegion: totalPerRegion.rows,
  };
};

const getDissemination = async () => {
  const queries = {
    perChannel: `
      SELECT dc.channel_type, COUNT(lpd.id) as count 
      FROM dissemination_channels dc 
      LEFT JOIN learner_program_data lpd ON dc.id = lpd.channel_id 
      GROUP BY dc.channel_type`,
    perEntity: `
      SELECT dc.entity_name, dc.channel_type, COUNT(lpd.id) as count 
      FROM dissemination_channels dc 
      LEFT JOIN learner_program_data lpd ON dc.id = lpd.channel_id 
      GROUP BY dc.entity_name, dc.channel_type`,
    growthOverTime: `
      SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count 
      FROM learners 
      GROUP BY date 
      ORDER BY date`
  };

  const [perChannel, perEntity, growthOverTime] = await Promise.all([
    db.query(queries.perChannel),
    db.query(queries.perEntity),
    db.query(queries.growthOverTime),
  ]);

  return {
    perChannel: perChannel.rows,
    perEntity: perEntity.rows,
    growthOverTime: growthOverTime.rows,
  };
};

const getInterests = async () => {
  const queries = {
    trackDemand: `
      SELECT t.track_name, COUNT(lpd.id) as count 
      FROM tracks t 
      LEFT JOIN learner_program_data lpd ON t.id = lpd.track_id 
      GROUP BY t.track_name`,
    motivations: `
      SELECT m.motivation_name, COUNT(lpd.id) as count 
      FROM motivations m 
      LEFT JOIN learner_program_data lpd ON m.id = lpd.motivation_id 
      GROUP BY m.motivation_name`
  };

  const [trackDemand, motivations] = await Promise.all([
    db.query(queries.trackDemand),
    db.query(queries.motivations),
  ]);

  return {
    trackDemand: trackDemand.rows,
    motivations: motivations.rows,
  };
};

const getGeography = async () => {
  const queries = {
    learnersPerRegion: `SELECT region, COUNT(*) as count FROM learners GROUP BY region`,
    channelEffectiveness: `
      SELECT l.region, dc.channel_type, COUNT(*) as count 
      FROM learners l 
      JOIN learner_program_data lpd ON l.id = lpd.learner_id 
      JOIN dissemination_channels dc ON lpd.channel_id = dc.id 
      GROUP BY l.region, dc.channel_type`
  };

  const [learnersPerRegion, channelEffectiveness] = await Promise.all([
    db.query(queries.learnersPerRegion),
    db.query(queries.channelEffectiveness),
  ]);

  return {
    learnersPerRegion: learnersPerRegion.rows,
    channelEffectiveness: channelEffectiveness.rows,
  };
};

const getLearners = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  let queryText = `
    SELECT l.*, 
      (SELECT STRING_AGG(t.track_name, ', ') FROM learner_program_data lpd JOIN tracks t ON lpd.track_id = t.id WHERE lpd.learner_id = l.id) as tracks,
      (SELECT STRING_AGG(dc.channel_type, ', ') FROM learner_program_data lpd JOIN dissemination_channels dc ON lpd.channel_id = dc.id WHERE lpd.learner_id = l.id) as channels
    FROM learners l
    WHERE 1=1
  `;
  const params = [];
  let paramIndex = 1;

  if (filters.region) {
    queryText += ` AND l.region = $${paramIndex++}`;
    params.push(filters.region);
  }

  if (filters.search) {
    queryText += ` AND (l.name ILIKE $${paramIndex} OR l.email ILIKE $${paramIndex})`;
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  queryText += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  params.push(limit, offset);

  const res = await db.query(queryText, params);
  
  // Count only unique learners by email
  const countRes = await db.query('SELECT COUNT(DISTINCT email) FROM learners');

  return {
    learners: res.rows,
    total: parseInt(countRes.rows[0].count),
    page,
    limit
  };
};

const getLearnerById = async (id) => {
  const queryText = `
    SELECT l.*, 
      lpd.preferred_format, lpd.skill_level,
      t.track_name, m.motivation_name,
      dc.channel_type, dc.entity_name,
      ps.provider_name, ps.progress_percentage, ps.completion_status
    FROM learners l
    LEFT JOIN learner_program_data lpd ON l.id = lpd.learner_id
    LEFT JOIN tracks t ON lpd.track_id = t.id
    LEFT JOIN motivations m ON lpd.motivation_id = m.id
    LEFT JOIN dissemination_channels dc ON lpd.channel_id = dc.id
    LEFT JOIN provider_status ps ON l.id = ps.learner_id
    WHERE l.id = $1
  `;
  const res = await db.query(queryText, [id]);
  return res.rows;
};

module.exports = {
  getSummary,
  getDissemination,
  getInterests,
  getGeography,
  getLearners,
  getLearnerById,
};
