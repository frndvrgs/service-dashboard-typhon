import { BaseEntity } from "../../../../common/abstracts";
import { clearObjectNulls } from "../../../../common/helpers/clear-object-nulls";

import { Id, WorkName, WorkLevel } from "../value-objects";

interface Work {
  id: Id;
  idAccount: Id;
  idFeature: Id;
  createdAt: string;
  updatedAt: string;
  name: WorkName;
  level: WorkLevel;
  document: Record<string, unknown> | null;
}

export interface WorkModel {
  id: string;
  idAccount: string;
  idFeature: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  level: number;
  document: Record<string, unknown> | null;
}

interface WorkCreateProps {
  idAccount: string;
  idFeature: string;
  name: string;
  level: number;
  document: Record<string, unknown> | null;
}

interface WorkUpdateProps {
  name?: string;
  level?: number;
  document?: Record<string, unknown> | null;
}

class WorkEntity extends BaseEntity<Work> {
  private constructor(props: Work) {
    super(props.id.value, props);
  }

  public export(): WorkModel {
    return {
      id: this.props.id.value,
      idAccount: this.props.idAccount.value,
      idFeature: this.props.idFeature.value,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      name: this.props.name.value,
      level: this.props.level.value,
      document: clearObjectNulls(this.props.document),
    };
  }

  public update(input: WorkUpdateProps): void {
    input.name != null &&
      (this.props.name = WorkName.createOrUpdate(input.name));
    input.level != null &&
      (this.props.level = WorkLevel.createOrUpdate(input.level));
    input.document != null && (this.props.document = input.document);
    this.props.updatedAt = new Date().toISOString();
  }

  static import(resource: WorkModel): WorkEntity {
    return new WorkEntity({
      id: Id.insert(resource.id),
      idAccount: Id.insert(resource.idAccount),
      idFeature: Id.insert(resource.idFeature),
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
      name: WorkName.insert(resource.name),
      level: WorkLevel.insert(resource.level),
      document: resource.document,
    });
  }

  static create(input: WorkCreateProps): WorkEntity {
    return new WorkEntity({
      id: Id.create(),
      idAccount: Id.insert(input.idAccount),
      idFeature: Id.insert(input.idFeature),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: WorkName.createOrUpdate(input.name),
      level: WorkLevel.createOrUpdate(input.level),
      document: input.document,
    });
  }
}

export { WorkEntity };
