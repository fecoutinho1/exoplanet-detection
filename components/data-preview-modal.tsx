"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface DataPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  csvData: any[]
  fileName: string
}

export function DataPreviewModal({ isOpen, onClose, onConfirm, csvData, fileName }: DataPreviewModalProps) {
  const [displayData, setDisplayData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    if (csvData && csvData.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      setDisplayData(csvData.slice(startIndex, endIndex))
    }
  }, [csvData, currentPage])

  const totalPages = Math.ceil((csvData?.length || 0) / itemsPerPage)

  const getColumnHeaders = () => {
    if (!csvData || csvData.length === 0) return []
    return Object.keys(csvData[0])
  }

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "N/A"
    if (typeof value === 'number') {
      return value.toFixed(4)
    }
    return String(value)
  }

  return (
    <>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 12px;
          width: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 6px;
          border: 2px solid #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #1f2937;
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[98vw] w-[98vw] max-h-[70vh] h-[70vh] overflow-hidden bg-black border-gray-800">
        <DialogHeader className="border-b border-gray-800 pb-3">
          <DialogTitle className="text-white text-lg">Normalized Data - {fileName}</DialogTitle>
          <DialogDescription className="text-gray-300 text-sm">
            Preview and confirm data before processing. Total records: {csvData?.length || 0}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 flex-1 flex flex-col min-h-0">
          {/* Data Summary */}
          <div className="flex gap-3 text-xs text-gray-300 flex-shrink-0">
            <Badge variant="outline" className="text-blue-400 border-blue-400 bg-blue-400/10">
              {csvData?.length || 0} records
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400 bg-green-400/10">
              {getColumnHeaders().length} columns
            </Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-yellow-400/10">
              Page {currentPage} of {totalPages}
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400 bg-purple-400/10">
              ← → Scroll horizontally
            </Badge>
          </div>

          {/* Data Table */}
          <div className="border border-gray-700 rounded-lg overflow-hidden flex-1 bg-gray-900 min-h-0">
            <div className="h-full overflow-auto custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4b5563 #1f2937' }}>
              <div className="overflow-x-auto" style={{ width: '100%', height: '100%' }}>
                <Table className="w-full" style={{ minWidth: 'max-content' }}>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-gray-800 border-b border-gray-700">
                      {getColumnHeaders().map((header, index) => (
                        <TableHead key={index} className="text-gray-200 font-mono text-xs px-3 py-2 border-r border-gray-700 last:border-r-0 whitespace-nowrap min-w-[150px] sticky top-0 bg-gray-800">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.map((row, rowIndex) => (
                      <TableRow key={rowIndex} className="hover:bg-gray-800/50 border-b border-gray-800">
                        {getColumnHeaders().map((header, colIndex) => (
                          <TableCell key={colIndex} className="text-gray-300 font-mono text-xs px-3 py-2 border-r border-gray-800 last:border-r-0 whitespace-nowrap min-w-[150px]">
                            {formatValue(row[header])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 py-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="text-gray-300 border-gray-600 hover:bg-gray-700 disabled:opacity-50 text-xs"
              >
                Previous
              </Button>
              <span className="text-gray-300 text-xs flex items-center px-3">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="text-gray-300 border-gray-600 hover:bg-gray-700 disabled:opacity-50 text-xs"
              >
                Next
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-700 flex-shrink-0">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-300 border-gray-600 hover:bg-gray-700 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Confirm & Process
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
