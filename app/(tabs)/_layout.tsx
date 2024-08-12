import { LimitModal } from "@/components/LimitModal";
import { MessageModal } from "@/components/MessageModal";
import { ThemedView } from "@/components/ThemedView";
import { calculateAveragePrice, getHourAndMinute } from "@/helpers";
import useTrades, { Trade } from "@/hooks/useTrades";
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Text, View, StyleSheet, Button } from "react-native";

const BinanceSocketScreen = () => {
  const { trades, currentPrice } = useTrades();

  const [limitVisible, setLimitVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [message, setMessage] = useState("");

  const [lowerLimit, setLowerLimit] = useState<number | null>(null);
  const [upperLimit, setUpperLimit] = useState<number | null>(null);

  const averagePrices = calculateAveragePrice(trades);

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

  const dataToRender = Object.keys(trades).map((minute) => ({
    minute,
    data: trades[minute],
  }));
  const renderGroup = ({
    item,
  }: {
    item: {
      minute: string;
      data: Trade[];
    };
  }) => {
    const { hour, minute } = getHourAndMinute(new Date(item.minute));
    return (
      <View style={{}}>
        <View style={{ borderTopWidth: 1, paddingVertical: 15 }}>
          <Text style={{ fontSize: 20 }}>
            Time: {hour}:{minute} minutes
          </Text>
          <Text style={{ fontSize: 20 }}>
            Average price: {averagePrices[minute]}
          </Text>
        </View>

        <View style={{ paddingLeft: 20 }}>
          {item.data.reverse().map((trade, index) => (
            <View style={{ marginBottom: 12 }} key={trade.t}>
              <Text style={{ fontSize: 16 }}>
                Time: {hour}:{minute}
              </Text>
              <Text style={{ fontSize: 16 }}>
                Price: {trade.p}, Quantity: {trade.q}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={{ marginVertical: 20 }}>
        <Button title="Set Limits" onPress={() => setLimitVisible(true)} />

        <Text style={{ marginLeft: 20, fontSize: 16 }}>
          Current Price: {currentPrice}
        </Text>
        <Text style={{ marginLeft: 20, fontSize: 16 }}>
          Lower Limit: {lowerLimit}
        </Text>
        <Text style={{ marginLeft: 20, fontSize: 16 }}>
          Upper Limit: {upperLimit}
        </Text>
      </View>
      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.minute}
        renderItem={renderGroup}
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
    marginTop: 50,
  },
});

export default BinanceSocketScreen;
