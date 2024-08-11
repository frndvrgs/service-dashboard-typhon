import validator from "validator";

import { InterfaceException } from "../exceptions";

import type { CommonModule } from "@types";

interface CreateParamsInput {
  rawSql: string;
  select?:
    | CommonModule.Payload.Query.Select.Generic
    | CommonModule.Payload.Query.Select.Generic[];
  selectOperator?: "AND" | "OR";
  filter?: CommonModule.Payload.Query.Filter;
  order?: CommonModule.Payload.Query.Order;
}

interface CreateParamsOutput {
  sqlWithParams: string;
  params: Array<string | string[] | boolean | number | undefined>;
}

interface FormatInput {
  rawSql: string;
  variables?: {
    I?: string | string[];
    L?: any | any[];
    SI?: string;
    SL?: any;
  };
  params?: any[];
}

type ValueType = string | number | boolean | Date | object | null | undefined;

/**
 * Creates an SQL query based on the specified input parameters.
 *
 * @param {Object} input - The input object containing query parameters.
 * @param {string} input.rawSql - The base SQL query.
 * @param {Application.Query.Select|Application.Query.Select[]} [input.select] - The select criteria to be applied to the query.
 * @param {'AND'|'OR'} [input.selectOperator='AND'] - The operator to use when combining multiple select criteria.
 * @param {Application.Query.Filter} [input.filter] - The filters to be applied to the query.
 * @param {Application.Query.Order} [input.order] - The order and pagination to be applied to the query.
 * @returns {CreateParamsOutput} An object containing the final SQL query and SQL parameters.
 *
 * @example
 * const result = createParams({
 *   rawSql: 'SELECT * FROM my_table',
 *   select: [{ field: 'id_account', value: 'Y' }, { field: 'id_feature', value: 'W' }],
 *   selectOperator: 'AND',
 *   filter: { equal: { status: 'active' } },
 *   order: { field: { created_at: 'DESC' }, limit: 10, offset: 0 }
 * });
 *
 */
const createParams = (input: CreateParamsInput): CreateParamsOutput => {
  let { rawSql, select, selectOperator = "AND", filter, order } = input;
  let params: any = [];

  // build the select clause if select is provided
  if (select) {
    const { selectSql, selectParams } = buildSelectClause(
      select,
      selectOperator,
    );
    if (selectParams.length !== 0) {
      rawSql += ` WHERE ${selectSql}`;
      params = [...params, ...selectParams];
    }
  }

  // build the filter clause if filters are provided
  if (filter && Object.keys(filter).length !== 0) {
    const { filterSql, filterParams } = buildFilterClause(filter);
    if (filterParams.length !== 0) {
      rawSql += select ? ` AND ${filterSql}` : ` WHERE ${filterSql}`;
      params = [...params, ...filterParams];
    }
  }

  // set default order if order is not provided
  if (order === undefined) {
    order = {
      field: { created_at: "DESC" },
      limit: 10,
      offset: 0,
    };
  }

  // build the order clause if order and pagination are provided
  if (order && Object.keys(order).length !== 0) {
    const { orderSql, orderParams } = buildOrderClause(order);
    if (orderParams.length !== 0) {
      rawSql += ` ORDER BY ${orderSql}`;
      params = [...params, ...orderParams];
    }
  }

  return { sqlWithParams: rawSql, params };
};

const buildSelectClause = (
  select:
    | CommonModule.Payload.Query.Select.Generic
    | CommonModule.Payload.Query.Select.Generic[],
  operator: "AND" | "OR" = "AND",
): { selectSql: string; selectParams: any[] } => {
  const selectParams: any[] = [];
  let selectSql = "";

  if (!Array.isArray(select)) {
    selectSql = "%I = %L";
    selectParams.push(select.field, select.value);
  } else {
    selectSql = select
      .map((item) => {
        selectParams.push(item.field, item.value);
        return "%I = %L";
      })
      .join(` ${operator} `);
  }

  return { selectSql, selectParams };
};

/**
 * Build the filter clause based on the provided filters.
 *
 * @param filter The filters to be applied to the query.
 * @returns An object containing the filter SQL clause and filter parameters.
 *
 */

const buildFilterClause = (
  filter: CommonModule.Payload.Query.Filter,
): { filterSql: string; filterParams: any[] } => {
  const filterParams: any[] = [];
  let filterSql = "";

  // build the EQUAL filter clause
  if (filter.equal && Object.keys(filter.equal).length !== 0) {
    Object.entries(filter.equal).forEach(([field, value]) => {
      filterSql += `${filterParams.length > 0 ? " AND " : ""}%I = %L`;
      filterParams.push(field, value);
    });
  }

  // build the MATCH filter clause
  if (filter.match && Object.keys(filter.match).length !== 0) {
    Object.entries(filter.match).forEach(([field, values]) => {
      filterSql += `${filterParams.length > 0 ? " AND " : ""}%I = ANY (%L)`;
      filterParams.push(field, values);
    });
  }

  // build the INCLUDES filter clause
  if (filter.includes && Object.keys(filter.includes).length !== 0) {
    Object.entries(filter.includes).forEach(([field, value]) => {
      if (Array.isArray(value)) {
        filterSql += `${filterParams.length > 0 ? " AND " : ""}%I @> %L`;
        filterParams.push(field, value);
      } else {
        filterSql += `${filterParams.length > 0 ? " AND " : ""}%I @> %L`;
        filterParams.push(field, [value]);
      }
    });
  }

  // build the DATE filter clause
  if (filter.date && Object.keys(filter.date).length !== 0) {
    Object.entries(filter.date).forEach(([field, dateFilter]) => {
      if (dateFilter) {
        const operatorMap: { [key: string]: string } = {
          before: "<",
          after: ">",
          within: "=",
        };

        Object.entries(dateFilter).forEach(([operator, value]) => {
          if (value?.trim() !== "") {
            filterSql += `${filterParams.length > 0 ? " AND " : ""}%I ${operatorMap[operator]} %L`;
            filterParams.push(field, value);
          }
        });
      }
    });
  }

  return { filterSql, filterParams };
};

