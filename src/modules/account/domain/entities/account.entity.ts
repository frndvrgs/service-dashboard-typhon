import { Id, AccountEmail, AccountPassword } from "../value-objects";
import { BaseEntity } from "../../../../common/abstracts";
import { clearObjectNulls } from "../../../../common/helpers/clear-object-nulls";

interface Account {
  id: Id;
  createdAt: string;
  updatedAt: string;
  email: AccountEmail;
  password: AccountPassword;
  scope: string;
  document: Record<string, unknown> | null;
}

export interface AccountModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  password: string;
  scope: string;
  document: Record<string, unknown> | null;
}

interface AccountCreateProps {
  email: string;
  password: string;
  document?: Record<string, unknown> | null;
}

interface AccountUpdateProps {
  email?: string;
  password?: string;
  document?: Record<string, unknown> | null;
}

class AccountEntity extends BaseEntity<Account> {
  private constructor(props: Account) {
    super(props.id.value, props);
  }
  public export(): AccountModel {
    return {
      id: this.props.id.value,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      email: this.props.email.value,
      password: this.props.password?.value,
      scope: this.props.scope,
      document: clearObjectNulls(this.props.document),
    };
  }
  public async update(input: AccountUpdateProps): Promise<void> {
    input.email != null &&
      (this.props.email = AccountEmail.createOrUpdate(input.email));
    input.password != null &&
      (this.props.password = await AccountPassword.create(input.password));
    input.document != null && (this.props.document = input.document);
    this.props.updatedAt = new Date().toISOString();
  }

  static import(resource: AccountModel): AccountEntity {
    return new AccountEntity({
      id: Id.insert(resource.id),
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
      email: AccountEmail.createOrUpdate(resource.email),
      password: AccountPassword.insert(resource.password),
      scope: resource.scope,
      document: resource.document,
    });
  }
  static async create(input: AccountCreateProps): Promise<AccountEntity> {
    return new AccountEntity({
      id: Id.create(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: AccountEmail.createOrUpdate(input.email),
      password: await AccountPassword.create(input.password),
      scope: "user",
      document: input.document ?? null,
    });
  }
}

export { AccountEntity };
