import { type ReactNode } from 'react'

// Simplified AtmosphereScene - just passes children through
// All heavy atmospheric effects have been removed for performance
interface AtmosphereSceneProps {
  children: ReactNode
}

export function AtmosphereScene({ children }: AtmosphereSceneProps) {
  // Just render children without any atmosphere wrapper
  return <>{children}</>
}

// Default export kept for backward compatibility
export default function AtmosphereEffects() {
  return null
}
