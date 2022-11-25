import { parseName } from "./parse_name.ts";

export interface ReformData {
  [name: string]:
    | File
    | string
    | ReformData
    | NestedArray<File | string | ReformData>;
}

export interface NestedArray<T> extends Array<T | NestedArray<T>> {
}

export function reform<T extends ReformData = ReformData>(form: FormData): T {
  const reformed: ReformData = {};
  for (const [name, value] of form.entries()) {
    const keys = parseName(name); // always length > 1
    // deno-lint-ignore no-explicit-any
    let data: any = reformed;
    for (const [keyIndex, key] of keys.entries()) {
      if (keyIndex + 1 === keys.length) {
        if (typeof key === "string" || typeof key === "number") {
          data[key] = value;
        } else if (Array.isArray(data)) {
          data.push(value);
        } else {
          throw new Error("111");
        }
        break;
      }
      const nextKey = keys[keyIndex + 1];
      if (typeof key === "string" || typeof key === "number") {
        if (typeof nextKey === "string") {
          data[key] = data[key] ?? {};
          data = data[key];
        } else {
          data[key] = data[key] ?? [];
          data = data[key];
        }
      } else if (Array.isArray(data)) {
        if (typeof nextKey === "string") {
          const next: ReformData = {};
          data.push(next);
          data = next;
        } else {
          const next = [] as NestedArray<File | string | ReformData>;
          data.push(next);
          data = next;
        }
      } else {
        throw new Error("22");
      }
    }
  }
  return reformed as T;
}
