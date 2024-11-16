export async function getModule(moduleName: string, globalName?: string) {
    let module

    try {
        module = (await import(moduleName))
    } catch (error) {
        if (globalName) {
            module = (window as any)[globalName];
        }
    }

    if (!module) {
        throw new Error(`${moduleName} module not found.`)
    }

    return module;
}
