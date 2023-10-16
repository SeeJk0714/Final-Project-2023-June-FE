import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Card,
    Title,
    Group,
    Button,
    Space,
    Text,
    Grid,
    TextInput,
    Container,
} from "@mantine/core";
import { fetchPlans } from "../api/plan";
import { useCookies } from "react-cookie";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { BiBookAdd } from "react-icons/bi";

export default function Plan() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const { isLoading, data: plans = [] } = useQuery({
        queryKey: ["plans"],
        queryFn: () => fetchPlans(currentUser ? currentUser.token : ""),
    });
    const [plan, setPlan] = useState(plans);
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
        let newPlan = [...plans];

        if (searchTerm) {
            newPlan = newPlan.filter(
                (i) =>
                    i.title.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
            );
        }

        setPlan(newPlan);
    }, [plans, searchTerm]);

    return (
        <Container>
            <Group position="apart">
                <BsJournalBookmarkFill size="50" />
                <Space h="20px" />
                <Title order={3} size="50px" align="center">
                    Plan
                </Title>
                <Space h="20px" />
                <Button
                    component={Link}
                    to="/add_plan"
                    disabled={isUser || isAdmin ? false : true}
                >
                    Add Plan <BiBookAdd size="30" />
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
                {plan.length > 0 && (isUser || isAdmin) ? (
                    plan.map((p) => {
                        return (
                            <Grid.Col md={6} lg={4} key={p._id}>
                                <Group position="center">
                                    <Link
                                        to={`/showplan/${p._id}`}
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
                                            className="plan-card"
                                            style={{
                                                height: "200px",
                                                width: "250px",
                                                color: "white",
                                                backgroundColor: "#121212",
                                            }}
                                        >
                                            {isAdmin && (
                                                <Text>{p.customerEmail}</Text>
                                            )}
                                            {p.title.length > 10 ? (
                                                <Text
                                                    size="30px"
                                                    td="underline"
                                                >
                                                    {p.title.slice(0, 10) +
                                                        "..."}
                                                </Text>
                                            ) : (
                                                <Text
                                                    size="30px"
                                                    td="underline"
                                                >
                                                    {p.title}
                                                </Text>
                                            )}
                                            <Space h="20px" />
                                            <Text>
                                                <>
                                                    {p.content.length > 15 ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    p.content.slice(
                                                                        0,
                                                                        15
                                                                    ) + "...",
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: p.content,
                                                            }}
                                                        />
                                                    )}
                                                </>
                                            </Text>
                                        </Card>{" "}
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
                                No Plan is Found
                            </Text>
                            <Text c="dimmed" ta="center">
                                Please Add A New Plan
                            </Text>
                        </Card>
                    </>
                )}
            </Grid>

            <Space h="20px" />
        </Container>
    );
}
