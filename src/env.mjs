import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv( {
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    // NODE
    NODE_ENV: z.enum( [ "development", "test", "production" ] ),

    // SANITY
    SANITY_API_TOKEN: z.string().min( 1 ),

    // CLERK
    CLERK_SECRET_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // SANITY
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min( 1 ),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min( 1 ),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().min( 1 ),

    // CLERK
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min( 1 ),

    // Others
    NEXT_PUBLIC_RANDOMPHONE_API_KEY: z.string().min( 1 ),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // NODE
    NODE_ENV: process.env.NODE_ENV,

    // SANITY
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,

    // CLERK
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,

    // Others
    NEXT_PUBLIC_RANDOMPHONE_API_KEY: process.env.NEXT_PUBLIC_RANDOMPHONE_API_KEY,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
} );
