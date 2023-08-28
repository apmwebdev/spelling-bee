export const toSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

interface AnyObject {
  [key: string | number | symbol]: any;
}

const isPlainObject = (thing: any) => thing?.constructor === Object;

export const keysToSnakeCase = (obj: AnyObject) => {
  const newObject: AnyObject = {};
  for (const key in obj) {
    const newKey = toSnakeCase(key);
    newObject[newKey] = isPlainObject(obj[key])
      ? keysToSnakeCase(obj[key])
      : obj[key];
  }
  console.log(newObject);
  return newObject;
};
