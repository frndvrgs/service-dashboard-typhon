import validator from "validator";

import { DomainException } from "../../../../../common/exceptions";
import { BaseValueObject } from "../../../../../common/abstracts";

import { TEXT_LENGTH } from "../../../../../common/constants";

const options = {
  length: {
    min: TEXT_LENGTH.FEATURE.NAME.MIN,
    max: TEXT_LENGTH.FEATURE.NAME.MAX,
  },
};

interface Name {
  value: string;
}

class FeatureName extends BaseValueObject<Name> {
  private constructor(props: Name) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static validate(value: string): string {
    value = value.trim();
    if (
      !validator.isLength(value, {
        min: options.length.min,
        max: options.length.max,
      })
    ) {
      throw new DomainException(
        "INVALID_VALUE_LENGTH",
        400,
        `invalid feature name length: (max-length) ${options.length.max}`,
        "name",
      );
    }
    return value;
  }

  static createOrUpdate(name: string): FeatureName {
    if (name == null) {
      throw new DomainException(
        "NON_NULLABLE_VALUE",
        400,
        "feature name can't be null.",
        "name",
      );
    }
    this.validate(name);
    return new FeatureName({
      value: name,
    });
  }

  static insert(name: string): FeatureName {
    return new FeatureName({
      value: name,
    });
  }
}

export { FeatureName };
