import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useTask } from '@/hooks/useTask';
import { styles } from './styles';
import { ButtonModal } from '../buttonModal';
import { useEffect, useState } from 'react';
import { theme } from '@/styles/theme';
import { Trash2, X } from 'lucide-react-native';
import { GroupProps } from '@/@types/group';

export function ModalSelectGroup() {
    const { data, modalState, setModalState, setData, handleAddAnnotationByGroup } = useTask();

    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
    const [combinedGroups, setCombinedGroups] = useState<GroupProps[]>([]);
    const [removeGroup, setRemoveGroup] = useState<string[]>([]);



    // const isDisabled = !selectedGroup || !accessType;

    function toggleSection(key: string) {
        setDropdownOpen(prev => ({ [key]: !prev[key] }));
    }


    useEffect(() => {
        const filteredGroups = data.groups?.filter(
            (group) => data.annotationById?.groupId?.includes(group._id)
        ) || [];

        setCombinedGroups(
            filteredGroups.filter(item => !removeGroup.includes(item._id))
        );
    }, [data.member, modalState.data, removeGroup]);

    function handleConfirmSelection() {
        if (selectedGroup) {
            setData(prevdata => ({ ...prevdata, selectedGroup: { _id: selectedGroup, icon: 0 } }));
            handleAddAnnotationByGroup(data.annotationById?._id, selectedGroup)
            setSelectedGroup(null);
            setDropdownOpen({});
            setModalState({ name: null });
        }
    }

    async function handleRemoveGroup(id: string) {
        setRemoveGroup(prev => {
            if (!prev.includes(id)) {
                return [...prev, id];
            }
            return prev;
        });

    }

    return (
        <Modal isVisible={modalState.name === 'isSelectGroupOpen'}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Selecionar Grupo</Text>
                <FlatList
                    data={combinedGroups}
                    keyExtractor={(item) => item._id}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({ item }) => (
                        <View style={styles.memberItem}>
                            <Text style={styles.memberText}>
                                {item?.name || 'Nome'}
                            </Text>
                            <TouchableOpacity onPress={() => handleRemoveGroup(item._id)}>
                                <Trash2 size={16} color={theme.red} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <TouchableOpacity
                    style={styles.accessType}
                    onPress={() => toggleSection("group")}
                >
                    <Text style={{ color: theme.gray1 }}>
                        {data.groups && selectedGroup
                            && data.groups.find(group => group._id === selectedGroup)?.name || 'Escolha um grupo'
                        }

                    </Text>
                    <Text style={{ color: theme.gray1 }}>▼</Text>
                </TouchableOpacity>
                {/* Lista de grupos */}
                {dropdownOpen["group"] && <FlatList
                    data={data.groups}
                    keyExtractor={(item) => item._id}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => { setSelectedGroup(item._id); setDropdownOpen({}); }}
                        >
                            <Text style={styles.memberText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    style={[styles.dropdownList, { top: 100 }]}
                />
                }
                <ButtonModal
                    CreateItem={handleConfirmSelection}
                    color={theme.blue1}
                    handleOnVisible={() => setModalState({ name: null })}
                />
            </View>
        </Modal>
    );
}
