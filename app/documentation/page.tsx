"use client"

import { useState } from "react"
import { ArrowLeft, BookOpen, Database, Cpu, Target, TrendingUp, FileText, Code, Users, Zap, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("overview")

  const sections = [
    { id: "overview", title: "Overview", icon: BookOpen },
    { id: "dataset", title: "Dataset", icon: Database },
    { id: "model", title: "Model", icon: Cpu },
    { id: "api", title: "API", icon: Code },
    { id: "architecture", title: "Architecture", icon: Target },
    { id: "performance", title: "Performance", icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to App
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Documentation</h1>
                <p className="text-sm text-gray-400">Exoplanet Detection System - NASA Space Apps 2025</p>
              </div>
            </div>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              v2.0.1
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <h3 className="font-semibold mb-4 text-white">Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    {section.title}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900/50 border-gray-800 p-8">
              {activeSection === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 text-white">System Overview</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      The Exoplanet Detection System is an advanced machine learning application designed to automatically 
                      identify exoplanet candidates from space telescope data. Built specifically for NASA's Space Apps 
                      Challenge 2025, this system demonstrates the potential of artificial intelligence in astronomical 
                      research and exoplanet discovery.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">Key Features</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-400" />
                          98.74% Classification Accuracy
                        </li>
                        <li className="flex items-center gap-2">
                          <Database className="w-4 h-4 text-green-400" />
                          Kepler Objects of Interest Dataset
                        </li>
                        <li className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-purple-400" />
                          XGBoost Machine Learning Model
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          Real-time Processing
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">Scientific Impact</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li>Automated exoplanet candidate screening</li>
                        <li>Large-scale survey data analysis</li>
                        <li>False positive reduction</li>
                        <li>Discovery efficiency improvement</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Author</h3>
                    <p className="text-white text-xl font-medium">Felipe Coutinho</p>
                    <p className="text-gray-300 text-sm">NASA Space Apps Challenge 2025</p>
                  </div>
                </div>
              )}

              {activeSection === "dataset" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Kepler Objects of Interest (KOI) Dataset</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      The system is trained on NASA's Kepler Objects of Interest (KOI) dataset, which contains 
                      photometric observations from the Kepler Space Telescope mission.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-gray-800/50 border-gray-700 p-4">
                      <div className="text-2xl font-bold text-white mb-1">9,564</div>
                      <div className="text-sm text-gray-300">Total Observations</div>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700 p-4">
                      <div className="text-2xl font-bold text-white mb-1">15</div>
                      <div className="text-sm text-gray-300">Features per Observation</div>
                    </Card>
                    <Card className="bg-gray-800/50 border-gray-700 p-4">
                      <div className="text-2xl font-bold text-white mb-1">4</div>
                      <div className="text-sm text-gray-300">Years of Data</div>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Required Features for Classification</h3>
                    <p className="text-gray-300 mb-6">
                      The XGBoost model requires exactly 15 features for accurate exoplanet classification. 
                      All features must be present in the input data.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-white flex items-center gap-2">
                          <Target className="w-4 h-4 text-green-400" />
                          Physical Parameters
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-green-400">
                            <div className="font-mono text-white text-sm">koi_period</div>
                            <div className="text-gray-300 text-xs">Orbital period in days</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-green-400">
                            <div className="font-mono text-white text-sm">koi_duration</div>
                            <div className="text-gray-300 text-xs">Transit duration in hours</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-green-400">
                            <div className="font-mono text-white text-sm">koi_depth</div>
                            <div className="text-gray-300 text-xs">Transit depth (dimming fraction)</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-green-400">
                            <div className="font-mono text-white text-sm">koi_prad</div>
                            <div className="text-gray-300 text-xs">Planet radius in Earth units</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-green-400">
                            <div className="font-mono text-white text-sm">koi_srad</div>
                            <div className="text-gray-300 text-xs">Star radius in Solar units</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-green-400">
                            <div className="font-mono text-white text-sm">koi_steff</div>
                            <div className="text-gray-300 text-xs">Star effective temperature (Kelvin)</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-white flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          Quality Flags & Metrics
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-yellow-400">
                            <div className="font-mono text-white text-sm">koi_score</div>
                            <div className="text-gray-300 text-xs">Confidence score (0-1)</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-yellow-400">
                            <div className="font-mono text-white text-sm">koi_fpflag_nt</div>
                            <div className="text-gray-300 text-xs">Not transit flag (0/1)</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-yellow-400">
                            <div className="font-mono text-white text-sm">koi_fpflag_ss</div>
                            <div className="text-gray-300 text-xs">Secondary star flag (0/1)</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-yellow-400">
                            <div className="font-mono text-white text-sm">koi_fpflag_co</div>
                            <div className="text-gray-300 text-xs">Contamination flag (0/1)</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-yellow-400">
                            <div className="font-mono text-white text-sm">koi_fpflag_ec</div>
                            <div className="text-gray-300 text-xs">Eclipse flag (0/1)</div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded border-l-4 border-yellow-400">
                            <div className="font-mono text-white text-sm">koi_model_snr</div>
                            <div className="text-gray-300 text-xs">Signal-to-noise ratio</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-blue-300 mb-1">Data Requirements</h5>
                          <p className="text-sm text-gray-300">
                            All 15 features are mandatory for classification. Missing values are automatically 
                            filled with median values, and all data is normalized before processing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "model" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Machine Learning Model</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      The system employs an XGBoost (eXtreme Gradient Boosting) classifier, chosen for its high 
                      performance on tabular data and robust handling of missing values.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Accuracy</span>
                          <span className="text-2xl font-bold text-green-400">98.74%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Precision</span>
                          <span className="text-2xl font-bold text-blue-400">98.17%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Recall</span>
                          <span className="text-2xl font-bold text-purple-400">99.24%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">F1-Score</span>
                          <span className="text-2xl font-bold text-yellow-400">98.70%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Training Methodology</h3>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span>GroupShuffleSplit to prevent data leakage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span>All observations from same star in same set</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span>Missing value imputation using median</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span>StandardScaler normalization</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "api" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 text-white">REST API Integration</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      The system provides a comprehensive REST API for integration with external applications.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Endpoints</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
                          <Badge className="bg-green-600 text-white">POST</Badge>
                          <code className="text-blue-400">/predict</code>
                          <span className="text-gray-300">Main classification endpoint</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
                          <Badge className="bg-blue-600 text-white">GET</Badge>
                          <code className="text-blue-400">/health</code>
                          <span className="text-gray-300">System status check</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
                          <Badge className="bg-blue-600 text-white">GET</Badge>
                          <code className="text-blue-400">/model-info</code>
                          <span className="text-gray-300">Model metadata and statistics</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Request Format</h3>
                      <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-green-400 text-sm">
{`{
  "candidate_data": {
    "koi_period": 365.25,
    "koi_duration": 12.0,
    "koi_depth": 0.01,
    "koi_prad": 1.2,
    "koi_srad": 1.0,
    "koi_steff": 5778,
    // ... additional features
  }
}`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Response Format</h3>
                      <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-blue-400 text-sm">
{`{
  "status": "success",
  "data": {
    "prediction": 1,
    "confidence": 95.2,
    "probabilities": {
      "exoplanet": 0.952,
      "false_positive": 0.048
    },
    "explanation": "Candidate classified as exoplanet with 95.2% confidence"
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "architecture" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 text-white">System Architecture</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      The system employs a modular, object-oriented design that separates data processing, 
                      model inference, and API functionality into distinct components.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gray-800/50 border-gray-700 p-6">
                      <Cpu className="w-8 h-8 text-blue-400 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">ExoplanetDetector</h3>
                      <p className="text-gray-300 text-sm">
                        Core machine learning operations including data validation, preprocessing, and prediction.
                      </p>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700 p-6">
                      <Code className="w-8 h-8 text-green-400 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">ExoplanetAPI</h3>
                      <p className="text-gray-300 text-sm">
                        REST API functionality for external integration and HTTP request processing.
                      </p>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700 p-6">
                      <FileText className="w-8 h-8 text-purple-400 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Utility Functions</h3>
                      <p className="text-gray-300 text-sm">
                        System initialization and configuration management.
                      </p>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Data Processing Pipeline</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                        <div>
                          <div className="text-white font-medium">Input Validation</div>
                          <div className="text-gray-300 text-sm">Dictionary format validation and feature completeness verification</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                        <div>
                          <div className="text-white font-medium">Preprocessing</div>
                          <div className="text-gray-300 text-sm">Missing value imputation and data normalization</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                        <div>
                          <div className="text-white font-medium">Classification</div>
                          <div className="text-gray-300 text-sm">XGBoost model prediction with confidence scoring</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "performance" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 text-white">Performance & Scalability</h2>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      The system is optimized for high performance and scalability across different deployment scenarios.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">System Requirements</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Python Version</span>
                          <span className="text-white font-medium">3.8+</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Minimum RAM</span>
                          <span className="text-white font-medium">4GB</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Recommended RAM</span>
                          <span className="text-white font-medium">8GB</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Storage</span>
                          <span className="text-white font-medium">1GB</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Performance Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Processing Speed</span>
                          <span className="text-green-400 font-medium">&lt;2 seconds</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Model Loading</span>
                          <span className="text-blue-400 font-medium">&lt;1 second</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Memory Usage</span>
                          <span className="text-purple-400 font-medium">&lt;500MB</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Concurrent Users</span>
                          <span className="text-yellow-400 font-medium">100+</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Future Development</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-white mb-2">Short-term Goals</h4>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          <li>• TESS mission integration</li>
                          <li>• Performance optimization</li>
                          <li>• Enhanced visualization tools</li>
                          <li>• Extended documentation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-white mb-2">Long-term Vision</h4>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          <li>• Multi-mission support</li>
                          <li>• Real-time data processing</li>
                          <li>• Advanced ensemble methods</li>
                          <li>• Community-driven development</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
