import fs from 'fs/promises';
import path from 'path';
import ts from 'typescript';
import esbuild from 'esbuild';
import rimraf from 'rimraf';

async function getPackageDeps(dir: string) {
  const file = await fs.readFile(`${dir}/package.json`, { encoding: 'utf-8' });
  const pkg = JSON.parse(file);

  return Object.keys({
    ...pkg.devDependencies,
    ...pkg.dependencies,
    ...pkg.peerDependencies,
  });
}

async function build(dir: string, target: 'esm' | 'cjs', deps: string[]) {
  console.log(`start build ${target} with esbuild...`);

  const outDir = target === 'esm' ? 'es' : 'lib';

  await esbuild.build({
    entryPoints: [`${dir}/src/index.ts`],
    outfile: `${dir}/${outDir}/index.js`,
    platform: 'node',
    target: 'node14',
    format: target,
    external: deps,
    bundle: true,
  });
  console.log(`build ${target} success`);
}

async function main() {
  const dirs = await fs.readdir('packages');
  for (const item of dirs) {
    if (item !== 'plugin-less') {
      continue;
    }

    const dir = path.resolve(__dirname, `../packages/${item}`);
    const deps = await getPackageDeps(dir);

    console.log(`build for ${item}`);

    console.log(`remove ${item}/es directory`);
    rimraf.sync(`${dir}/es`);
    await build(dir, 'esm', deps);
    await build(dir, 'cjs', deps);
    console.log('\n');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
