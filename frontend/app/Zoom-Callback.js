// pages/api/zoom-callback.js
export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.ZOOM_CLIENT_ID + ':' + process.env.ZOOM_CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://flowai-hub.vercel.app/api/zoom-callback',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenResponse.status !== 200) {
      return res.status(400).json({ error: tokenData.reason });
    }

    // TODO: Save tokenData.access_token to Supabase for current user

    res.redirect('/?zoom=connected');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to connect Zoom' });
  }
}