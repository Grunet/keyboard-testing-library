import { switchTopLevelDynamicImportToRequire } from "./shared/topLevelDynamicImportModsForCJS.mjs";

(async () => {
  await switchTopLevelDynamicImportToRequire();
})();
