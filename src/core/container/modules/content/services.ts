import { container } from "../../container.handler";

import {
  profileMapper,
  featureMapper,
} from "../../../../modules/content/mappers";
import { ListService, ReadService } from "../../../../common/services";
import {
  CreateProfileService,
  UpdateProfileService,
  RemoveProfileService,
  CreateFeatureService,
  UpdateFeatureService,
  RemoveFeatureService,
} from "../../../../modules/content/services";

container.set([
  // ----------------------------------------------------------------
  // Profile
  container.register(
    "listProfilesService",
    () => new ListService(container.get("profileRepository")),
  ),
  container.register(
    "readProfilesService",
    () => new ReadService(container.get("profileRepository")),
  ),
  container.register(
    "createProfileService",
    () =>
      new CreateProfileService(
        {
          account: container.get("accountRepository"),
          profile: container.get("profileRepository"),
        },
        profileMapper,
      ),
  ),
  container.register(
    "updateProfileService",
    () =>
      new UpdateProfileService(
        container.get("profileRepository"),
        profileMapper,
      ),
  ),
  container.register(
    "removeProfileService",
    () => new RemoveProfileService(container.get("profileRepository")),
  ),
  // ----------------------------------------------------------------
  // Feature
  container.register(
    "listFeaturesService",
    () => new ListService(container.get("featureRepository")),
  ),
  container.register(
    "createFeatureService",
    () =>
      new CreateFeatureService(
        container.get("featureRepository"),
        featureMapper,
      ),
  ),
  container.register(
    "updateFeatureService",
    () =>
      new UpdateFeatureService(
        container.get("featureRepository"),
        featureMapper,
      ),
  ),
  container.register(
    "removeFeatureService",
    () => new RemoveFeatureService(container.get("featureRepository")),
  ),
]);
