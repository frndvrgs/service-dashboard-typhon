import { ValidationHandler } from "../../../../common/handlers";
import { container } from "../../container.handler";

import * as schemas from "../../../../modules/product/interface/v1/schemas/validation";

container.set([
  container.register(
    "productValidationHandler",
    () => new ValidationHandler(schemas),
  ),
]);
