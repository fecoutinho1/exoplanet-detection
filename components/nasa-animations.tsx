"use client"

export function NASAAnimations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Simple floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse animation-delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-pulse animation-delay-2000" />
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse animation-delay-3000" />
    </div>
  )
}
