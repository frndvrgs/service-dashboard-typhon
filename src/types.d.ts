import type {
  FastifyRequest,
  FastifyReply,
  FastifyServerOptions,
} from "fastify";
import type { JWTPayload } from "jose";
import type { ErrorObject } from "ajv";
import type { FastifyRateLimitOptions } from "@fastify/rate-limit";
import type { FastifyCookieOptions } from "@fastify/cookie";
import type { PoolConfig } from "pg";
import type { MercuriusOptions, MercuriusContext, IResolvers } from "mercurius";
import type { GraphQLResolveInfo } from "graphql";

import type {
  ServicePort,
  RepositoryPort,
  MapperPort,
  StatusHandlerPort,
  ValidationHandlerPort,
  SessionHandlerPort,
} from "./common/ports";

import { DESCRIPTION_CODES, STATUS_CODES } from "./common/constants";

import type {
  AccountModel,
  SubscriptionModel,
} from "./modules/account/domain/entities";
import type { WorkModel } from "./modules/product/domain/entities";
import type {
  ProfileModel,
  FeatureModel,
} from "./modules/content/domain/entities";

// utility type
type valueof<T> = T[keyof T];

declare namespace CommonModule {
  namespace DTO {
    namespace EntityModel {
      type Generic =
        | AccountModule.DTO.EntityModel.Account
        | AccountModule.DTO.EntityModel.Subscription
        | ContentModule.DTO.EntityModel.Profile
        | ContentModule.DTO.EntityModel.Feature
        | ProductModule.DTO.EntityModel.Work;
    }

    namespace ViewModel {
      type Generic =
        | AccountModule.DTO.ViewModel.Account
        | AccountModule.DTO.ViewModel.Subscription
        | ContentModule.DTO.ViewModel.Profile
        | ContentModule.DTO.ViewModel.Feature
        | ProductModule.DTO.ViewModel.Work;
    }

    namespace DataModel {
      type Generic =
        | AccountModule.DTO.DataModel.Account
        | AccountModule.DTO.DataModel.Subscription
        | ContentModule.DTO.DataModel.Profile
        | ContentModule.DTO.DataModel.Feature
        | ProductModule.DTO.DataModel.Work;
    }

    interface StatusModel {
      description: Payload.DescriptionCodes;
      code: Payload.StatusCodes;
      message?: string;
      detail?: string;
      context: string;
      scope?: string;
      validation?: Payload.Exception.ValidationObject;
    }

    interface HttpStatusModel {
      type: string;
      name: string;
      description: string;
      code: number;
      context?: string | null;
      scope?: string | null;
      message?: string | null;
      detail?: string | null;
      validation?: Payload.Exception.ValidationObject;
    }
  }

  namespace Payload {
    type DescriptionCodes = keyof typeof DESCRIPTION_CODES;
    type StatusCodes = valueof<typeof STATUS_CODES>;

    namespace Query {
      namespace Select {
        interface Generic {
          field: string;
          value: string;
        }
        interface Account {
          field: "id_account" | "email";
          value: string;
        }
        interface Subscription {
          field: "id_subscription" | "id_account";
          value: string;
        }
        interface Work {
          field: "id_work" | "id_account";
          value: string;
        }
        interface Profile {
          field: "id_profile" | "id_account" | "username";
          value: string;
        }
        interface Feature {
          field: "id_feature";
          value: string;
        }
      }

      interface Filter {
        equal?: {
          [index: string]: string | number;
        };
        match?: {
          [index: string]: string[] | number[];
        };
        includes?: {
          [index: string]: string | number | string[] | number[];
        };
        date?: {
          [index: string]: {
            before?: string;
            after?: string;
            within?: string;
          };
        };
      }

      interface Order {
        field?: {
          [index: string]: string;
        };
        limit?: number;
        offset?: number;
      }
    }

