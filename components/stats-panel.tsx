import { TrendingUp, Database, Cpu, Target } from "lucide-react"

export function StatsPanel() {
  const stats = [
    { label: "Exoplanets Detected", value: "5,247", icon: Target, color: "text-primary" },
    { label: "Model Accuracy", value: "98.7%", icon: TrendingUp, color: "text-accent" },
    { label: "Training Samples", value: "150K+", icon: Database, color: "text-primary" },
    { label: "Processing Speed", value: "<2s", icon: Cpu, color: "text-accent" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="glass rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1 text-white">{stat.value}</div>
          <div className="text-sm text-gray-300">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
