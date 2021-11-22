import path from 'path';
import fs from 'fs/promises';
import { build } from 'esbuild';
import rimraf from 'rimraf';
import http from 'http';
import serve from 'serve-handler';
import LessPlugin from '../packages/plugin-less/es';

function resolve(name: string) {
  return path.resolve(__dirname, `./${name}`);
}

(async () => {
  await rimraf.sync(resolve('dist'));

  await build({
    entryPoints: [resolve('page/index.tsx')],
    outfile: resolve('dist/bundle.js'),
    bundle: true,
    format: 'cjs',
    minify: false,
    plugins: [
      LessPlugin({
        javascriptEnabled: true,
      }),
    ],
  });

  await fs.copyFile(resolve('public/index.html'), resolve('dist/index.html'));

  const server = http.createServer((req, res) => {
    return serve(req, res, { public: resolve('dist') });
  });

  server.listen(3000, () => {
    console.log('test server has been started at http://localhost:3000');
  });
})();