    namespace Service {
      namespace List {
        interface Input {
          payload: {
            filter?: Query.Filter;
            order?: Query.Order;
          };
        }

        interface Output {
          status: DTO.StatusModel;
          output: DTO.ViewModel.Generic[];
        }
      }

      namespace Read {
        interface Input {
          payload: {
            select: Query.Select.Generic[];
          };
        }

        interface Output {
          status: DTO.StatusModel;
          output: DTO.ViewModel.Generic;
        }
      }
    }

    namespace Controller {
      interface BaseInput {
        requestType: string;
        scopeType: string;
      }

      interface BaseInputGraphql extends BaseInput {
        request: MercuriusContext["reply"]["request"];
        reply: MercuriusContext["reply"];
      }

      interface BaseInputREST extends BaseInput {
        request: FastifyRequest;
        reply: FastifyReply;
      }

      interface BaseOutput {
        status: DTO.HttpStatusModel;
      }

      namespace List {
        interface Input extends BaseInputGraphql {
          payload: {
            filter?: Payload.Query.Filter;
            order?: Payload.Query.Order;
          };
        }

        interface Output extends BaseOutput {
          output?: DTO.ViewModel.Generic[];
        }
      }

      namespace Read {
        interface Input extends BaseInputGraphql {
          payload: {
            select: Payload.Query.Select.Generic[];
          };
        }

        interface Output extends BaseOutput {
          output?: DTO.ViewModel.Generic;
        }
      }
    }

    namespace Exception {
      type ValidationObject = ErrorObject[] | null | undefined;

      interface Input {
        description: Payload.DescriptionCodes;
        code: Payload.StatusCodes;
        message?: string;
        detail?: string;
        error?: Error | unknown;
        errors?: AggregateError | unknown;
      }
    }
  }

  namespace Port {
    namespace Service {
      type List = ServicePort<
        Payload.Service.List.Input,
        Payload.Service.List.Output
      >;

      type Read = ServicePort<
        Payload.Service.Read.Input,
        Payload.Service.Read.Output
      >;
    }

    namespace Repository {
      type Generic = RepositoryPort<
        CommonModule.Payload.Query.Filter,
        CommonModule.Payload.Query.Order,
        CommonModule.Payload.Query.Select.Generic,
        DTO.ViewModel.Generic,
        DTO.EntityModel.Generic,
        DTO.DataModel.Generic
      >;

      type Account = RepositoryPort<
        CommonModule.Payload.Query.Filter,
        CommonModule.Payload.Query.Order,
        CommonModule.Payload.Query.Select.Generic,
        AccountModule.DTO.ViewModel.Account,
        AccountModule.DTO.EntityModel.Account,
        AccountModule.DTO.DataModel.Account
      >;

      type Subscription = RepositoryPort<
        CommonModule.Payload.Query.Filter,
        CommonModule.Payload.Query.Order,
        CommonModule.Payload.Query.Select.Generic,
        AccountModule.DTO.ViewModel.Subscription,
        AccountModule.DTO.EntityModel.Subscription,
        AccountModule.DTO.DataModel.Subscription
      >;

      type Work = RepositoryPort<
        CommonModule.Payload.Query.Filter,
        CommonModule.Payload.Query.Order,
        CommonModule.Payload.Query.Select.Generic,
        ProductModule.DTO.ViewModel.Work,
        ProductModule.DTO.EntityModel.Work,
        ProductModule.DTO.DataModel.Work
      >;

      type Profile = RepositoryPort<
        CommonModule.Payload.Query.Filter,
        CommonModule.Payload.Query.Order,
        CommonModule.Payload.Query.Select.Generic,
        ContentModule.DTO.ViewModel.Profile,
        ContentModule.DTO.EntityModel.Profile,
        ContentModule.DTO.DataModel.Profile
      >;

