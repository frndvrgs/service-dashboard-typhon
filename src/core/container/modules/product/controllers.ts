import { container } from "../../container.handler";

import { WorkController } from "../../../../modules/product/controllers";

container.set([
  container.register(
    "workController",
    () =>
      new WorkController(
        container.get("listWorksService"),
        container.get("readWorkService"),
        container.get("createWorkService"),
        container.get("updateWorkService"),
        container.get("removeWorkService"),
        container.get("statusHandler"),
        container.get("productValidationHandler"),
        container.get("sessionHandler"),
      ),
    "request",
  ),
]);
