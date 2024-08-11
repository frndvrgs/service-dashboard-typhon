import { container } from "../../container.handler";

import { workMapper } from "../../../../modules/product/mappers";
import { ListService, ReadService } from "../../../../common/services";
import {
  CreateWorkService,
  UpdateWorkService,
  RemoveWorkService,
} from "../../../../modules/product/services";

container.set([
  container.register(
    "listWorksService",
    () => new ListService(container.get("workRepository")),
  ),
  container.register(
    "readWorkService",
    () => new ReadService(container.get("workRepository")),
  ),
  container.register(
    "createWorkService",
    () =>
      new CreateWorkService(
        {
          account: container.get("accountRepository"),
          subscription: container.get("subscriptionRepository"),
          feature: container.get("featureRepository"),
          work: container.get("workRepository"),
        },
        workMapper,
      ),
  ),
  container.register(
    "updateWorkService",
    () =>
      new UpdateWorkService(
        {
          account: container.get("accountRepository"),
          feature: container.get("featureRepository"),
          work: container.get("workRepository"),
        },
        workMapper,
      ),
  ),
  container.register(
    "removeWorkService",
    () => new RemoveWorkService(container.get("workRepository")),
  ),
]);
