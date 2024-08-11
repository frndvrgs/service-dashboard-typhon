import argon2 from "argon2";
import validator from "validator";

import { BaseValueObject } from "../../../../../common/abstracts";
import { DomainException } from "../../../../../common/exceptions";

import { TEXT_LENGTH } from "../../../../../common/constants";

const options = {
  length: {
    min: TEXT_LENGTH.ACCOUNT.PASSWORD.MIN,
    max: TEXT_LENGTH.ACCOUNT.PASSWORD.MAX,
  },
  hash: {
    type: argon2.argon2id,
    hashLength: 64,
    timeCost: 6,
    memoryCost: 32 * 1024,
    parallelism: 4,
  },
};

interface Password {
  value: string;
}

class AccountPassword extends BaseValueObject<Password> {
  private constructor(props: Password) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static validate(value: string): string {
    value = value.trim();
    if (
      !validator.isLength(value, {
        max: options.length.max,
      })
    ) {
      throw new DomainException(
        "INVALID_VALUE_LENGTH",
        400,
        `invalid password length: (max-length): ${options.length.max}.`,
        "password",
      );
    }
    return value;
  }

  private static async hash(value: string): Promise<string> {
    return await argon2.hash(value, options.hash);
  }

  static async create(password: string): Promise<AccountPassword> {
    if (password == null) {
      throw new DomainException(
        "NON_NULLABLE_VALUE",
        400,
        "password can't be null.",
        "password",
      );
    }
    password = await this.hash(this.validate(password));
    return new AccountPassword({
      value: password,
    });
  }

  static async update(password?: string): Promise<AccountPassword> {
    if (password == null) {
      throw new DomainException(
        "NON_NULLABLE_VALUE",
        400,
        "password can't be null.",
        "password",
      );
    }
    password = await this.hash(this.validate(password));
    return new AccountPassword({
      value: password,
    });
  }

  static insert(password: string): AccountPassword {
    return new AccountPassword({
      value: password,
    });
  }
}

export { AccountPassword };
