// app/layout.js (or wherever your RootLayout is)
import './globals.css'

export const metadata = {
  title: 'FlowAI Hub',
  description: 'AI workflow automation for remote teams',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}