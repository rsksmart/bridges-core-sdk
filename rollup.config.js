import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import dts from "rollup-plugin-dts";

const argIndex = process.argv.indexOf('--buildType');
const buildType = argIndex !== -1 ? process.argv[argIndex + 1] : null;

const builds = {
    default: {
        tsConfig: './core.tsconfig.json',
        name: 'index'
    },
    initialization: {
        tsConfig: './initialization.tsconfig.json',
        name: 'initialization'
    }
}

const buildInfo = builds[buildType]
if (!buildInfo) {
    throw new Error('unknown build')
}

const config = [
    {
        input: `src/${buildInfo.name}.ts`,
        output: {
            name: `${buildInfo.name}.js`,
            dir: './lib',
            format: 'cjs',
            dynamicImportInCjs: false,
        },
        plugins: [
            commonjs(),
            json(),
            typescript({
                tsconfig: buildInfo.tsConfig
            })
        ]
    },
    {
        input: `lib/${buildInfo.name}.d.ts`,
        output: {
            file: `lib/${buildInfo.name}.d.ts`,
            format: 'es'
        },
        plugins: [ dts.default() ]
    }
];

config.forEach(config => {
    config.onwarn = (log, handler) => {
        if (log.code === 'UNKNOWN_OPTION') {
            return
        }
        handler(log)
    }
})
export default config