import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

// Flat config for ESLint 9. Next.js 16 removed the `next lint` command,
// so linting now runs through the ESLint CLI (`eslint .`) against this config.
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Cosmetic only — literal quotes/apostrophes in JSX copy are fine and
      // escaping them hurts readability of the source. No safety value.
      'react/no-unescaped-entities': 'off',
      // Advisory, not blocking: the codebase uses intentional setState-in-effect
      // patterns (SSR-safe scroll reveal, async data fetching) that this
      // react-hooks v6 rule flags as false positives.
      'react-hooks/set-state-in-effect': 'warn',
      // Allow deliberately-unused args/vars when prefixed with an underscore.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
]

export default eslintConfig
