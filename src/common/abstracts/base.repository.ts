import { settings } from "../../core/settings";
import { databaseClient } from "../../core/services/database";
import { sqlTools } from "../helpers/sql-tools";
import { ServerException } from "../exceptions";

import type { Pool, QueryResultRow } from "pg";
import type { RepositoryPort, MapperPort } from "../ports";

import type { CommonModule } from "@types";

class BaseRepository<ViewModel, EntityModel, DataModel extends QueryResultRow>
  implements
    RepositoryPort<
      CommonModule.Payload.Query.Filter,
      CommonModule.Payload.Query.Order,
      CommonModule.Payload.Query.Select.Generic,
      ViewModel,
      EntityModel,
      DataModel
    >
{
  private readonly mapper: MapperPort<ViewModel, EntityModel, DataModel>;
  private readonly database: Pool;
  private readonly schemas: { data: string; read: string };
  private readonly tableName: string;
  private readonly columnConstraints: string[];

  constructor(
    mapper: MapperPort<ViewModel, EntityModel, DataModel>,
    databaseName: keyof typeof settings.database,
    schemas: { data: string; read: string },
    tableName: string,
    columnConstraints: string[],
  ) {
    this.mapper = mapper;
    this.database = databaseClient.getInstance(databaseName);
    this.schemas = schemas;
    this.tableName = tableName;
    this.columnConstraints = columnConstraints;
  }

  /**
   * Lists entities based on the specified filters and order.
   *
   * @param filter - Query filters.
   * @param order - Result ordering.
   * @returns Array of entities or null if no results.
   * @throws ServerException if a database error occurs.
   *
   */

  public async list(
    filter: CommonModule.Payload.Query.Filter,
    order: CommonModule.Payload.Query.Order,
  ): Promise<ViewModel[] | null> {
    try {
      const rawSql = `
      SELECT ${this.columnConstraints.join(", ")} FROM
        "${this.schemas.read}"."${this.tableName}"
    `;

      const listQuery = sqlTools.createParams({ rawSql, filter, order });

      const sql = sqlTools.format({
        rawSql: listQuery.sqlWithParams,
        params: listQuery.params,
      });

      const result = await this.database.query<DataModel, DataModel[]>(sql);

      if (result.rows?.length) {
        return result.rows.map((resource) => {
          return this.mapper.mapDataToView(resource);
        });
      } else {
        return null;
      }
    } catch (err) {
      throw new ServerException(
        "DATABASE_ERROR",
        500,
        "database storage internal error.",
        "sqlTools(), database.query()",
        err,
      );
    }
  }

  /**
   * Reads an entity based on the select parameters.
   *
   * @param select - Select parameters.
   * @returns Found entity or null if no results.
   * @throws ServerException if a database error occurs.
   *
   */

  public async read(
    select:
      | CommonModule.Payload.Query.Select.Generic
      | CommonModule.Payload.Query.Select.Generic[],
  ): Promise<ViewModel | null> {
    try {
      const rawSql = `
      SELECT ${this.columnConstraints.join(", ")} FROM
        "${this.schemas.read}"."${this.tableName}"
    `;

      const listQuery = sqlTools.createParams({ rawSql, select });

      const sql = sqlTools.format({
        rawSql: listQuery.sqlWithParams,
        params: listQuery.params,
      });

      const result = await this.database.query<DataModel, DataModel[]>(sql);
      if (result.rows?.length && result.rows[0]) {
        const resource = result.rows[0];
        return this.mapper.mapDataToView(resource);
      } else {
        return null;
      }
    } catch (err) {
      throw new ServerException(
        "DATABASE_ERROR",
        500,
        "database storage internal error.",
        "database.query()",
        err,
      );
    }
  }

  /**
   * Selects an entity based on the select parameters.
   *
   * ATTENTION: The select() has the special characteristic of bringing all the
   * fields from a data schema, that is, it can return sensitive data.
   *
   * @param select - Select parameters.
   * @returns Found entity or null if no results.
   * @throws ServerException if a database error occurs.
   *
   */

  public async select(
    select:
      | CommonModule.Payload.Query.Select.Generic
      | CommonModule.Payload.Query.Select.Generic[],
  ): Promise<DataModel | null> {
    try {
      const rawSql = `
          SELECT * FROM
            "${this.schemas.data}"."${this.tableName}"
        `;

      const listQuery = sqlTools.createParams({ rawSql, select });

      const sql = sqlTools.format({
        rawSql: listQuery.sqlWithParams,
        params: listQuery.params,
      });

      const result = await this.database.query<DataModel, DataModel[]>(sql);
      if (result.rows?.length && result.rows[0]) {
        const resource = result.rows[0];
        return resource;
      } else {
        return null;
      }
    } catch (err) {
      throw new ServerException(
        "DATABASE_ERROR",
        500,
        "database storage internal error.",
        "database.query()",
        err,
      );
    }
  }

  /**
   * Checks if an entity exists based on the select parameters.
   *
   * @param select - Select parameters.
   * @returns True if the entity exists, false otherwise.
   * @throws ServerException if a database error occurs.
   *
   */

  public async exists(
    select: CommonModule.Payload.Query.Select.Generic,
  ): Promise<boolean> {
    try {
      const rawSql = `
        SELECT EXISTS (
          SELECT 1 FROM
            "${this.schemas.data}"."${this.tableName}"
          WHERE %SI = %SL
        )
      `;

      const sql = sqlTools.format({
        rawSql,
        variables: {
          SI: select.field,
          SL: select.value,
        },
      });

      const result = await this.database.query<{ exists: boolean }>(sql);
      return !!result?.rows[0]?.exists;
    } catch (err) {
      throw new ServerException(
        "DATABASE_ERROR",
        500,
        "database storage internal error.",
        "database.query()",
        err,
      );
    }
  }

  /**
   * Creates a new entity.
   *
   * @param resource - Entity data to be created.
   * @returns Created entity or null if no results.
   * @throws ServerException if a database error occurs.
   *
   */

  public async create(entity: EntityModel): Promise<DataModel | null> {
    try {
      const rawSql = `
        INSERT INTO
          "${this.schemas.data}"."${this.tableName}" (%I)
        VALUES (%L)
        RETURNING ${this.columnConstraints.join(", ")}
      `;

      const data = this.mapper.mapEntityToData(entity);

      const columns = Object.keys(data);
      const values = Object.values(data);

      const sql = sqlTools.format({
        rawSql,
        variables: {
          I: columns,
          L: values,
        },
      });

      const result = await this.database.query<DataModel, DataModel[]>(sql);
      if (result.rows?.length && result.rows[0]) {
        const resource = result.rows[0];
        return resource;
      } else {
        return null;
      }
    } catch (err) {
      throw new ServerException(
        "DATABASE_ERROR",
        500,
        "database storage internal error.",
        "sqlTools, database.query()",
        err,
      );
    }
  }

  /**
   * Updates an entity based on the select parameters and provided data.
   *
   * @param select - Select parameters.
   * @param resource - Entity data to be updated.
   * @returns Updated entity or null if no results.
   * @throws ServerException if a database error occurs.
   *
   */

  public async update(
    select: CommonModule.Payload.Query.Select.Generic,
    entity: EntityModel,
  ): Promise<DataModel | null> {
    try {
      const rawSql = `
        UPDATE
          "${this.schemas.data}"."${this.tableName}"
        SET (%I) = ROW(%L)
          WHERE %SI = %SL
        RETURNING ${this.columnConstraints.join(", ")}
      `;

      const data = this.mapper.mapEntityToData(entity);

      const columns = Object.keys(data);
      const values = Object.values(data);

      const sql = sqlTools.format({
        rawSql,
        variables: {
          I: columns,
          L: values,
          SI: select.field,
          SL: select.value,
        },
      });

      const result = await this.database.query<DataModel, DataModel[]>(sql);
      if (result.rows?.length && result.rows[0]) {
        const resource = result.rows[0];
        return resource;
      } else {
        return null;
      }
    } catch (err) {
      throw new ServerException(
        "DATABASE_ERROR",
        500,
        "database storage internal error.",
        "sqlTools, database.query()",
        err,
      );
    }
  }

  /**
   * Removes an entity based on the select parameters.
   *
   * @param select - Select parameters.
   * @returns True if the entity was removed, false otherwise.
   * @throws ServerException if a database error occurs.
   *
   */

  public async remove(
    select: CommonModule.Payload.Query.Select.Generic,
  ): Promise<boolean> {
    try {
      const rawSql = `
        DELETE FROM
          "${this.schemas.data}"."${this.tableName}"
        WHERE %SI = %SL
      `;

      const sql = sqlTools.format({
        rawSql,
        variables: {
          SI: select.field,
          SL: select.value,
        },
      });

      const result = await this.database.query<DataModel, DataModel[]>(sql);
      return !!result.rowCount && result.rowCount > 0;
    } catch (err) {
      throw new ServerException(
        "DATABASE_ERROR",
        500,
        "database storage internal error.",
        "sqlTools, database.query()",
        err,
      );
    }
  }

  public async beginTransaction(): Promise<void> {
    await this.database.query("BEGIN");
  }

  public async beginIsolatedTransaction(): Promise<void> {
    await this.database.query("BEGIN");
    await this.database.query("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
  }

  public async commitTransaction(): Promise<void> {
    await this.database.query("COMMIT");
  }

  public async rollbackTransaction(): Promise<void> {
    await this.database.query("ROLLBACK");
  }
}

export { BaseRepository };
