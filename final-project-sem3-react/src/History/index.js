import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
    Card,
    Title,
    Group,
    Button,
    Space,
    Container,
    Text,
} from "@mantine/core";
import { createBudget, deleteBudget, fetchBudgets } from "../api/budget";
import {
    TbArrowBigUpLineFilled,
    TbArrowBigDownLineFilled,
} from "react-icons/tb";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { BsTrash } from "react-icons/bs";

export default function History() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const queryClient = useQueryClient();
    const [email, setEmail] = useState(currentUser ? currentUser.email : "");
    const { data: budgets = [] } = useQuery({
        queryKey: ["budgets"],
        queryFn: () => fetchBudgets(currentUser ? currentUser.token : ""),
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

    const createMutation = useMutation({
        mutationFn: createBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["budgets"],
            });
            notifications.show({
                title: "Budget List Added",
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

    const handleAddNewBudgetList = async (event) => {
        event.preventDefault();
        createMutation.mutate({
            data: JSON.stringify({
                customerEmail: email,
            }),
            token: currentUser ? currentUser.token : "",
        });
    };

    const deleteBudgetMutation = useMutation({
        mutationFn: deleteBudget,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["budgets"],
            });
            notifications.show({
                title: "Budget List Deleted",
                color: "green",
            });
        },
    });

    return (
        <>
            <Container>
                <Group position="apart">
                    <Title order={3} size="30px" align="center">
                        Manager Budget Lists
                    </Title>
                    <Group>
                        <Button
                            component={Link}
                            to="/budget"
                            variant="outline"
                            color="gray"
                        >
                            Go back to Manage Budget
                        </Button>
                        <Button
                            color="green"
                            onClick={handleAddNewBudgetList}
                            disabled={isUser || isAdmin ? false : true}
                        >
                            Create New Budget List
                        </Button>
                    </Group>
                </Group>
                <Space h="20px" />
                {(budgets.length > 0 && isUser) || isAdmin ? (
                    budgets.map((b) => {
                        return (
                            <div key={b._id}>
                                <Card shadow="sm" padding="lg" withBorder>
                                    {isAdmin && <Text>{b.customerEmail}</Text>}
                                    <Group position="apart">
                                        <Title size="40">
                                            {b.date.slice(0, 10)}
                                        </Title>
                                        <Group>
                                            <Button
                                                component={Link}
                                                to={`/showbill/${b._id}`}
                                            >
                                                <FaMoneyBillTrendUp size="20" />
                                            </Button>
                                            <Button
                                                color="red"
                                                onClick={() => {
                                                    deleteBudgetMutation.mutate(
                                                        {
                                                            id: b._id,
                                                            token: currentUser
                                                                ? currentUser.token
                                                                : "",
                                                        }
                                                    );
                                                }}
                                            >
                                                <BsTrash size="20" />
                                            </Button>
                                        </Group>
                                    </Group>
                                    <Space h="20px" />
                                    {b.bills.length > 0 ? (
                                        b.bills.map((bill, index) => (
                                            <Card withBorder key={index}>
                                                <Group>
                                                    {bill.model === "Income" ? (
                                                        <TbArrowBigUpLineFilled
                                                            color="green"
                                                            size="20px"
                                                        />
                                                    ) : (
                                                        <TbArrowBigDownLineFilled
                                                            color="red"
                                                            size="20px"
                                                        />
                                                    )}

                                                    <Text size="20px">
                                                        {bill.source}
                                                    </Text>
                                                </Group>
                                                <Group grow>
                                                    <Text
                                                        style={{
                                                            paddingLeft: "35px",
                                                        }}
                                                    >
                                                        {bill.date.slice(
                                                            11,
                                                            16
                                                        )}
                                                    </Text>
                                                    {bill.model === "Income" ? (
                                                        <Text
                                                            color="green"
                                                            ta="right"
                                                            fw={700}
                                                        >
                                                            RM
                                                            {bill.amount}
                                                        </Text>
                                                    ) : (
                                                        <Text
                                                            color="red"
                                                            ta="right"
                                                            fw={700}
                                                        >
                                                            - RM
                                                            {bill.amount}
                                                        </Text>
                                                    )}
                                                </Group>
                                            </Card>
                                        ))
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
                                                Please Add A New Bill
                                            </Text>
                                        </Card>
                                    )}
                                    <Space h="20px" />
                                </Card>
                            </div>
                        );
                    })
                ) : (
                    <Card
                        hadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={{
                            height: "300px",
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
                            Please Add A New Budget List
                        </Text>
                    </Card>
                )}
            </Container>
        </>
    );
}
