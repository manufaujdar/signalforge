type Fetcher = {
  fetch(request: Request): Promise<Response>;
};

// The deploy platform supplies the concrete D1 type. The application casts
// this boundary into Drizzle's client contract without adding platform-only
// types to the local prototype dependency set.
type D1Database = object;

declare module "cloudflare:workers" {
  export const env: { DB?: D1Database };
}
