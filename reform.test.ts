import { assertEquals, assertInstanceOf } from "testing/asserts.ts";

import { reform } from "./reform.ts";

Deno.test("reform, empty FormData", () => {
  const form = new FormData();

  assertEquals(reform(form), {});
});

Deno.test("reform, plain FormData", () => {
  const form = new FormData();
  form.append("text", "plain text");
  form.append("blob1", new Blob());
  form.append("blob2", new Blob([], { type: "application/json" }), "data.json");
  form.append("file", new File([], "data.json", { type: "application/json" }));

  const reformed = reform(form);
  assertEquals(Object.keys(reformed), ["text", "blob1", "blob2", "file"]);
  assertEquals(reformed.text, "plain text");

  assertInstanceOf(reformed.blob1, File);
  assertInstanceOf(reformed.blob2, File);
  assertInstanceOf(reformed.file, File);
});

Deno.test("reform, plain array", () => {
  const form = new FormData();

  form.append("multiple[]", "1");
  form.append("multiple[]", "2");
  form.append("multiple[]", "3");
  form.append("multiple[]", "4");

  assertEquals(reform(form), { multiple: ["1", "2", "3", "4"] });
});

Deno.test("reform, n-depth array", () => {
  const form = new FormData();

  form.append("multiple[][]", "1");
  form.append("multiple[][]", "2");
  form.append("multiple[][]", "3");
  form.append("multiple[][]", "4");

  assertEquals(reform(form), { multiple: [["1"], ["2"], ["3"], ["4"]] });
});

Deno.test("reform, n-depth, indexed array", () => {
  const form = new FormData();

  form.append("multiple[0][]", "1");
  form.append("multiple[0][]", "2");
  form.append("multiple[1][]", "3");
  form.append("multiple[1][]", "4");

  assertEquals(reform(form), { multiple: [["1", "2"], ["3", "4"]] });
});

Deno.test("reform, object array", () => {
  const form = new FormData();

  form.append("users[1].name", "wan3land");
  form.append("users[0].id", "10");
  form.append("users[1][id]", "11");
  form.append("users[0][name]", "wan2land");

  assertEquals(reform(form), {
    users: [{ id: "10", name: "wan2land" }, { id: "11", name: "wan3land" }],
  });
});
