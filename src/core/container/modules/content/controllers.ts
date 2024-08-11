import { container } from "../../container.handler";

import {
  ProfileController,
  FeatureController,
} from "../../../../modules/content/controllers";

container.set([
  container.register(
    "profileController",
    () =>
      new ProfileController(
        container.get("listProfilesService"),
        container.get("readProfilesService"),
        container.get("createProfileService"),
        container.get("updateProfileService"),
        container.get("removeProfileService"),
        container.get("statusHandler"),
        container.get("contentValidationHandler"),
        container.get("sessionHandler"),
      ),
    "request",
  ),
  container.register(
    "featureController",
    () =>
      new FeatureController(
        container.get("listFeaturesService"),
        container.get("createFeatureService"),
        container.get("updateFeatureService"),
        container.get("removeFeatureService"),
        container.get("statusHandler"),
        container.get("contentValidationHandler"),
        container.get("sessionHandler"),
      ),
    "request",
  ),
]);
