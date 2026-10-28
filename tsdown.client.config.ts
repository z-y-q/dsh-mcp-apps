import { defineConfig } from 'tsdown'

// Browser bundle: CJS wrapped in the dsh module-table handoff. react stays
// external (the kernel's module table answers it); everything else inlines,
// including the hand-maintained Typert Remote contribution imported from src.
// Runs SECOND (see package.json build script): order matters only for log
// readability — the contribution is imported from src, not lib.
export default defineConfig({
  entry: { client: 'src/client/index.ts' },
  outDir: 'lib',
  format: ['cjs'],
  platform: 'browser',
  dts: false,
  sourcemap: true,
  clean: false,
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
  noExternal: (id: string) => (['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'].includes(id) ? undefined : true),
  outputOptions: {
    entryFileNames: 'client.js',
    banner: `window.__ModuleLoader__.load({ id: '@z-y-q/dsh-mcp-apps', factory: (require) => {`,
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
})
