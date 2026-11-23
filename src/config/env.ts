
export const env = {
  
  apiBaseUrl: process.env.API_BASE_URL || "http://localhost:8000",

  betterAuthUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  betterAuthSecret: process.env.BETTER_AUTH_SECRET || "",

  mongoUri: process.env.MONGODB_URI || "",

  dbName: process.env.DB_NAME || "WedPlan",

  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",

  imgbbApiKey: process.env.IMGBB_API_KEY || "",

  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
};

// Named exports for convenient direct imports
export const {
  apiBaseUrl: API_BASE_URL,
  betterAuthUrl: BETTER_AUTH_URL,
  betterAuthSecret: BETTER_AUTH_SECRET,
  mongoUri: MONGODB_URI,
  dbName: DB_NAME,
  googleClientId: GOOGLE_CLIENT_ID,
  googleClientSecret: GOOGLE_CLIENT_SECRET,
  imgbbApiKey: IMGBB_API_KEY,
  stripePublishableKey: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
} = env;

export default env;
