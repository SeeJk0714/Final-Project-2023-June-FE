import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
    Container,
    Space,
    TextInput,
    Card,
    Button,
    Group,
    Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { getUser, updateUser } from "../api/auth";
import { TiTickOutline } from "react-icons/ti";

export default function EditUser() {
    const [cookies, setCookie] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [role, setRole] = useState();

    const { isLoading } = useQuery({
        queryKey: ["user", id],
        queryFn: () => getUser(id),
        onSuccess: (data) => {
            setName(data.name);
            setEmail(data.email);
            setRole(data.role);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            notifications.show({
                title: "User Edited",
                color: "green",
            });
            navigate("/manageusers");
        },
        onError: (error) => {
            notifications.show({
                title: error.response.data.message,
                color: "red",
            });
        },
    });

    const handleUpdateUser = async (event) => {
        event.preventDefault();
        updateMutation.mutate({
            id: id,
            data: JSON.stringify({
                name: name,
                email: email,
                role: role,
            }),
            token: currentUser ? currentUser.token : "",
        });
    };

    return (
        <Container>
            <Space h="50px" />
            <Card
                withBorder
                shadow="lg"
                p="20px"
                mx="auto"
                sx={{
                    maxWidth: "700px",
                }}
            >
                <TextInput
                    value={name}
                    placeholder="Name"
                    label="Name"
                    required
                    onChange={(event) => setName(event.target.value)}
                />
                <Space h="20px" />
                <TextInput
                    value={email}
                    placeholder="Email"
                    label="Email"
                    required
                    onChange={(event) => setEmail(event.target.value)}
                />
                <Space h="20px" />
                <Select
                    radius="lg"
                    placeholder="Select a Category"
                    label="Status"
                    data={["user", "admin"]}
                    value={role}
                    onChange={setRole}
                />
                <Space h="40px" />
                <Group position="center">
                    <Button color="green" onClick={handleUpdateUser}>
                        Submit <TiTickOutline size="20" />
                    </Button>
                </Group>
            </Card>
            <Space h="20px" />
            <Group position="center">
                <Button
                    component={Link}
                    to="/manageusers"
                    variant="subtle"
                    size="xs"
                    color="gray"
                >
                    Go back to Manage Users
                </Button>
            </Group>
        </Container>
    );
}
