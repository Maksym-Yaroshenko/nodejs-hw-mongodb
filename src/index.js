import { setupServer } from './server.js';
import { initMongoConection } from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

const botstrap = async () => {
  try {
    await initMongoConection();
    createDirIfNotExists(TEMP_UPLOAD_DIR);
    createDirIfNotExists(UPLOAD_DIR);
    setupServer();
  } catch (error) {
    console.error(error);
  }
};

botstrap();
