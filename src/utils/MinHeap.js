export default class MinHeap {
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
