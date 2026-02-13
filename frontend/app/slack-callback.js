// frontend/pages/api/slack-callback.js

export default async function handler(req, res) {
  const { code, state, error } = req.query;

  // Handle error from Slack
  if (error) {
    console.error('Slack OAuth error:', error);
    return res.redirect('/?slack=error&message=' + encodeURIComponent(error));
  }

  if (!code) {
    return res.status(400).json({ error: 'No code received from Slack' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: 'https://flowai-hub.vercel.app/api/slack-callback',
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.ok) {
      console.error('Slack token error:', tokenData.error);
      return res.redirect('/?slack=error&message=' + encodeURIComponent(tokenData.error));
    }

    // Success! You now have tokens
    const { access_token, refresh_token, authed_user, team } = tokenData;

    // TODO: Save to Supabase (user ID from session, access_token, team.id, etc.)
    // Example (add after you have session in API route):
    // const { data: { session } } = await supabase.auth.getSession();
    // await supabase.from('slack_connections').insert({
    //   user_id: session.user.id,
    //   access_token,
    //   refresh_token,
    //   team_id: team.id,
    //   authed_user_id: authed_user.id
    // });

    // Redirect back to dashboard with success
    res.redirect('/?slack=connected&team=' + team.name);
  } catch (err) {
    console.error('Slack callback error:', err);
    res.redirect('/?slack=error&message=Server+error');
  }
}