interface Env {
  ENVIRONMENT: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json() as { email?: string };
    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // In production, add to a mailing list service like Buttondown or ConvertKit.
    console.log('Newsletter subscription:', {
      email,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully subscribed!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
