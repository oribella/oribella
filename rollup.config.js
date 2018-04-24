import rimraf from 'rimraf';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

const cwd = process.cwd();
const { name, main, dependencies } = require(`${cwd}/package.json`);
const dir = main.split('/').shift();
const external = Object.keys(dependencies);
rimraf.sync(dir);

export default [{
  input: 'src/index.ts',
  output: {
    format: 'es',
    file: `${dir}/es/index.js`,
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.esnext.json',
    }),
  ],
  external,
}, {
  input: 'src/index.ts',
  output: {
    format: 'umd',
    file: `${dir}/umd/index.js`,
    name,
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfig: 'tsconfig.es5.json',
    })
  ],
  external
}];
