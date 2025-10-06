"use client"

import { CheckCircle2, XCircle, Database, TrendingUp, Target } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CSVResultsDisplayProps {
  results: {
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
    results: Array<{
      row_index: number
      kepid: number
      kepoi_name: string
      kepler_name: string
      success: boolean
      prediction?: number
      prediction_text?: string
      confidence?: number
      probability_exoplanet?: number
      probability_false_positive?: number
      explanation?: string
      error?: string
    }>
  }
}

export function CSVResultsDisplay({ results }: CSVResultsDisplayProps) {
  if (!results || results.status !== 'success') {
    return (
      <Card className="glass border-border/50 p-6">
        <div className="text-center text-gray-300">
          <Database className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h3 className="text-lg font-semibold mb-2">No Results Available</h3>
          <p>Upload and process a CSV file to see results</p>
        </div>
      </Card>
    )
  }

  const { summary, results: dataResults } = results

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Exoplanet Detection Results</h2>
        <p className="text-gray-400">Complete analysis of your CSV dataset</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-white">{summary.total_rows}</div>
              <div className="text-sm text-gray-300">Total Rows</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">{summary.success_rate}</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{summary.exoplanets_detected}</div>
              <div className="text-sm text-gray-300">Exoplanets</div>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-400" />
            <div>
              <div className="text-2xl font-bold text-white">{summary.false_positives}</div>
              <div className="text-sm text-gray-300">False Positives</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="glass border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-400" />
            <div>
              <h3 className="text-xl font-semibold text-white">Detailed Classification Results</h3>
              <p className="text-sm text-gray-400">Complete analysis of all {dataResults.length} candidates</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Processing Complete</div>
            <div className="text-xs text-gray-500">XGBoost Model</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800 border-b border-gray-700">
                <TableHead className="text-gray-200 font-medium text-sm">Row</TableHead>
                <TableHead className="text-gray-200 font-medium text-sm">KEPID</TableHead>
                <TableHead className="text-gray-200 font-medium text-sm">Candidate Name</TableHead>
                <TableHead className="text-gray-200 font-medium text-sm">Kepler Name</TableHead>
                <TableHead className="text-gray-200 font-medium text-sm">Classification</TableHead>
                <TableHead className="text-gray-200 font-medium text-sm">Confidence</TableHead>
                <TableHead className="text-gray-200 font-medium text-sm">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataResults.map((result, index) => (
                <TableRow key={index} className="hover:bg-gray-800/50 border-b border-gray-800">
                  <TableCell className="text-gray-300 font-medium text-sm">
                    {result.row_index + 1}
                  </TableCell>
                  <TableCell className="text-gray-300 font-mono text-sm">
                    {result.kepid}
                  </TableCell>
                  <TableCell className="text-gray-300 font-medium text-sm">
                    {result.kepoi_name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-gray-300 font-medium text-sm">
                    {result.kepler_name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {result.success ? (
                      <div className="flex items-center gap-2">
                        {result.prediction === 1 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`font-medium ${result.prediction === 1 ? 'text-green-400' : 'text-red-400'}`}>
                          {result.prediction === 1 ? 'Exoplanet' : 'False Positive'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Processing Error</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300 font-medium text-sm">
                    {result.confidence ? `${result.confidence.toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {result.success ? (
                      <Badge className={`text-white text-xs ${result.prediction === 1 ? 'bg-green-600' : 'bg-red-600'}`}>
                        {result.prediction === 1 ? 'Confirmed' : 'Rejected'}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-600 text-white text-xs">
                        Error
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-400">
              <span className="font-medium">Analysis Complete</span>
              <span className="ml-2">• {dataResults.length} candidates processed</span>
            </div>
            <div className="text-gray-500 text-xs">
              XGBoost Classification Model
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
