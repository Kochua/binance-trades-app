import React, { FC } from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";

interface MessageModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  message: string;
}

export const MessageModal: FC<MessageModalProps> = ({
  visible,
  setVisible,
  message,
}) => {
  const handleCloseModal = () => {
    setVisible(false);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.messageText}>{message}</Text>
        <Button title="Close" onPress={handleCloseModal} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "30%",
  },
  messageText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
