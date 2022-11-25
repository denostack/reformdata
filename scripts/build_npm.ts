import { build, emptyDir } from "dnt/mod.ts";

const cmd = Deno.run({ cmd: ["git", "describe", "--tags"], stdout: "piped" });
const version = new TextDecoder().decode(await cmd.output()).trim();
cmd.close();

await emptyDir("./.npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./.npm",
  shims: {
    deno: false,
  },
  test: false,
  compilerOptions: {
    lib: ["es2021", "dom", "dom.iterable"],
  },
  package: {
    name: "reformdata",
    version,
    description: "Reform FormData to Object or Array format.",
    keywords: [
      "FormData",
      "JSON",
    ],
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/denostack/reformdata.git",
    },
    bugs: {
      url: "https://github.com/denostack/reformdata/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("README.md", ".npm/README.md");
