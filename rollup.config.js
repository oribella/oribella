import rimraf from 'rimraf';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

const cwd = process.cwd();
const { name, main, dependencies } = require(`${cwd}/package.json`);
const dir = main.split('/').shift();
const external = Object.keys(dependencies);
rimraf.sync(dir);

export default {
  input: 'src/index.ts',
  output: [
    { format: 'umd', file: `${dir}/umd/index.js`, name, sourcemap: true },
    {
      format: 'es',
      file: `${dir}/es/index.js`,
      plugins: [
        typescript({
          tsconfig: 'tsconfig.build.json',
          tsconfigOverride: {
            compilerOptions: {
              target: 'esnext',
            }
          }
        }),
      ],
      sourcemap: true,
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
    // uglify(),
    // filesize(),
  ],
  external,
};