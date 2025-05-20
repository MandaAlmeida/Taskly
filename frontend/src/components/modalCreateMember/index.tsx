import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useTask } from '@/hooks/useTask';
import { styles } from './styles';
import { ButtonModal } from '../buttonModal';
import { useEffect, useState } from 'react';
import { theme } from '@/styles/theme';
import { Trash2, X } from 'lucide-react-native';
import { connectToSocket } from '@/notification';
import { membersProps } from '@/@types/annotation';

const permissionLevels = ['ADMIN', 'EDITOR', 'DELETE', 'VIEWER'];

export function ModalCreateMember() {
    const { getUserMember, data, setData, modalState, setModalState, handleAddMemberGroup, handleRemoveMemberGroup } = useTask();

    const [name, setName] = useState('');
    const [accessType, setAccessType] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [removeMember, setRemoveMember] = useState<string[]>([]);
    const [combinedMembers, setCombinedMembers] = useState<membersProps[]>([]);


    const isDisebled = !name || !accessType

    useEffect(() => {
        const merged = [
            ...(modalState.data || []),
            ...(data.member || [])
        ].filter(
            (item, index, self) =>
                index === self.findIndex((m) => m.userId === item.userId)
        );

        setCombinedMembers(
            merged.filter(item => !removeMember.includes(item.userId))
        );
    }, [data.member, modalState.data, removeMember]);



    async function handleAddMember() {
        getUserMember(name, accessType);

        if (data.member) {
            data.member.map(member => connectToSocket(member.userId))
        }

        setName('');
        setAccessType('');
        setDropdownOpen(false);
    }

    async function CreateMember() {
        if (modalState.data && data.selectedGroup) {
            handleAddMemberGroup(data.selectedGroup._id, data.member)
            if (removeMember) handleRemoveMemberGroup(data.selectedGroup._id, removeMember)

            setRemoveMember([])
        } else {
            setModalState({ name: null })
        }
    }



    async function handleRemoveMember(id: string) {
        setData(prevData => ({
            ...prevData,
            member: prevData.member.filter((m: any) => m.userId !== id)
        }));
        setRemoveMember(prev => {
            if (!prev.includes(id)) {
                return [...prev, id];
            }
            return prev;
        });

    }

    return (
        <Modal isVisible={modalState.name === 'isCreateMemberOpen'}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Adicionar membro</Text>

                {/* Lista de membros adicionados */}
                <FlatList
                    data={combinedMembers}
                    keyExtractor={(item) => item.userId}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({ item }) => (
                        <View style={styles.memberItem}>
                            <Text style={styles.memberText}>
                                {item?.name || 'Nome'} - {item.accessType}
                            </Text>
                            <TouchableOpacity onPress={() => handleRemoveMember(item.userId)}>
                                <Trash2 size={16} color={theme.red} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View style={styles.containerInput}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do usuário..."
                        value={name}
                        onChangeText={setName}
                    />

                    <TouchableOpacity
                        style={styles.accessType}
                        onPress={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <Text style={{ color: theme.gray1 }}>
                            {accessType || 'Escolha nível de permissão'}
                        </Text>
                        <Text style={{ color: theme.gray1 }}>▼</Text>
                    </TouchableOpacity>
                </View>
                {dropdownOpen && (
                    <FlatList
                        data={permissionLevels}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setAccessType(item);
                                    setDropdownOpen(false);
                                }}
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                        style={styles.dropdownList}
                    />
                )}

                <TouchableOpacity onPress={handleAddMember} style={[styles.addButton, { backgroundColor: isDisebled ? `${theme.blue1}80` : theme.blue1 }]} disabled={isDisebled}>
                    <Text style={styles.addButtonText}>Adicionar membro</Text>
                </TouchableOpacity>

                <ButtonModal
                    CreateItem={() => CreateMember()}
                    color={theme.blue1}
                    handleOnVisible={() => setModalState({ name: null })}
                />
            </View>
        </Modal>
    );
}
