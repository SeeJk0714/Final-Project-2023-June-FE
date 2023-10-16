import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Chart } from "react-google-charts";
import {
    Card,
    Title,
    Group,
    Button,
    Space,
    Text,
    Container,
} from "@mantine/core";
import { fetchBudgets } from "../api/budget";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { TbPigMoney } from "react-icons/tb";

export default function Budget() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
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

    const calculateTotalIncome = () => {
        let BillTotal = 0;
        {
            budgets.map((b) =>
                b.bills
                    .filter((i) => i.model === "Income")
                    .forEach((i) => {
                        BillTotal += parseInt(i.amount);
                    })
            );
        }
        return BillTotal;
    };

    const calculateTotalExpenses = () => {
        let BillTotal = 0;
        {
            budgets.map((b) =>
                b.bills
                    .filter((e) => e.model === "Expenses")
                    .forEach((e) => {
                        BillTotal += parseInt(e.amount);
                    })
            );
        }
        return BillTotal;
    };

    const data = [
        ["Task", "Hours per Day"],
        ["Income", calculateTotalIncome()],
        ["Expenses", calculateTotalExpenses()],
    ];

    const options = {
        pieHole: 0.4,
        is3D: false,
        legend: "none",
    };

    return (
        <Container>
            <Group position="apart">
                <HiOutlineClipboardDocumentList size="60" />
                <Space h="20px" />
                <Title order={3} size="50px" align="center">
                    Budget
                </Title>
                <Space h="20px" />
                <Button
                    component={Link}
                    to="/history"
                    disabled={isUser || isAdmin ? false : true}
                >
                    Add Budget <TbPigMoney size="30" />
                </Button>
            </Group>
            <Space h="20px" />
            {budgets.length > 0 && (isUser || isAdmin) ? (
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={data}
                    options={options}
                />
            ) : (
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
                        No Budget is Found
                    </Text>
                    <Text c="dimmed" ta="center">
                        Please Add A New Budget
                    </Text>
                </Card>
            )}
            <Space h="20px" />
            {isUser || isAdmin ? (
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Text size="30px" align="center">
                        Total: RM
                        {calculateTotalIncome() - calculateTotalExpenses()}
                    </Text>
                </Card>
            ) : null}
        </Container>
    );
}
