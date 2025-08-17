import React, { useState, useMemo } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  IndianRupee,
  Route,
  Loader2,
  Zap,
} from "lucide-react";
import MetroGraph from "./core/MetroGraph";

const App = () => {
  const [sourceStation, setSourceStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const metroGraph = useMemo(() => {
    const graph = new MetroGraph();

    const redLine = [
      ["Miyapur", "JNTU College", 2.1],
      ["JNTU College", "KPHB Colony", 1.8],
      ["KPHB Colony", "Kukatpally", 1.2],
      ["Kukatpally", "Balanagar", 1.9],
      ["Balanagar", "Moosapet", 1.1],
      ["Moosapet", "Bharat Nagar", 1.3],
      ["Bharat Nagar", "Erragadda", 1.4],
      ["Erragadda", "ESI Hospital", 1.0],
      ["ESI Hospital", "S.R. Nagar", 1.2],
      ["S.R. Nagar", "Ameerpet", 1.8],
      ["Ameerpet", "Punjagutta", 1.5],
      ["Punjagutta", "Irrum Manzil", 1.1],
      ["Irrum Manzil", "Khairatabad", 1.0],
      ["Khairatabad", "Lakdi-ka-pul", 1.2],
      ["Lakdi-ka-pul", "Assembly", 0.8],
      ["Assembly", "Nampally", 1.1],
      ["Nampally", "Gandhi Bhavan", 0.9],
      ["Gandhi Bhavan", "Osmania Medical College", 1.2],
      ["Osmania Medical College", "MG Bus Station", 1.0],
      ["MG Bus Station", "Malakpet", 1.4],
      ["Malakpet", "New Market", 1.2],
      ["New Market", "Musarambagh", 1.1],
      ["Musarambagh", "Dilsukhnagar", 1.3],
      ["Dilsukhnagar", "Chaitanyapuri", 1.5],
      ["Chaitanyapuri", "Victoria Memorial", 1.2],
      ["Victoria Memorial", "LB Nagar", 1.8],
    ];
    const blueLine = [
      ["Nagole", "Uppal", 2.0],
      ["Uppal", "Stadium", 1.5],
      ["Stadium", "NGRI", 1.8],
      ["NGRI", "Habsiguda", 1.2],
      ["Habsiguda", "Tarnaka", 1.4],
      ["Tarnaka", "Mettuguda", 1.1],
      ["Mettuguda", "Secunderabad East", 1.3],
      ["Secunderabad East", "Parade Ground", 0.8],
      ["Parade Ground", "Secunderabad West", 1.0],
      ["Secunderabad West", "Begumpet", 1.9],
      ["Begumpet", "Madhura Nagar", 1.2],
      ["Madhura Nagar", "Yusufguda", 1.5],
      ["Yusufguda", "Jubilee Hills Check Post", 1.8],
      ["Jubilee Hills Check Post", "Peddamma Gudi", 1.0],
      ["Peddamma Gudi", "Madhapur", 1.4],
      ["Madhapur", "Durgam Cheruvu", 1.6],
      ["Durgam Cheruvu", "Hi-Tech City", 1.2],
      ["Hi-Tech City", "Raidurg", 1.5],
    ];
    const greenLine = [
      ["JBS", "Parade Ground", 1.0],
      ["Parade Ground", "MG Bus Station", 2.0],
      ["MG Bus Station", "Imlibun", 1.1],
      ["Imlibun", "Charminar", 1.0],
      ["Charminar", "Salarjung Museum", 0.8],
      ["Salarjung Museum", "Shamshabad", 1.5],
      ["Shamshabad", "Falaknuma", 1.3],
    ];

    redLine.forEach(([a, b, d]) => graph.addEdge(a, b, d, "red"));
    blueLine.forEach(([a, b, d]) => graph.addEdge(a, b, d, "blue"));
    greenLine.forEach(([a, b, d]) => graph.addEdge(a, b, d, "green"));

    graph.addEdge("Ameerpet", "Begumpet", 2.5, "interchange");
    graph.addEdge("MG Bus Station", "Imlibun", 1.5, "interchange");
    graph.addEdge("JBS", "Jubilee Hills Check Post", 0.5, "interchange");

    return graph;
  }, []);

  const metroStations = useMemo(
    () => [...metroGraph.stationNames].sort(),
    [metroGraph]
  );

  const handleSubmit = async () => {
    setError("");

    if (!sourceStation || !destinationStation) {
      setError("Please select both source and destination stations.");
      return;
    }

    if (sourceStation === destinationStation) {
      setError("Source and destination stations cannot be the same.");
      return;
    }

    setLoading(true);
    try {
      const result = await new Promise((resolve) =>
        setTimeout(
          () => resolve(metroGraph.dijkstra(sourceStation, destinationStation)),
          800
        )
      );

      if (result.path.length === 0) {
        setError("No route found between the selected stations.");
        setRouteData(null);
      } else {
        setRouteData(result);
      }
    } catch {
      setError("Failed to calculate route. Please try again.");
      setRouteData(null);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSourceStation("");
    setDestinationStation("");
    setRouteData(null);
    setError("");
  };

  const getStationColor = (station, index, total) => {
    if (index === 0) return "bg-green-900 text-green border-green-700";
    if (index === total - 1) return "bg-red-900 text-red border-red-700";
    const line = metroGraph.lineColors.get(station);
    switch (line) {
      case "red":
        return "bg-red-800 text-red border-red-700";
      case "blue":
        return "bg-blue-800 text-blue border-blue-700";
      case "green":
        return "bg-green-800 text-green border-green-700";
      default:
        return "bg-gray-800 text-gray border-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center mb-4 p-3 rounded-full bg-gray-800">
            <Navigation className="w-7 h-7 text-gray-300" />
          </div>
          <h1 className="text-3xl font-semibold mb-1 tracking-tight">
            Metro Route Finder
          </h1>
          <p className="text-sm text-gray-400">
            Hyderabad Metro — Powered by Dijkstra's Algorithm
          </p>
          <div className="mt-1 text-xs text-gray-500 flex items-center justify-center gap-1">
            <Zap className="w-4 h-4" /> Shortest path calculation
          </div>
        </header>

        {/* Form */}
        <section className="bg-gray-850 border border-gray-700 rounded-xl p-6 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label
                htmlFor="source"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                <MapPin className="inline w-4 h-4 mr-1" />
                Source Station
              </label>
              <select
                id="source"
                value={sourceStation}
                onChange={(e) => setSourceStation(e.target.value)}
                className="w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="" disabled>
                  Select source station
                </option>
                {metroStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium mb-2 text-gray-300"
              >
                <MapPin className="inline w-4 h-4 mr-1" />
                Destination Station
              </label>
              <select
                id="destination"
                value={destinationStation}
                onChange={(e) => setDestinationStation(e.target.value)}
                className="w-full rounded-md bg-gray-800 border border-gray-700 text-gray-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="" disabled>
                  Select destination station
                </option>
                {metroStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 select-none">{error}</p>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md py-3 font-semibold flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Calculating...
                </>
              ) : (
                <>
                  <Route className="w-5 h-5" />
                  Find Shortest Route
                </>
              )}
            </button>
            <button
              onClick={resetForm}
              className="cursor-pointer flex-1 border border-gray-700 text-gray-300 rounded-md py-3 font-semibold hover:bg-gray-800 transition"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Result */}
        {routeData && (
          <section className="bg-gray-850 border border-gray-700 rounded-xl p-6 shadow-sm">
            <h2 className="flex items-center text-xl font-semibold mb-6 text-gray-100 gap-2">
              <Route className="w-6 h-6 text-blue-400" />
              Optimal Route Details
            </h2>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-gray-300">
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
                <p className="text-xs uppercase tracking-wide mb-1 font-medium">
                  Distance
                </p>
                <p className="text-2xl font-bold">{routeData.distance} km</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center flex flex-col items-center justify-center gap-1">
                <p className="text-xs uppercase tracking-wide font-medium">
                  Fare
                </p>
                <div className="flex items-center text-2xl font-bold">
                  <IndianRupee className="w-5 h-5 mr-1" />
                  {routeData.fare}
                </div>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
                <p className="text-xs uppercase tracking-wide mb-1 font-medium">
                  Time
                </p>
                <p className="text-2xl font-bold">{routeData.estimatedTime} min</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 text-center">
                <p className="text-xs uppercase tracking-wide mb-1 font-medium">
                  Interchanges
                </p>
                <p className="text-2xl font-bold">{routeData.interchanges}</p>
              </div>
            </div>

            {/* Path */}
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Shortest Path ({routeData.path.length} stations)
              </h3>
              <div className="flex flex-wrap gap-2">
                {routeData.path.map((station, i) => (
                  <React.Fragment key={i}>
                    <div
                      className={`px-3 py-1 rounded-md text-sm font-medium border ${getStationColor(
                        station,
                        i,
                        routeData.path.length
                      )}`}
                    >
                      {station}
                      {i === 0 && (
                        <span className="ml-1 text-xs text-white">(Start)</span>
                      )}
                      {i === routeData.path.length - 1 && (
                        <span className="ml-1 text-xs text-white">(End)</span>
                      )}
                    </div>
                    {i < routeData.path.length - 1 && (
                      <div className="text-gray-500 text-lg select-none">→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Algorithm Info */}
            <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-md text-gray-400 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <strong className="text-gray-300">Algorithm:</strong> Dijkstra's Shortest Path
              </div>
              <div>
                <strong className="text-gray-300">Data Structure:</strong> Min-Heap Priority Queue
              </div>
              <div>
                <strong className="text-gray-300">Graph:</strong> Adjacency Matrix
              </div>
              <div>
                <strong className="text-gray-300">Complexity:</strong> O(V log V + E log V)
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;
