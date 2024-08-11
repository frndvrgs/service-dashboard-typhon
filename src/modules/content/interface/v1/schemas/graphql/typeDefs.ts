import { mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ServerException } from "../../../../../../common/exceptions";

import {
  adminListSelectTypeDefs,
  adminInputsTypeDefs,
  adminOutputsTypeDefs,
  adminQueriesTypeDefs,
  adminMutationsTypeDefs,
} from "./service";
import {
  userDataModelsTypeDefs,
  userListSelectTypeDefs,
  userInputsTypeDefs,
  userOutputsTypeDefs,
  userQueriesTypeDefs,
  userMutationsTypeDefs,
} from "./user";
import {
  publicDataModelsTypeDefs,
  publicListSelectTypeDefs,
  publicInputsTypeDefs,
  publicOutputsTypeDefs,
  publicQueriesTypeDefs,
  publicMutationsTypeDefs,
} from "./public";

import { commonTypeDefs } from "./common";

export const makePublicSchema = () => {
  try {
    return makeExecutableSchema({
      typeDefs: mergeTypeDefs(
        [
          commonTypeDefs,
          publicDataModelsTypeDefs,
          publicListSelectTypeDefs,
          publicInputsTypeDefs,
          publicOutputsTypeDefs,
          publicQueriesTypeDefs,
          publicMutationsTypeDefs,
        ],
        {
          useSchemaDefinition: false,
        },
      ),
    });
  } catch (err) {
    throw new ServerException(
      "INTERNAL_SERVER_ERROR",
      500,
      "error merging graphql typedefs.",
      "public",
      err,
    );
  }
};

export const makeUserSchema = () => {
  try {
    return makeExecutableSchema({
      typeDefs: mergeTypeDefs(
        [
          commonTypeDefs,
          publicDataModelsTypeDefs,
          userDataModelsTypeDefs,
          userListSelectTypeDefs,
          userInputsTypeDefs,
          publicListSelectTypeDefs,
          publicOutputsTypeDefs,
          userOutputsTypeDefs,
          userQueriesTypeDefs,
          userMutationsTypeDefs,
        ],
        {
          useSchemaDefinition: false,
        },
      ),
    });
  } catch (err) {
    throw new ServerException(
      "INTERNAL_SERVER_ERROR",
      500,
      "error merging graphql typedefs.",
      "user",
      err,
    );
  }
};

export const makeServiceSchema = () => {
  try {
    return makeExecutableSchema({
      typeDefs: mergeTypeDefs(
        [
          // common
          commonTypeDefs,
          // data models
          publicDataModelsTypeDefs,
          userDataModelsTypeDefs,
          // list select
          publicListSelectTypeDefs,
          userListSelectTypeDefs,
          adminListSelectTypeDefs,
          // inputs
          publicInputsTypeDefs,
          userInputsTypeDefs,
          adminInputsTypeDefs,
          // outputs
          publicOutputsTypeDefs,
          adminOutputsTypeDefs,
          userOutputsTypeDefs,
          // queries
          userQueriesTypeDefs,
          adminQueriesTypeDefs,
          // mutations
          userMutationsTypeDefs,
          adminMutationsTypeDefs,
        ],
        {
          useSchemaDefinition: false,
        },
      ),
    });
  } catch (err) {
    throw new ServerException(
      "INTERNAL_SERVER_ERROR",
      500,
      "error merging graphql typedefs.",
      "service",
      err,
    );
  }
};
