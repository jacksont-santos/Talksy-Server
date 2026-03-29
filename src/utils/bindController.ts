export const asyncHandler = (fn: any) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export function bindController(controller: any) {
  const instance = controller;

  Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
    .forEach((method) => {
      if (method !== "constructor") {
        instance[method] = asyncHandler(instance[method].bind(instance));
      }
    });

  return instance;
}