import validator from "validator";

import { BaseValueObject } from "../../../../../common/abstracts";
import { DomainException } from "../../../../../common/exceptions";

import { TEXT_LENGTH } from "../../../../../common/constants";

const options = {
  length: {
    min: TEXT_LENGTH.ACCOUNT.EMAIL.MIN,
    max: TEXT_LENGTH.ACCOUNT.EMAIL.MAX,
  },
};

interface Email {
  value: string;
}

class AccountEmail extends BaseValueObject<Email> {
  private constructor(props: Email) {
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
        `invalid email length: (min-length): ${options.length.min} (max-length): ${options.length.max}.`,
        "email",
      );
    }
    if (!validator.isEmail(value)) {
      throw new DomainException(
        "INVALID_VALUE_FORMAT",
        400,
        "email must be a valid format",
        "email",
      );
    }
    return value;
  }

  static createOrUpdate(email: string): AccountEmail {
    if (email == null) {
      throw new DomainException(
        "NON_NULLABLE_VALUE",
        400,
        "email can't be null.",
        "email",
      );
    }
    email = this.validate(email);
    return new AccountEmail({
      value: email,
    });
  }

  static insert(email: string): AccountEmail {
    return new AccountEmail({
      value: email,
    });
  }
}

export { AccountEmail };
