import { BaseEntity } from "../../../../common/abstracts";
import { clearObjectNulls } from "../../../../common/helpers/clear-object-nulls";

import { Id, FeatureName, FeatureSubscriptionScope } from "../value-objects";

interface Feature {
  id: Id;
  createdAt: string;
  updatedAt: string;
  name: FeatureName;
  subscriptionsScope: FeatureSubscriptionScope;
  document: Record<string, unknown> | null;
}

export interface FeatureModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  subscriptionScope: string[];
  document: Record<string, unknown> | null;
}

interface FeatureCreateProps {
  name: string;
  subscriptionScope: string[];
  document: Record<string, unknown> | null;
}

interface FeatureUpdateProps {
  name?: string;
  subscriptionScope?: string[];
  document?: Record<string, unknown> | null;
}

class FeatureEntity extends BaseEntity<Feature> {
  private constructor(props: Feature) {
    super(props.id.value, props);
  }

  public export(): FeatureModel {
    return {
      id: this.props.id.value,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      name: this.props.name.value,
      subscriptionScope: this.props.subscriptionsScope.value,
      document: clearObjectNulls(this.props.document),
    };
  }

  public update(input: FeatureUpdateProps): void {
    input.name != null &&
      (this.props.name = FeatureName.createOrUpdate(input.name));
    input.subscriptionScope != null &&
      (this.props.subscriptionsScope = FeatureSubscriptionScope.insert(
        input.subscriptionScope,
      ));
    input.document != null && (this.props.document = input.document);
    this.props.updatedAt = new Date().toISOString();
  }

  static import(resource: FeatureModel): FeatureEntity {
    return new FeatureEntity({
      id: Id.insert(resource.id),
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
      name: FeatureName.createOrUpdate(resource.name),
      subscriptionsScope: FeatureSubscriptionScope.insert(
        resource.subscriptionScope,
      ),
      document: resource.document,
    });
  }

  static create(input: FeatureCreateProps): FeatureEntity {
    return new FeatureEntity({
      id: Id.create(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: FeatureName.createOrUpdate(input.name),
      subscriptionsScope: FeatureSubscriptionScope.insert(
        input.subscriptionScope,
      ),
      document: input.document,
    });
  }
}

export { FeatureEntity };
