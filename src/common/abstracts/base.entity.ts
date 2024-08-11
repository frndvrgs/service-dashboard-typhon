interface Entity {
  [index: string]: any;
}

abstract class BaseEntity<T extends Entity> {
  readonly #id: string;
  protected readonly props: T;
  constructor(id: string, props: T) {
    this.#id = id;
    this.props = props;
  }

  public equals(object: BaseEntity<T>): boolean {
    return JSON.stringify(object.#id) === JSON.stringify(this.#id);
  }
}

export { BaseEntity };
