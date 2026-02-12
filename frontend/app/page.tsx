export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        FlowAI Hub
      </h1>
      <p style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>
        Turn Zoom meetings into approved tasks — inside Slack, with hybrid AI oversight.  
        Reliable automation for remote SMB teams.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <button 
          style={{ 
            background: '#0070f3', 
            color: 'white', 
            padding: '14px 28px', 
            fontSize: '1.1rem', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer' 
          }}
        >
          Start Free (Connect Slack + Zoom)
        </button>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Why teams love it</h2>
        <ul style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
          <li>AI drafts tasks & emails — you just approve in Slack</li>
          <li>No bots in client calls (invisible processing)</li>
          <li>Flat team pricing ($29–99/team) – no per-seat nonsense</li>
          <li>Open-source models = cheap + private</li>
        </ul>
      </div>
    </div>
  );
}