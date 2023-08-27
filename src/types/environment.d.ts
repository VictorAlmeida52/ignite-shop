export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_URL: string
      STRIPE_PUBLIC_KEY: string
      STRIPE_SECRET_KEY: string
    }
  }
}