import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import {
    Card,
    Group,
    Button,
    Space,
    Text,
    Container,
    Divider,
    PasswordInput,
} from "@mantine/core";
import { deleteJournal, getJournal } from "../api/journal";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineEditOff } from "react-icons/md";

export default function ShowJournal() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const { id } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("");
    const [password, setPassword] = useState("");
    const [chaeckPwd, setCheckPwd] = useState("");
    const [visible, setVisible] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const { isLoading } = useQuery({
        queryKey: ["journal", id],
        queryFn: () => getJournal(id),
        onSuccess: (data) => {
            setEmail(data.customerEmail);
            setDate(data.createDate);
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

    const checkPassword = () => {
        if (chaeckPwd === password) {
            setVisible(true);
            setShowForm(false);
        } else {
            setVisible(false);
            setShowForm(true);
        }
    };

    const deleteJournalMutation = useMutation({
        mutationFn: deleteJournal,
        onSuccess: () => {
            notifications.show({
                title: "Journal Deleted",
                color: "green",
            });
            navigate("/");
        },
    });

    return (
        <Container>
            {status === "Private" ? (
                <>
                    {showForm && (isUser || isAdmin) ? (
                        <>
                            <Card
                                hadow="sm"
                                padding="lg"
                                radius="md"
                                withBorder
                            >
                                <Text size="40px" ta="center">
                                    {title}
                                </Text>
                                <Text c="dimmed" ta="center">
                                    Enter the Password to read the private
                                    journal
                                </Text>
                                <Space h="50px" />
                                <PasswordInput
                                    label="Password"
                                    placeholder="123456789"
                                    size="lg"
                                    value={chaeckPwd}
                                    onChange={(event) => {
                                        setCheckPwd(event.target.value);
                                    }}
                                />
                                <Space h="50px" />
                                <Button fullWidth onClick={checkPassword}>
                                    Submit Password
                                </Button>
                                <Space h="20px" />
                            </Card>
                        </>
                    ) : null}
                    {visible ? (
                        <>
                            <Group position="apart">
                                {isUser || isAdmin ? (
                                    <Text size="40px" ta="center">
                                        {title}
                                    </Text>
                                ) : null}

                                <Group>
                                    <Button
                                        component={Link}
                                        to={`/edit_journal/${id}`}
                                        color="teal"
                                        disabled={
                                            isUser || isAdmin ? false : true
                                        }
                                    >
                                        <FaRegEdit size="20" />
                                    </Button>
                                    <Button
                                        color="red"
                                        disabled={
                                            isUser || isAdmin ? false : true
                                        }
                                        onClick={() => {
                                            deleteJournalMutation.mutate({
                                                id: id,
                                                token: currentUser
                                                    ? currentUser.token
                                                    : "",
                                            });
                                        }}
                                    >
                                        <MdOutlineEditOff size="20" />
                                    </Button>
                                </Group>
                            </Group>
                            <Space h="20px" />
                            <Divider />
                            <Space h="20px" />
                            <Group>
                                <Card
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    withBorder
                                >
                                    {isAdmin && <Text>User: {email}</Text>}
                                    <Text>Date: {date.slice(0, 10)}</Text>
                                </Card>
                            </Group>

                            {isUser || isAdmin ? (
                                <Text>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: content,
                                        }}
                                    />
                                </Text>
                            ) : null}

                            <Space h="70px" />
                        </>
                    ) : null}
                </>
            ) : (
                <>
                    <Group position="apart">
                        {isUser || isAdmin ? (
                            <Text size="40px" ta="center">
                                {title}
                            </Text>
                        ) : null}

                        <Group>
                            <Button
                                color="teal"
                                component={Link}
                                to={`/edit_journal/${id}`}
                                disabled={isUser || isAdmin ? false : true}
                            >
                                <FaRegEdit size="20" />
                            </Button>
                            <Button
                                color="red"
                                disabled={isUser || isAdmin ? false : true}
                                onClick={() => {
                                    deleteJournalMutation.mutate({
                                        id: id,
                                        token: currentUser
                                            ? currentUser.token
                                            : "",
                                    });
                                }}
                            >
                                <MdOutlineEditOff size="20" />
                            </Button>
                        </Group>
                    </Group>
                    <Space h="20px" />
                    <Divider />
                    <Space h="20px" />
                    <Group>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            {isAdmin && <Text>User: {email}</Text>}
                            <Text>Date: {date.slice(0, 10)}</Text>
                        </Card>
                    </Group>
                    {isUser || isAdmin ? (
                        <Text>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: content,
                                }}
                            />
                        </Text>
                    ) : null}

                    <Space h="70px" />
                </>
            )}

            <Button
                component={Link}
                to="/"
                variant="subtle"
                size="xs"
                color="gray"
            >
                Go back to Journal
            </Button>
        </Container>
    );
}
