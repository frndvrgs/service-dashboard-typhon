-- psql --host=localhost --port=5432 --username=postgres --echo-all --file=database.sql

CREATE DATABASE service_dashboard_typhon
WITH ENCODING 'UTF8'
     LC_COLLATE 'en_US.UTF-8'
     LC_CTYPE 'en_US.UTF-8'
     TEMPLATE template0;

\connect service_dashboard_typhon;

DROP SCHEMA IF EXISTS public;
DROP ROLE IF EXISTS typhon_account;
DROP ROLE IF EXISTS typhon_product;
DROP ROLE IF EXISTS typhon_content;

-- Create roles
CREATE ROLE typhon_account WITH LOGIN PASSWORD '### UPDATE ###';
CREATE ROLE typhon_product WITH LOGIN PASSWORD '### UPDATE ###';
CREATE ROLE typhon_content WITH LOGIN PASSWORD '### UPDATE ###';

-- Grant necessary permissions
GRANT ALL ON DATABASE service_dashboard_typhon TO typhon_account, typhon_product, typhon_content;

-- Connect as typhon_account
\connect service_dashboard_typhon typhon_account

-- ACCOUNT MODULE
CREATE SCHEMA account_data_schema;
CREATE SCHEMA account_read_schema;

-- DATA SCHEMA TABLES
CREATE TABLE IF NOT EXISTS account_data_schema.account (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  scope TEXT DEFAULT 'user',
  document JSONB DEFAULT '{}'::JSONB
);

CREATE UNIQUE INDEX account_id_account_idx
  ON account_data_schema.account (id_account);

CREATE UNIQUE INDEX account_email_idx
  ON account_data_schema.account (email);

CREATE TABLE IF NOT EXISTS account_data_schema.subscription (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_subscription UUID NOT NULL,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  document JSONB DEFAULT '{}'::JSONB,
  CONSTRAINT subscription_id_account_fkey FOREIGN KEY (id_account)
    REFERENCES account_data_schema.account (id_account) ON DELETE CASCADE
);

CREATE UNIQUE INDEX subscription_id_subscription_idx
  ON account_data_schema.subscription (id_subscription);

-- READ SCHEMA TABLE VIEWS
CREATE VIEW account_read_schema.account
AS SELECT
  id_account,
  created_at,
  updated_at,
  email,
  scope,
  document
FROM account_data_schema.account;

CREATE VIEW account_read_schema.subscription
AS SELECT
  id_subscription,
  id_account,
  created_at,
  updated_at,
  type,
  status,
  document
FROM account_data_schema.subscription;

-- Connect as typhon_product
\connect service_dashboard_typhon typhon_product

-- PRODUCT MODULE
CREATE SCHEMA product_data_schema;
CREATE SCHEMA product_read_schema;

-- DATA SCHEMA TABLES
CREATE TABLE IF NOT EXISTS product_data_schema.work (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_work UUID NOT NULL,
  id_account UUID NOT NULL,
  id_feature UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  level NUMERIC(5, 2) NOT NULL,
  document JSONB DEFAULT '{}'::JSONB
);

CREATE UNIQUE INDEX product_id_work_idx
  ON product_data_schema.work (id_work);

-- READ SCHEMA TABLE VIEWS
CREATE VIEW product_read_schema.work
AS SELECT
  id_work,
  id_account,
  id_feature,
  created_at,
  updated_at,
  name,
  level,
  document
FROM product_data_schema.work;

-- Connect as typhon_content
\connect service_dashboard_typhon typhon_content

-- CONTENT MODULE
CREATE SCHEMA content_data_schema;
CREATE SCHEMA content_read_schema;

-- DATA SCHEMA TABLES
CREATE TABLE IF NOT EXISTS content_data_schema.profile (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_profile UUID NOT NULL,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  document JSONB DEFAULT '{}'::JSONB
);

CREATE UNIQUE INDEX profile_id_profile_idx
  ON content_data_schema.profile (id_profile);

CREATE UNIQUE INDEX profile_id_account_idx
  ON content_data_schema.profile (id_account);

CREATE UNIQUE INDEX profile_username_idx
  ON content_data_schema.profile (username);

CREATE TABLE IF NOT EXISTS content_data_schema.feature (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_feature UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  subscription_scope TEXT[] NOT NULL,
  document JSONB DEFAULT '{}'::JSONB
);

-- READ SCHEMA VIEWS
CREATE VIEW content_read_schema.profile
AS SELECT
  id_profile,
  id_account,
  created_at,
  updated_at,
  username,
  name,
  document
FROM content_data_schema.profile;

CREATE VIEW content_read_schema.feature
AS SELECT
  id_feature,
  created_at,
  updated_at,
  name,
  subscription_scope,
  document
FROM content_data_schema.feature;

-- Connect back as the original user (usually postgres)
\connect service_dashboard_typhon postgres

-- Grant necessary permissions
GRANT USAGE ON SCHEMA account_read_schema TO typhon_product, typhon_content;
GRANT USAGE ON SCHEMA product_read_schema TO typhon_account, typhon_content;
GRANT USAGE ON SCHEMA content_read_schema TO typhon_account, typhon_product;

GRANT SELECT ON ALL TABLES IN SCHEMA account_read_schema TO typhon_product, typhon_content;
GRANT SELECT ON ALL TABLES IN SCHEMA product_read_schema TO typhon_account, typhon_content;
GRANT SELECT ON ALL TABLES IN SCHEMA content_read_schema TO typhon_account, typhon_product;