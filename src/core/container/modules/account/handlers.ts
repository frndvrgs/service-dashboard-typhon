import { ValidationHandler } from "../../../../common/handlers";
import { container } from "../../container.handler";

import * as schemas from "../../../../modules/account/interface/v1/schemas/validation";

container.set([
  container.register(
    "accountValidationHandler",
    () => new ValidationHandler(schemas),
  ),
]);
