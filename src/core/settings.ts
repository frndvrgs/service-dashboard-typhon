import { env } from "./env";

import type { Core } from "@types";

const web: Core.Settings.Web = {
  host: env.ENVIRONMENT === 'production' ? '0.0.0.0' : 'locahost',
  port: env.ENVIRONMENT === 'production' ? env.PRODUCTION_PORT : env.DEVELOPMENT_PORT,
  fastify: {
    https: env.WEB_SECURE,
    http2: env.WEB_HTTP2,
    trustProxy: env.WEB_TRUST_PROXY,
    connectionTimeout: env.WEB_TIMEOUT,
    logger: env.WEB_LOGGER,
  },
  cookie: {
    ...(env.SESSION_COOKIE_SECRET !== ""
      ? { secret: env.SESSION_COOKIE_SECRET }
      : {}),
  },
  api: {
    path: "/api",
  },
  graphql: {
    service: {
      jit: 1,
      path: "/graphql",
    },
    user: {
      jit: 1,
      path: "/graphql",
    },
    public: {
      jit: 1,
      path: "/graphql",
    },
  },
  rateLimit: {
    max: 100,
    timeWindow: "1 minute",
  },
  useRequestScope: true,
};

const database: Core.Settings.Database = {
  account: {
    databaseModuleName: "account",
    schemas: {
      data: env.DATABASE.ACCOUNT.DATABASE_SCHEMA_DATA,
      read: env.DATABASE.ACCOUNT.DATABASE_SCHEMA_READ,
    },
    tables: {
      account: {
        name: "account",
        columnConstraints: ["id_account", "created_at", "updated_at", "email"],
      },
      subscription: {
        name: "subscription",
        columnConstraints: [
          "id_subscription",
          "id_account",
          "created_at",
          "updated_at",
          "type",
          "status",
        ],
      },
    },
    client: {
      port: env.DATABASE.ACCOUNT.DATABASE_PORT,
      host: env.DATABASE.ACCOUNT.DATABASE_HOST,
      user: env.DATABASE.ACCOUNT.DATABASE_USER,
      password: env.DATABASE.ACCOUNT.DATABASE_PASSWORD,
      database: env.DATABASE.ACCOUNT.DATABASE_NAME,
      min: env.DATABASE.ACCOUNT.DATABASE_POOL_MIN_CLIENTS,
      max: env.DATABASE.ACCOUNT.DATABASE_POOL_MAX_CLIENTS,
      connectionTimeoutMillis:
        env.DATABASE.ACCOUNT.DATABASE_POOL_CONNECTION_TIMEOUT,
      idleTimeoutMillis: env.DATABASE.ACCOUNT.DATABASE_POOL_IDLE_TIMEOUT,
    },
  },
  product: {
    databaseModuleName: "product",
    schemas: {
      data: env.DATABASE.PRODUCT.DATABASE_SCHEMA_DATA,
      read: env.DATABASE.PRODUCT.DATABASE_SCHEMA_READ,
    },
    tables: {
      work: {
        name: "work",
        columnConstraints: [
          "id_work",
          "id_account",
          "id_feature",
          "created_at",
          "updated_at",
          "name",
          "level",
          "document",
        ],
      },
    },
    client: {
      port: env.DATABASE.PRODUCT.DATABASE_PORT,
      host: env.DATABASE.PRODUCT.DATABASE_HOST,
      user: env.DATABASE.PRODUCT.DATABASE_USER,
      password: env.DATABASE.PRODUCT.DATABASE_PASSWORD,
      database: env.DATABASE.PRODUCT.DATABASE_NAME,
      min: env.DATABASE.PRODUCT.DATABASE_POOL_MIN_CLIENTS,
      max: env.DATABASE.PRODUCT.DATABASE_POOL_MAX_CLIENTS,
      connectionTimeoutMillis:
        env.DATABASE.PRODUCT.DATABASE_POOL_CONNECTION_TIMEOUT,
      idleTimeoutMillis: env.DATABASE.PRODUCT.DATABASE_POOL_IDLE_TIMEOUT,
    },
  },
  content: {
    databaseModuleName: "content",
    schemas: {
      data: env.DATABASE.CONTENT.DATABASE_SCHEMA_DATA,
      read: env.DATABASE.CONTENT.DATABASE_SCHEMA_READ,
    },
    tables: {
      profile: {
        name: "profile",
        columnConstraints: [
          "id_profile",
          "id_account",
          "created_at",
          "updated_at",
          "username",
          "name",
          "document",
        ],
      },
      feature: {
        name: "feature",
        columnConstraints: [
          "id_feature",
          "created_at",
          "updated_at",
          "name",
          "subscription_scope",
          "document",
        ],
      },
    },
    client: {
      port: env.DATABASE.CONTENT.DATABASE_PORT,
      host: env.DATABASE.CONTENT.DATABASE_HOST,
      user: env.DATABASE.CONTENT.DATABASE_USER,
      password: env.DATABASE.CONTENT.DATABASE_PASSWORD,
      database: env.DATABASE.CONTENT.DATABASE_NAME,
      min: env.DATABASE.CONTENT.DATABASE_POOL_MIN_CLIENTS,
      max: env.DATABASE.CONTENT.DATABASE_POOL_MAX_CLIENTS,
      connectionTimeoutMillis:
        env.DATABASE.CONTENT.DATABASE_POOL_CONNECTION_TIMEOUT,
      idleTimeoutMillis: env.DATABASE.CONTENT.DATABASE_POOL_IDLE_TIMEOUT,
    },
  },
};

const session: Core.Settings.Session = {
  tokenSecret: env.SESSION_TOKEN_SECRET,
  auth: {
    name: env.SESSION_COOKIE_AUTH_NAME,
    options: {
      path: "/",
      secure: env.SESSION_COOKIE_AUTH_SECURE,
      sameSite: env.SESSION_COOKIE_AUTH_SAMESITE,
      domain: env.SESSION_COOKIE_AUTH_DOMAIN,
      signed: env.SESSION_COOKIE_SECRET !== "",
      httpOnly: env.SESSION_COOKIE_AUTH_HTTPONLY,
      maxAge: env.SESSION_COOKIE_AUTH_MAXAGE,
    },
  },
  user: {
    name: env.SESSION_COOKIE_USER_NAME,
    options: {
      path: "/",
      secure: env.SESSION_COOKIE_USER_SECURE,
      sameSite: env.SESSION_COOKIE_USER_SAMESITE,
      domain: env.SESSION_COOKIE_USER_DOMAIN,
      signed: env.SESSION_COOKIE_SECRET !== "",
      httpOnly: env.SESSION_COOKIE_USER_HTTPONLY,
      maxAge: env.SESSION_COOKIE_USER_MAXAGE,
    },
  },
};

const server: Core.Settings.Server = {
  name: `${env.SERVICE_NAME} ${env.SERVICE_VERSION} ${env.ENVIRONMENT}`,
};

export const settings = {
  env,
  session,
  web,
  database,
  server,
};
