import { replaceAdapter } from "./replaceInFileAdapter.mjs";

async function switchTopLevelDynamicImportToRequire() {
  await replaceAdapter({
    files: "tmp/require/**/*.ts",
    from: /await importModuleDynamically\(/g,
    to: "importModuleDynamically(",
  });

  await replaceAdapter({
    files: "tmp/require/**/moduleLoaderAdapter.ts",
    from: "importModuleAsync as",
    to: "importModuleSync as",
  });
}

export { switchTopLevelDynamicImportToRequire };
