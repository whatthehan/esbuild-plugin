import { PluginBuild } from 'esbuild';

export interface GlobalsOptions {
  [key: string]: string;
}

function GlobalsPlugin(options: GlobalsOptions) {
  return {
    name: 'plugin-globals',
    setup: (build: PluginBuild) => {
      const regexp = Object.keys(options)
        .map((key) => `^${key}$`)
        .join('|');

      build.onLoad(
        {
          filter: new RegExp(regexp),
          namespace: 'file',
        },
        (args) => {
          const value = options[args.path];
          if (!value) {
            throw new Error(`unknow global config key: ${args.path}`);
          }

          return {
            contents: `export default window['${value}']`,
            loader: 'js',
          };
        },
      );
    },
  };
}

export default GlobalsPlugin;
