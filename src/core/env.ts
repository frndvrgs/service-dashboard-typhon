import dotenv from "dotenv";

import { getEnvVariable } from "../common/helpers/get-env-variable";

dotenv.config();

export const env = {
  ENVIRONMENT: getEnvVariable(process.env["NODE_ENV"], "DEVELOPMENT"),
  SERVICE_NAME: getEnvVariable(
    process.env["SERVICE_NAME"],
    "service-dashboard-typhon",
  ),
  SERVICE_VERSION: getEnvVariable(process.env["SERVICE_VERSION"], "1.0.0"),
  SERVICE_NTAG: getEnvVariable(process.env["SERVICE_NTAG"], "TYPHON"),
  SERVICE_DESC: getEnvVariable(
    process.env["SERVICE_DESC"],
    "service-dashboard-typhon",
  ),
  WEB_HOST: getEnvVariable(process.env["WEB_HOST"], "localhost"),
  WEB_PORT: parseInt(getEnvVariable(process.env["WEB_PORT"], "40110")),
  WEB_SECURE: process.env["WEB_SECURE"] === "true",
  WEB_HTTP2: process.env["WEB_HTTP2"] === "true",
  WEB_TRUST_PROXY: process.env["WEB_TRUST_PROXY"] === "true",
  WEB_TIMEOUT: parseInt(getEnvVariable(process.env["WEB_TIMEOUT"], "0")),
  WEB_LOGGER: process.env["WEB_LOGGER"] === "true",
  DATABASE: {
    ACCOUNT: {
      DATABASE_HOST: getEnvVariable(
        process.env["DATABASE_ACCOUNT_HOST"],
        "localhost",
      ),
      DATABASE_PORT: parseInt(
        getEnvVariable(process.env["DATABASE_ACCOUNT_PORT"], "5432"),
      ),
      DATABASE_USER: getEnvVariable(
        process.env["DATABASE_ACCOUNT_USER"],
        "account_module",
      ),
      DATABASE_PASSWORD: getEnvVariable(
        process.env["DATABASE_ACCOUNT_PASSWORD"],
        "123456",
      ),
      DATABASE_NAME: getEnvVariable(
        process.env["DATABASE_ACCOUNT_NAME"],
        "service_dashboard_typhon",
      ),
      DATABASE_POOL_MIN_CLIENTS: parseInt(
        getEnvVariable(process.env["DATABASE_ACCOUNT_POOL_MIN_CLIENTS"], "0"),
      ),
      DATABASE_POOL_MAX_CLIENTS: parseInt(
        getEnvVariable(process.env["DATABASE_ACCOUNT_POOL_MAX_CLIENTS"], "10"),
      ),
      DATABASE_POOL_CONNECTION_TIMEOUT: parseInt(
        getEnvVariable(
          process.env["DATABASE_ACCOUNT_POOL_CONNECTION_TIMEOUT"],
          "0",
        ),
      ),
      DATABASE_POOL_IDLE_TIMEOUT: parseInt(
        getEnvVariable(
          process.env["DATABASE_ACCOUNT_POOL_IDLE_TIMEOUT"],
          "10000",
        ),
      ),
      DATABASE_SCHEMA_DATA: getEnvVariable(
        process.env["DATABASE_ACCOUNT_SCHEMA_DATA"],
        "account_data_schema",
      ),
      DATABASE_SCHEMA_READ: getEnvVariable(
        process.env["DATABASE_ACCOUNT_SCHEMA_READ"],
        "account_read_schema",
      ),
    },
    PRODUCT: {
      DATABASE_HOST: getEnvVariable(
        process.env["DATABASE_PRODUCT_HOST"],
        "localhost",
      ),
      DATABASE_PORT: parseInt(
        getEnvVariable(process.env["DATABASE_PRODUCT_PORT"], "5432"),
      ),
      DATABASE_USER: getEnvVariable(
        process.env["DATABASE_PRODUCT_USER"],
        "product_module",
      ),
      DATABASE_PASSWORD: getEnvVariable(
        process.env["DATABASE_PRODUCT_PASSWORD"],
        "123456",
      ),
      DATABASE_NAME: getEnvVariable(
        process.env["DATABASE_PRODUCT_NAME"],
        "service_dashboard_typhon",
      ),
      DATABASE_POOL_MIN_CLIENTS: parseInt(
        getEnvVariable(process.env["DATABASE_PRODUCT_POOL_MIN_CLIENTS"], "0"),
      ),
      DATABASE_POOL_MAX_CLIENTS: parseInt(
        getEnvVariable(process.env["DATABASE_PRODUCT_POOL_MAX_CLIENTS"], "10"),
      ),
      DATABASE_POOL_CONNECTION_TIMEOUT: parseInt(
        getEnvVariable(
          process.env["DATABASE_PRODUCT_POOL_CONNECTION_TIMEOUT"],
          "0",
        ),
      ),
      DATABASE_POOL_IDLE_TIMEOUT: parseInt(
        getEnvVariable(
          process.env["DATABASE_PRODUCT_POOL_IDLE_TIMEOUT"],
          "10000",
        ),
      ),
      DATABASE_SCHEMA_DATA: getEnvVariable(
        process.env["DATABASE_PRODUCT_SCHEMA_DATA"],
        "product_data_schema",
      ),
      DATABASE_SCHEMA_READ: getEnvVariable(
        process.env["DATABASE_PRODUCT_SCHEMA_READ"],
        "product_read_schema",
      ),
    },
    CONTENT: {
      DATABASE_HOST: getEnvVariable(
        process.env["DATABASE_CONTENT_HOST"],
        "localhost",
      ),
      DATABASE_PORT: parseInt(
        getEnvVariable(process.env["DATABASE_CONTENT_PORT"], "5432"),
      ),
      DATABASE_USER: getEnvVariable(
        process.env["DATABASE_CONTENT_USER"],
        "content_module",
      ),
      DATABASE_PASSWORD: getEnvVariable(
        process.env["DATABASE_CONTENT_PASSWORD"],
        "123456",
      ),
      DATABASE_NAME: getEnvVariable(
        process.env["DATABASE_CONTENT_NAME"],
        "service_dashboard_typhon",
      ),
      DATABASE_POOL_MIN_CLIENTS: parseInt(
        getEnvVariable(process.env["DATABASE_CONTENT_POOL_MIN_CLIENTS"], "0"),
      ),
      DATABASE_POOL_MAX_CLIENTS: parseInt(
        getEnvVariable(process.env["DATABASE_CONTENT_POOL_MAX_CLIENTS"], "10"),
      ),
      DATABASE_POOL_CONNECTION_TIMEOUT: parseInt(
        getEnvVariable(
          process.env["DATABASE_CONTENT_POOL_CONNECTION_TIMEOUT"],
          "0",
        ),
      ),
      DATABASE_POOL_IDLE_TIMEOUT: parseInt(
        getEnvVariable(
          process.env["DATABASE_CONTENT_POOL_IDLE_TIMEOUT"],
          "10000",
        ),
      ),
      DATABASE_SCHEMA_DATA: getEnvVariable(
        process.env["DATABASE_CONTENT_SCHEMA_DATA"],
        "content_data_schema",
      ),
      DATABASE_SCHEMA_READ: getEnvVariable(
        process.env["DATABASE_CONTENT_SCHEMA_READ"],
        "content_data_schema",
      ),
    },
  },
  SESSION_COOKIE_SECRET: getEnvVariable(
    process.env["SESSION_COOKIE_SECRET"],
    "",
  ),
  SESSION_TOKEN_SECRET: getEnvVariable(
    process.env["SESSION_TOKEN_SECRET"],
    "rx5VqyTssEmeTLJYe3GU",
  ),
  SESSION_COOKIE_AUTH_NAME: getEnvVariable(
    process.env["SESSION_COOKIE_AUTH_NAME"],
    "auth",
  ),
  SESSION_COOKIE_AUTH_SECURE:
    process.env["SESSION_COOKIE_AUTH_SECURE"] === "true",
  SESSION_COOKIE_AUTH_SAMESITE:
    process.env["SESSION_COOKIE_AUTH_SAMESITE"] === "true",
  SESSION_COOKIE_AUTH_DOMAIN: process.env["SESSION_COOKIE_AUTH_DOMAIN"],
  SESSION_COOKIE_AUTH_SIGNED:
    process.env["SESSION_COOKIE_AUTH_SIGNED"] === "true",
  SESSION_COOKIE_AUTH_HTTPONLY:
    process.env["SESSION_COOKIE_AUTH_HTTPONLY"] === "true",
  SESSION_COOKIE_AUTH_MAXAGE: parseInt(
    getEnvVariable(process.env["SESSION_COOKIE_AUTH_MAXAGE"], "86400"),
  ),
  SESSION_COOKIE_USER_NAME: getEnvVariable(
    process.env["SESSION_COOKIE_USER_NAME"],
    "user",
  ),
  SESSION_COOKIE_USER_SECURE:
    process.env["SESSION_COOKIE_USER_SECURE"] === "true",
  SESSION_COOKIE_USER_SAMESITE:
    process.env["SESSION_COOKIE_USER_SAMESITE"] === "true",
  SESSION_COOKIE_USER_DOMAIN: process.env["SESSION_COOKIE_USER_DOMAIN"],
  SESSION_COOKIE_USER_SIGNED:
    process.env["SESSION_COOKIE_USER_SIGNED"] === "true",
  SESSION_COOKIE_USER_HTTPONLY:
    process.env["SESSION_COOKIE_USER_HTTPONLY"] === "true",
  SESSION_COOKIE_USER_MAXAGE: parseInt(
    getEnvVariable(process.env["SESSION_COOKIE_USER_MAXAGE"], "86400"),
  ),
};
