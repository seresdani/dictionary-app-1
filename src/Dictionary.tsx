import { useCallback, useEffect, useState } from "react";
import "./App.css";
import {
    Translation,
    getDictionaryArray,
    saveToDictionary,
    updateDictionary,
} from "./firebase";
import {
    ActionIcon,
    Button,
    Center,
    Flex,
    Box,
    Group,
    Loader,
    Modal,
    TextInput,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { useDisclosure } from "@mantine/hooks";
import { DictionaryTable } from "./DictionaryTable";
import { TranslationForm } from "./TranslationForm";
import { DeleteAlert } from "./DeleteAlert";
import { ArrowBack } from "./ArrowBack";
import { Magnifier } from "./Magnifier";

interface DictionaryProps {
    onBack: () => void;
}

export const Dictionary = ({ onBack }: DictionaryProps) => {
    const [loading, setLoading] = useState(false);
    const [dictionary, setDictionary] = useState<Translation[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedTranslation, setSelectedTranslation] = useState<
        Translation | undefined
    >();
    const [modalType, setModalType] = useState<
        "add" | "edit" | "delete" | undefined
    >();

    const getDictionary = useCallback(async () => {
        return getDictionaryArray();
    }, []);

    useEffect(() => {
        setLoading(true);
        getDictionary()
            .then((r) => setDictionary(r))
            .then(() => setLoading(false));
    }, [getDictionary]);

    const onSave = async (newTranslation: Translation) => {
        const exist = dictionary.find(
            (w) =>
                w.de.toLowerCase() == newTranslation.de.toLowerCase() ||
                w.hu.toLowerCase() == newTranslation.hu.toLowerCase()
        );
        if (exist) {
            setErrorMessage("Translation already exists!");
        } else {
            const result = await saveToDictionary(newTranslation);
            if (result) {
                close();
                setDictionary((prevState) => [...prevState, result]);
            }
        }
    };

    const onUpdate = async (newWord: Translation) => {
        if (selectedTranslation) {
            const index = dictionary.findIndex(
                (word) => word.id === selectedTranslation?.id
            );
            dictionary[index] = { id: selectedTranslation.id, ...newWord };
            const result = await updateDictionary(dictionary);
            if (result) {
                setDictionary(result);
                setSelectedTranslation(undefined);
                close();
            }
        }
    };

    const onDelete = async () => {
        if (selectedTranslation) {
            const index = dictionary.findIndex(
                (word) => word.id === selectedTranslation?.id
            );
            dictionary.splice(index, 1);
            const result = await updateDictionary(dictionary);
            if (result) {
                setDictionary(result);
                setSelectedTranslation(undefined);
                close();
            }
        }
    };

    const openModal = (type: "add" | "edit" | "delete", word?: Translation) => {
        setModalType(type);
        setSelectedTranslation(word);
        open();
    };
    //248 219 148
    return (
        <Flex
            align="center"
            direction="column"
            mih="100vh"
            bg="linear-gradient(0deg, rgb(214,251,251) 0%, rgb(255, 255, 255) 100%)"
        >
            <Group justify="space-between" wrap="nowrap" p={24} w="100%">
                <ActionIcon
                    onClick={onBack}
                    size={50}
                    radius="lg"
                    aria-label="Gradient action icon"
                    color="#e3fafc"
                >
                    <ArrowBack />
                </ActionIcon>
                <TextInput
                    placeholder="Search word"
                    size="lg"
                    radius="lg"
                    variant="filled"
                    rightSectionPointerEvents="all"
                    rightSection={<Magnifier aria-label="Search" />}
                />
            </Group>
            <Box
                w="100%"
                p={18}
                bg="linear-gradient(0deg, #d2ffff 0%, rgb(141,225,228) 100%)"
                style={{
                    borderRadius: "32px 32px 0 0",
                }}
            >
                <Center>
                    <Button
                        variant="filled"
                        color="#1098ad"
                        radius="lg"
                        onClick={() => openModal("add")}
                        size="lg"
                        m={24}
                    >
                        Add New Translation
                    </Button>
                </Center>
                {loading ? (
                    <Center p={24}>
                        <Loader size={50} color="#1098ad" />
                    </Center>
                ) : (
                    <DictionaryTable
                        translationList={dictionary}
                        onClickEdit={(word) => openModal("edit", word)}
                        onClickDelete={(word) => openModal("delete", word)}
                    />
                )}
            </Box>
            <Modal
                opened={opened}
                onClose={close}
                radius={"lg"}
                title={
                    modalType === "add"
                        ? "Add New Translation"
                        : modalType === "edit"
                        ? "Edit Translation"
                        : "Delete Translation"
                }
                centered
            >
                {modalType === "add" && (
                    <TranslationForm
                        onSubmit={onSave}
                        errorMessage={errorMessage}
                    />
                )}
                {modalType === "edit" && (
                    <TranslationForm
                        selectedWord={selectedTranslation}
                        onSubmit={onUpdate}
                        errorMessage={errorMessage}
                    />
                )}
                {modalType === "delete" && selectedTranslation && (
                    <DeleteAlert
                        selectedTranslation={selectedTranslation}
                        onDelete={onDelete}
                    />
                )}
            </Modal>
        </Flex>
    );
};
