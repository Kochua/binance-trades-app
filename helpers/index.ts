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
