"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function APIStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch('http://localhost:8000/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          setStatus('connected')
        } else {
          setStatus('disconnected')
        }
      } catch (error) {
        setStatus('disconnected')
      }
      
      setLastCheck(new Date())
    }

    // Check immediately
    checkAPI()
    
    // Check every 30 seconds
    const interval = setInterval(checkAPI, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking API...'
      case 'connected':
        return 'API Connected'
      case 'disconnected':
        return 'API Disconnected'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-yellow-600'
      case 'connected':
        return 'bg-green-600'
      case 'disconnected':
        return 'bg-red-600'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge className={`${getStatusColor()} text-white text-xs flex items-center gap-2`}>
        {getStatusIcon()}
        {getStatusText()}
        {lastCheck && (
          <span className="text-xs opacity-75">
            ({lastCheck.toLocaleTimeString()})
          </span>
        )}
      </Badge>
    </div>
  )
}
