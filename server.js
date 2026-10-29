require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { buildCss } = require('./src/utils/buildCss');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    await buildCss();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
