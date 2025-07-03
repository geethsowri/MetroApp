import MinHeap from "../utils/MinHeap";

export default class MetroGraph {
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
    if (!this.stations.has(sourceStation) || !this.stations.has(destinationStation)) {
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