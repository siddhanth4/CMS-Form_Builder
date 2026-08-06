# Consent Management System

DPDP Act-compliant CMS — stores, shares and manages user data on behalf of organizations under DPDP Act of India.

<img width="1159" height="652" alt="image" src="https://github.com/user-attachments/assets/8c9cce1a-bf61-4efb-9736-a45fd34162ec" />

Admin Dashboard

<img width="1356" height="676" alt="Screenshot 2026-05-27 152008" src="https://github.com/user-attachments/assets/1a109bb5-f6b7-492b-b732-89db50330105" />

Privacy Notice

<img width="1349" height="726" alt="Screenshot 2026-05-27 151840" src="https://github.com/user-attachments/assets/db41e660-5e56-47de-bb28-2afc176cdf98" />

Withdraw Consent Request

<img width="1342" height="672" alt="Screenshot 2026-05-27 152756" src="https://github.com/user-attachments/assets/76d69eb4-37ca-42c1-a0ba-581a0f382a40" />

Organization Audit Logs

<img width="1352" height="675" alt="Screenshot 2026-05-27 152219" src="https://github.com/user-attachments/assets/eecd95bf-86fd-4830-9d52-b48e236e309e" />


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
