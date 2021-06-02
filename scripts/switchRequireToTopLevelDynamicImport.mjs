import { switchRequireToTopLevelDynamicImport } from "./shared/topLevelDynamicImportModsForCJS.mjs";

(async () => {
  await switchRequireToTopLevelDynamicImport();
})();
