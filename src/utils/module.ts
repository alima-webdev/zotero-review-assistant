/**
 * Module Wrapper
 */
export function module(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
) {
    const original = descriptor.value;
    descriptor.value = function (...args: any) {
        try {
            ztoolkit.log(
                `Calling module ${target.name}.${String(propertyKey)}`,
            );
            return original.apply(this, args);
        } catch (e) {
            ztoolkit.log(
                `Error in module ${target.name}.${String(propertyKey)}`,
                e,
            );
            throw e;
        }
    };
    return descriptor;
}
