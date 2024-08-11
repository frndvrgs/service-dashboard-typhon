import { settings } from "../../core/settings";
import { logger } from "./logger";

import type { Pool, PoolConfig } from "pg";

interface PoolMetrics {
  [key: string]: {
    idle: number;
    waiting: number;
    total: number;
  };
}

const createConnectionMessage = (
  pool: { settings: PoolConfig },
  step: string,
) => {
  const protocol = settings.web.fastify.https ? "https" : "http";
  return `database connection at ${protocol}://${pool.settings.host}:${pool.settings.port} | ${step} | ${pool.settings.user} -> ${pool.settings.database}`;
};

const testPoolConnections = async (
  pools: {
    instance: Pool;
    settings: PoolConfig;
  }[],
): Promise<void> => {
  const results = await Promise.allSettled(
    pools.map((pool) => {
      return (async () => {
        logger.info({}, createConnectionMessage(pool, "TESTING"));
        const client = await pool.instance.connect();
        client.release();
        logger.info({}, createConnectionMessage(pool, "SUCCESS"));
        return pool;
      })();
    }),
  );

  const errors: Error[] = [];

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const pool = pools[index];
      if (pool) {
        logger.warn({}, createConnectionMessage(pool, "FAILURE"));
      }
      errors.push(result.reason);
    }
  });

  if (errors.length) {
    throw new AggregateError(errors);
  }
};

const getPoolMetrics = (pools: { [key: string]: Pool }): PoolMetrics => {
  const poolMetrics: PoolMetrics = {};

  for (const poolName in pools) {
    if (pools[poolName]) {
      const pool = pools[poolName];
      const total = pool.totalCount;
      const waiting = pool.waitingCount;
      const idle = pool.idleCount;

      poolMetrics[poolName] = {
        idle,
        waiting,
        total,
      };
    }
  }

  return poolMetrics;
};

export const databaseTools = {
  testPoolConnections,
  getPoolMetrics,
};