      type Feature = RepositoryPort<
        CommonModule.Payload.Query.Filter,
        CommonModule.Payload.Query.Order,
        CommonModule.Payload.Query.Select.Generic,
        ContentModule.DTO.ViewModel.Feature,
        ContentModule.DTO.EntityModel.Feature,
        ContentModule.DTO.DataModel.Feature
      >;
    }

    namespace Handler {
      type Status = StatusHandlerPort<DTO.StatusModel, DTO.HttpStatusModel>;

      type Session = SessionHandlerPort<
        FastifyRequest,
        FastifyReply,
        CommonModule.Handler.Session.Payload,
        CommonModule.Handler.Session.Identity,
        CommonModule.Handler.Session.Output
      >;

      namespace Validation {
        type Generic<ValidationSchema> =
          ValidationHandlerPort<ValidationSchema>;

        type CommonModule = ValidationHandlerPort<
          | Payload.Service.List.Input["payload"]
          | Payload.Service.Read.Input["payload"]
        >;
      }
    }
  }

  namespace Handler {
    namespace Session {
      type ServiceScope = "user" | "service";

      type ScopeObject = {
        [K in ServiceScope]: boolean;
      };

      interface Payload {
        id_account: string;
        scope: string;
      }

      interface Claims extends JWTPayload {
        id_account: string;
        scope: string;
      }

      interface Identity extends JWTPayload {
        iss: string;
        sub: string;
        jti: string;
        iat: number;
        exp: number;
        scope: ScopeObject;
      }

      interface Output {
        status: DTO.StatusModel;
      }
    }

    namespace Status {
      interface CodeList {
        [key: string]: {
          type: string;
          name: {
            [key in valueof<typeof STATUS_CODES>]?: string;
          };
        };
      }
    }
  }
}

declare namespace Core {
  namespace Service {
    // explicit resolvers type to proper handle index signatures
    // in order to allow merging multiple resolvers in one object
    // without the need of ~ most probably ~ incompatible tools
    type MercuriusResolvers = IResolvers & {
      Query?: {
        [key: string]: (
          source: any,
          args: any,
          context: MercuriusContext,
          info: GraphQLResolveInfo,
        ) => Promise<any>;
      };
      Mutation?: {
        [key: string]: (
          source: any,
          args: any,
          context: MercuriusContext,
          info: GraphQLResolveInfo,
        ) => Promise<any>;
      };
    };
  }

  namespace Settings {
    interface Server {
      name: string;
    }
    interface Web {
      host: string;
      port: number;
      fastify: {
        https: boolean;
        http2: boolean;
        trustProxy: string | boolean | undefined;
        connectionTimeout: number;
        logger: boolean;
      };
      cookie: FastifyCookieOptions;
      api: {
        path: string;
      };
      graphql: {
        service: MercuriusOptions;
        user: MercuriusOptions;
        public: MercuriusOptions;
      };
      rateLimit: FastifyRateLimitOptions;
      useRequestScope: boolean;
    }

    interface SessionCookieOptions {
      path: string;
      secure: boolean;
      sameSite: boolean | "lax" | "strict" | "none" | undefined;
      maxAge: number;
      domain: string | undefined;
      signed: boolean;
      httpOnly: boolean;
    }

    interface SessionCookie {
      name: string;
      options: SessionCookieOptions;
    }

    interface Session {
      tokenSecret: string;
      auth: SessionCookie;
      user: SessionCookie;
    }

    interface DatabaseModuleOptions {
      port: number;
      host: string;
      user: string;
      password: string;
      database: string;
      max: number;
      connectionTimeoutMillis: number;
      idleTimeoutMillis: number;
    }

    type DatabaseModuleNames = "account" | "product" | "content";
    type DatabaseTableNames =
      | "account"
      | "subscription"
      | "profile"
      | "feature"
      | "work";

    type TableNamesForModule<T extends DatabaseModuleNames> =
      T extends "account"
        ? "account" | "subscription"
        : T extends "product"
          ? "work"
          : T extends "content"
            ? "profile" | "feature"
            : never;

