import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.test for E2E tests
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
