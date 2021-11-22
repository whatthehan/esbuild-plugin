import fs from 'fs/promises';
import path from 'path';
import less from 'less';
import { PluginBuild } from 'esbuild';

function LessPlugin(options: Less.Options) {
  return {
    name: 'plugin-less',
    setup: (build: PluginBuild) => {
      build.onLoad(
        {
          filter: /\.less$/,
          namespace: 'file',
        },
        async (args) => {
          const file = await fs.readFile(args.path, { encoding: 'utf-8' });
          const info = path.parse(args.path);

          const res = await less.render(file, {
            ...options,
            filename: info.name,
            paths: [...(options.paths || []), info.dir],
            rootpath: info.dir,
          });

          return {
            contents: res.css,
            loader: 'css',
          };
        },
      );
    },
  };
}

export default LessPlugin;