    type Database = {
      [S in DatabaseModuleNames]: {
        databaseModuleName: DatabaseModuleNames;
        schemas: {
          data: string;
          read: string;
        };
        tables: {
          [T in TableNamesForModule<S>]: {
            name: string;
            columnConstraints: string[];
          };
        };
        client: PoolConfig;
      };
    };
  }
}

declare namespace AccountModule {
  namespace DTO {
    namespace EntityModel {
      type Account = AccountModel;
      type Subscription = SubscriptionModel;
    }

    namespace ViewModel {
      interface Base {
        created_at: string;
        updated_at: string;
      }

      interface Account extends Base {
        id_account: string;
        email: string;
        scope: string;
        password?: never; // important!
        document?: Record<string, unknown> | null;
      }

      interface Subscription extends Base {
        id_subscription: string;
        id_account: string;
        type: string;
        status: string;
        document?: Record<string, unknown> | null;
      }
    }

    namespace DataModel {
      interface Base {
        created_at: string;
        updated_at: string;
      }

      interface Account extends Base {
        id_account: string;
        email: string;
        password: string;
        scope: string;
        document: Record<string, unknown> | null;
      }

      interface Subscription extends Base {
        id_subscription: string;
        id_account: string;
        type: string;
        status: string;
        document: Record<string, unknown> | null;
      }
    }
  }

  namespace Payload {
    namespace Service {
      namespace CreateAccount {
        interface Input {
          payload: {
            input: {
              email: string;
              password: string;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Account;
        }
      }

      namespace UpdateAccount {
        interface Input {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
            input: {
              email?: string;
              password?: string;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Account;
        }
      }

      namespace RemoveAccount {
        interface Input {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
        }
      }

      namespace CreateSession {
        interface Input {
          payload: {
            body: {
              email: string;
              password: string;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Account;
        }
      }

      namespace CreateSubscription {
        interface Input {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
            input: {
              type: string;
              status: string;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Subscription;
        }
      }

      namespace UpdateSubscription {
        interface Input {
          payload: {
            subscription: CommonModule.Payload.Query.Select.Subscription;
            input: {
              type?: string;
              status?: string;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Subscription;
        }
      }

      namespace RemoveSubscription {
        interface Input {
          payload: {
            subscription: CommonModule.Payload.Query.Select.Subscription;
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
        }
      }
    }

    namespace Controller {
      namespace CreateAccount {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            input: {
              email: string;
              password: string;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Account;
        }
      }

      namespace UpdateAccount {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            account?: CommonModule.Payload.Query.Select.Account;
            input: {
              email?: string;
              password?: string;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Account;
        }
      }

      namespace RemoveAccount {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            account?: CommonModule.Payload.Query.Select.Account;
          };
        }

        type Output = CommonModule.Payload.Controller.BaseOutput;
      }

      namespace CreateSession {
        interface Input extends CommonModule.Payload.Controller.BaseInputREST {
          payload: {
            body: {
              email: string;
              password: string;
            };
          };
        }
      }

      namespace RemoveSession {
        type Input = CommonModule.Payload.Controller.BaseInputREST;
      }

      namespace CreateSubscription {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
            input: {
              type: string;
              status: string;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Subscription;
        }
      }

      namespace UpdateSubscription {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            subscription: CommonModule.Payload.Query.Select.Subscription;
            input: {
              type?: string;
              status?: string;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Subscription;
        }
      }

      namespace RemoveSubscription {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            subscription: CommonModule.Payload.Query.Select.Subscription;
          };
        }

        type Output = CommonModule.Payload.Controller.BaseOutput;
      }
    }
  }

  namespace Port {
    namespace Service {
      type CreateAccount = ServicePort<
        Payload.Service.CreateAccount.Input,
        Payload.Service.CreateAccount.Output
      >;

