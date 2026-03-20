module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'standard'  // Using standard JS config instead of TypeScript variant
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'commonjs',
  },
  settings: {
    // Helps ESLint understand import resolvers
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules', 'src/lib/']
      }
    }
  },
  rules: {
    // Estilo de código (alinhado com nosso AGENTS.md)
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    
    // Possíveis problemas
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    
    // Melhores práticas Node.js
    'handle-callback-err': 'error',
    'no-path-concat': 'error',
    'no-process-env': 'off',
    'no-process-exit': 'off',
    'no-sync': 'off',
    
    // Estilo (conforme nosso AGENTS.md)
    'id-length': [
      'error',
      {
        exceptions: ['_', 'i', 'j', 'x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'],
        min: 2
      }
    ],
    'no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1, 2, 3, 4, 5, 6, 10, 100, 60, 90, 360, 1000],
        ignoreArrayIndexes: true,
        enforceConst: true
      }
    ],
    
    // Imports (conforme nosso AGENTS.md)
    'import/no-duplicates': 'error',
    'import/no-unresolved': ['error', { ignore: ['^@/'] }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index']
        ],
        'newlines-between': 'always'
      }
    ],
    
    // Boas práticas de código
    'curly': ['error', 'all'],
    'eqeqeq': ['error', 'smart'],
    'no-else-return': ['error', { allowElseIf: false }],
    'no-param-reassign': ['error', { props: false }],
    'prefer-template': 'error',
    
    // Complexidade
    'max-depth': ['error', 4],
    'max-params': ['error', 3],
    'max-statements': ['error', 20],
    
    // Comentários (conforme nosso AGENTS.md - valorizamos comments explicativos)
    'spaced-comment': ['error', 'always', {
      markers: ['/', '!', '/**', '*', '//', '/*']
    }]
  }
};