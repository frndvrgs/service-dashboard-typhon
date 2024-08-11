import { v4 as uuidv4 } from "uuid";
import validator from "validator";

import { DomainException } from "../../../../common/exceptions";
import { BaseValueObject } from "../../../../common/abstracts";

class Id extends BaseValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static validate(value: string): string {
    if (validator.isUUID(value, 4)) {
      return value;
    } else {
      throw new DomainException(
        "INVALID_VALUE_FORMAT",
        400,
        "value on array is not a valid UUID.",
        value,
      );
    }
  }

  static create(): Id {
    return new Id({
      value: uuidv4(),
    });
  }

  static insert(id: string): Id {
    this.validate(id);
    return new Id({
      value: id,
    });
  }
}

export { Id };
