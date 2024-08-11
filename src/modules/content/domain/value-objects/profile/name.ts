import validator from "validator";

import { DomainException } from "../../../../../common/exceptions";
import { BaseValueObject } from "../../../../../common/abstracts";

import { TEXT_LENGTH } from "../../../../../common/constants";

const options = {
  length: {
    min: TEXT_LENGTH.PROFILE.NAME.MIN,
    max: TEXT_LENGTH.PROFILE.NAME.MAX,
  },
};

interface Name {
  value: string | null;
}

class ProfileName extends BaseValueObject<Name> {
  private constructor(props: Name) {
    super(props);
  }

  get value(): string | null {
    return this.props.value;
  }

  private static validate(value: string): string | null {
    value = value.trim();
    if (value === "") return null;
    if (
      !validator.isLength(value, {
        min: options.length.min,
        max: options.length.max,
      })
    ) {
      throw new DomainException(
        "INVALID_VALUE_LENGTH",
        400,
        `invalid profile name length: (max-length) ${options.length.max}`,
        "name",
      );
    }
    return value;
  }

  static createOrUpdate(name: string | null | undefined): ProfileName {
    if (name != null) name = this.validate(name);
    return new ProfileName({
      value: name ?? null,
    });
  }

  static insert(name: string | null | undefined): ProfileName {
    return new ProfileName({
      value: name ?? null,
    });
  }
}

export { ProfileName };
