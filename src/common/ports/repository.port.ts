export interface RepositoryPort<
  Filter,
  Order,
  Select,
  ViewModel,
  EntityModel,
  DataModel,
> {
  list(filter?: Filter, order?: Order): Promise<ViewModel[] | null>;
  read(select: Select | Select[]): Promise<ViewModel | null>;
  select(select: Select | Select[]): Promise<DataModel | null>;
  exists(select: Select): Promise<boolean>;
  create(entity: EntityModel): Promise<DataModel | null>;
  update(select: Select, entity: EntityModel): Promise<DataModel | null>;
  remove(select: Select): Promise<boolean>;
  beginTransaction(): Promise<void>;
  beginIsolatedTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;
}
