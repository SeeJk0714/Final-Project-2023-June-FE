import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import {
    Container,
    Title,
    Space,
    Card,
    TextInput,
    Divider,
    Button,
    Group,
} from "@mantine/core";
import { RichTextEditor, Link as EditorLink } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TimeInput, DatePickerInput } from "@mantine/dates";
import { addPlan } from "../api/plan";
import { IconClock } from "@tabler/icons-react";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function AddPlan() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const navigate = useNavigate();
    const [email, setEmail] = useState(currentUser ? currentUser.email : "");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

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

    const editor = useEditor({
        extensions: [StarterKit, Underline, EditorLink, Highlight, TextAlign],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    const createMutation = useMutation({
        mutationFn: addPlan,
        onSuccess: () => {
            notifications.show({
                title: "Plan Added",
                color: "green",
            });
            navigate("/plan");
        },
        onError: (error) => {
            notifications.show({
                title: error.response.data.message,
                color: "red",
            });
        },
    });

    const handleAddNewPlan = async (event) => {
        event.preventDefault();
        createMutation.mutate({
            data: JSON.stringify({
                title: title,
                content: content,
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
                customerEmail: email,
            }),
            token: currentUser ? currentUser.token : "",
        });
    };

    return (
        <Container>
            <Space h="50px" />
            <Title order={2} align="center">
                Add New Plan
            </Title>
            <Space h="50px" />
            <Card withBorder shadow="md" p="20px">
                <TextInput
                    value={title}
                    placeholder="Enter the movie title here"
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
                <Group>
                    <TimeInput
                        label="Start time"
                        icon={<IconClock size="1rem" stroke={1.5} />}
                        maw={400}
                        mx="end"
                        id="start-time"
                        value={startTime}
                        onChange={(event) => {
                            setStartTime(event.target.value);
                        }}
                    />
                    <Space w="xl" />
                    <TimeInput
                        label="End time"
                        icon={<IconClock size="1rem" stroke={1.5} />}
                        maw={400}
                        mx="end"
                        id="end-time"
                        value={endTime}
                        onChange={(event) => {
                            setEndTime(event.target.value);
                        }}
                    />
                </Group>
                <Space h="20px" />
                <Group>
                    <DatePickerInput
                        value={startDate}
                        onChange={(newStart) => {
                            setStartDate(newStart);
                        }}
                        label="Start Date"
                        placeholder="Start Date"
                        maw={400}
                        mx="end"
                        w={115}
                    />
                    <Space w="xl" />

                    <DatePickerInput
                        value={endDate}
                        onChange={(newEnd) => {
                            setEndDate(newEnd);
                        }}
                        label="End Date"
                        placeholder="End Date"
                        maw={400}
                        mx="end"
                        w={115}
                    />
                </Group>

                <Space h="50px" />

                <Button
                    color="green"
                    fullWidth
                    onClick={handleAddNewPlan}
                    disabled={isUser || isAdmin ? false : true}
                >
                    Add New Plan <IoIosAddCircleOutline size="20" />
                </Button>
            </Card>
            <Space h="20px" />
            <Group position="center">
                <Button
                    component={Link}
                    to="/plan"
                    variant="subtle"
                    size="xs"
                    color="gray"
                >
                    Go back to Plan
                </Button>
            </Group>
            <Space h="100px" />
        </Container>
    );
}
