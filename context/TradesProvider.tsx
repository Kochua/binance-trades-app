import { Queue } from "@/helpers";
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

const SHOW_TRADES_MILLISECONDS = 100;
const MAX_LIMIT_TRADES = 2000;

export type Trade = {
  t: number; // Trade ID
  p: string; // Price
  q: string; // Quantity
  T: Date; // Trade time
};

interface TradesContextType {
  trades: Trade[];
  currentPrice: number;
}

const defaultValue: TradesContextType = {
  trades: [],
  currentPrice: 0,
};

// Create the context with the defined type
export const TradesContext = createContext<TradesContextType>(defaultValue);

export const TradesProvider = ({ children }: { children: ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);

  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const queue = new Queue();

  const handleOnMessageQueue = (event: MessageEvent<any>) => {
    const message: Trade = JSON.parse(event.data);
    queue.enqueue(message);
  };

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

    ws.current.onmessage = handleOnMessageQueue;

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

  // Dequeue the message from the queue and update the trades state
  useEffect(() => {
    const interval = setInterval(() => {
      if (queue.isEmpty()) return;

      const message = queue.dequeue();
      setTrades((prevState) => {
        const updatedTrades = [...prevState];
        updatedTrades.unshift(message);

        if (updatedTrades.length > MAX_LIMIT_TRADES) {
          updatedTrades.pop();
        }
        return updatedTrades;
      });
      setCurrentPrice(Number(message.p));
    }, SHOW_TRADES_MILLISECONDS);

    return () => clearInterval(interval);
  }, []);

  return (
    <TradesContext.Provider value={{ trades, currentPrice }}>
      {children}
    </TradesContext.Provider>
  );
};
