import { DomainException } from "../../../../../common/exceptions";
import { BaseValueObject } from "../../../../../common/abstracts";

interface Level {
  value: number;
}

class WorkLevel extends BaseValueObject<Level> {
  private constructor(props: Level) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  static createOrUpdate(level: number): WorkLevel {
    if (level < 0) {
      throw new DomainException(
        "INVALID_VALUE",
        400,
        "work level cant be negative.",
        "level",
      );
    }
    return new WorkLevel({ value: level });
  }

  static insert(level: number): WorkLevel {
    return new WorkLevel({
      value: level,
    });
  }
}

export { WorkLevel };
