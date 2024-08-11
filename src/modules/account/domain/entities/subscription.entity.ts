import { Id, SubscriptionType, SubscriptionStatus } from "../value-objects";
import { BaseEntity } from "../../../../common/abstracts";
import { clearObjectNulls } from "../../../../common/helpers/clear-object-nulls";

interface Subscription {
  id: Id;
  idAccount: Id;
  createdAt: string;
  updatedAt: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  document: Record<string, unknown> | null;
}

export interface SubscriptionModel {
  id: string;
  idAccount: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  status: string;
  document: Record<string, unknown> | null;
}

interface SubscriptionCreateProps {
  idAccount: string;
  type: string;
  status: string;
  document?: Record<string, unknown> | null;
}

interface SubscriptionUpdateProps {
  type?: string;
  status?: string;
  document?: Record<string, unknown> | null;
}

class SubscriptionEntity extends BaseEntity<Subscription> {
  private constructor(props: Subscription) {
    super(props.id.value, props);
  }

  public export(): SubscriptionModel {
    return {
      id: this.props.id.value,
      idAccount: this.props.idAccount.value,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      type: this.props.type.value,
      status: this.props.status.value,
      document: clearObjectNulls(this.props.document),
    };
  }

  public async update(input: SubscriptionUpdateProps): Promise<void> {
    input.type != null &&
      (this.props.type = SubscriptionType.createOrUpdate(input.type));
    input.status != null &&
      (this.props.status = SubscriptionStatus.createOrUpdate(input.status));
    input.document != null && (this.props.document = input.document);
    this.props.updatedAt = new Date().toISOString();
  }

  static import(resource: SubscriptionModel): SubscriptionEntity {
    return new SubscriptionEntity({
      id: Id.insert(resource.id),
      idAccount: Id.insert(resource.idAccount),
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
      type: SubscriptionType.insert(resource.type),
      status: SubscriptionStatus.insert(resource.status),
      document: resource.document,
    });
  }

  static create(input: SubscriptionCreateProps): SubscriptionEntity {
    return new SubscriptionEntity({
      id: Id.create(),
      idAccount: Id.insert(input.idAccount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: SubscriptionType.createOrUpdate(input.type),
      status: SubscriptionStatus.createOrUpdate("ACTIVE"),
      document: input.document ?? null,
    });
  }
}

export { SubscriptionEntity };
