import fs from 'fs/promises';
import path from 'path';
import { PluginBuild } from 'esbuild';
import modules from 'postcss-modules';
import postcss from 'postcss';

function getModules(obj: any) {
  return modules({
    generateScopedName: '[local]_[hash:base64:5]',
    getJSON: (cssFilename: string, json: Record<string, string>) => {
      for (const key in json) {
        obj[key] = json[key];
      }
    },
  });
}

function CssModulesPlugin(options: Less.Options) {
  const json = {};

  return {
    name: 'plugin-css-modules',
    setup: (build: PluginBuild) => {
      build.onLoad(
        {
          filter: /\.module.css$/,
          namespace: 'file',
        },
        async (args) => {
          const file = await fs.readFile(args.path, { encoding: 'utf-8' });
          const info = path.parse(args.path);

          const res = await postcss([getModules(json)]).process(file, {
            from: args.path,
          });

          const outfilepath = info.dir + '/style.css';

          await fs.writeFile(outfilepath, res.css, { encoding: 'utf-8' });

          const contents = `import '${outfilepath}';const styles = ${JSON.stringify(
            json,
          )}; export default styles;`;

          return {
            contents,
            loader: 'js',
          };

          // return {
          //   contents: res.css,
          //   loader: 'css',
          // };
        },
      );
    },
  };
}

export default CssModulesPlugin;