      type UpdateAccount = ServicePort<
        Payload.Service.UpdateAccount.Input,
        Payload.Service.UpdateAccount.Output
      >;

      type RemoveAccount = ServicePort<
        Payload.Service.RemoveAccount.Input,
        Payload.Service.RemoveAccount.Output
      >;

      type CreateSession = ServicePort<
        Payload.Service.CreateSession.Input,
        Payload.Service.CreateSession.Output
      >;

      type CreateSubscription = ServicePort<
        Payload.Service.CreateSubscription.Input,
        Payload.Service.CreateSubscription.Output
      >;

      type UpdateSubscription = ServicePort<
        Payload.Service.UpdateSubscription.Input,
        Payload.Service.UpdateSubscription.Output
      >;

      type RemoveSubscription = ServicePort<
        Payload.Service.RemoveSubscription.Input,
        Payload.Service.RemoveSubscription.Output
      >;
    }

    namespace Mapper {
      type Account = MapperPort<
        DTO.ViewModel.Account,
        DTO.EntityModel.Account,
        DTO.DataModel.Account
      >;

      type Subscription = MapperPort<
        DTO.ViewModel.Subscription,
        DTO.EntityModel.Subscription,
        DTO.DataModel.Subscription
      >;
    }

    namespace Handler {
      namespace Validation {
        type Account = ValidationHandlerPort<
          | CommonModule.Payload.Service.List.Input["payload"]
          | CommonModule.Payload.Service.Read.Input["payload"]
          | Payload.Service.CreateSession.Input["payload"]
          | Payload.Service.CreateAccount.Input["payload"]
          | Payload.Service.UpdateAccount.Input["payload"]
          | Payload.Service.RemoveAccount.Input["payload"]
        >;

        type Session = ValidationHandlerPort<
          Payload.Service.CreateSession.Input["payload"]
        >;

        type Subscription = ValidationHandlerPort<
          | CommonModule.Payload.Service.List.Input["payload"]
          | CommonModule.Payload.Service.Read.Input["payload"]
          | Payload.Service.CreateSubscription.Input["payload"]
          | Payload.Service.UpdateSubscription.Input["payload"]
          | Payload.Service.RemoveSubscription.Input["payload"]
        >;
      }
    }
  }
}

declare namespace ContentModule {
  namespace DTO {
    namespace EntityModel {
      type Profile = ProfileModel;
      type Feature = FeatureModel;
    }

    namespace ViewModel {
      interface Base {
        created_at: string;
        updated_at: string;
      }

      interface Profile extends Base {
        id_profile: string;
        id_account: string;
        username: string;
        name?: string | null;
        document?: Record<string, unknown> | null;
      }

      interface Feature extends Base {
        id_feature: string;
        name: string;
        subscription_scope: string[];
        document?: Record<string, unknown> | null;
      }
    }

    namespace DataModel {
      interface Base {
        created_at: string;
        updated_at: string;
      }

      interface Profile extends Base {
        id_profile: string;
        id_account: string;
        username: string;
        name: string | null;
        document: Record<string, unknown> | null;
      }

      interface Feature extends Base {
        id_feature: string;
        name: string;
        subscription_scope: string[];
        document: Record<string, unknown> | null;
      }
    }
  }

  namespace Payload {
    namespace Service {
      namespace CreateProfile {
        interface Input {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
            input: {
              username: string;
              name?: string | null;
              image_url?: string | null;
              description?: string | null;
              website_url?: string | null;
              location?: string | null;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Profile;
        }
      }

      namespace UpdateProfile {
        interface Input {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
            input: {
              username?: string;
              name?: string | null;
              image_url?: string | null;
              description?: string | null;
              website_url?: string | null;
              location?: string | null;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Profile;
        }
      }

      namespace RemoveProfile {
        interface Input {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
        }
      }

      namespace CreateFeature {
        interface Input {
          payload: {
            input: {
              name: string;
              subscription_scope: string[];
              description?: string | null;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Feature;
        }
      }

