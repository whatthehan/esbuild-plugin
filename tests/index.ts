import path from 'path';
import fs from 'fs/promises';
import { build } from 'esbuild';
import rimraf from 'rimraf';
import http from 'http';
import serve from 'serve-handler';
// import LessPlugin from '../packages/plugin-less/es';
// import GlobalsPlugin from '../packages/plugin-globals/es';
import PostCSSPlugin from '../packages/plugin-postcss/src';
import CssModulesPlugin from '../packages/plugin-css-modules/src';

function resolve(name: string) {
  return path.resolve(__dirname, `./${name}`);
}

(async () => {
  console.log('remove dist directory');
  await rimraf.sync(resolve('dist'));

  console.log('start bundle with esbuild');
  await build({
    entryPoints: [resolve('page/index.tsx')],
    outfile: resolve('dist/bundle.js'),
    bundle: true,
    format: 'cjs',
    minify: false,
    // external: ['react', 'react-dom', 'antd'],
    plugins: [
      CssModulesPlugin({}),
      PostCSSPlugin({
        less: {
          javascriptEnabled: true,
        },
      }),
      // LessPlugin({
      //   javascriptEnabled: true,
      // }),
      // GlobalsPlugin({
      //   react: 'React',
      //   'react-dom': 'ReactDOM',
      //   antd: 'antd',
      // }),
    ],
  });
  console.log('bundle success');

  await fs.copyFile(resolve('public/index.html'), resolve('dist/index.html'));

  console.log('start test server...');
  const server = http.createServer((req, res) => {
    return serve(req, res, { public: resolve('dist') });
  });

  server.listen(3000, () => {
    console.log('test server has been started at http://localhost:3000');
  });
})();
