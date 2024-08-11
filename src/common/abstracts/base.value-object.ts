interface ValueObject {
  [index: string]: any;
}

abstract class BaseValueObject<T extends ValueObject> {
  protected readonly props: T;
  constructor(props: T) {
    this.props = props;
  }

  public equals(object: BaseValueObject<T>): boolean {
    return JSON.stringify(object.props) === JSON.stringify(this.props);
  }
}

export { BaseValueObject };
