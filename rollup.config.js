import metablock from 'rollup-plugin-userscript-metablock'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
	input: 'src/index.js',
	output: {
		file: 'userscript.js',
		format: 'iife',
		globals: {
			jquery: '$',
			jszip: 'JSZip'
		}
	},
	context: 'window',
	external: ['jquery', 'jszip'],
	plugins: [
		metablock({ file: 'src/meta.json' }),
		nodeResolve(),
		commonjs({
			include: 'node_modules/**'
		}),
		babel({
			runtimeHelpers: true,
			exclude: 'node_modules/**'
		})
	]
}
