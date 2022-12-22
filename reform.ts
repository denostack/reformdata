import { parseName } from "./parse_name.ts";

function isPlainObject(value: unknown): value is ReformData {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export interface ReformData {
  [name: string]: ReformDataValue;
}

export type ReformDataValue =
  | File
  | string
  | ReformData
  | (ReformDataValue | null)[];

export function reform<T extends ReformData = ReformData>(form: FormData): T {
  const reformed: ReformData = {};
  for (const [name, value] of form.entries()) {
    const keys = parseName(name); // always length > 1
    // deno-lint-ignore no-explicit-any
    let data: any = reformed;
    for (const [keyIndex, key] of keys.entries()) {
      if (keyIndex + 1 === keys.length) {
        if (typeof key === "string") {
          data[key] = value;
        } else if (typeof key === "number") {
          data[key] = value;
          // fill sparse
          for (let i = 0; i < key; i++) {
            if (!(i in data)) {
              data[i] = null;
            }
          }
        } else {
          data.push(value);
        }
        break;
      }
      const nextKey = keys[keyIndex + 1];
      if (typeof key === "string" || typeof key === "number") {
        if (typeof nextKey === "string") {
          data[key] = isPlainObject(data[key]) ? data[key] : {};
          data = data[key];
        } else {
          data[key] = Array.isArray(data[key]) ? data[key] : [];
          data = data[key];
        }
      } else if (Array.isArray(data)) {
        if (typeof nextKey === "string") {
          const next: ReformData = {};
          data.push(next);
          data = next;
        } else {
          const next = [] as ReformDataValue[];
          data.push(next);
          data = next;
        }
      }
    }
  }
  return reformed as T;
}
