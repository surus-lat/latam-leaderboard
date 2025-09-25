import { useEffect } from 'react'

export function About() {
  useEffect(() => {
    // Redirect to the self-contained HTML file
    window.location.href = '/about.html'
  }, [])

  return (
    <div className="container max-w-3xl py-6 md:py-10 mx-auto text-center">
      <div className="space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Redirecting to About page...</p>
      </div>
    </div>
  )
}



