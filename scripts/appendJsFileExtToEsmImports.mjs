import { replaceAdapter } from "./shared/replaceInFileAdapter.mjs";

(async () => {
  await replaceAdapter({
    files: "dist/**/*.js",
    from: /import {.*} from ".*";/g,
    to: (match) => {
      if (!match.includes(".js")) {
        const endOfImportStatement = match.indexOf('";');

        return (
          match.slice(0, endOfImportStatement) +
          ".js" +
          match.slice(endOfImportStatement)
        );
      } else {
        return match;
      }
    },
  });
})();
