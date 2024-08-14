import React, { useState, useEffect } from "react";
import { FlatList, Text, View, StyleSheet, Button } from "react-native";

import { LimitModal } from "@/components/LimitModal";
import { MessageModal } from "@/components/MessageModal";
import { ThemedView } from "@/components/ThemedView";
import TradeItem from "@/components/TradeItem";
import { Trade } from "@/context/TradesProvider";
import { useTrades } from "@/hooks/useTrades";

const BinanceSocketScreen = () => {
  const { trades, currentPrice } = useTrades();

  const [limitVisible, setLimitVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [message, setMessage] = useState("");

  const [lowerLimit, setLowerLimit] = useState<number | null>(null);
  const [upperLimit, setUpperLimit] = useState<number | null>(null);

  const handleSelect = (lowerLimit: number, upperLimit: number) => {
    setLowerLimit(lowerLimit);
    setUpperLimit(upperLimit);
  };

  useEffect(() => {
    if (!lowerLimit || !upperLimit || messageVisible) return;

    if (lowerLimit > currentPrice) {
      setMessageVisible(true);
      setMessage("Lower limit is too low");

      return;
    }

    if (currentPrice > upperLimit) {
      setMessageVisible(true);
      setMessage("Higher limit is too high");
      return;
    }
  }, [currentPrice, lowerLimit, upperLimit]);

  const renderItem = ({ item }: { item: Trade }) => {
    return <TradeItem trade={item} />;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={{ marginVertical: 20 }}>
        <Button title="Set Limits" onPress={() => setLimitVisible(true)} />

        <Text style={styles.text}>
          Current Price: <Text style={styles.highlight}>{currentPrice}</Text>
        </Text>
        <Text style={styles.text}>
          Lower Limit: <Text style={styles.highlight}>{lowerLimit}</Text>
        </Text>
        <Text style={styles.text}>
          Upper Limit: <Text style={styles.highlight}>{upperLimit}</Text>
        </Text>
      </View>
      <FlatList
        data={trades.slice(0, 100)}
        keyExtractor={(item) => item.t?.toString()}
        renderItem={renderItem}
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

      <LimitModal
        visible={limitVisible}
        setVisible={setLimitVisible}
        onSelect={handleSelect}
      />

      <MessageModal
        visible={messageVisible}
        setVisible={() => {
          setLowerLimit(null);
          setUpperLimit(null);
          setMessageVisible(false);
        }}
        message={message}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 70,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  highlight: {
    color: "#007AFF",
  },
});

export default BinanceSocketScreen;
