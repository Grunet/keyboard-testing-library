(async function () {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
  return require("jsonfile").writeFile("./dist/require/package.json", {
    type: "commonjs",
  });
})();
