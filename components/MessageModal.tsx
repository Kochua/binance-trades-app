import { FC, useState } from "react";
import { Modal, View, Text, Button } from "react-native";

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
    <View>
      <Modal visible={visible} animationType="slide">
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: "30%",
          }}
        >
          <Text>{message}</Text>

          <Button title="Close" onPress={handleCloseModal} />
        </View>
      </Modal>
    </View>
  );
};
