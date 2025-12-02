import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { videoAPI } from '../services/api'

/**
 * Report Page
 * Displays detailed vehicle detection report
 */
function ReportPage() {
  const { id } = useParams()
  const [filter, setFilter] = useState('all') // 'all', 'speeding', 'normal'

  // Fetch video details
  const { data: video, isLoading: isLoadingVideo } = useQuery({
    queryKey: ['video', id],
    queryFn: () => videoAPI.getById(id),
  })

  // Fetch detections
  const { data: detections, isLoading: isLoadingDetections } = useQuery({
    queryKey: ['detections', id],
    queryFn: () => videoAPI.getDetections(id),
  })

  const isLoading = isLoadingVideo || isLoadingDetections

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading report data...</p>
        </div>
      </div>
    )
  }

  if (!video || !detections) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Report not found</h2>
        <Link to="/videos" className="mt-4 text-primary-600 hover:text-primary-500">
          Back to videos
        </Link>
      </div>
    )
  }

  // Calculate stats
  const totalVehicles = detections.length
  const speedingVehicles = detections.filter(d => d.is_speeding).length
  const maxSpeed = Math.max(...detections.map(d => d.speed), 0)
  
  // Filter detections
  const filteredDetections = detections.filter(d => {
    if (filter === 'speeding') return d.is_speeding
    if (filter === 'normal') return !d.is_speeding
    return true
  })

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-3">
          <li>
            <Link to="/videos" className="text-gray-500 hover:text-primary-600 transition-colors">
              Videos
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to={`/videos/${id}`} className="ml-3 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                {video.filename}
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-3 text-sm font-bold text-primary-700">Report</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-900">Vehicle Speed Report</h1>
          <p className="mt-3 text-lg text-gray-600">
            Speed Limit: <span className="font-bold text-primary-600">{video.speed_limit} km/h</span> | Video: <span className="font-mono font-semibold">{video.filename}</span>
          </p>
        </div>
        <a
          href={videoAPI.getReportDownloadUrl(video.id)}
          download
          className="inline-flex items-center px-6 py-3 rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-105"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download CSV
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Vehicles */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Total Vehicles</h3>
              <p className="mt-4 text-5xl font-black text-blue-600">{totalVehicles}</p>
            </div>
            <svg className="h-14 w-14 text-blue-400 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
          </div>
        </div>

        {/* Speeding Vehicles */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Speeding Vehicles</h3>
              <p className="mt-4 text-5xl font-black text-red-600">{speedingVehicles}</p>
              <p className="mt-2 text-sm font-bold text-red-700">
                {totalVehicles > 0 ? ((speedingVehicles / totalVehicles) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <svg className="h-14 w-14 text-red-400 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 2.623a6 6 0 8.516 10.268zm-6.516-10.268L3.89 5.11a6 6 0 108.516 10.268l-2.081-2.081a4 4 0 00-5.664-5.664z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Max Speed */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Max Speed Detected</h3>
              <p className="mt-4">
                <span className="text-5xl font-black text-green-600">{maxSpeed.toFixed(1)}</span>
                <span className="text-sm font-bold text-green-700 ml-1">km/h</span>
              </p>
            </div>
            <svg className="h-14 w-14 text-green-400 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.555 5.168A1 1 0 003 6v6a1 1 0 01-2 0V6a3 3 0 015.464-1.679l1.341 4.21-2.062 2.063a1 1 0 001.414 1.414L9.414 11l1.768 1.768a1 1 0 001.414-1.414L10.828 9.586l2.062-2.063A3 3 0 0010 3.168V1a1 1 0 10-2 0v2.168zm9.776 7.664L13.172 10.586l2.062-2.063A3 3 0 0010 3.168V1a1 1 0 10-2 0v2.168a1 1 0 01-1.555.832A3 3 0 015.464 8.321l-1.341-4.21 2.062-2.063a1 1 0 00-1.414-1.414L3.586 3l-1.768-1.768a1 1 0 00-1.414 1.414L2.172 4.414 0.11 6.477A3 3 0 004 10.832v2.168a1 1 0 102 0v-2.168a1 1 0 011.555-.832 3 3 0 012.464 4.151l1.341 4.21-2.062 2.063a1 1 0 001.414 1.414l1.768-1.768 1.768 1.768a1 1 0 001.414-1.414l-1.768-1.768 2.062-2.063a3 3 0 00-3.89-4.151l-1.341-4.21 2.062-2.063a1 1 0 00-1.414-1.414L11.414 3l-1.768-1.768a1 1 0 00-1.414 1.414l1.768 1.768z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            {[
              { value: 'all', label: 'All Vehicles', icon: '📊' },
              { value: 'speeding', label: 'Speeding Only', icon: '⚠️' },
              { value: 'normal', label: 'Normal Speed', icon: '✓' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex-1 py-4 px-6 text-center font-bold transition-all duration-300 ${
                  filter === tab.value
                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-b-4 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Vehicle ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Frame</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Speed</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDetections.length > 0 ? (
                filteredDetections.map((detection) => (
                  <tr
                    key={detection.track_id}
                    className={`transition-colors hover:bg-gray-50 ${
                      detection.is_speeding ? 'bg-red-50' : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary-100 text-primary-700">
                        #{detection.track_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {detection.timestamp.toFixed(2)}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                      {detection.frame_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-black text-gray-900">
                        {detection.speed.toFixed(1)}
                        <span className="text-xs font-bold text-gray-600 ml-1">km/h</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold ${
                          detection.is_speeding
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {detection.is_speeding ? (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 2.623a6 6 0 8.516 10.268zm-6.516-10.268L3.89 5.11a6 6 0 108.516 10.268l-2.081-2.081a4 4 0 00-5.664-5.664z" clipRule="evenodd" />
                            </svg>
                            SPEEDING
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            NORMAL
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="inline-block p-3 bg-gray-100 rounded-full mb-3">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">No vehicles found matching the filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ReportPage