      namespace UpdateFeature {
        interface Input {
          payload: {
            feature: CommonModule.Payload.Query.Select.Feature;
            input: {
              name?: string;
              subscription_scope?: string[];
              description?: string | null;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Feature;
        }
      }

      namespace RemoveFeature {
        interface Input {
          payload: {
            feature: CommonModule.Payload.Query.Select.Feature;
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
        }
      }
    }

    namespace Controller {
      namespace CreateProfile {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            account?: CommonModule.Payload.Query.Select.Account;
            input: {
              username: string;
              name?: string | null;
              image_url?: string | null;
              description?: string | null;
              website_url?: string | null;
              location?: string | null;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Profile;
        }
      }

      namespace UpdateProfile {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            account?: CommonModule.Payload.Query.Select.Account;
            input: {
              username?: string;
              name?: string | null;
              image_url?: string | null;
              description?: string | null;
              website_url?: string | null;
              location?: string | null;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Profile;
        }
      }

      namespace RemoveProfile {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            account?: CommonModule.Payload.Query.Select.Account;
          };
        }

        type Output = CommonModule.Payload.Controller.BaseOutput;
      }

      namespace CreateFeature {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            input: {
              name: string;
              subscription_scope: string[];
              description?: string | null;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Feature;
        }
      }

      namespace UpdateFeature {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            feature: CommonModule.Payload.Query.Select.Feature;
            input: {
              name?: string;
              subscription_scope?: string[];
              description?: string | null;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Feature;
        }
      }

      namespace RemoveFeature {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            feature: CommonModule.Payload.Query.Select.Feature;
          };
        }

        type Output = CommonModule.Payload.Controller.BaseOutput;
      }
    }
  }

  namespace Port {
    namespace Service {
      type CreateProfile = ServicePort<
        Payload.Service.CreateProfile.Input,
        Payload.Service.CreateProfile.Output
      >;

      type UpdateProfile = ServicePort<
        Payload.Service.UpdateProfile.Input,
        Payload.Service.UpdateProfile.Output
      >;

      type RemoveProfile = ServicePort<
        Payload.Service.RemoveProfile.Input,
        Payload.Service.RemoveProfile.Output
      >;

      type CreateFeature = ServicePort<
        Payload.Service.CreateFeature.Input,
        Payload.Service.CreateFeature.Output
      >;

      type UpdateFeature = ServicePort<
        Payload.Service.UpdateFeature.Input,
        Payload.Service.UpdateFeature.Output
      >;

      type RemoveFeature = ServicePort<
        Payload.Service.RemoveFeature.Input,
        Payload.Service.RemoveFeature.Output
      >;
    }

    namespace Mapper {
      type Profile = MapperPort<
        DTO.ViewModel.Profile,
        DTO.EntityModel.Profile,
        DTO.DataModel.Profile
      >;

      type Feature = MapperPort<
        DTO.ViewModel.Feature,
        DTO.EntityModel.Feature,
        DTO.DataModel.Feature
      >;
    }

    namespace Handler {
      namespace Validation {
        type Profile = ValidationHandlerPort<
          | CommonModule.Payload.Service.List.Input["payload"]
          | CommonModule.Payload.Service.Read.Input["payload"]
          | Payload.Service.CreateProfile.Input["payload"]
          | Payload.Service.UpdateProfile.Input["payload"]
          | Payload.Service.RemoveProfile.Input["payload"]
        >;

        type Feature = ValidationHandlerPort<
          | CommonModule.Payload.Service.List.Input["payload"]
          | CommonModule.Payload.Service.Read.Input["payload"]
          | Payload.Service.CreateFeature.Input["payload"]
          | Payload.Service.UpdateFeature.Input["payload"]
          | Payload.Service.RemoveFeature.Input["payload"]
        >;
      }
    }
  }
}

declare namespace ProductModule {
  namespace DTO {
    namespace EntityModel {
      type Work = WorkModel;
    }

