import 'dotenv/config';
import env from 'env-var';

export const envs = {
    port: env.get('PORT').required().asPortNumber(),
    mailerEmail: env.get('MAILER_EMAIL').required().asEmailString(),
    mailerSecretKey: env.get('MAILER_SECRET_KEY').required().asString(),
    prod: env.get('PROD').default('false').asBool(),
    mailerService: env.get('MAILER_SERVICE').default('gmail').asString(),

    //Mongo DB
    MONGO_URL: env.get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: env.get('MONGO_DB_NAME').required().asString(),
    MONGO_USER: env.get('MONGO_USER').required().asString(),
    MONGO_PASS: env.get('MONGO_PASS').required().asString(),

    //LinkedIn OAuth
    LINKEDIN_CLIENT_ID: env.get('LINKEDIN_CLIENT_ID').required().asString(),
    LINKEDIN_CLIENT_SECRET: env.get('LINKEDIN_CLIENT_SECRET').required().asString(),
    LINKEDIN_REDIRECT_URI: env.get('LINKEDIN_REDIRECT_URI').required().asString(),
    FRONTEND_URL: env.get('FRONTEND_URL').required().asString(),
};