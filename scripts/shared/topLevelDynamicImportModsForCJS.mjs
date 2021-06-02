import replace from "replace-in-file";

async function replaceAdapter(options) {
  try {
    const results = await replace(options);
    console.log("Replacement results:", results);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

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
