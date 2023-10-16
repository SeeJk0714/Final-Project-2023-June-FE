import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
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
import { fetchJournals } from "../api/journal";
import { AiFillLock } from "react-icons/ai";
import { PiPencilLineDuotone } from "react-icons/pi";
import { TbPencilPlus } from "react-icons/tb";

export default function Journal() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const { isLoading, data: journals = [] } = useQuery({
        queryKey: ["journals"],
        queryFn: () => fetchJournals(currentUser ? currentUser.token : ""),
    });
    const [journal, setJournal] = useState(journals);
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
        let newJournal = [...journals];

        if (searchTerm) {
            newJournal = newJournal.filter(
                (i) =>
                    i.title.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
            );
        }

        setJournal(newJournal);
    }, [journals, searchTerm]);

    return (
        <div className="bg">
            <Container>
                <Group position="apart">
                    <PiPencilLineDuotone size="70" />
                    <Space h="20px" />
                    <Title order={3} size="50px" align="center">
                        Journal
                    </Title>
                    <Space h="20px" />
                    <Button
                        component={Link}
                        to="/add_journal"
                        disabled={isUser || isAdmin ? false : true}
                    >
                        Add Journal <TbPencilPlus size="30" />
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
                    {journal.length > 0 && (isUser || isAdmin) ? (
                        journal.map((j) => {
                            return (
                                <Grid.Col md={6} lg={4} key={j._id}>
                                    <Group position="center">
                                        <Link
                                            to={`/showjournal/${j._id}`}
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
                                                className="journal-card"
                                                style={{
                                                    height: "200px",
                                                    width: "250px",
                                                    backgroundColor: "#121212",
                                                    color: "white",
                                                }}
                                            >
                                                {isAdmin && (
                                                    <Text>
                                                        {j.customerEmail}
                                                    </Text>
                                                )}
                                                {j.title.length > 10 ? (
                                                    <Text
                                                        size="30px"
                                                        td="underline"
                                                    >
                                                        {j.title.slice(0, 10) +
                                                            "..."}
                                                    </Text>
                                                ) : (
                                                    <Text
                                                        size="30px"
                                                        td="underline"
                                                    >
                                                        {j.title}
                                                    </Text>
                                                )}
                                                <Text>
                                                    {j.status === "Private" ? (
                                                        <>
                                                            <Space h="20px" />

                                                            <Text
                                                                size="50px"
                                                                ta="center"
                                                            >
                                                                <AiFillLock />
                                                            </Text>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {j.content.length >
                                                            15 ? (
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html:
                                                                            j.content.slice(
                                                                                0,
                                                                                15
                                                                            ) +
                                                                            "...",
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: j.content,
                                                                    }}
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                                </Text>
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
                                    No Journal is Found
                                </Text>
                                <Text c="dimmed" ta="center">
                                    Please Add A New Journal
                                </Text>
                            </Card>
                        </>
                    )}
                </Grid>

                <Space h="20px" />
            </Container>
        </div>
    );
}
