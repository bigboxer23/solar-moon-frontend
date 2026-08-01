/// <reference types="vite/client" />

declare module '*.css' {}
declare module '*.scss' {}

interface ImportMetaEnv {
  readonly VITE_STRIPE_PK?: string;
  readonly VITE_PRICE_MO?: string;
  readonly VITE_PRICE_YR?: string;
  readonly VITE_NEW_UI?: string;
  readonly VITE_ACCESS_CODE?: string;
  readonly VITE_USER_POOL_ID: string;
  readonly VITE_USER_POOL_CLIENT_ID: string;
  readonly VITE_IDENTITY_POOL_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Injected by Vite `define` at build time; absent under Vitest.
declare const __BUILD_VERSION__: string | undefined;
declare const __BUILD_SHA__: string | undefined;
declare const __BUILD_TIME__: string | undefined;
