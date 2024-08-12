import { useState, useEffect, useRef } from "react";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export type Trade = {
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  T: Date; // Trade time
};

function useTrades() {
  const ws = useRef<WebSocket | null>(null);

  const [groupedData, setGroupedData] = useState<{
    [key: string]: Trade[];
  }>({});

  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    ws.current = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@trade"
    );

    ws.current.onopen = () => {
      console.log("Connection established");
      ws.current?.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: ["btcusdt@trade"],
          id: 1,
        })
      );
    };

    ws.current.onmessage = debounce((event: MessageEvent<any>) => {
      const message: Trade = JSON.parse(event.data);

      const timestamp = new Date(message.T);
      const minuteKey = timestamp?.toISOString()?.slice(0, 16);

      setGroupedData((prevState) => {
        const updatedGroup = { ...prevState };

        if (!updatedGroup[minuteKey]) {
          updatedGroup[minuteKey] = [];
        }

        updatedGroup[minuteKey].push(message);

        const maxLimit = 20;
        if (updatedGroup[minuteKey].length > maxLimit) {
          updatedGroup[minuteKey] = updatedGroup[minuteKey].slice(-maxLimit);
        }

        return updatedGroup;
      });
      setCurrentPrice(Number(message.p));
    }, 100);

    ws.current.onclose = () => {
      console.log("Connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const trades = groupedData;

  return { trades, currentPrice };
}

export default useTrades;