    namespace RepositoryModel {
      interface Base {
        created_at: string;
        updated_at: string;
      }

      interface Work extends Base {
        id_work: string;
        id_account: string;
        id_feature: string;
        name: string;
        level: number;
        document: Record<string, unknown> | null;
      }
    }

    namespace ViewModel {
      interface Base {
        created_at: string;
        updated_at: string;
      }

      interface Work extends Base {
        id_work: string;
        id_account: string;
        id_feature: string;
        name: string;
        level: number;
        document?: Record<string, unknown> | null;
      }
    }

    namespace DataModel {
      interface Base {
        created_at: string;
        updated_at: string;
      }

      interface Work extends Base {
        id_work: string;
        id_account: string;
        id_feature: string;
        name: string;
        level: number;
        document: Record<string, unknown> | null;
      }
    }
  }

  namespace Select {
    interface Work {
      field: "id_work" | "id_account";
      value: string;
    }
  }

  namespace Payload {
    namespace Service {
      namespace CreateWork {
        interface Input {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
            feature: CommonModule.Payload.Query.Select.Feature;
            input: {
              name: string;
              level: number;
              description?: string;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Work;
        }
      }

      namespace UpdateWork {
        interface Input {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
            work: CommonModule.Payload.Query.Select.Work;
            input: {
              name?: string;
              level?: number;
              description?: string;
            };
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
          output: DTO.ViewModel.Work;
        }
      }

      namespace RemoveWork {
        interface Input {
          payload: {
            account: CommonModule.Payload.Query.Select.Account;
            work: CommonModule.Payload.Query.Select.Work;
          };
        }

        interface Output {
          status: CommonModule.DTO.StatusModel;
        }
      }
    }

    namespace Controller {
      // ----------------------------------------------------------------
      // Work

      namespace CreateWork {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            account?: CommonModule.Payload.Query.Select.Account;
            feature: CommonModule.Payload.Query.Select.Feature;
            input: {
              name: string;
              level: number;
              description?: string;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Work;
        }
      }

      namespace UpdateWork {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            account?: CommonModule.Payload.Query.Select.Account;
            work: CommonModule.Payload.Query.Select.Work;
            input: {
              name?: string;
              level?: number;
              description?: string;
            };
          };
        }

        interface Output extends CommonModule.Payload.Controller.BaseOutput {
          output?: DTO.ViewModel.Work;
        }
      }

      namespace RemoveWork {
        interface Input
          extends CommonModule.Payload.Controller.BaseInputGraphql {
          payload: {
            account?: CommonModule.Payload.Query.Select.Account;
            work: CommonModule.Payload.Query.Select.Work;
          };
        }

        type Output = CommonModule.Payload.Controller.BaseOutput;
      }
    }
  }

  namespace Port {
    namespace Service {
      type CreateWork = ServicePort<
        Payload.Service.CreateWork.Input,
        Payload.Service.CreateWork.Output
      >;

      type UpdateWork = ServicePort<
        Payload.Service.UpdateWork.Input,
        Payload.Service.UpdateWork.Output
      >;

      type RemoveWork = ServicePort<
        Payload.Service.RemoveWork.Input,
        Payload.Service.RemoveWork.Output
      >;
    }

    namespace Mapper {
      type Work = MapperPort<
        DTO.ViewModel.Work,
        DTO.EntityModel.Work,
        DTO.DataModel.Work
      >;
    }

    namespace Handler {
      namespace Validation {
        type Work = ValidationHandlerPort<
          | CommonModule.Payload.Service.List.Input["payload"]
          | CommonModule.Payload.Service.Read.Input["payload"]
          | Payload.Service.CreateWork.Input["payload"]
          | Payload.Service.UpdateWork.Input["payload"]
          | Payload.Service.RemoveWork.Input["payload"]
        >;
      }
    }
  }
}
