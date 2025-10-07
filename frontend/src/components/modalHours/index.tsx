import { useTask } from "@/hooks/useTask";
import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { styles } from "./styles";

export function ModalHours() {
  const { setUiState, setModalState, modalState } = useTask();
  const [hour, setHour] = useState("08");
  const [minute, setMinute] = useState("00");

  const hourRef = useRef<FlatList<string> | null>(null);
  const minuteRef = useRef<FlatList<string> | null>(null);

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  const ITEM_HEIGHT = 36;

  function handleConfirm() {
    setUiState((prev) => ({ ...prev, hours: `${hour}:${minute}` }));
    setModalState({ name: null });
  }

  useEffect(() => {
    if (modalState.name === "isSelectHoursOpen") {
      const [h, m] = modalState.data?.hours?.split(":") || ["08", "00"];
      setHour(h.padStart(2, "0"));
      setMinute(m.padStart(2, "0"));

      const hourIndex = hours.findIndex((item) => item === h);
      const minuteIndex = minutes.findIndex((item) => item === m);

      setTimeout(() => {
        hourRef.current?.scrollToIndex({
          index: hourIndex >= 0 ? hourIndex : 8,
          animated: false,
        });
        minuteRef.current?.scrollToIndex({
          index: minuteIndex >= 0 ? minuteIndex : 0,
          animated: false,
        });
      }, 100);
    }
  }, [modalState.name]);

  const renderPicker = (
    data: string[],
    selected: string,
    setSelected: (value: string) => void,
    ref: React.RefObject<FlatList<string> | null>
  ) => (
    <FlatList
      ref={ref}
      data={data}
      keyExtractor={(item) => item}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.y / ITEM_HEIGHT
        );
        setSelected(data[index]);
      }}
      renderItem={({ item }) => (
        <View style={[styles.item, item === selected && styles.selectedItem]}>
          <Text
            style={[styles.itemText, item === selected && styles.selectedText]}
          >
            {item}
          </Text>
        </View>
      )}
    />
  );

  return (
    <Modal
      visible={modalState.name === "isSelectHoursOpen"}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Choose Time</Text>
          <View style={styles.separator} />

          <View style={styles.pickerRow}>
            {renderPicker(hours, hour, setHour, hourRef)}
            <Text style={styles.colon}>:</Text>
            {renderPicker(minutes, minute, setMinute, minuteRef)}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => setModalState({ name: null })}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
