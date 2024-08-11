import { BaseEntity } from "../../../../common/abstracts";
import { clearObjectNulls } from "../../../../common/helpers/clear-object-nulls";

import { Id, ProfileUsername, ProfileName } from "../value-objects";

interface Profile {
  id: Id;
  idAccount: Id;
  createdAt: string;
  updatedAt: string;
  username: ProfileUsername;
  name: ProfileName;
  document: Record<string, unknown> | null;
}

export interface ProfileModel {
  id: string;
  idAccount: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  name: string | null;
  document: Record<string, unknown> | null;
}

interface ProfileCreateProps {
  idAccount: string;
  username: string;
  name?: string | null;
  document?: Record<string, unknown> | null;
}

interface ProfileUpdateProps {
  username?: string;
  name?: string | null;
  document?: Record<string, unknown> | null;
}

class ProfileEntity extends BaseEntity<Profile> {
  private constructor(props: Profile) {
    super(props.id.value, props);
  }

  public export(): ProfileModel {
    return {
      id: this.props.id.value,
      idAccount: this.props.idAccount.value,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      username: this.props.username.value,
      name: this.props.name.value,
      document: clearObjectNulls(this.props.document),
    };
  }

  public update(input: ProfileUpdateProps): void {
    input.username != null &&
      (this.props.username = ProfileUsername.createOrUpdate(input.username));
    input.name != null &&
      (this.props.name = ProfileName.createOrUpdate(input.name));
    input.document != null && (this.props.document = input.document);
    this.props.updatedAt = new Date().toISOString();
  }

  static import(resource: ProfileModel): ProfileEntity {
    return new ProfileEntity({
      id: Id.insert(resource.id),
      idAccount: Id.insert(resource.idAccount),
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
      username: ProfileUsername.insert(resource.username),
      name: ProfileName.insert(resource.name),
      document: resource.document,
    });
  }

  static create(input: ProfileCreateProps): ProfileEntity {
    return new ProfileEntity({
      id: Id.create(),
      idAccount: Id.insert(input.idAccount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      username: ProfileUsername.createOrUpdate(input.username),
      name: ProfileName.createOrUpdate(input.name),
      document: input.document ?? null,
    });
  }
}

export { ProfileEntity };
