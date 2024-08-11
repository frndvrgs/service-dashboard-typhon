import { ValidationHandler } from "../../../../common/handlers";
import { container } from "../../container.handler";

import * as schemas from "../../../../modules/content/interface/v1/schemas/validation";

container.set([
  container.register(
    "contentValidationHandler",
    () => new ValidationHandler(schemas),
  ),
]);
