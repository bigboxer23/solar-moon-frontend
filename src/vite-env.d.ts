// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PK?: string;
  readonly VITE_PRICE_MO?: string;
  readonly VITE_PRICE_YR?: string;
  readonly VITE_NEW_UI?: string;
  readonly VITE_ACCESS_CODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
