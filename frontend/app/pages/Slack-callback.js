// pages/api/slack-callback.js
export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: 'https://flowai-hub.vercel.app/api/slack-callback',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.ok) {
      return res.status(400).json({ error: tokenData.error });
    }

    // TODO: Save tokenData.access_token, team.id, etc. to Supabase for the current user
    // Example: await supabase.from('connections').insert({ user_id: session.user.id, provider: 'slack', access_token: tokenData.access_token })

    // Redirect back to dashboard with success
    res.redirect('/?slack=connected');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to connect Slack' });
  }
}