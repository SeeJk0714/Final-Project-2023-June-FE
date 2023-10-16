import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
    Container,
    Space,
    TextInput,
    Card,
    Button,
    Group,
    PasswordInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { registerUser } from "../api/auth";
import { TiTickOutline } from "react-icons/ti";

export default function AddUser() {
    const [cookies, setCookie] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [visible, { toggle }] = useDisclosure(false);

    const isAdmin = useMemo(() => {
        return cookies &&
            cookies.currentUser &&
            cookies.currentUser.role === "admin"
            ? true
            : false;
    }, [cookies]);

    const signMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            notifications.show({
                title: "Add Successful",
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

    const handleSubmit = () => {
        if (!name || !email || !password || !confirmPassword) {
            notifications.show({
                title: "Please fill in all fields",
                color: "red",
            });
        } else if (password !== confirmPassword) {
            notifications.show({
                title: "Password and Confirm Password not match",
                color: "red",
            });
        } else {
            signMutation.mutate(
                JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                })
            );
        }
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
                <PasswordInput
                    value={password}
                    placeholder="Password"
                    label="Password"
                    visible={visible}
                    onVisibilityChange={toggle}
                    required
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Space h="20px" />
                <PasswordInput
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    visible={visible}
                    onVisibilityChange={toggle}
                    required
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <Space h="40px" />
                <Group position="center">
                    <Button
                        color="green"
                        onClick={handleSubmit}
                        disabled={isAdmin ? false : true}
                    >
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