/**
 * Builds the order clause based on the provided order and pagination.
 *
 * @param order The order and pagination to be applied to the query.
 * @returns An object containing the order SQL clause and order parameters.
 *
 */

const buildOrderClause = (
  order: CommonModule.Payload.Query.Order,
): { orderSql: string; orderParams: any[] } => {
  const orderParams: any[] = [];
  let orderSql = "";

  // build the order by clause
  if (order.field && Object.keys(order.field).length !== 0) {
    Object.entries(order.field).forEach(([field, sort]) => {
      if (sort?.trim() !== "") {
        orderSql += `${orderParams.length > 0 ? ", " : ""}%I %s`;
        orderParams.push(field, sort);
      }
    });
  }

  // add the limit clause if provided, otherwise use default limit of 10
  if (order.limit !== undefined) {
    orderSql += " LIMIT %s";
    orderParams.push(order.limit);
  } else {
    orderSql += " LIMIT 10";
  }

  // add the offset clause if provided, otherwise use default offset of 0
  if (order.offset !== undefined) {
    orderSql += " OFFSET %s";
    orderParams.push(order.offset);
  } else {
    orderSql += " OFFSET 0";
  }

  return { orderSql, orderParams };
};

/**
 * Formats the SQL query based on the provided options.
 *
 * @param input The options for formatting the SQL query.
 * @returns The formatted SQL query.
 *
 */

const format = (input: FormatInput): string => {
  const { rawSql, params, variables } = input;

  let formattedSql = rawSql;
  let paramIndex = 0;

  // format identifiers (I)
  if (variables?.I) {
    const formattedColumns = Array.isArray(variables.I)
      ? variables.I.join(", ")
      : variables.I;
    formattedSql = formattedSql.replace(/%I/g, formattedColumns);
  }

  // format literals (L)
  if (variables?.L) {
    const formattedValues = Array.isArray(variables.L)
      ? variables.L.map((value) => formatValue(value)).join(", ")
      : formatValue(variables.L);
    formattedSql = formattedSql.replace(/%L/g, formattedValues);
  }

  // format selected identifier (SI)
  if (variables?.SI) {
    formattedSql = formattedSql.replace(/%SI/g, variables.SI);
  }

  // format selected literal (SL)
  if (variables?.SL) {
    const formattedSelectedValue = formatValue(variables.SL);
    formattedSql = formattedSql.replace(/%SL/g, formattedSelectedValue);
  }

  // format identifiers, literals, and strings based on the params array
  formattedSql = formattedSql.replace(/%I|%L|%s/g, (match) => {
    if (params && paramIndex < params.length) {
      const value = params[paramIndex];
      paramIndex++;

      switch (match) {
        case "%I":
          return `"${value}"`;
        case "%L":
          return formatValue(value);
        case "%s":
          return value;
        default:
          return match;
      }
    }
    return match;
  });

  return formattedSql;
};

/**
 * Formats the value based on its type.
 *
 * @param value The value to be formatted.
 * @returns The formatted value.
 *
 */

const formatValue = (value: ValueType): string => {
  if (value === null || value === undefined) {
    return "NULL";
  }

  switch (typeof value) {
    case "number":
      return formatNumber(value);
    case "string":
      return formatString(value);
    case "boolean":
      return formatBoolean(value);
    case "object":
      if (Array.isArray(value)) {
        return formatArray(value);
      }
      if (value instanceof Date) {
        return formatDate(value);
      }
      return formatObject(value);
    default:
      throw new InterfaceException(
        "INVALID_INPUT",
        401,
        `unsupported value type: ${typeof value}`,
        `sqlTools.formatValue()`,
      );
  }
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) {
    throw new InterfaceException(
      "INVALID_INPUT",
      401,
      `invalid number: ${value}`,
      `sqlTools.formatValue()`,
    );
  }
  if (Number.isInteger(value)) {
    return `${value}::INTEGER`;
  }
  return `${value}::NUMERIC`;
};

const formatString = (value: string): string => {
  if (validator.isUUID(value)) {
    return `'${value}'::UUID`;
  }
  if (isISODateString(value)) {
    return `'${value}'::TIMESTAMPTZ`;
  }
  return `'${value.replace(/'/g, "''")}'::TEXT`;
};

const formatBoolean = (value: boolean): string => {
  return value ? "TRUE::BOOLEAN" : "FALSE::BOOLEAN";
};

const formatDate = (value: Date): string => {
  if (!(value instanceof Date) || isNaN(value.getTime())) {
    throw new InterfaceException(
      "INVALID_INPUT",
      401,
      `invalid date: ${typeof value}`,
      `sqlTools.formatValue()`,
    );
  }
  return `'${value.toISOString()}'::TIMESTAMPTZ`;
};

const formatArray = (value: ValueType[]): string => {
  const result = value.map((item) => formatValue(item)).join(", ");
  return `ARRAY [${result}]`;
};

const formatObject = (value: object): string => {
  try {
    const jsonString = JSON.stringify(value);
    return `'${jsonString.replace(/'/g, "''")}'::JSONB`;
  } catch (err) {
    throw new InterfaceException(
      "INVALID_INPUT",
      401,
      `failed to format object: ${typeof value}`,
      `sqlTools.formatValue()`,
      err,
    );
  }
};

const isISODateString = (value: string): boolean => {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
  return isoDatePattern.test(value);
};

export const sqlTools = { createParams, format };
