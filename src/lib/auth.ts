import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

// Reuse MongoClient across Next.js hot reloads to avoid connection leaks
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };
const client = globalForMongo.mongoClient ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db(process.env.DB_NAME || "WedPlan");

// Only standard customer and vendor roles may be chosen at public sign-up
const PUBLIC_ROLES = new Set(["user", "vendor"]);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
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
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
