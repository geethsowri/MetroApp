// ...rest of the code remains unchanged...

return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-indigo-700 to-blue-900 p-3 rounded-full">
                        <Navigation className="text-white w-8 h-8" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">
                    Metro Route Finder
                </h1>
                <p className="text-gray-300 text-lg">
                    Hyderabad Metro - Powered by Dijkstra's Algorithm
                </p>
                <div className="flex items-center justify-center mt-2 text-sm text-gray-400">
                    <Zap className="w-4 h-4 mr-1" />
                    Real-time shortest path calculation
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
                {/* Route Form */}
                <div className="bg-gray-900 rounded-2xl shadow-xl p-8 mb-8 border border-gray-800">
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Source Station */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    <MapPin className="inline w-4 h-4 mr-1" />
                                    Source Station
                                </label>
                                <select
                                    value={sourceStation}
                                    onChange={(e) => setSourceStation(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                                >
                                    <option value="">Select source station</option>
                                    {metroStations.map((station) => (
                                        <option key={station} value={station}>
                                            {station}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Destination Station */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-200 mb-2">
                                    <MapPin className="inline w-4 h-4 mr-1" />
                                    Destination Station
                                </label>
                                <select
                                    value={destinationStation}
                                    onChange={(e) => setDestinationStation(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                                >
                                    <option value="">Select destination station</option>
                                    {metroStations.map((station) => (
                                        <option key={station} value={station}>
                                            {station}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-800 hover:to-indigo-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                        Calculating Route...
                                    </>
                                ) : (
                                    <>
                                        <Route className="w-5 h-5 mr-2" />
                                        Find Shortest Route
                                    </>
                                )}
                            </button>
                            <button
                                onClick={resetForm}
                                className="px-6 py-3 border border-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-800 transition-all"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Route Results */}
                {routeData && (
                    <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <Route className="w-6 h-6 mr-2 text-blue-400" />
                            Optimal Route Details
                        </h2>

                        {/* Route Summary */}
                        <div className="grid md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-4 rounded-lg border border-green-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-300 font-medium">
                                            Distance
                                        </p>
                                        <p className="text-2xl font-bold text-green-200">
                                            {routeData.distance} km
                                        </p>
                                    </div>
                                    <Navigation className="w-8 h-8 text-green-400" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-900 to-cyan-900 p-4 rounded-lg border border-blue-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-300 font-medium">Fare</p>
                                        <p className="text-2xl font-bold text-blue-200 flex items-center">
                                            <IndianRupee className="w-5 h-5" />
                                            {routeData.fare}
                                        </p>
                                    </div>
                                    <IndianRupee className="w-8 h-8 text-blue-400" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-900 to-violet-900 p-4 rounded-lg border border-purple-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-300 font-medium">
                                            Travel Time
                                        </p>
                                        <p className="text-2xl font-bold text-purple-200">
                                            {routeData.estimatedTime} min
                                        </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-purple-400" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-900 to-amber-900 p-4 rounded-lg border border-orange-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-orange-300 font-medium">
                                            Interchanges
                                        </p>
                                        <p className="text-2xl font-bold text-orange-200">
                                            {routeData.interchanges}
                                        </p>
                                    </div>
                                    <Route className="w-8 h-8 text-orange-400" />
                                </div>
                            </div>
                        </div>

                        {/* Route Path */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-100 mb-4">
                                Shortest Path ({routeData.path.length} stations)
                            </h3>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    {routeData.path.map((station, index) => (
                                        <React.Fragment key={index}>
                                            <div
                                                className={`px-3 py-2 rounded-lg text-sm font-medium border ${getStationColor(
                                                    station,
                                                    index,
                                                    routeData.path.length
                                                )}`}
                                            >
                                                {station}
                                                {index === 0 && (
                                                    <span className="ml-1 text-xs text-green-300">(Start)</span>
                                                )}
                                                {index === routeData.path.length - 1 && (
                                                    <span className="ml-1 text-xs text-red-300">(End)</span>
                                                )}
                                            </div>
                                            {index < routeData.path.length - 1 && (
                                                <div className="text-gray-500 text-lg">→</div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Algorithm Info */}
                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg border border-blue-800">
                            <h4 className="font-semibold text-blue-200 mb-2">
                                Algorithm Details
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-300">
                                <div>
                                    <strong>Algorithm:</strong> Dijkstra's Shortest Path
                                </div>
                                <div>
                                    <strong>Data Structure:</strong> Min-Heap Priority Queue
                                </div>
                                <div>
                                    <strong>Graph Representation:</strong> Adjacency Matrix
                                </div>
                                <div>
                                    <strong>Complexity:</strong> O(V log V + E log V)
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);

// Update getStationColor for dark mode

