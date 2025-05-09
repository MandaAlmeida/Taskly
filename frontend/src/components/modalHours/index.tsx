import { useTask } from '@/hooks/useTask';
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native';
import { styles } from './styles';

const { height } = Dimensions.get('window');

interface Props {
    isVisible: boolean;
    handleOnVisible: () => void;
}

export function ModalHours({ isVisible, handleOnVisible }: Props) {
    const { setUiState } = useTask()
    const [hour, setHour] = useState('08');
    const [minute, setMinute] = useState('00');

    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    function handleConfirm() {
        setUiState(prevUiState => ({ ...prevUiState, hours: `${hour}:${minute}` }));
        handleOnVisible();
    };

    const ITEM_HEIGHT = 36;

    const renderPicker = (
        data: string[],
        selected: string,
        setSelected: (value: string) => void
    ) => (
        <FlatList
            data={data}
            keyExtractor={(item) => item}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            contentContainerStyle={{
                paddingVertical: (ITEM_HEIGHT * 2),
            }}
            getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
            })}
            onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                setSelected(data[index]);
            }}
            renderItem={({ item }) => (
                <View style={[styles.item, item === selected && styles.selectedItem]}>
                    <Text
                        style={[
                            styles.itemText,
                            item === selected && styles.selectedText
                        ]}
                    >
                        {item}
                    </Text>
                </View>
            )}
        />
    );

    return (
        <Modal visible={isVisible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <Text style={styles.title}>Choose Time</Text>
                    <View style={styles.separator} />

                    <View style={styles.pickerRow}>
                        {renderPicker(hours, hour, setHour)}
                        <Text style={styles.colon}>:</Text>
                        {renderPicker(minutes, minute, setMinute)}
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity onPress={handleOnVisible}>
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

