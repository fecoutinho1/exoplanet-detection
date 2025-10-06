"use client"

import { useState } from "react"
import { SpaceScene } from "@/components/space-scene"
import { DataUploader } from "@/components/data-uploader"
import { ResultsDisplay } from "@/components/results-display"
import { Header } from "@/components/header"
import { NASAAnimations } from "@/components/nasa-animations"
import { NASALogoAnimated } from "@/components/nasa-logo-animated"
import { SpaceParticles } from "@/components/space-particles"
import { CSVResultsDisplay } from "@/components/csv-results-display"
import { APIStatus } from "@/components/api-status"

export default function ExoplanetDetector() {
  const [analysisResult, setAnalysisResult] = useState<{
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
        failed_predictions: number
        exoplanets_detected: number
        false_positives: number
        success_rate: string
      }
      results: any[]
    }
  } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleDataUpload = async (data: any) => {
    setIsAnalyzing(true)

    // Set the result directly from the DataUploader component
    // which already processes the API response correctly
    setAnalysisResult(data)
    setIsAnalyzing(false)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Cosmic Background Grid */}
      <div className="cosmic-grid fixed inset-0 opacity-30" />

      {/* 3D Space Scene */}
      <div className="fixed inset-0 pointer-events-none">
        <SpaceScene analysisResult={analysisResult} />
      </div>

              {/* NASA Animated Elements */}
              <NASAAnimations />
              <NASALogoAnimated />
              <SpaceParticles />
              
              {/* API Status */}
              <APIStatus />

      {/* Main Content */}
      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 space-y-6">
              <div className="inline-block">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-primary">NASA Space Apps Challenge 2025</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-balance">
                <span className="bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Exoplanet Detection
                </span>
                <br />
                <span className="text-white/80">AI System</span>
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto text-pretty">
                Advanced machine learning model trained on NASA's open-source datasets to automatically identify
                exoplanets from space telescope data
              </p>
            </div>


            {/* Main Interface Grid */}
            {!analysisResult?.fullResults ? (
              <div className="grid lg:grid-cols-2 gap-6 mt-12">
                {/* Data Upload Section */}
                <DataUploader onUpload={handleDataUpload} isAnalyzing={isAnalyzing} />

                {/* Results Section */}
                <ResultsDisplay result={analysisResult} isAnalyzing={isAnalyzing} />
              </div>
            ) : (
              /* Full Screen Results when data is available */
              <div className="mt-12">
                <CSVResultsDisplay results={analysisResult.fullResults} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
