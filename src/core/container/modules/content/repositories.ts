import { settings } from "../../../../core/settings";
import { container } from "../../container.handler";

import {
  profileMapper,
  featureMapper,
} from "../../../../modules/content/mappers";
import {
  ProfileRepository,
  FeatureRepository,
} from "../../../../modules/content/repositories";

const {
  database: { content: contentDatabase },
} = settings;

container.set([
  container.register(
    "profileRepository",
    () =>
      new ProfileRepository(
        profileMapper,
        contentDatabase.databaseModuleName,
        contentDatabase.schemas,
        contentDatabase.tables.profile.name,
        contentDatabase.tables.profile.columnConstraints,
      ),
  ),
  container.register(
    "featureRepository",
    () =>
      new FeatureRepository(
        featureMapper,
        contentDatabase.databaseModuleName,
        contentDatabase.schemas,
        contentDatabase.tables.feature.name,
        contentDatabase.tables.feature.columnConstraints,
      ),
  ),
]);
