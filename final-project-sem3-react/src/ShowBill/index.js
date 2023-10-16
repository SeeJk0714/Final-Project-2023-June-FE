import { useState, useMemo } from "react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
    Card,
    Title,
    Group,
    Button,
    Space,
    Container,
    Table,
    Text,
} from "@mantine/core";
import { deleteBill } from "../api/bill";
import { fetchBudgets, getBudget } from "../api/budget";
import {
    TbArrowBigUpLineFilled,
    TbArrowBigDownLineFilled,
} from "react-icons/tb";
import { HiBarsArrowUp, HiBarsArrowDown } from "react-icons/hi2";

export default function ShowBill() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [email, setEmail] = useState("");
    const [bill, setBill] = useState("");
    const [date, setDate] = useState("");
    const { data: budgets = [] } = useQuery({
        queryKey: ["budgets"],
        queryFn: () => fetchBudgets(currentUser ? currentUser.token : ""),
    });
    const { isLoading } = useQuery({
        queryKey: ["budget", id],
        queryFn: () => getBudget(id),
        onSuccess: (data) => {
            setEmail(data.customerEmail);
            setDate(data.date);
            setBill(data.bills);
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

    const calculateTotalIncome = () => {
        let itotal = 0;
        {
            budgets
                .filter((b) => b._id === id)
                .map((b) =>
                    b.bills
                        .filter((i) => i.model === "Income")
                        .forEach((i) => {
                            itotal += parseInt(i.amount);
                        })
                );
        }
        return itotal;
    };

    const calculateTotalExpenses = () => {
        let etotal = 0;
        {
            budgets
                .filter((b) => b._id === id)
                .map((b) =>
                    b.bills
                        .filter((e) => e.model === "Expenses")
                        .forEach((e) => {
                            etotal += parseInt(e.amount);
                        })
                );
        }
        return etotal;
    };

    const deleteMutation = useMutation({
        mutationFn: deleteBill,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["budget"],
            });
            notifications.show({
                title: "Bill Deleted",
                color: "green",
            });
        },
    });

    return (
        <>
            <Container>
                <Group position="apart">
                    {isUser || isAdmin ? (
                        <Title size="30">{date.slice(0, 10)}</Title>
                    ) : (
                        <Title size="30">YYYY-MM-DD</Title>
                    )}
                    <Group>
                        <Button
                            color="teal"
                            component={Link}
                            to={`/income/${id}`}
                            disabled={isUser || isAdmin ? false : true}
                        >
                            Income <HiBarsArrowUp size="20" />
                        </Button>
                        <Button
                            color="red"
                            component={Link}
                            to={`/expenses/${id}`}
                            disabled={isUser || isAdmin ? false : true}
                        >
                            Expenses <HiBarsArrowDown size="20" />
                        </Button>
                    </Group>
                </Group>
                {isAdmin && <Text>User: {email}</Text>}
                <Space h="20px" />
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Table highlightOnHover withBorder>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Date</th>
                                <th>Source</th>
                                <th>Category</th>
                                <th>Amount(RM)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bill.length > 0 && (isUser || isAdmin) ? (
                                bill.map((b, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {b.model === "Income" ? (
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
                                            </td>
                                            <td>{b.date.slice(0, 10)}</td>
                                            <td>{b.source}</td>
                                            <td>{b.category}</td>
                                            <td>{b.amount}</td>
                                            <td>
                                                <Button
                                                    variant="outline"
                                                    color="red"
                                                    onClick={() => {
                                                        deleteMutation.mutate(
                                                            b._id
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6}>No income added yet.</td>
                                </tr>
                            )}
                            <tr>
                                <td colSpan={4}>Total</td>
                                <td colSpan={2}>
                                    RM{" "}
                                    {isUser || isAdmin ? (
                                        <>
                                            {calculateTotalIncome() -
                                                calculateTotalExpenses()}
                                        </>
                                    ) : (
                                        0
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card>
                <Space h="30px" />
                <Button
                    component={Link}
                    to="/history"
                    variant="outline"
                    color="gray"
                >
                    Go back to Manage Budget
                </Button>
            </Container>
        </>
    );
}
