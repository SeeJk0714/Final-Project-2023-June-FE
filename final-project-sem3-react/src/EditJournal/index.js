import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import {
    Container,
    Title,
    Space,
    Card,
    TextInput,
    PasswordInput,
    Divider,
    Button,
    Group,
    Select,
} from "@mantine/core";
import { RichTextEditor, Link as EditorLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { getJournal, updateJournal } from "../api/journal";
import { TiTickOutline } from "react-icons/ti";

export default function EditJournal() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const { id } = useParams();
    const navigate = useNavigate();
    const [journal, setJouranl] = useState({});
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("");
    const [password, setPassword] = useState("");
    const { isLoading } = useQuery({
        queryKey: ["journal", id],
        queryFn: () => getJournal(id),
        onSuccess: (data) => {
            setJouranl(data);
            setTitle(data.title);
            setContent(data.content);
            setStatus(data.status);
            setPassword(data.password);
        },
    });

    const isUser = useMemo(() => {
        return cookies &&
            cookies.currentUser &&
            cookies.currentUser.role === "user"
            ? true
            : false;
    }, [cookies]);

    const isAdmin = useMemo(() => {
        return cookies &&
            cookies.currentUser &&
            cookies.currentUser.role === "admin"
            ? true
            : false;
    }, [cookies]);

    const editor = useEditor(
        {
            extensions: [
                StarterKit,
                Underline,
                EditorLink,
                Highlight,
                TextAlign,
            ],
            content: content,
            onUpdate: ({ editor }) => {
                setContent(editor.getHTML());
            },
        },
        [journal]
    );

    const updateMutation = useMutation({
        mutationFn: updateJournal,
        onSuccess: () => {
            notifications.show({
                title: "Journal Edited",
                color: "green",
            });
            navigate("/");
        },
        onError: (error) => {
            notifications.show({
                title: error.response.data.message,
                color: "red",
            });
        },
    });

    const handleUpdateJournal = async (event) => {
        event.preventDefault();
        updateMutation.mutate({
            id: id,
            data: JSON.stringify({
                title: title,
                content: content,
                status: status,
                password: password,
            }),
            token: currentUser ? currentUser.token : "",
        });
    };

    return (
        <Container>
            <Space h="50px" />
            <Title order={2} align="center">
                Edit Plan
            </Title>
            <Space h="50px" />
            <Card withBorder shadow="md" p="20px">
                <TextInput
                    value={title}
                    placeholder="Enter the journal title here"
                    label="Title"
                    onChange={(event) => setTitle(event.target.value)}
                />
                <Space h="20px" />
                <Divider />
                <Space h="20px" />
                <RichTextEditor editor={editor}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content />
                </RichTextEditor>
                <Space h="20px" />
                <Divider />
                <Space h="20px" />
                <Select
                    radius="lg"
                    placeholder="Select a Category"
                    label="Status"
                    data={["Public", "Private"]}
                    value={status}
                    onChange={setStatus}
                />

                {status === "Private" ? (
                    <>
                        <Space h="30px" />
                        <PasswordInput
                            label="Password"
                            placeholder="123456789"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                        />
                    </>
                ) : null}
                <Space h="50px" />
                <Button
                    color="green"
                    fullWidth
                    onClick={handleUpdateJournal}
                    disabled={isUser || isAdmin ? false : true}
                >
                    Edit Journal <TiTickOutline size="20" />
                </Button>
            </Card>
            <Space h="20px" />
            <Group position="center">
                <Button
                    component={Link}
                    to="/"
                    variant="subtle"
                    size="xs"
                    color="gray"
                >
                    Go back to Journal
                </Button>
            </Group>
            <Space h="100px" />
        </Container>
    );
}
