import replace from "replace-in-file";

async function replaceAdapter(options) {
  try {
    const results = await replace(options);
    console.log("Replacement results:", results);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

export { replaceAdapter };
