import jsonfile from "jsonfile";

jsonfile.writeFile("./dist/require/package.json", {
  type: "commonjs",
});
