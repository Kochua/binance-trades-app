export function getHourAndMinute(timestamp: Date) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  let minute = date.getMinutes();
  return { hour, minute };
}

export const calculateAveragePrice = (trades: { [key: string]: Trade[] }) => {
  const averagePrices: { [key: string]: number } = {};
  for (const date in trades) {
    const minuteTrades = trades[date];

    const { hour, minute } = getHourAndMinute(new Date(date));

    const totalPrice = minuteTrades.reduce(
      (sum, trade) => sum + Number(trade.p),
      0
    );

    const averagePrice = totalPrice / minuteTrades.length;
    averagePrices[minute] = averagePrice;
  }
  return averagePrices;
};

export class Queue {
  constructor() {
    this.items = [];
  }

  // Add an element to the queue (enqueue)
  enqueue(element) {
    this.items.push(element);
  }

  // Remove an element from the queue (dequeue)
  dequeue() {
    if (this.isEmpty()) {
      console.log("Queue is empty");
      return null;
    }
    return this.items.shift();
  }

  // Peek at the front element of the queue without removing it
  front() {
    if (this.isEmpty()) {
      console.log("Queue is empty");
      return null;
    }
    return this.items[0];
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get the size of the queue
  size() {
    return this.items.length;
  }

  // Print the elements in the queue
  printQueue() {
    console.log(this.items.toString());
  }
}
