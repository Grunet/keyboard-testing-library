import { replaceAdapter } from "./replaceInFileAdapter.mjs";

async function switchTopLevelDynamicImportToRequire() {
  await replaceAdapter({
    files: "src/**/*.ts",
    from: /await importModuleDynamically\(/g,
    to: "importModuleDynamically(",
  });

  await replaceAdapter({
    files: "src/**/moduleLoaderAdapter.ts",
    from: "importModuleAsync as",
    to: "importModuleSync as",
  });
}

async function switchRequireToTopLevelDynamicImport() {
  await replaceAdapter({
    files: "src/**/*.ts",
    from: /importModuleDynamically\(/g,
    to: "await importModuleDynamically(",
  });

  await replaceAdapter({
    files: "src/**/moduleLoaderAdapter.ts",
    from: "importModuleSync as",
    to: "importModuleAsync as",
  });
}

export {
  switchTopLevelDynamicImportToRequire,
  switchRequireToTopLevelDynamicImport,
};
