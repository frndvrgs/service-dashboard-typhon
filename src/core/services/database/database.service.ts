import pg, { Pool } from "pg";

import { settings } from "../../../core/settings";
import { ServerException } from "../../../common/exceptions";
import { databaseTools } from "../../../common/helpers/database-tools";
import { logger } from "../../../common/helpers/logger";

import type { Core } from "@types";

/**
 * The node-postgres client uses connection pools instead of a constant Client connection, each
 * pool instance manages multiple client connections, automatically handling their creation and release.
 * We create separate connection pools for each module database to achieve isolation and scalability.
 *
 * For simple queries, use the `await pool.query()` method directly:
 * const result = await pool.query('SELECT * FROM users');
 *
 * For more complex queries or transactions, follow these steps:
 * 1. Acquire a client from the pool using `await pool.connect()`.
 * 2. Execute queries using `await client.query()`.
 * 3. Release the client back to the pool using `client.release()` to ensure proper resource management.
 *
 * Account Module:
 *
 *   account_data_schema.account
 *   account_read_schema.account
 *
 *   account_data_schema.subscription
 *   account_read_schema.subscription
 *
 * Work Module:
 *
 *   product_data_schema.work
 *   product_read_schema.work
 *
 * Content Module:
 *
 *   content_data_schema.profile
 *   content_read_schema.profile
 *
 *   content_data_schema.feature
 *   content_read_schema.feature
 *
 */

// Creating pg Pool instances

const accountModulePool = new pg.Pool(settings.database.account.client);
const productModulePool = new pg.Pool(settings.database.product.client);
const contentModulePool = new pg.Pool(settings.database.content.client);

// Adding event listener error on pool instances

accountModulePool.on("error", (error) => {
  logger.error(`:: error on account module connection pool:`, error);
});

productModulePool.on("error", (error) => {
  logger.error(`:: error on product module connection pool:`, error);
});

contentModulePool.on("error", (error) => {
  logger.error(`:: error on content module connection pool:`, error);
});

class DatabaseClient {
  public account: Pool;
  public product: Pool;
  public content: Pool;

  constructor() {
    this.account = accountModulePool;
    this.product = productModulePool;
    this.content = contentModulePool;
  }

  public async verify() {
    try {
      await databaseTools.testPoolConnections([
        {
          instance: this.account,
          settings: settings.database.account.client,
        },
        {
          instance: this.product,
          settings: settings.database.product.client,
        },
        {
          instance: this.content,
          settings: settings.database.content.client,
        },
      ]);

      logger.info(":: database connection pools checked.");
    } catch (err) {
      throw new ServerException(
        "DATABASE_CLIENT_ERROR",
        500,
        "database service internal error.",
        "DatabaseClient.verify()",
        err,
      );
    }
  }

  public async stop() {
    try {
      await Promise.all([
        this.account.end(),
        this.product.end(),
        this.content.end(),
      ]);
      logger.info(":: database connection pools cleaned.");
    } catch (err) {
      throw new ServerException(
        "DATABASE_CLIENT_ERROR",
        500,
        "database service internal error.",
        "DatabaseClient.stop()",
        err,
      );
    }
  }

  public getInstance(instance: Core.Settings.DatabaseModuleNames) {
    return this[instance];
  }
}

export const databaseClient = new DatabaseClient();
