import validator from "validator";
import slugify from "slugify";

import { DomainException } from "../../../../../common/exceptions";
import { BaseValueObject } from "../../../../../common/abstracts";
import { TEXT_LENGTH } from "../../../../../common/constants";

const options = {
  length: {
    min: TEXT_LENGTH.PROFILE.USERNAME.MIN,
    max: TEXT_LENGTH.PROFILE.USERNAME.MAX,
  },
};

interface Username {
  value: string;
}

class ProfileUsername extends BaseValueObject<Username> {
  private constructor(props: Username) {
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
        `invalid username length: (max-length) ${options.length.max}`,
        "username",
      );
    }
    return value;
  }

  static createOrUpdate(username: string): ProfileUsername {
    if (username == null) {
      throw new DomainException(
        "NON_NULLABLE_VALUE",
        400,
        "username can't be null.",
        "username",
      );
    }
    username = slugify(this.validate(username), {
      lower: true,
      strict: true,
    });
    return new ProfileUsername({
      value: username,
    });
  }

  static insert(username: string): ProfileUsername {
    return new ProfileUsername({
      value: username,
    });
  }
}

export { ProfileUsername };
