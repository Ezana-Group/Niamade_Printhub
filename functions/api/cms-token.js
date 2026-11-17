export async function onRequest(context) {
  const { request, env } = context;

  // Cloudflare Access injects this header for authenticated users
  const cfEmail = request.headers.get("cf-access-authenticated-user-email") || "";
  const token = env.CMS_GITHUB_TOKEN;

  const headers = {
    "content-type": "application/json; charset=UTF-8",
    "cache-control": "no-store, no-cache, must-revalidate",
  };

  if (!token) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "MISSING_TOKEN",
        email: cfEmail || null,
        message: "CMS_GITHUB_TOKEN secret is not set in Cloudflare Pages settings.",
      }),
      { status: 200, headers }
    );
  }

  const username = cfEmail ? cfEmail.split("@")[0] : "admin";

  return new Response(
    JSON.stringify({
      ok: true,
      token,
      email: cfEmail || "admin@printhub.africa",
      login: username,
      name: username,
    }),
    { status: 200, headers }
  );
}
