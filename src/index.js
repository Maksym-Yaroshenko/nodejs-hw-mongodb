import { setupServer } from './server.js';
import { initMongoConection } from './db/initMongoConnection.js';

const botstrap = async () => {
  try {
    await initMongoConection();
    setupServer();
  } catch (error) {
    console.error(error);
  }
};

botstrap();
