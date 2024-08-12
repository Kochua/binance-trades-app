import { FC, memo, useState } from "react";
import { Modal, TextInput, View, Text, Button } from "react-native";

interface LimitModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSelect: (lowerLimit: number, upperLimit: number) => void;
}

export const LimitModal: FC<LimitModalProps> = memo(
  ({ visible, setVisible, onSelect }) => {
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");

    const handleCloseModal = () => {
      setVisible(false);
    };

    const handleSave = () => {
      handleCloseModal();
      onSelect(Number(input1), Number(input2));
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
            <Text>Lower Limit:</Text>
            <TextInput
              value={input1}
              onChangeText={setInput1}
              style={{ height: 40, borderWidth: 1, width: "50%" }}
            />

            <Text>Upper Limit:</Text>
            <TextInput
              value={input2}
              onChangeText={setInput2}
              style={{ height: 40, borderWidth: 1, width: "50%" }}
            />

            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={handleCloseModal} />
          </View>
        </Modal>
      </View>
    );
  }
);
