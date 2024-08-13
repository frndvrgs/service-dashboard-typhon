-- psql --host=localhost --port=5432 --username=postgres --echo-all --file=database.sql

CREATE DATABASE typhon_service_dashboard
WITH ENCODING 'UTF8'
     LC_COLLATE 'en_US.UTF-8'
     LC_CTYPE 'en_US.UTF-8'
     TEMPLATE template0;

\connect typhon_service_dashboard;

DROP SCHEMA public;
DROP ROLE typhon_account;
DROP ROLE typhon_product;
DROP ROLE typhon_content;

--------------------------------------------------------------------------------
-- ACCOUNT MODULE
--------------------------------------------------------------------------------

CREATE ROLE typhon_account WITH LOGIN PASSWORD '123456';

CREATE SCHEMA account_data_schema AUTHORIZATION typhon_account;
ALTER SCHEMA account_data_schema OWNER TO typhon_account;

CREATE SCHEMA account_read_schema AUTHORIZATION typhon_account;
ALTER SCHEMA account_read_schema OWNER TO typhon_account;

---- DATA SCHEMA TABLES

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

ALTER TABLE account_data_schema.account OWNER TO typhon_account;

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

ALTER TABLE account_data_schema.subscription OWNER TO typhon_account;

CREATE UNIQUE INDEX subscription_id_subscription_idx
  ON account_data_schema.subscription (id_subscription);

---- READ SCHEMA TABLE VIEWS

CREATE VIEW account_read_schema.account
AS SELECT
  id_account,
  created_at,
  updated_at,
  email,
  scope,
  document
FROM account_data_schema.account;

ALTER VIEW account_read_schema.account OWNER TO typhon_account;

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

ALTER VIEW account_read_schema.subscription OWNER TO typhon_account;

--------------------------------------------------------------------------------
-- PRODUCT MODULE
--------------------------------------------------------------------------------

CREATE ROLE typhon_product WITH LOGIN PASSWORD '123456';

CREATE SCHEMA product_data_schema AUTHORIZATION typhon_product;
ALTER SCHEMA product_data_schema OWNER TO typhon_product;

CREATE SCHEMA product_read_schema AUTHORIZATION typhon_product;
ALTER SCHEMA product_read_schema OWNER TO typhon_product;

---- DATA SCHEMA TABLES

CREATE TABLE IF NOT EXISTS product_data_schema.work (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_work UUID NOT NULL,
  id_account UUID NOT NULL,
  id_feature UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  level NUMERIC(5, 2) NOT NULL,
  document JSONB DEFAULT '{}'::JSONB,
  CONSTRAINT work_id_account_fkey FOREIGN KEY (id_account)
    REFERENCES account_data_schema.account (id_account) ON DELETE CASCADE
);

ALTER TABLE product_data_schema.work OWNER TO typhon_product;

CREATE UNIQUE INDEX product_id_work_idx
  ON product_data_schema.work (id_work);

---- READ SCHEMA TABLE VIEWS

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

ALTER VIEW product_read_schema.work OWNER TO typhon_product;

--------------------------------------------------------------------------------
-- CONTENT MODULE

CREATE ROLE typhon_content WITH LOGIN PASSWORD '123456';

CREATE SCHEMA content_data_schema AUTHORIZATION typhon_content;
ALTER SCHEMA content_data_schema OWNER TO typhon_content;

CREATE SCHEMA content_read_schema AUTHORIZATION typhon_content;
ALTER SCHEMA content_read_schema OWNER TO typhon_content;

---- DATA SCHEMA TABLES

CREATE TABLE IF NOT EXISTS content_data_schema.profile (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_profile UUID NOT NULL,
  id_account UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  username TEXT NOT NULL,
  name TEXT NOT NULL,
  document JSONB DEFAULT '{}'::JSONB,
  CONSTRAINT profile_id_account_fkey FOREIGN KEY (id_account)
    REFERENCES account_data_schema.account (id_account) ON DELETE CASCADE
);

ALTER TABLE content_data_schema.profile OWNER TO typhon_content;

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

ALTER TABLE content_data_schema.feature OWNER TO typhon_content;

---- READ SCHEMA VIEWS

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

ALTER VIEW content_read_schema.profile OWNER TO typhon_content;

CREATE VIEW content_read_schema.feature
AS SELECT
  id_feature,
  created_at,
  updated_at,
  name,
  subscription_scope,
  document
FROM content_data_schema.feature;

ALTER VIEW content_read_schema.feature OWNER TO typhon_content;
