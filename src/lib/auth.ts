import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import {
  MONGODB_URI,
  DB_NAME,
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "@/config/env";

const uri = MONGODB_URI;

// Reuse MongoClient across Next.js hot reloads to avoid connection leaks
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };
const client = globalForMongo.mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db(DB_NAME);

// Only standard customer and vendor roles may be chosen at public sign-up
const PUBLIC_ROLES = new Set(["user", "customer", "vendor"]);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: BETTER_AUTH_SECRET.trim(),
  baseURL: BETTER_AUTH_URL.trim(),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedRole =
            typeof user.role === "string" ? user.role : "user";
          return {
            data: {
              ...user,
              // Block self-registration as admin; admin promotion happens in DB only
              role: PUBLIC_ROLES.has(requestedRole) ? requestedRole : "user",
              isBlocked: false,
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword(data) {
      if (process.env.NODE_ENV !== "production") {
        console.log(
          `[WedPlan Auth] Password reset requested for: ${data.user.email}`,
        );
        console.log(`[WedPlan Auth] Reset URL: ${data.url}`);
      }
    },
  },
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID.trim(),
      clientSecret: GOOGLE_CLIENT_SECRET.trim(),
    },
  },
});

export type Session = typeof auth.$Infer.Session;
