import validator from "validator";

import { DomainException } from "../../../../common/exceptions";
import { BaseValueObject } from "../../../../common/abstracts";
import { Id } from "./id";

class Ids extends BaseValueObject<{ value: string[] | null }> {
  private constructor(props: { value: string[] | null }) {
    super(props);
  }

  get value(): string[] | null {
    return this.props.value;
  }

  private static validate(value: string[]): string[] | null {
    if (!Array.isArray(value)) {
      throw new DomainException(
        "INVALID_VALUE_FORMAT",
        400,
        "value is not array.",
        value,
      );
    }
    if (value.length === 0) return null;
    value = [...new Set(value)];
    value = value.map((item) => {
      item = item.trim();
      if (validator.isUUID(item, 4)) {
        return item;
      } else {
        throw new DomainException(
          "INVALID_VALUE_FORMAT",
          400,
          "value on array is not a valid UUID.",
          item,
        );
      }
    });
    return value;
  }

  static insert(ids: string[] | null | undefined): Ids {
    if (ids != null) ids = this.validate(ids);
    return new Ids({
      value: ids ? ids.map((id) => Id.insert(id).value) : null,
    });
  }
}

export { Ids };
