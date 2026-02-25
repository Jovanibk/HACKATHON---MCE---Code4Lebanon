require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./src/routes/api');
const errorHandler = require('./src/middleware/errorHandler');
const { createTables } = require('./src/models/schema');
const { syncData } = require('./src/services/surveyService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRoutes);

// Error Handler
app.use(errorHandler);

// Initialize DB and Start Server
const start = async () => {
  try {
    if (process.env.USE_MOCK_DATA !== 'true' && process.env.DATA_SOURCE !== 'API') {
      await createTables();
      console.log('Database connected and schema ready');
    } else {
      console.log(`Running in ${process.env.USE_MOCK_DATA === 'true' ? 'MOCK DATA' : 'LIVE API'} mode (No DB required)`);
    }
    
    // Optional: Initial sync on startup if needed
    // await syncData();

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
