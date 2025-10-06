"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, X, Sparkles, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DataPreviewModal } from "@/components/data-preview-modal"

interface DataUploaderProps {
  onUpload: (data: any) => void
  isAnalyzing: boolean
}

export function DataUploader({ onUpload, isAnalyzing }: DataUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [csvData, setCsvData] = useState<any[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const normalizeCSVData = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'))
          const headers = lines[0].split(',').map(h => h.trim())
          const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim())
            const row: any = {}
            headers.forEach((header, index) => {
              const value = values[index]
              // Try to convert to number if possible
              if (value && !isNaN(Number(value))) {
                row[header] = Number(value)
              } else {
                row[header] = value
              }
            })
            return row
          })
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const handlePreview = async () => {
    if (file) {
      try {
        const data = await normalizeCSVData(file)
        setCsvData(data as any[])
        setShowPreview(true)
      } catch (error) {
        console.error('Error processing file:', error)
      }
    }
  }

  const handleConfirmAnalysis = async () => {
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        console.log('Sending file to API:', file.name)
        const response = await fetch('http://localhost:8000/predict-csv', {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        }
        
        const result = await response.json()
        console.log('API Response:', result)
        
        // Process results for display
        if (result.results && result.results.length > 0) {
          const exoplanetCount = result.summary.exoplanets_detected
          const falsePositiveCount = result.summary.false_positives
          const totalAnalyzed = result.summary.total_rows
          
          // Find first exoplanet result for display
          const firstExoplanet = result.results.find((r: any) => r.prediction === 1) || result.results[0]
          
          // Use original data from API response
          const originalData = firstExoplanet.original_data || {}
          
          console.log('First Exoplanet Result:', firstExoplanet)
          console.log('Original Data:', originalData)
          
          const displayData = {
            fileName: file.name,
            isExoplanet: exoplanetCount > 0, // Show as exoplanet if any were detected
            confidence: exoplanetCount > 0 ? 0.95 : 0.1, // High confidence if exoplanets found
            planetData: {
              fileName: file.name,
              orbitalPeriod: originalData.koi_period || 0,
              planetRadius: originalData.koi_prad || 0,
              stellarRadius: originalData.koi_srad || 0,
              temperature: originalData.koi_steff || 0,
              transitDepth: originalData.koi_depth || 0,
            },
            fullResults: result,
            summary: {
              exoplanetCount,
              falsePositiveCount,
              totalAnalyzed,
              successRate: result.summary.success_rate
            },
            // Add specific row information
            detectedRow: {
              rowIndex: firstExoplanet.row_index,
              kepid: firstExoplanet.kepid,
              kepoiName: firstExoplanet.kepoi_name,
              keplerName: firstExoplanet.kepler_name,
              prediction: firstExoplanet.prediction,
              confidence: firstExoplanet.confidence
            }
          }
          onUpload(displayData)
        } else {
          throw new Error('No results returned from API')
        }
        
        setShowPreview(false)
      } catch (error) {
        console.error('Error processing file:', error)
        alert(`Error processing file: ${error instanceof Error ? error.message : String(error)}. Make sure the backend API is running on http://localhost:8000`)
        setShowPreview(false)
      }
    }
  }

  const handleAnalyze = async () => {
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        console.log('Sending file to API (Analyze):', file.name)
        const response = await fetch('http://localhost:8000/predict-csv', {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
        }
        
        const result = await response.json()
        console.log('API Response (Analyze):', result)
        
        // Process results for display
        if (result.results && result.results.length > 0) {
          const exoplanetCount = result.summary.exoplanets_detected
          const falsePositiveCount = result.summary.false_positives
          const totalAnalyzed = result.summary.total_rows
          
          // Find first exoplanet result for display
          const firstExoplanet = result.results.find((r: any) => r.prediction === 1) || result.results[0]
          
          // Use original data from API response
          const originalData = firstExoplanet.original_data || {}
          
          console.log('First Exoplanet Result:', firstExoplanet)
          console.log('Original Data:', originalData)
          
          const displayData = {
            fileName: file.name,
            isExoplanet: exoplanetCount > 0, // Show as exoplanet if any were detected
            confidence: exoplanetCount > 0 ? 0.95 : 0.1, // High confidence if exoplanets found
            planetData: {
              fileName: file.name,
              orbitalPeriod: originalData.koi_period || 0,
              planetRadius: originalData.koi_prad || 0,
              stellarRadius: originalData.koi_srad || 0,
              temperature: originalData.koi_steff || 0,
              transitDepth: originalData.koi_depth || 0,
            },
            fullResults: result,
            summary: {
              exoplanetCount,
              falsePositiveCount,
              totalAnalyzed,
              successRate: result.summary.success_rate
            },
            // Add specific row information
            detectedRow: {
              rowIndex: firstExoplanet.row_index,
              kepid: firstExoplanet.kepid,
              kepoiName: firstExoplanet.kepoi_name,
              keplerName: firstExoplanet.kepler_name,
              prediction: firstExoplanet.prediction,
              confidence: firstExoplanet.confidence
            }
          }
          onUpload(displayData)
        } else {
          throw new Error('No results returned from API')
        }
      } catch (error) {
        console.error('Error processing file:', error)
        alert(`Error processing file: ${error instanceof Error ? error.message : String(error)}. Make sure the backend API is running on http://localhost:8000`)
      }
    }
  }

  return (
    <Card className="glass border-border/50 p-6 space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Upload Data</h3>
          <p className="text-sm text-muted-foreground">CSV, JSON, or FITS format</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          dragActive ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input type="file" id="file-upload" className="hidden" onChange={handleChange} accept=".csv,.json,.fits" />

        {!file ? (
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm font-medium mb-1">Drop your data file here</p>
            <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
            <Button variant="outline" size="sm" type="button">
              Select File
            </Button>
          </label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Sample Data Option */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="h-px flex-1 bg-gray-600" />
          <span>or use sample data</span>
          <div className="h-px flex-1 bg-gray-600" />
        </div>

        <Button
          variant="outline"
          className="w-full bg-transparent text-gray-300 border-gray-600 hover:bg-gray-700"
          onClick={() => {
            const mockFile = new File(["sample"], "kepler-sample.csv", { type: "text/csv" })
            setFile(mockFile)
          }}
        >
          Load Kepler Sample Dataset
        </Button>
      </div>

      {/* Preview and Analyze Buttons */}
      <div className="space-y-3">
        {file && (
          <Button
            variant="outline"
            className="w-full text-gray-300 border-gray-600 hover:bg-gray-700"
            onClick={handlePreview}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Data
          </Button>
        )}

        <Button
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          size="lg"
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze with AI
            </>
          )}
        </Button>
      </div>

      {/* Data Preview Modal */}
      <DataPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmAnalysis}
        csvData={csvData}
        fileName={file?.name || ''}
      />
    </Card>
  )
}
