type LoadedValue = {
  saved: string;
  parsed: any;
};

const save = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.log(`Couldn't persist ${key} with ${value} to localStorage:`, err);
    return false;
  }
};

const load = (key: string) => {
  const storedItem = localStorage.getItem(key);
  if (storedItem) {
    try {
      const loadedVal: LoadedValue = {
        saved: storedItem,
        parsed: JSON.parse(storedItem),
      };
      return loadedVal;
    } catch (err) {
      console.error(`Couldn't parse localStorage item '${key}':`, err);
    }
  }
  return null;
};

export const persister = { save, load };
