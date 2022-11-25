let ctx = "";
let pos = 0;
let len = 0;
let results: (string | number | null)[] = [];

type NextHandle = () => NextHandle | null;

function array(): NextHandle | null {
  let isArray = true;
  for (let i = pos; i <= len; i++) {
    switch (ctx.charAt(i)) {
      case "":
        return null;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": {
        break;
      }
      case "]": {
        const token = ctx.slice(pos, i);
        pos = i + 1;
        if (token === "") {
          results.push(null);
        } else {
          results.push(isArray ? +token : token);
        }
        return arrayOrObject;
      }
      default: {
        isArray = false;
      }
    }
  }
  return null;
}

function arrayOrObject() {
  if (pos >= len) {
    return null;
  }
  if (ctx.charAt(pos) === "[") {
    pos++;
    return array;
  }
  if (ctx.charAt(pos) === ".") {
    pos++;
    return object;
  }
  throw new Error("syntax error");
}

function object(): NextHandle | null {
  for (let i = pos; i <= len; i++) {
    switch (ctx.charAt(i)) {
      case "[": {
        results.push(ctx.slice(pos, i));
        pos = i + 1;
        return array;
      }
      case ".": {
        if (pos !== i) {
          results.push(ctx.slice(pos, i));
        }
        pos = i + 1;
        return object;
      }
    }
  }
  if (pos < len) {
    results.push(ctx.slice(pos));
  }
  return null;
}

export function parseName(name: string): (string | number | null)[] {
  if (name === "") {
    return [""];
  }

  results = [];
  pos = 0;
  len = name.length;
  ctx = name;

  let next = object();
  while (next) {
    next = next();
  }

  return results;
}
