import { DomainException } from "../../../../../common/exceptions";
import { BaseValueObject } from "../../../../../common/abstracts";

interface SubscriptionScope {
  value: string[];
}

class FeatureSubscriptionScope extends BaseValueObject<SubscriptionScope> {
  private constructor(props: SubscriptionScope) {
    super(props);
  }

  get value(): string[] {
    return this.props.value;
  }

  private static validate(value: string[]): string[] {
    if (!Array.isArray(value)) {
      throw new DomainException(
        "INVALID_VALUE_FORMAT",
        400,
        "(FeatureSubscriptionScope): value is not array.",
        value,
      );
    }
    if (value.length === 0) {
      throw new DomainException(
        "NON_NULLABLE_VALUE",
        400,
        "(FeatureSubscriptionScope): subscription scope can't be null.",
        "subscriptionScope",
      );
    }
    value = [...new Set(value)];
    value = value.map((item) => item.trim());
    return value;
  }

  static insert(scope: string[]): FeatureSubscriptionScope {
    if (scope != null) scope = this.validate(scope);
    return new FeatureSubscriptionScope({
      value: scope,
    });
  }
}

export { FeatureSubscriptionScope };
