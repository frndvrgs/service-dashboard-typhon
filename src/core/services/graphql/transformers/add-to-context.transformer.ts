import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";

import type { MercuriusContext } from "mercurius";
import type {
  GraphQLFieldConfig,
  GraphQLSchema,
  GraphQLResolveInfo,
} from "graphql";

// extending MercuriusContext to allow additional properties

declare module "mercurius" {
  interface MercuriusContext {
    custom: Record<string, any>;
  }
}

interface AddToContextDirective {
  key: string;
  value: string;
}

/**
 * Transformer function that processes the @addToContext directive.
 * It modifies the resolve function of fields with this directive to add custom data to the context.
 *
 * @param schema - The GraphQL schema to transform.
 * @returns The transformed GraphQL schema.
 *
 */

export const addToContextTransformer = (
  schema: GraphQLSchema,
): GraphQLSchema => {
  return mapSchema(schema, {
    // applying this transformation to all object fields in the schema
    [MapperKind.OBJECT_FIELD]: (
      fieldConfig: GraphQLFieldConfig<any, MercuriusContext>,
    ) => {
      // get the @addToContext directive for this field
      const addToContextDirective = getDirective(
        schema,
        fieldConfig,
        "addToContext",
      )?.[0] as AddToContextDirective | undefined;

      if (addToContextDirective) {
        const { key, value } = addToContextDirective;

        const { resolve = defaultFieldResolver } = fieldConfig;
        const newFieldConfig = { ...fieldConfig };

        // replace the resolve function with our custom one
        newFieldConfig.resolve = async (
          source: {},
          args: {},
          context: MercuriusContext,
          info: GraphQLResolveInfo,
        ) => {
          if (!context.custom) context.custom = {};
          context.custom[key] = value;

          // call the original resolve function with the modified context
          return resolve(source, args, context, info);
        };

        return newFieldConfig;
      }
      // if no directive is found, return the original field config
      return fieldConfig;
    },
  });
};
