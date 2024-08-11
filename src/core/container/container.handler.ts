import { ServerException } from "../../common/exceptions";

type RegistrationKey = string;
type Scope = "singleton" | "transient" | "request";

interface RegistrationItem {
  factory: () => any;
  scope: Scope;
}

/**
 * Container class for managing dependency injection and instances lazy-loading.
 * Supports singleton, transient, and request-scoped instances.
 *
 */

class ContainerHandler {
  private singletonInstances: Map<RegistrationKey, any> = new Map();
  private requestInstances: Map<symbol, Map<RegistrationKey, any>> = new Map();
  private registrations: Map<RegistrationKey, RegistrationItem> = new Map();

  private getSingletonInstance<T>(
    key: RegistrationKey,
    registration: RegistrationItem,
  ): T {
    if (!this.singletonInstances.has(key)) {
      this.singletonInstances.set(key, registration.factory());
    }
    return this.singletonInstances.get(key) as T;
  }

  private getRequestInstance<T>(
    key: RegistrationKey,
    registration: RegistrationItem,
    requestId: symbol,
  ): T {
    let requestMap = this.requestInstances.get(requestId);
    if (!requestMap) {
      requestMap = new Map();
      this.requestInstances.set(requestId, requestMap);
    }
    if (!requestMap.has(key)) {
      requestMap.set(key, registration.factory());
    }
    return requestMap.get(key) as T;
  }

  public cleanupRequest(requestId: symbol): void {
    if (this.requestInstances.has(requestId)) {
      this.requestInstances.delete(requestId);
    }
  }

  /**
   * Creates a registration entry for a dependency.
   *
   * @param key - Unique identifier for the dependency
   * @param factory - Factory function to create the instance
   * @param scope - Scope of the instance: 'singleton', 'transient', or 'request' (default: 'singleton')
   * @returns A tuple containing the key and registration item
   *
   */

  public register<T>(
    key: RegistrationKey,
    factory: () => T,
    scope: Scope = "singleton",
  ): [RegistrationKey, RegistrationItem] {
    return [key, { factory, scope }];
  }

  /**
   * Creates a registration entry for a class-based dependency.
   *
   * @param key - Unique identifier for the dependency
   * @param classConstructor - Class constructor
   * @param scope - Scope of the instance: 'singleton', 'transient', or 'request' (default: 'singleton')
   * @returns A tuple containing the key and registration item
   */

  public registerClass<T>(
    key: RegistrationKey,
    classConstructor: new (...args: any[]) => T,
    scope: Scope = "singleton",
  ): [RegistrationKey, RegistrationItem] {
    return [key, { factory: () => new classConstructor(), scope }];
  }

  /**
   * Registers one or more dependencies.
   *
   * @param registrations - An array of tuples, each containing a key and a registration item
   *
   */

  public set(registrations: [RegistrationKey, RegistrationItem][]): void {
    for (const [key, item] of registrations) {
      this.registrations.set(key, item);
    }
  }

  /**
   * Retrieves an instance of a registered dependency.
   *
   * @param key - Unique identifier for the dependency
   * @param requestId - Optional request ID for request-scoped instances
   * @returns The instance of the requested dependency
   * @throws ServerException if no registration is found for the given key
   *
   */

  public get<T>(key: RegistrationKey, requestId?: symbol): T {
    const registration = this.registrations.get(key);
    if (!registration) {
      throw new ServerException(
        "INTERNAL_SERVER_ERROR",
        500,
        `no registration found for key: ${key}`,
        `check instance registers of  ${key}`,
      );
    }

    switch (registration.scope) {
      case "singleton":
        return this.getSingletonInstance(key, registration);
      case "transient":
        return registration.factory() as T;
      case "request":
        if (!requestId) {
          throw new ServerException(
            "INTERNAL_SERVER_ERROR",
            500,
            `requestId is required for request-scoped dependency: ${key}`,
            `try container.get(${key}, request.requestId)`,
          );
        }
        return this.getRequestInstance(key, registration, requestId);
      default:
        throw new ServerException(
          "INTERNAL_SERVER_ERROR",
          500,
          `invalid scope for key: ${key}`,
          `check instance registers of  ${key}`,
        );
    }
  }
}

export const container = new ContainerHandler();
