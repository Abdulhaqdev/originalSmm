module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'next/core-web-vitals', // Next.js uchun asosiy qoidalar
    'plugin:@typescript-eslint/recommended', // TypeScript uchun tavsiya qilingan qoidalar
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // TypeScript tip tekshiruvi bilan qoidalar
    'plugin:react/recommended', // React uchun qoidalar
    'plugin:react-hooks/recommended', // React Hooks qoidalari
    'prettier', // Prettier bilan integratsiya, konfliktli qoidalarni o‘chiradi
  ],
  parser: '@typescript-eslint/parser', // TypeScript fayllarini tahlil qilish uchun parser
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json', // TypeScript loyiha sozlamalari
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
  rules: {
    // Umumiy qoidalar
    'no-console': ['warn', { allow: ['error'] }], // console.log ogohlantirish, lekin console.error ruxsat etiladi
    'no-unused-vars': 'off', // ESLint’ning standart no-unused-vars qoidasini o‘chirish
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // TypeScript uchun no-unused-vars

    // TypeScript qoidalar
    '@typescript-eslint/no-explicit-any': 'error', // any tipini taqiqlash
    '@typescript-eslint/explicit-module-boundary-types': 'warn', // Funksiya qaytish turlari aniq bo‘lishi uchun ogohlantirish
    '@typescript-eslint/no-non-null-assertion': 'warn', // ! operatorini ogohlantirish

    // React qoidalar
    'react/prop-types': 'off', // TypeScript prop turlarni tekshiradi, shuning uchun prop-types kerak emas
    'react/jsx-key': 'error', // JSX ro‘yxatlarda key atributini talab qilish
    'react-hooks/rules-of-hooks': 'error', // React Hooks qoidalarini majburiy qilish
    'react-hooks/exhaustive-deps': 'warn', // useEffect/useCallback dependensiyalarni tekshirish

    // Prettier qoidalar
    'prettier/prettier': 'error', // Prettier qoidalariga rioya qilish
  },
  settings: {
    react: {
      version: 'detect', // React versiyasini avtomatik aniqlash
    },
  },
};