import { Button, Flex, TextInput } from "@mantine/core";
import { Translation } from "./firebase";
import { isNotEmpty, useForm } from "@mantine/form";

interface TranslationFormProps {
    selectedWord?: Translation;
    onSubmit: (value: Translation) => void;
    errorMessage?: string;
}

export const TranslationForm = ({
    selectedWord,
    onSubmit,
    errorMessage,
}: TranslationFormProps) => {
    const form = useForm<Translation>({
        mode: "uncontrolled",
        initialValues: {
            de: selectedWord?.de ?? "",
            hu: selectedWord?.hu ?? "",
        },
        validate: {
            hu: isNotEmpty("Word is required"),
            de: isNotEmpty("Word is required"),
        },
    });

    return (
        <form onSubmit={form.onSubmit(onSubmit)}>
            <Flex
                gap="md"
                justify="center"
                align="center"
                direction="column"
            >
                <TextInput
                    {...form.getInputProps("de")}
                    label="German"
                    placeholder="Add word"
                    variant="filled"
                    radius="lg"
                    size="lg"
                />

                <TextInput
                    {...form.getInputProps("hu")}
                    label="Hungarian"
                    placeholder="Add word"
                    variant="filled"
                    radius="lg"
                    size="lg"
                />
                <Button
                    type="submit"
                    variant="filled"
                    color="lime"
                    radius="lg"
                    size="lg"
                >
                    Save
                </Button>
                {errorMessage}
            </Flex>
        </form>
    );
};
