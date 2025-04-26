import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';


export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  {
    rules: {
      semi: ['error', 'always'],          // exige punto y coma
      quotes: ['error', 'single'],        // exige comillas simples
      indent: ['error', 2],               // indentación de 2 espacios
      'no-unused-vars': 'warn',           // alerta si hay variables sin usar
      'no-console': 'off',                // permite console.log (útil en dev)
    },
  },
]);