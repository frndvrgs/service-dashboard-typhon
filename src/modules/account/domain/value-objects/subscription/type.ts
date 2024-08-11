import { BaseValueObject } from "../../../../../common/abstracts";
import { DomainException } from "../../../../../common/exceptions";

import { ENUM } from "../../../../../common/constants";

type SubscriptionTypeValues = keyof typeof ENUM.SUBSCRIPTION.TYPE;

interface SubscriptionTypeValue {
  value: SubscriptionTypeValues;
}

class SubscriptionType extends BaseValueObject<SubscriptionTypeValue> {
  private constructor(props: SubscriptionTypeValue) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static createOrUpdate(type: string): SubscriptionType {
    if (!Object.values(ENUM.SUBSCRIPTION.TYPE).includes(type)) {
      throw new DomainException(
        "INVALID_SUBSCRIPTION_TYPE",
        400,
        "invalid subscription type.",
        "type",
      );
    }
    return new SubscriptionType({ value: type as SubscriptionTypeValues });
  }

  static insert(type: string): SubscriptionType {
    return new SubscriptionType({
      value: type as SubscriptionTypeValues,
    });
  }
}

export { SubscriptionType };
