import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  salt_rounds: process.env.SALT_ROUNDS,
  jwt_token_secret: process.env.JWT_TOKEN_SECRET,
  jwt_token_expires_in: process.env.JWT_TOKEN_EXPIRES_IN,
};
