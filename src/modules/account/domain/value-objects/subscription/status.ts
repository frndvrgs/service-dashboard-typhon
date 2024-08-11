import { BaseValueObject } from "../../../../../common/abstracts";
import { DomainException } from "../../../../../common/exceptions";

import { ENUM } from "../../../../../common/constants";

type SubscriptionStatusValues = keyof typeof ENUM.SUBSCRIPTION.STATUS;

interface SubscriptionStatusValue {
  value: SubscriptionStatusValues;
}

class SubscriptionStatus extends BaseValueObject<SubscriptionStatusValue> {
  private constructor(props: SubscriptionStatusValue) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static createOrUpdate(status: string): SubscriptionStatus {
    if (!Object.values(ENUM.SUBSCRIPTION.STATUS).includes(status)) {
      throw new DomainException(
        "INVALID_SUBSCRIPTION_STATUS",
        400,
        "invalid subscription status.",
        "status",
      );
    }
    return new SubscriptionStatus({
      value: status as SubscriptionStatusValues,
    });
  }

  static insert(type: string): SubscriptionStatus {
    return new SubscriptionStatus({
      value: type as SubscriptionStatusValues,
    });
  }
}

export { SubscriptionStatus };
