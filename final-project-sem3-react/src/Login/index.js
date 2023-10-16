import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
    Card,
    Button,
    Group,
    Container,
    Space,
    TextInput,
    PasswordInput,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { loginUser } from "../api/auth";

export default function Login() {
    const [cookies, setCookie] = useCookies(["currentUser"]);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (user) => {
            setCookie("currentUser", user, {
                maxAge: 60 * 60 * 24 * 30,
            });

            notifications.show({
                title: "Login Successful",
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

    const handleSubmit = () => {
        let error = false;
        if (!email || !password) {
            error = "Please fill out all the required fields.";
        }
        if (error) {
            notifications.show({
                title: error,
                color: "red",
            });
        } else {
            loginMutation.mutate(
                JSON.stringify({
                    email: email,
                    password: password,
                })
            );
        }
    };

    return (
        <Container>
            <Space h="50px" />
            <Space h="50px" />
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Space h="10px" />
                <TextInput
                    label="Email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                    }}
                />
                <Space h="30px" />
                <PasswordInput
                    label="Password"
                    placeholder="123456789"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
                <Space h="30px" />
                <Button
                    color="blue"
                    fullWidth
                    mt="md"
                    radius="md"
                    onClick={() => {
                        handleSubmit();
                    }}
                >
                    Submit
                </Button>
            </Card>
            <Group position="apart">
                <Button component={Link} to="/" variant="transparent">
                    back to home
                </Button>
                <Button component={Link} to="/signup" variant="transparent">
                    Sign In
                </Button>
            </Group>
        </Container>
    );
}
