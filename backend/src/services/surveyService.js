const axios = require('axios');
const { normalizeLearner } = require('../utils/normalizer');
const db = require('../config/db');

const SURVEY_API_URL = process.env.SURVEY_API_URL;
const SURVEY_API_KEY = process.env.SURVEY_API_KEY;

const fetchSurveyData = async () => {
  let allResponses = [];
  let page = 1;
  let hasNextPage = true;

  try {
    while (hasNextPage) {
      console.log(`Fetching page ${page}...`);
      const response = await axios.get(`${SURVEY_API_URL}/responses`, {
        headers: { 'x-api-key': SURVEY_API_KEY },
        params: { page, limit: 100 },
        timeout: 10000,
      });
      
      if (response.data && response.data.success && response.data.data) {
        allResponses = allResponses.concat(response.data.data.responses);
        hasNextPage = response.data.data.pagination.hasNextPage;
        page++;
      } else {
        hasNextPage = false;
      }
    }
    return allResponses;
  } catch (error) {
    console.error('API call failed:', error.message);
    throw error;
  }
};

const syncData = async () => {
  try {
    const rawData = await fetchSurveyData();
    for (const rawLearner of rawData) {
      const normalized = normalizeLearner(rawLearner);
      
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');

        // Insert or Update Learner
        const learnerRes = await client.query(
          `INSERT INTO learners (name, email, phone, age_range, employment_status, job_level, industry, years_experience, region, city, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
           ON CONFLICT (email) DO UPDATE SET
             name = EXCLUDED.name,
             phone = EXCLUDED.phone,
             age_range = EXCLUDED.age_range,
             employment_status = EXCLUDED.employment_status,
             job_level = EXCLUDED.job_level,
             industry = EXCLUDED.industry,
             years_experience = EXCLUDED.years_experience,
             region = EXCLUDED.region,
             city = EXCLUDED.city,
             updated_at = CURRENT_TIMESTAMP
           RETURNING id`,
          [normalized.name, normalized.email, normalized.phone, normalized.age_range, normalized.employment_status, normalized.job_level, normalized.industry, normalized.years_experience, normalized.region, normalized.city]
        );
        const learnerId = learnerRes.rows[0].id;

        // Channel
        const channelRes = await client.query(
          `INSERT INTO dissemination_channels (channel_type, entity_name)
           VALUES ($1, $2)
           ON CONFLICT (channel_type, entity_name) DO UPDATE SET channel_type = EXCLUDED.channel_type
           RETURNING id`,
          [normalized.dissemination_channel.type, normalized.dissemination_channel.entity]
        );
        const channelId = channelRes.rows[0].id;

        // Track
        const trackRes = await client.query(
          `INSERT INTO tracks (track_name)
           VALUES ($1)
           ON CONFLICT (track_name) DO UPDATE SET track_name = EXCLUDED.track_name
           RETURNING id`,
          [normalized.track]
        );
        const trackId = trackRes.rows[0].id;

        // Motivation
        const motivationRes = await client.query(
          `INSERT INTO motivations (motivation_name)
           VALUES ($1)
           ON CONFLICT (motivation_name) DO UPDATE SET motivation_name = EXCLUDED.motivation_name
           RETURNING id`,
          [normalized.motivation]
        );
        const motivationId = motivationRes.rows[0].id;

        // Learner Program Data
        await client.query(
          `INSERT INTO learner_program_data (learner_id, track_id, channel_id, motivation_id, preferred_format, skill_level)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [learnerId, trackId, channelId, motivationId, normalized.preferred_format, normalized.skill_level]
        );

        // Provider Status (Secondary Source)
        if (normalized.provider_data && normalized.provider_data.length > 0) {
          for (const provider of normalized.provider_data) {
            await client.query(
              `INSERT INTO provider_status (learner_id, provider_name, progress_percentage, completion_status)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (learner_id, provider_name) DO UPDATE SET
                 progress_percentage = EXCLUDED.progress_percentage,
                 completion_status = EXCLUDED.completion_status`,
              [learnerId, provider.provider_name, provider.progress, provider.status]
            );
          }
        }

        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Error syncing learner ${normalized.email}:`, err.message);
      } finally {
        client.release();
      }
    }
    console.log('Data sync completed successfully');
  } catch (err) {
    console.error('Sync failed:', err.message);
  }
};

module.exports = { fetchSurveyData, syncData };
