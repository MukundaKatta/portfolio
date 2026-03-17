interface Env {
  ENVIRONMENT: string;
}

// In-memory draft store for development.
// In production, use D1 or KV for persistence.
const drafts: Array<{
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}> = [];

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as {
      title?: string;
      content?: string;
      tags?: string[];
    };

    const { title, content, tags } = body;

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Title and content are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const draft = {
      id: crypto.randomUUID(),
      title,
      content,
      tags: tags || [],
      createdAt: new Date().toISOString(),
    };

    drafts.push(draft);

    return new Response(
      JSON.stringify({ success: true, draft }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequestGet: PagesFunction<Env> = async () => {
  return new Response(
    JSON.stringify({ drafts }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
