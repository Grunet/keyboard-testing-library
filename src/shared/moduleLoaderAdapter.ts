function importModuleAsync<T>(id: string): Promise<T> {
  return import(id);
}

//This is substituted in for the CJS build (as CJS doesn't support top-level await)
function importModuleSync<T>(id: string): T {
  return require(id);
}

export { importModuleAsync as importModuleDynamically };
