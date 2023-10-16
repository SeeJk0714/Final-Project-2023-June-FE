import { useState, useMemo } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import {
    Container,
    Space,
    Card,
    TextInput,
    Divider,
    Button,
    Group,
    Text,
    Grid,
} from "@mantine/core";

import { addList, ClickList, UnclickList, deleteList } from "../api/list";
import { getTodolist, deleteTodoList } from "../api/todolist";
import { BsSquare, BsXSquare } from "react-icons/bs";
import { RiDeleteBin4Line } from "react-icons/ri";
import { MdPlaylistRemove } from "react-icons/md";

export default function ShowList() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
    const [name, setName] = useState("");
    const [list, setList] = useState([]);
    const [title, setTitle] = useState("");
    const { isLoading } = useQuery({
        queryKey: ["todolist", id],
        queryFn: () => getTodolist(id),
        onSuccess: (data) => {
            setEmail(data.customerEmail);
            setDate(data.date);
            setTitle(data.title);
            setList(data.lists);
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

    const createListMutation = useMutation({
        mutationFn: addList,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todolist", id],
            });
            notifications.show({
                title: "List Added",
                color: "green",
            });
        },
        onError: (error) => {
            notifications.show({
                title: error.response.data.message,
                color: "red",
            });
        },
    });

    const handleAddNewList = async (event) => {
        event.preventDefault();
        createListMutation.mutate(
            JSON.stringify({
                name: name,
                todolists: id,
            })
        );
        setName("");
    };

    const clickMutation = useMutation({
        mutationFn: ClickList,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todolist", id],
            });
        },
    });

    const unclickMutation = useMutation({
        mutationFn: UnclickList,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todolist", id],
            });
        },
    });

    const deleteListMutation = useMutation({
        mutationFn: deleteList,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todolist", id],
            });
            notifications.show({
                title: "List Deleted",
                color: "green",
            });
        },
    });

    const deleteTodoListMutation = useMutation({
        mutationFn: deleteTodoList,
        onSuccess: () => {
            notifications.show({
                title: "Todo List Deleted",
                color: "green",
            });
            navigate("/todolist");
        },
    });

    return (
        <Container>
            <Group position="apart">
                {isUser || isAdmin ? (
                    <Text size="40px" ta="center">
                        {title}
                    </Text>
                ) : null}
                <Group>
                    <Button
                        size="xs"
                        color="red"
                        disabled={isUser || isAdmin ? false : true}
                        onClick={() => {
                            deleteTodoListMutation.mutate({
                                id: id,
                                token: currentUser ? currentUser.token : "",
                            });
                        }}
                    >
                        <MdPlaylistRemove size="20" />
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
            <Space h="50px" />
            <Grid justify="center">
                <Grid.Col span={8}>
                    <TextInput
                        radius="lg"
                        placeholder="Type your list here..."
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                    />
                </Grid.Col>
                <Grid.Col span={1}>
                    <Button
                        color="gray"
                        onClick={handleAddNewList}
                        disabled={isUser || isAdmin ? false : true}
                    >
                        Add
                    </Button>
                </Grid.Col>
            </Grid>

            <Space h="20px" />
            {list.length > 0 && (isUser || isAdmin) ? (
                list.map((l, index) => {
                    return (
                        <Card shadow="sm" padding="sm" withBorder key={index}>
                            <Group position="apart">
                                <Group>
                                    {l.status === true ? (
                                        <Button
                                            color="green"
                                            size="xs"
                                            radius="10px"
                                            onClick={() => {
                                                unclickMutation.mutate(l._id);
                                            }}
                                        >
                                            <BsXSquare />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="default"
                                            size="xs"
                                            radius="10px"
                                            onClick={() => {
                                                clickMutation.mutate(l._id);
                                            }}
                                        >
                                            <BsSquare />
                                        </Button>
                                    )}
                                    {l.status === true ? (
                                        <Text td="line-through">{l.name}</Text>
                                    ) : (
                                        <Text>{l.name}</Text>
                                    )}
                                </Group>

                                <Group>
                                    <Button
                                        variant="subtle"
                                        size="xs"
                                        color="gray"
                                        onClick={() => {
                                            deleteListMutation.mutate(l._id);
                                        }}
                                    >
                                        <RiDeleteBin4Line size="20" />
                                    </Button>
                                </Group>
                            </Group>
                        </Card>
                    );
                })
            ) : (
                <Card
                    hadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    style={{
                        height: "200px",
                        width: "100%",
                    }}
                >
                    <Text
                        size="50px"
                        ta="center"
                        color="red"
                        style={{
                            paddingTop: "40px",
                        }}
                    >
                        Please Add A New List
                    </Text>
                </Card>
            )}
            <Space h="20px" />
            <Group position="center">
                <Button
                    component={Link}
                    to="/todolist"
                    variant="subtle"
                    size="xs"
                    color="gray"
                >
                    Go back to Todo List
                </Button>
            </Group>
            <Space h="100px" />
        </Container>
    );
}
