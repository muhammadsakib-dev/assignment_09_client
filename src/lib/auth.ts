import { betterAuth } from "better-auth";
import { getOAuthState } from "better-auth/api";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient, ObjectId } from "mongodb";
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
        before: async (user, ctx) => {
          let requestedRole: string | undefined =
            typeof user.role === "string" && PUBLIC_ROLES.has(user.role)
              ? user.role
              : undefined;

          // 1. If not provided directly on user object, check OAuth state
          if (!requestedRole) {
            try {
              const state = (await getOAuthState()) as Record<string, any> | null;
              if (state) {
                if (typeof state.role === "string" && PUBLIC_ROLES.has(state.role)) {
                  requestedRole = state.role;
                } else if (
                  state.additionalData &&
                  typeof state.additionalData.role === "string" &&
                  PUBLIC_ROLES.has(state.additionalData.role)
                ) {
                  requestedRole = state.additionalData.role;
                } else if (
                  typeof state.callbackURL === "string" &&
                  state.callbackURL.includes("vendor")
                ) {
                  requestedRole = "vendor";
                }
              }
            } catch {
              // Ignore OAuth state error if not in OAuth callback
            }
          }

          // 2. Check cookies from context headers if still not resolved
          if (!requestedRole) {
            try {
              const headers =
                (ctx as { headers?: Headers; request?: Request })?.headers ||
                (ctx as { request?: Request })?.request?.headers;
              const rawCookie =
                typeof (headers as Headers)?.get === "function"
                  ? (headers as Headers).get("cookie")
                  : typeof (headers as unknown as Record<string, string>)?.cookie === "string"
                    ? (headers as unknown as Record<string, string>).cookie
                    : "";
              const match = rawCookie?.match(/wedplan_pending_role=([^;]+)/);
              if (match && match[1]) {
                const cookieRole = decodeURIComponent(match[1].trim());
                if (PUBLIC_ROLES.has(cookieRole)) {
                  requestedRole = cookieRole;
                }
              }
            } catch {
              // Ignore cookie parse error
            }
          }

          const finalRole =
            requestedRole && PUBLIC_ROLES.has(requestedRole) && requestedRole !== "admin"
              ? requestedRole
              : "user";

          return {
            data: {
              ...user,
              // Block self-registration as admin; admin promotion happens in DB only
              role: finalRole,
              isBlocked: false,
              ...(finalRole === "vendor" ? { subscriptionPlan: "free" } : {}),
            },
          };
        },
      },
    },
    session: {
      create: {
        before: async (session, ctx) => {
          try {
            const headers =
              (ctx as { headers?: Headers; request?: Request })?.headers ||
              (ctx as { request?: Request })?.request?.headers;
            const rawCookie =
              typeof (headers as Headers)?.get === "function"
                ? (headers as Headers).get("cookie")
                : typeof (headers as unknown as Record<string, string>)?.cookie === "string"
                  ? (headers as unknown as Record<string, string>).cookie
                  : "";
            const match = rawCookie?.match(/wedplan_pending_role=([^;]+)/);
            if (match && decodeURIComponent(match[1].trim()) === "vendor") {
              const userCol = db.collection("user");
              const existingUser = await userCol.findOne({
                $or: [
                  { id: session.userId },
                  ...(ObjectId.isValid(session.userId)
                    ? [{ _id: new ObjectId(session.userId) }]
                    : []),
                ],
              });
              if (existingUser && existingUser.role === "user") {
                await userCol.updateOne(
                  { _id: existingUser._id },
                  { $set: { role: "vendor", subscriptionPlan: "free" } },
                );
              }
            }
          } catch {
            // Ignore session hook error
          }
          return { data: session };
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
