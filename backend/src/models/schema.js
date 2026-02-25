const db = require('../config/db');

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS learners (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      age_range VARCHAR(50),
      employment_status VARCHAR(100),
      job_level VARCHAR(100),
      industry VARCHAR(100),
      years_experience VARCHAR(50),
      region VARCHAR(100),
      city VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dissemination_channels (
      id SERIAL PRIMARY KEY,
      channel_type VARCHAR(100) NOT NULL,
      entity_name VARCHAR(255) NOT NULL,
      UNIQUE(channel_type, entity_name)
    );

    CREATE TABLE IF NOT EXISTS tracks (
      id SERIAL PRIMARY KEY,
      track_name VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS motivations (
      id SERIAL PRIMARY KEY,
      motivation_name VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS learner_program_data (
      id SERIAL PRIMARY KEY,
      learner_id INTEGER REFERENCES learners(id) ON DELETE CASCADE,
      track_id INTEGER REFERENCES tracks(id),
      channel_id INTEGER REFERENCES dissemination_channels(id),
      motivation_id INTEGER REFERENCES motivations(id),
      preferred_format VARCHAR(100),
      skill_level VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS provider_status (
      id SERIAL PRIMARY KEY,
      learner_id INTEGER REFERENCES learners(id) ON DELETE CASCADE,
      provider_name VARCHAR(100) NOT NULL,
      progress_percentage DECIMAL(5,2) DEFAULT 0,
      completion_status VARCHAR(50) DEFAULT 'Not Started',
      UNIQUE(learner_id, provider_name)
    );

    CREATE INDEX IF NOT EXISTS idx_learners_region ON learners(region);
    CREATE INDEX IF NOT EXISTS idx_channels_type ON dissemination_channels(channel_type);
    CREATE INDEX IF NOT EXISTS idx_tracks_name ON tracks(track_name);
  `;

  try {
    await db.query(queryText);
    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database tables:', err);
    throw err;
  }
};

module.exports = { createTables };
