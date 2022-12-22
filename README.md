# reformdata (re:FormData)

<a href="https://github.com/denostack"><img src="https://raw.githubusercontent.com/denostack/images/main/logo.svg" width="240" /></a>

<p>
  <a href="https://github.com/denostack/reformdata/actions"><img alt="Build" src="https://img.shields.io/github/workflow/status/denostack/reformdata/CI?logo=github&style=flat-square" /></a>
  <a href="https://codecov.io/gh/denostack/reformdata"><img alt="Coverage" src="https://img.shields.io/codecov/c/gh/denostack/reformdata?style=flat-square" /></a>
  <a href="https://npmcharts.com/compare/reformdata?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/reformdata.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/reformdata"><img alt="Version" src="https://img.shields.io/npm/v/reformdata.svg?style=flat-square" /></a>
  <a href="https://deno.land/x/reformdata"><img alt="deno.land/x/reformdata" src="https://img.shields.io/github/v/release/denostack/reformdata?display_name=tag&label=deno.land/x/reformdata@&style=flat-square&logo=deno&labelColor=000&color=777" /></a>
  <a href="https://www.npmjs.com/package/reformdata"><img alt="License" src="https://img.shields.io/npm/l/reformdata.svg?style=flat-square" /></a>
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
</p>

Reform FormData.

## Usage

### with Deno

```ts
import { reform } from "https://deno.land/x/reformdata/mod.ts";

const form = new FormData();

form.append("multiple[]", "1");
form.append("multiple[]", "2");
form.append("multiple[]", "3");
form.append("multiple[]", "4");

reform(form); // { multiple: ["1", "2", "3", "4"] }
```

### with Node.js & Browser

**Install**

```bash
npm install reformdata
```

```ts
import { reform } from "reformdata";

// Usage is as above :-)
```

### Support File or Blob

```ts
const form = new FormData();
form.append("text", "plain text");
form.append("blob1", new Blob());
form.append("blob2", new Blob([], { type: "application/json" }), "data.json");
form.append("file", new File([], "data.json", { type: "application/json" }));

reform(form);
/*
{
  text: "plain text",
  blob1: File
  blob2: File
  file: File
}
*/
```

### Array

```ts
const form = new FormData();

form.append("multiple[]", "1");
form.append("multiple[]", "2");
form.append("multiple[]", "3");
form.append("multiple[]", "4");

reform(form); // { multiple: ["1", "2", "3", "4"] }
```

### n-depth Array

```ts
const form = new FormData();

form.append("multiple[0][]", "1");
form.append("multiple[0][]", "2");
form.append("multiple[1][]", "3");
form.append("multiple[1][]", "4");

reform(form), // { multiple: [["1", "2"], ["3", "4"]] }
```

### Object

```ts
const form = new FormData();

// dot notation
form.append("users[1].name", "wan3land");
form.append("users[0].id", "10");

// bracket notation
form.append("users[1][id]", "11");
form.append("users[0][name]", "wan2land");

reform(form);
/*
{
  users: [
    { id: "10", name: "wan2land" },
    { id: "11", name: "wan3land" },
  ],
}
*/
```

## Example with Deno

```ts
import { serve } from "https://deno.land/std@0.161.0/http/server.ts";
import reform from "https://deno.land/x/reformdata/mod.ts";

serve(async (request) => {
  if (request.method === "POST") {
    const formData = reform(await request.formData());

    // do something
  }

  return new Response(":D");
});
```
