import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useTask } from '@/hooks/useTask';
import { styles } from './styles';
import { ButtonModal } from '../buttonModal';
import { useState } from 'react';
import { AnnotationProps } from '@/@types/annotation';
import { theme } from '@/styles/theme';
import { X } from 'lucide-react-native';

type Props = {
    isVisible: boolean;
    item: AnnotationProps | undefined;
    handleOnVisible: () => void;
};

const permissionLevels = ['ADMIN', 'EDITOR', 'DELETE', 'VIEWER'];

export function ModalCreateMember({ isVisible, handleOnVisible, item }: Props) {
    const { getUserMember, data, setData } = useTask();

    const [name, setName] = useState('');
    const [accessType, setAccessType] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const isDisebled = !name || !accessType

    async function handleAddMember() {
        getUserMember(name, accessType);

        setName('');
        setAccessType('');
        setDropdownOpen(false);
    }

    async function handleRemoveMember(name: string) {
        setData(prevData => ({
            ...prevData,
            member: prevData.member.filter((m: any) => m.name !== name)
        }));
    }


    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Adicionar membro</Text>

                {/* Lista de membros adicionados */}
                <FlatList
                    data={data.member}
                    keyExtractor={(_, index) => index.toString()}
                    ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                    renderItem={({ item }) => (
                        <View style={styles.memberItem}>
                            <Text style={styles.memberText}>
                                {item?.name || 'Nome'} - {item.accessType}
                            </Text>
                            <TouchableOpacity onPress={() => handleRemoveMember(item.name)}>
                                <X size={16} color={theme.red} />
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
                    CreateItem={handleOnVisible}
                    color={theme.blue1}
                    handleOnVisible={handleOnVisible}
                />
            </View>
        </Modal>
    );
}
