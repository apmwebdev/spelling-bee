export * from "./debouncer";
export * from "./persister";

export const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

interface AnyObject {
  [key: string | number | symbol]: any;
}

const isPlainObject = (thing: any) => thing?.constructor === Object;

export const keysToSnakeCase = (obj?: AnyObject) => {
  if (obj === undefined) return obj;
  const newObject: AnyObject = {};
  for (const key in obj) {
    const newKey = toSnakeCase(key);
    newObject[newKey] = isPlainObject(obj[key])
      ? keysToSnakeCase(obj[key])
      : obj[key];
  }
  return newObject;
};
