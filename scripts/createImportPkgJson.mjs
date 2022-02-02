import jsonfile from "jsonfile";

jsonfile.writeFile("./dist/import/package.json", {
  type: "module",
});
