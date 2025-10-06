import { Rocket, Github, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="relative z-20 border-b border-border/50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-bold text-lg">ExoDetect AI</h2>
              <p className="text-xs text-muted-foreground font-mono">v2.0.1</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="/documentation" className="text-sm text-gray-300 hover:text-white transition-colors">
              Documentation
            </a>
            <a href="/documentation#dataset" className="text-sm text-gray-300 hover:text-white transition-colors">
              Dataset
            </a>
            <a href="/documentation#model" className="text-sm text-gray-300 hover:text-white transition-colors">
              Model Info
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Info className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Github className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
