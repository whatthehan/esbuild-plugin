import path from 'path';
import fs from 'fs/promises';
import { PluginBuild } from 'esbuild';
import postcss from 'postcss';
import less from 'less';
import modules from 'postcss-modules';

export interface PostCSSPluginOptions {
  plugins?: any[];
  less?: Less.Options;
  modules?: any;
}

const modulesExported = {};

function getPlugins(options: PostCSSPluginOptions, info: path.ParsedPath) {
  const { plugins = [] } = options;
  if (options.modules.autoModules && /\.module\.[a-z]{2,6}$/.test(info.base)) {
    return [
      ...plugins,
      modules({
        generateScopedName: '[name]_[local]_[hash:base64:5]',
        getJSON(filepath, json, outpath) {
          Object.assign(modulesExported, json);

          if (
            typeof options.modules === 'object' &&
            typeof options.modules.getJSON === 'function'
          ) {
            return options.modules.getJSON(filepath, json, outpath);
          }
        },
        ...options.modules,
      }),
    ];
  }

  if (plugins.length === 0) {
    return [
      ...plugins,
      {
        postcssPlugin: 'postcss-noop-plugin',
        Once: () => {},
      },
    ];
  }

  return plugins;
}

function PostCSSPlugin(options: PostCSSPluginOptions) {
  const { less: lessOptions = {} } = options;

  if (!options.modules) {
    options.modules = {
      autoModules: true,
    };
  }

  return {
    name: 'plugin-postcss',
    setup: (build: PluginBuild) => {
      build.onLoad(
        {
          filter: /\.(css|less)$/,
          namespace: 'file',
        },
        async (args) => {
          const info = path.parse(args.path);
          let css = await fs.readFile(args.path, { encoding: 'utf-8' });

          if (info.ext === '.less') {
            css = await less
              .render(css, {
                ...options.less,
                filename: info.name,
                paths: [...(lessOptions.paths || []), info.dir],
                rootpath: info.dir,
              })
              .then((res) => res.css);
          }

          const plugins = getPlugins(options, info);

          css = await postcss(plugins)
            .process(css, { from: undefined })
            .then((res) => res.css);

          if (info.base.includes('module')) {
            console.log(modulesExported);
          }

          return {
            contents: css,
            loader: 'css',
          };
        },
      );
    },
  };
}

export default PostCSSPlugin;
