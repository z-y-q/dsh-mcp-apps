import { defineConfig } from 'tsdown'

// Browser bundle: CJS wrapped in the dsh module-table handoff. react stays
// external (the kernel's module table answers it); everything else inlines.
const client = {
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: ['cjs'],
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
  noExternal: (id) => (['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'].includes(id) ? undefined : true),
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: '@z-y-q/dsh-mcp-apps', factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
}

// Node half: plain ESM, the cordis peer stays external.
const node = {
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['esm'],
  platform: 'node',
  dts: false,
  clean: false,
  fixedExtension: false,
  external: ['@deepseek-ai/cordis'],
}

export default defineConfig([node, client])
