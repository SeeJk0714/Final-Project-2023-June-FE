import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { useCookies } from "react-cookie";
import {
    Card,
    Title,
    Group,
    Button,
    Space,
    Text,
    Grid,
    Container,
    Modal,
    TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { fetchTodolists, addTodoList } from "../api/todolist";
import { RiPlayListAddLine, RiListCheck3 } from "react-icons/ri";

export default function TodoList() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const queryClient = useQueryClient();
    const [opened, { open, close }] = useDisclosure(false);
    const [email, setEmail] = useState(currentUser ? currentUser.email : "");
    const [title, setTitle] = useState("");
    const { data: todolists = [] } = useQuery({
        queryKey: ["todolists"],
        queryFn: () => fetchTodolists(currentUser ? currentUser.token : ""),
    });
    const [todolist, setTodolist] = useState(todolists);
    const [searchTerm, setSearchTerm] = useState("");

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

    useEffect(() => {
        let newTodolist = [...todolists];

        if (searchTerm) {
            newTodolist = newTodolist.filter(
                (i) =>
                    i.title.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
            );
        }

        setTodolist(newTodolist);
    }, [todolists, searchTerm]);

    const createMutation = useMutation({
        mutationFn: addTodoList,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["todolists"],
            });
            notifications.show({
                title: "Todo List Added",
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

    const handleAddNewTodoList = async (event) => {
        event.preventDefault();
        createMutation.mutate({
            data: JSON.stringify({
                title: title,
                customerEmail: email,
            }),
            token: currentUser ? currentUser.token : "",
        });
        setTitle("");
    };

    return (
        <Container>
            <Group position="apart">
                <RiListCheck3 size="60" />
                <Space h="20px" />
                <Title order={3} size="50px" align="center">
                    Todo List
                </Title>
                <Space h="20px" />
                <Button
                    onClick={open}
                    disabled={isUser || isAdmin ? false : true}
                >
                    Add Todo List <RiPlayListAddLine size="30" />
                </Button>
            </Group>
            <Space h="20px" />
            <TextInput
                value={searchTerm}
                placeholder="Search"
                onChange={(event) => setSearchTerm(event.target.value)}
            />
            <Space h="20px" />
            <Grid>
                {todolist.length > 0 && (isUser || isAdmin) ? (
                    todolist.map((t) => {
                        return (
                            <Grid.Col md={6} lg={4} key={t._id}>
                                <Group position="center">
                                    <Link
                                        to={`/showlist/${t._id}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "black",
                                        }}
                                    >
                                        <Card
                                            shadow="sm"
                                            padding="lg"
                                            radius="md"
                                            withBorder
                                            className="todo-card"
                                            style={{
                                                height: "200px",
                                                width: "250px",
                                                color: "white",
                                                backgroundColor: "#121212",
                                            }}
                                        >
                                            {isAdmin && (
                                                <Text>{t.customerEmail}</Text>
                                            )}
                                            {t.title.length > 10 ? (
                                                <Text
                                                    size="30px"
                                                    td="underline"
                                                >
                                                    {t.title.slice(0, 10) +
                                                        "..."}
                                                </Text>
                                            ) : (
                                                <Text
                                                    size="30px"
                                                    td="underline"
                                                >
                                                    {t.title}
                                                </Text>
                                            )}
                                            <ul>
                                                {t.lists
                                                    .slice(0, 3)
                                                    .map((l) => (
                                                        <li key={l._id}>
                                                            {l.status ===
                                                            true ? (
                                                                <Text td="line-through">
                                                                    {l.name}
                                                                </Text>
                                                            ) : (
                                                                <Text>
                                                                    {l.name}
                                                                </Text>
                                                            )}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </Card>
                                    </Link>
                                </Group>
                            </Grid.Col>
                        );
                    })
                ) : (
                    <>
                        <Card
                            hadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                            style={{
                                height: "500px",
                                width: "100%",
                            }}
                        >
                            <Text
                                size="50px"
                                ta="center"
                                color="red"
                                style={{
                                    paddingTop: "180px",
                                }}
                            >
                                No Todo List is Found
                            </Text>
                            <Text c="dimmed" ta="center">
                                Please Add A New Todo List
                            </Text>
                        </Card>
                    </>
                )}
            </Grid>
            <Modal opened={opened} onClose={close} title="Add Todo List">
                <TextInput
                    radius="lg"
                    placeholder="Type your title here..."
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }}
                />
                <Space h="20px" />
                <Button color="green" onClick={handleAddNewTodoList}>
                    Add
                </Button>
            </Modal>
            <Space h="20px" />
        </Container>
    );
}
