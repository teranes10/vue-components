export async function getModule(moduleName: string, globalName?: string) {
  let module

  try {
    module = (await import(/* @vite-ignore */moduleName))
  }
  catch (e) {
    if (globalName) {
      module = (window as any)[globalName]
    }
    else {
      console.error(e)
    }
  }

  if (!module) {
    throw new Error(`${moduleName} module not found.`)
  }

  return module
}
