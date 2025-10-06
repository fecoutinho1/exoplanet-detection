"use client"

import { CheckCircle2, XCircle, Activity, Thermometer, Orbit, Ruler } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ResultsDisplayProps {
  result: {
    isExoplanet: boolean
    confidence: number
    planetData: any
    summary?: {
      exoplanetCount: number
      falsePositiveCount: number
      totalAnalyzed: number
      successRate: string
    }
    detectedRow?: {
      rowIndex: number
      kepid: number
      kepoiName: string
      keplerName: string
      prediction: number
      confidence: number
    }
    fullResults?: {
      status: string
      message: string
      summary: {
        total_rows: number
        successful_predictions: number
        exoplanets_detected: number
        false_positives: number
        success_rate: string
      }
      results?: any[]
    }
  } | null
  isAnalyzing: boolean
}

export function ResultsDisplay({ result, isAnalyzing }: ResultsDisplayProps) {
  if (isAnalyzing) {
    return (
      <Card className="glass border-border/50 p-6 flex flex-col items-center justify-center min-h-[500px]">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-3 border-4 border-accent/20 rounded-full" />
          <div
            className="absolute inset-3 border-4 border-accent border-t-transparent rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">Analyzing Data</h3>
        <p className="text-sm text-gray-300 text-center max-w-xs">
          Running neural network classification on transit photometry data...
        </p>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="glass border-border/50 p-6 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
          <Activity className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">Ready for Analysis</h3>
        <p className="text-sm text-gray-300 text-center max-w-xs">
          Upload exoplanet data to begin AI-powered classification
        </p>
      </Card>
    )
  }

  const { isExoplanet, confidence, planetData, summary, detectedRow, fullResults } = result

  console.log('ResultsDisplay - Full result:', result)
  console.log('ResultsDisplay - planetData:', planetData)
  console.log('ResultsDisplay - detectedRow:', detectedRow)
  console.log('ResultsDisplay - fullResults:', fullResults)

  return (
    <Card className="glass border-border/50 p-6 space-y-6">
      {/* Result Header */}
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isExoplanet ? "bg-primary/10" : "bg-destructive/10"
          }`}
        >
          {isExoplanet ? (
            <CheckCircle2 className="w-6 h-6 text-primary" />
          ) : (
            <XCircle className="w-6 h-6 text-destructive" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1 text-white">
            {summary ? 
              `Analysis Complete - ${summary.exoplanetCount} Exoplanets Detected` : 
              (isExoplanet ? "Exoplanet Detected!" : "No Exoplanet Detected")
            }
          </h3>
          <p className="text-sm text-gray-300">
            {summary ? 
              `Processed ${summary.totalAnalyzed} candidates: ${summary.exoplanetCount} exoplanets confirmed, ${summary.falsePositiveCount} false positives` :
              (isExoplanet
                ? "Transit signal matches exoplanet characteristics"
                : "Signal does not match exoplanet profile")
            }
          </p>
          {summary && summary.exoplanetCount > 0 && (
            <div className="mt-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-300 font-medium text-sm">Exoplanets Found</span>
              </div>
              <p className="text-xs text-gray-300">
                {summary.exoplanetCount} candidates classified as confirmed exoplanets. 
                See detailed results below for specific row information and confidence scores.
              </p>
            </div>
          )}
          {summary && summary.exoplanetCount === 0 && (
            <div className="mt-2 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-300 font-medium text-sm">No Exoplanets Detected</span>
              </div>
              <p className="text-xs text-gray-300">
                All {summary.totalAnalyzed} candidates were classified as false positives. 
                This dataset may require further analysis or different classification criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{summary.exoplanetCount}</div>
            <div className="text-sm text-gray-300">Exoplanets Found</div>
            <div className="text-xs text-green-300 mt-1">
              {summary.exoplanetCount > 0 ? 'Confirmed planets' : 'No exoplanets detected'}
            </div>
          </div>
          <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{summary.falsePositiveCount}</div>
            <div className="text-sm text-gray-300">False Positives</div>
            <div className="text-xs text-red-300 mt-1">
              {summary.falsePositiveCount > 0 ? 'Not exoplanets' : 'All candidates valid'}
            </div>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{summary.totalAnalyzed}</div>
            <div className="text-sm text-gray-300">Total Analyzed</div>
            <div className="text-xs text-blue-300 mt-1">
              CSV rows processed
            </div>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{summary.successRate}</div>
            <div className="text-sm text-gray-300">Success Rate</div>
            <div className="text-xs text-yellow-300 mt-1">
              Model accuracy
            </div>
          </div>
        </div>
      )}

      {/* Confidence Score */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">Confidence Score</span>
          <span className="text-2xl font-bold text-white">{(confidence * 100).toFixed(1)}%</span>
        </div>
        <Progress value={confidence * 100} className="h-2" />
        <p className="text-xs text-gray-400">Based on XGBoost analysis of {planetData.fileName}</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Planet Parameters - Show when we have specific planet data */}
      {detectedRow && (
        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-white">Detected Exoplanet Details</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <div className="text-xs text-green-300 mb-1">Row #{detectedRow.rowIndex + 1}</div>
              <div className="text-sm font-medium text-white">{detectedRow.kepoiName || 'Unknown'}</div>
              <div className="text-xs text-gray-400">{detectedRow.keplerName || 'No Kepler name'}</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <div className="text-xs text-blue-300 mb-1">KEPID</div>
              <div className="text-sm font-mono text-white">{detectedRow.kepid}</div>
              <div className="text-xs text-gray-400">Kepler ID</div>
            </div>
          </div>
        </div>
      )}

      {/* Classification Details */}
      <div className="rounded-lg bg-muted/30 p-4 space-y-2">
        <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Model Information</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-400">Architecture:</span>
            <span className="ml-2 font-mono text-white">XGBoost</span>
          </div>
          <div>
            <span className="text-gray-400">Dataset:</span>
            <span className="ml-2 font-mono text-white">Kepler KOI</span>
          </div>
          <div>
            <span className="text-gray-400">Training Acc:</span>
            <span className="ml-2 font-mono text-white">98.74%</span>
          </div>
          <div>
            <span className="text-gray-400">Features:</span>
            <span className="ml-2 font-mono text-white">15</span>
          </div>
        </div>
      </div>

      {/* Show detailed results link if we have full results */}
      {fullResults && (
        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h6 className="text-sm font-medium text-blue-300 mb-1">Detailed Analysis Available</h6>
              <p className="text-xs text-gray-300">
                View complete classification results for all {fullResults.results?.length || 0} candidates
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-400 font-medium">
                {fullResults.summary?.exoplanets_detected || 0} Exoplanets
              </div>
              <div className="text-xs text-gray-400">
                {fullResults.summary?.false_positives || 0} False Positives
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
