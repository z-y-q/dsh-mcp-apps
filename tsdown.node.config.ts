import { defineConfig } from 'tsdown'
import ts from 'typescript'

// Lower standard decorators (@Remote) with a tiny local transform — the same
// ts.transpileModule lowering the official typertPlugin performs. The Typert
// artifacts themselves are hand-maintained (see src/*.manual.js), because the
// generator's package mode only recognizes workspace-internal packages while
// this plugin consumes the protocol from npm.
function decoratorLowering() {
  const DECORATOR_SYNTAX = /^\s*@[A-Za-z_$][\w$]*/m
  return {
    name: 'lower-decorators',
    transform(code, id) {
      const file = id.split('?', 1)[0] ?? id
      if (!/\.[cm]?tsx?$/.test(file) || !DECORATOR_SYNTAX.test(code)) return
      const result = ts.transpileModule(code, {
        fileName: file,
        compilerOptions: {
          target: ts.ScriptTarget.ES2024,
          module: ts.ModuleKind.ESNext,
          sourceMap: true,
        },
      })
      return {
        code: result.outputText.replace(/\n?\/\/# sourceMappingURL=.*$/u, '\n'),
        map: result.sourceMapText,
      }
    },
  }
}

// Node half: plain ESM. cordis and the Typert protocol stay external (the
// host's copies must answer, otherwise Service/binding identity splits).
// onSuccess copies the hand-maintained artifacts into lib/ as the published
// ./typert and ./remote exports.
export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  dts: false,
  clean: false,
  fixedExtension: false,
  plugins: [decoratorLowering()],
  external: ['@deepseek-ai/cordis', '@deepseek-ai/dsh-typert-protocol'],
  onSuccess: async () => {
    const { copyFileSync, writeFileSync } = await import('node:fs')
    copyFileSync('src/typert.host.manual.js', 'lib/typert.host.js')
    copyFileSync('src/typert.remote-client.manual.js', 'lib/typert.remote-client.js')
    // Minimal declaration stubs so the exports map resolves for type consumers
    // (the generator's own d.ts also exposes TYPERT as unknown).
    writeFileSync('lib/typert.host.d.ts', 'export declare const TYPERT: unknown\n')
    writeFileSync('lib/typert.remote-client.d.ts', 'export declare const TYPERT_REMOTE: unknown\nexport default TYPERT_REMOTE\n')
  },
})
