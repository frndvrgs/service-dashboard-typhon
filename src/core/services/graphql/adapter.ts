import plugin from "fastify-plugin";
import mercurius from "mercurius";
import { mergeSchemas } from "@graphql-tools/schema";

import { settings } from "../../../core/settings";

import * as account_api_v1 from "../../../modules/account/interface/v1/";
import * as content_api_v1 from "../../../modules/content/interface/v1/";
import * as product_api_v1 from "../../../modules/product/interface/v1/";

import type { FastifyInstance } from "fastify";
import type { IResolvers } from "mercurius";

const publicResolvers: IResolvers = {
  Query: {
    ...content_api_v1.resolvers.publicResolvers.Query,
  },
  Mutation: {
    ...account_api_v1.resolvers.publicResolvers.Mutation,
  },
};

// const publicResolvers: IResolvers = {
//   ...account_api_v1.resolvers.publicResolvers,
//   ...content_api_v1.resolvers.publicResolvers
// };

const userResolvers: IResolvers = {
  Query: {
    ...account_api_v1.resolvers.userResolvers.Query,
    ...content_api_v1.resolvers.userResolvers.Query,
    ...product_api_v1.resolvers.userResolvers.Query,
  },
  Mutation: {
    ...account_api_v1.resolvers.userResolvers.Mutation,
    ...content_api_v1.resolvers.userResolvers.Mutation,
    ...product_api_v1.resolvers.userResolvers.Mutation,
  },
};

// const userResolvers: IResolvers = {
//   ...account_api_v1.resolvers.userResolvers,
//   ...content_api_v1.resolvers.userResolvers,
//   ...product_api_v1.resolvers.userResolvers
// };

const serviceResolvers: IResolvers = {
  Query: {
    ...account_api_v1.resolvers.serviceResolvers.Query,
    ...content_api_v1.resolvers.serviceResolvers.Query,
    ...product_api_v1.resolvers.serviceResolvers.Query,
  },
  Mutation: {
    ...account_api_v1.resolvers.serviceResolvers.Mutation,
    ...content_api_v1.resolvers.serviceResolvers.Mutation,
    ...product_api_v1.resolvers.serviceResolvers.Mutation,
  },
};

// const serviceResolvers: IResolvers = {
//   ...account_api_v1.resolvers.serviceResolvers,
//   ...content_api_v1.resolvers.serviceResolvers,
//   ...product_api_v1.resolvers.serviceResolvers
// };

const publicSchema = mergeSchemas({
  schemas: [
    account_api_v1.schemas.graphql.publicSchema,
    content_api_v1.schemas.graphql.makePublicSchema(),
    product_api_v1.schemas.graphql.makePublicSchema(),
  ],
});

const userSchema = mergeSchemas({
  schemas: [
    account_api_v1.schemas.graphql.makeUserSchema(),
    content_api_v1.schemas.graphql.makeUserSchema(),
    product_api_v1.schemas.graphql.makeUserSchema(),
  ],
});

const serviceSchema = mergeSchemas({
  schemas: [
    account_api_v1.schemas.graphql.makeServiceSchema(),
    content_api_v1.schemas.graphql.makeServiceSchema(),
    product_api_v1.schemas.graphql.makeServiceSchema(),
  ],
});

const options = settings.web.graphql;

export default plugin(async (fastify: FastifyInstance) => {
  await fastify.register(
    async (apiInstance) => {
      await apiInstance.register(async (publicInstance) => {
        await publicInstance.register(mercurius, {
          schema: publicSchema,
          resolvers: publicResolvers,
          // schemaTransforms: [addToContextTransformer],
          ...options.public,
        });
      });

      await apiInstance.register(
        async (userInstance) => {
          await userInstance.register(mercurius, {
            schema: userSchema,
            resolvers: userResolvers,
            ...options.user,
          });
        },
        { prefix: "/user" },
      );

      await apiInstance.register(
        async (adminInstance) => {
          await adminInstance.register(mercurius, {
            schema: serviceSchema,
            resolvers: serviceResolvers,
            ...options.service,
          });
        },
        { prefix: "/service" },
      );
    },
    { prefix: `${settings.web.api.path}/v1` },
  );
});
