import { prettyDOM } from "./depsAdapter";

const displayDOM =
  (prettyDOM as (node: Element) => string) ||
  function (node: Element): string {
    return node.outerHTML;
  };

export { displayDOM };
