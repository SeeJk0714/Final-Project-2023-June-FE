import { useMemo } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import {
    Container,
    Space,
    Title,
    Card,
    Table,
    Text,
    Group,
    Button,
} from "@mantine/core";
import { deleteUser, fetchUsers } from "../api/auth";
import {
    BsFillPersonPlusFill,
    BsFillPersonXFill,
    BsPersonVcard,
    BsPersonBadge,
} from "react-icons/bs";
import { LiaUserEditSolid } from "react-icons/lia";
import { MdOutlineVpnKey, MdOutlinePeopleAlt } from "react-icons/md";

export default function ManageUsers() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const queryClient = useQueryClient();
    const { data: users = [] } = useQuery({
        queryKey: ["users"],
        queryFn: () => fetchUsers(currentUser ? currentUser.token : ""),
    });

    const isAdmin = useMemo(() => {
        return cookies &&
            cookies.currentUser &&
            cookies.currentUser.role === "admin"
            ? true
            : false;
    }, [cookies]);

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
            notifications.show({
                title: "User Deleted",
                color: "green",
            });
        },
    });

    return (
        <>
            {isAdmin && (
                <Container>
                    <Group position="apart">
                        <MdOutlinePeopleAlt size="60" />
                        <Space h="20px" />
                        <Title order={3} size="50px" align="center">
                            Manage Users
                        </Title>
                        <Space h="20px" />
                        <Button component={Link} to="/adduser">
                            Add New User <BsFillPersonPlusFill size="30" />
                        </Button>
                    </Group>
                    <Space h="20px" />
                    <Card hadow="sm" padding="lg" radius="md" withBorder>
                        <div>
                            <Table style={{ overflowX: "auto" }}>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users ? (
                                        users.map((u) => {
                                            return (
                                                <tr key={u._id}>
                                                    <td>
                                                        {u.role === "user" ? (
                                                            <BsPersonBadge
                                                                size="30"
                                                                color="indigo"
                                                            />
                                                        ) : (
                                                            <BsPersonVcard
                                                                size="30"
                                                                color="red"
                                                            />
                                                        )}
                                                    </td>
                                                    <td>{u.name}</td>
                                                    <td>{u.email}</td>
                                                    <td>{u.role}</td>
                                                    <td>
                                                        <Group>
                                                            <Button
                                                                component={Link}
                                                                to={`/edituser/${u._id}`}
                                                                size="xs"
                                                                color="teal"
                                                            >
                                                                <LiaUserEditSolid size="20" />
                                                            </Button>
                                                            <Button
                                                                component={Link}
                                                                to={`/editpassword/${u._id}`}
                                                                size="xs"
                                                                color="gray"
                                                            >
                                                                <MdOutlineVpnKey size="20" />
                                                            </Button>
                                                            <Button
                                                                size="xs"
                                                                color="red"
                                                                onClick={() => {
                                                                    deleteUserMutation.mutate(
                                                                        {
                                                                            id: u._id,
                                                                            token: currentUser
                                                                                ? currentUser.token
                                                                                : "",
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                <BsFillPersonXFill size="20" />
                                                            </Button>
                                                        </Group>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <Text>User Not Found</Text>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    </Card>
                </Container>
            )}
        </>
    );
}
