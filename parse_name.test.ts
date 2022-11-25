import { assertEquals } from "testing/asserts.ts";

import { parseName } from "./parse_name.ts";

Deno.test("parseName, single", () => {
  assertEquals(parseName(""), [""]); // empty

  assertEquals(parseName("hello"), ["hello"]);

  assertEquals(parseName("hello]..."), ["hello]"]); // warning
});

Deno.test("parseName, array", () => {
  assertEquals(parseName("[]"), ["", null]); // warning

  assertEquals(parseName("hello[1]"), ["hello", 1]);

  assertEquals(parseName("hello[]"), ["hello", null]);

  assertEquals(parseName("hello[1][2][3]"), ["hello", 1, 2, 3]);
  assertEquals(parseName("hello[world][foo][bar]"), [
    "hello",
    "world",
    "foo",
    "bar",
  ]);

  assertEquals(parseName("hello[world][3][foo][2][bar]"), [
    "hello",
    "world",
    3,
    "foo",
    2,
    "bar",
  ]);
});

Deno.test("parseName, object", () => {
  assertEquals(parseName("hello.foo"), ["hello", "foo"]);
  assertEquals(parseName("hello.foo.bar"), ["hello", "foo", "bar"]);
});

Deno.test("parseName, complex", () => {
  assertEquals(parseName("hello[].foo"), ["hello", null, "foo"]);
  assertEquals(parseName("hello.foo.bar"), ["hello", "foo", "bar"]);
});
