/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ms from "ms";
import dotenv from "dotenv";
import packageInfo from "../../package.json";

dotenv.config();

const APP_VERSION = packageInfo.version;
const DEPLOYMENT_ENV = process.env.NODE_ENV || "development";

const GLOBAL_CONSTANTS = {
    APP_NAME: "Healify",

    BCRYPT_SALT: 10,
    ACCESS_TOKEN_JWT_EXPIRES_IN: ms("30d"),
    REFRESH_TOKEN_JWT_EXPIRES_IN: ms("30d"),

    APP_ROLES: {
        ADMIN: ["admin"],
        DOCTOR: ["doctor", "admin"],
        PATIENT: ["patient", "admin"],
        USER: ["patient", "doctor", "admin"],
    },

    MAILER: {
        SMTP_HOST: process.env.MAILER_SMTP_HOST,
        SMTP_PORT: process.env.MAILER_SMTP_PORT,
        SMTP_USER: process.env.MAILER_SMTP_USER,
        SMTP_PASSWORD: process.env.MAILER_SMTP_PASSWORD,
        SECURE: process.env.MAILER_SECURE === "true" ? true : false,
        USE_AWS_SES: process.env.MAILER_USE_AWS_SES === "true" ? true : false,
    },

    AWS: {
        S3_BUCKET_REGION: "us-east-1",
        S3_BUCKET: "healify-360-bucket",

        SES_REGION: "us-east-1",

        SNS_REGION: "us-east-1",

        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    },

    PUSHER: {
        APP_ID: process.env.PUSHER_APP_ID!,
        APP_KEY: process.env.PUSHER_APP_KEY!,
        APP_SECRET: process.env.PUSHER_APP_SECRET!,
        APP_CLUSTER: process.env.PUSHER_APP_CLUSTER!,
    },
};

const CONFIG_BUILDER = {
    development: {
        ...GLOBAL_CONSTANTS,

        URL: {
            AUTH_BASE_URL: "https://example.com",
            API_BASE_URL: "https://api.example.com",
            LANDING_BASE_URL: "https://example.com",
        },

        JWT_SECRET: "T4u2Rcnne09F.FBr11f0VvERyUiq",

        MONGODB_URI: "mongodb+srv://toluolatubosun:PycclWtgYu5LOBFc@cluster0.o2qgaov.mongodb.net/healify360?retryWrites=true&w=majority",

        CORS_ALLOWED_ORIGINS: ["http://localhost:3000", "https://example.com"],
    },

    production: {
        ...GLOBAL_CONSTANTS,

        URL: {
            AUTH_BASE_URL: "https://example.com",
            API_BASE_URL: "https://api.example.com",
            LANDING_BASE_URL: "https://example.com",
        },

        JWT_SECRET: process.env.JWT_SECRET!,

        MONGODB_URI: process.env.MONGO_ATLAS_URI!,

        CORS_ALLOWED_ORIGINS: ["https://example.com", "https://www.example.com"],
    },
} as const;

// Check if DEPLOYMENT_ENV is valid
if (!Object.keys(CONFIG_BUILDER).includes(DEPLOYMENT_ENV)) {
    throw new Error(`Invalid NODE_ENV: ${DEPLOYMENT_ENV}`);
}

const CONFIGS = CONFIG_BUILDER[DEPLOYMENT_ENV as keyof typeof CONFIG_BUILDER];

export { DEPLOYMENT_ENV, APP_VERSION, CONFIGS };
