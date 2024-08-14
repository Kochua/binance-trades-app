import React from "react";
import { StyleSheet } from "react-native";

import { getHourAndMinute } from "@/helpers";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Trade } from "@/context/TradesProvider";

interface TradeItemProps {
  trade: Trade;
}

const TradeItem: React.FC<TradeItemProps> = ({ trade }) => {
  const { hour, minute } = getHourAndMinute(trade.T);
  return (
    <ThemedView style={styles.itemContainer}>
      <ThemedText style={styles.itemText}>
        Time: {hour}:{minute}, ID: {trade.t?.toString()}
      </ThemedText>
      <ThemedText style={styles.itemText}>
        Price: {trade.p}, Quantity: {trade.q}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 12,
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: "#333333",
  },
});

export default TradeItem;
