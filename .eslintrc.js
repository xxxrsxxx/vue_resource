module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:vue/essential', '@vue/prettier'],
	rules: {
		'no-console': 'off',
		// "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		// "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				semi: true,
				useTabs: true,
				tabWidth: 4,
				trailingComma: 'all',
				printWidth: 100,
				bracketSpacing: true,
				arrowParens: 'avoid',
				jsxBracketSameLine: true,
			},
		],
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
};
