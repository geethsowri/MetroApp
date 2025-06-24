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

class MinHeap {
  constructor() {
    this.heap = [];
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }
  left(i) {
    return 2 * i + 1;
  }
  right(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(node) {
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return min;
  }

  heapifyUp(i) {
    while (
      i > 0 &&
      this.heap[this.parent(i)].distance > this.heap[i].distance
    ) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  heapifyDown(i) {
    let minIndex = i;
    const left = this.left(i);
    const right = this.right(i);

    if (
      left < this.heap.length &&
      this.heap[left].distance < this.heap[minIndex].distance
    ) {
      minIndex = left;
    }

    if (
      right < this.heap.length &&
      this.heap[right].distance < this.heap[minIndex].distance
    ) {
      minIndex = right;
    }

    if (i !== minIndex) {
      this.swap(i, minIndex);
      this.heapifyDown(minIndex);
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

class MetroGraph {
  constructor() {
    this.stations = new Map();
    this.graph = [];
    this.stationNames = [];
    this.lineColors = new Map();
  }

  addStation(stationName, line = "red") {
    if (!this.stations.has(stationName)) {
      const index = this.stationNames.length;
      this.stations.set(stationName, index);
      this.stationNames.push(stationName);
      this.lineColors.set(stationName, line);

      for (let i = 0; i < this.graph.length; i++) {
        this.graph[i].push(Infinity);
      }
      this.graph.push(new Array(this.stationNames.length).fill(Infinity));
      this.graph[index][index] = 0;
    }
  }

  addEdge(station1, station2, distance, line = "red") {
    this.addStation(station1, line);
    this.addStation(station2, line);

    const idx1 = this.stations.get(station1);
    const idx2 = this.stations.get(station2);

    this.graph[idx1][idx2] = distance;
    this.graph[idx2][idx1] = distance;
  }

  dijkstra(sourceStation, destinationStation) {
    if (
      !this.stations.has(sourceStation) ||
      !this.stations.has(destinationStation)
    ) {
      throw new Error("Station not found in the metro network");
    }

    const sourceIdx = this.stations.get(sourceStation);
    const destIdx = this.stations.get(destinationStation);
    const n = this.stationNames.length;

    const distances = new Array(n).fill(Infinity);
    const previous = new Array(n).fill(-1);
    const visited = new Array(n).fill(false);
    const pq = new MinHeap();

    distances[sourceIdx] = 0;
    pq.insert({ vertex: sourceIdx, distance: 0 });

    while (!pq.isEmpty()) {
      const current = pq.extractMin();
      const { vertex: u } = current;

      if (visited[u]) continue;
      visited[u] = true;

      if (u === destIdx) break;

      for (let v = 0; v < n; v++) {
        if (!visited[v] && this.graph[u][v] !== Infinity) {
          const newDistance = distances[u] + this.graph[u][v];

          if (newDistance < distances[v]) {
            distances[v] = newDistance;
            previous[v] = u;
            pq.insert({ vertex: v, distance: newDistance });
          }
        }
      }
    }

    const path = [];
    let current = destIdx;

    while (current !== -1) {
      path.unshift(this.stationNames[current]);
      current = previous[current];
    }

    if (path[0] !== sourceStation) {
      return {
        path: [],
        distance: Infinity,
        fare: 0,
        estimatedTime: 0,
        interchanges: 0,
      };
    }

    return {
      path: path,
      distance: Math.round(distances[destIdx] * 10) / 10,
      fare: this.calculateFare(distances[destIdx]),
      estimatedTime: this.calculateTime(path.length),
      interchanges: this.calculateInterchanges(path),
    };
  }

  calculateFare(distance) {
    if (distance <= 2) return 10;
    if (distance <= 5) return 15;
    if (distance <= 10) return 20;
    if (distance <= 15) return 25;
    if (distance <= 20) return 30;
    if (distance <= 25) return 40;
    if (distance <= 30) return 50;
    return Math.min(62, Math.ceil(distance * 2));
  }

  calculateTime(stationCount) {
    const stationTime = (stationCount - 1) * 2;
    const waitTime = 3;
    return Math.round(stationTime + waitTime);
  }

  calculateInterchanges(path) {
    let interchanges = 0;
    let currentLine = null;

    for (const station of path) {
      const stationLine = this.lineColors.get(station);
      if (currentLine && currentLine !== stationLine) {
        interchanges++;
      }
      currentLine = stationLine;
    }

    return interchanges;
  }
}

const MetroApp = () => {
  const [sourceStation, setSourceStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const metroGraph = useMemo(() => {
    const graph = new MetroGraph();

    const redLineConnections = [
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

    const blueLineConnections = [
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

    const greenLineConnections = [
      ["JBS", "Parade Ground", 1.0],
      ["Parade Ground", "MG Bus Station", 2.0],
      ["MG Bus Station", "Imlibun", 1.1],
      ["Imlibun", "Charminar", 1.0],
      ["Charminar", "Salarjung Museum", 0.8],
      ["Salarjung Museum", "Shamshabad", 1.5],
      ["Shamshabad", "Falaknuma", 1.3],
    ];

    redLineConnections.forEach(([station1, station2, distance]) => {
      graph.addEdge(station1, station2, distance, "red");
    });

    blueLineConnections.forEach(([station1, station2, distance]) => {
      graph.addEdge(station1, station2, distance, "blue");
    });

    greenLineConnections.forEach(([station1, station2, distance]) => {
      graph.addEdge(station1, station2, distance, "green");
    });

    graph.addEdge("Ameerpet", "Begumpet", 2.5, "interchange");
    graph.addEdge("MG Bus Station", "Imlibun", 1.5, "interchange");
    graph.addEdge("JBS", "Jubilee Hills Check Post", 0.5, "interchange");

    return graph;
  }, []);

  const metroStations = useMemo(() => {
    return [...metroGraph.stationNames].sort();
  }, [metroGraph]);

  const calculateRoute = async (source, destination) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return metroGraph.dijkstra(source, destination);
  };

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
      const result = await calculateRoute(sourceStation, destinationStation);

      if (result.path.length === 0) {
        setError("No route found between the selected stations.");
        setRouteData(null);
      } else {
        setRouteData(result);
      }
    } catch (err) {
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

  const getStationColor = (station, index, totalStations) => {
    if (index === 0) return "bg-green-950 text-green-300 border-green-800";
    if (index === totalStations - 1)
      return "bg-red-950 text-red-300 border-red-800";
    const line = metroGraph.lineColors.get(station);
    switch (line) {
      case "red":
        return "bg-red-900 text-red-300 border-red-800";
      case "blue":
        return "bg-blue-900 text-blue-300 border-blue-800";
      case "green":
        return "bg-green-900 text-green-300 border-green-800";
      default:
        return "bg-purple-900 text-purple-300 border-purple-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      <div className="container mx-auto px-4 py-8">
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
            Shortest path calculation
          </div>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 mb-8 border border-gray-800">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
              {error && (
                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="cursor-pointer flex-1 bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-800 hover:to-indigo-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
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
                  className="cursor-pointer px-6 py-3 border border-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-800 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          {routeData && (
            <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Route className="w-6 h-6 mr-2 text-blue-400" />
                Optimal Route Details
              </h2>
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
                            <span className="ml-1 text-xs text-green-300">
                              (Start)
                            </span>
                          )}
                          {index === routeData.path.length - 1 && (
                            <span className="ml-1 text-xs text-red-300">
                              (End)
                            </span>
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
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg border border-blue-800">
                <h4 className="font-semibold text-blue-200 mb-2">
                  Algorithm Details
                </h4>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-blue-300">
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
};

export default MetroApp;
