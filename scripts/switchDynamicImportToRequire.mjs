import { replaceAdapter } from "./shared/replaceInFileAdapter.mjs";

(async function switchDynamicImportToRequire() {
  await replaceAdapter({
    files: "tmp/require/**/*.ts",
    from: /await import\(/g,
    to: "require(",
  });
})();
