interface Env {
  ENVIRONMENT: string;
}

// In-memory view store for development.
// In production, use KV or D1 for persistence.
const viewCounts: Record<string, number> = {};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return new Response(
      JSON.stringify({ error: 'Slug parameter is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  viewCounts[slug] = (viewCounts[slug] || 0) + 1;

  return new Response(
    JSON.stringify({ slug, views: viewCounts[slug] }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return new Response(
      JSON.stringify({ error: 'Slug parameter is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ slug, views: viewCounts[slug] || 0 }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
