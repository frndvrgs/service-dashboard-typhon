import { settings } from "../../../../core/settings";
import { container } from "../../container.handler";

import { workMapper } from "../../../../modules/product/mappers";
import { WorkRepository } from "../../../../modules/product/repositories";

const {
  database: { product: productDatabase },
} = settings;

container.set([
  container.register(
    "workRepository",
    () =>
      new WorkRepository(
        workMapper,
        productDatabase.databaseModuleName,
        productDatabase.schemas,
        productDatabase.tables.work.name,
        productDatabase.tables.work.columnConstraints,
      ),
  ),
]);
