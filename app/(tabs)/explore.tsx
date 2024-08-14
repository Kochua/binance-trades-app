import { StyleSheet, ScrollView } from "react-native";
import { useMemo } from "react";

import { Collapsible } from "@/components/Collapsible";
import { ThemedView } from "@/components/ThemedView";
import { useTrades } from "@/hooks/useTrades";
import { Trade } from "@/context/TradesProvider";
import TradeItem from "@/components/TradeItem";

export default function TabTwoScreen() {
  const { trades } = useTrades();

  const tradesGroupByMinute = useMemo(() => {
    let acc: { [key: number]: Trade[] } = {};

    // Group by minute
    trades.forEach((trade) => {
      const minute = new Date(trade.T).getMinutes();
      if (!minute || Number.isNaN(minute)) return;
      if (!acc[minute]) {
        acc[minute] = [];
      }

      acc[minute].push(trade);
    });

    const groupedList = Object.keys(acc).map((key) => {
      const _trades = acc[Number(key)];
      const priceSum = _trades.reduce((acc, trade) => {
        return acc + Number(trade.p);
      }, 0);

      const averagePrice = priceSum / _trades.length;

      return {
        key,
        trades: _trades,
        averagePrice,
      };
    });

    // Sort by descending order
    const sortedGroup = groupedList.sort((a, b) => {
      return Number(b.key) - Number(a.key);
    });

    return sortedGroup;
  }, [trades]);

  return (
    <ScrollView style={styles.container}>
      {tradesGroupByMinute.map((group) => (
        <Collapsible
          title={`Minute: ${group.key}, Average price: ${group.averagePrice}`}
        >
          <ThemedView>
            {group.trades.map((trade: Trade) => {
              return <TradeItem key={trade.t} trade={trade} />;
            })}
          </ThemedView>
        </Collapsible>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
  },
});
