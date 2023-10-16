import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { useCookies } from "react-cookie";
import {
    Card,
    Group,
    Button,
    Space,
    Text,
    Container,
    Divider,
} from "@mantine/core";
import { deletePlan, getPlan } from "../api/plan";
import { BsCalendar2Date } from "react-icons/bs";
import { BiTimeFive } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineEditOff } from "react-icons/md";

export default function ShowPlan() {
    const [cookies] = useCookies(["currentUser"]);
    const { currentUser } = cookies;
    const { id } = useParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const { isLoading } = useQuery({
        queryKey: ["plan", id],
        queryFn: () => getPlan(id),
        onSuccess: (data) => {
            setEmail(data.customerEmail);
            setTitle(data.title);
            setContent(data.content);
            setStartDate(data.startDate);
            setEndDate(data.endDate);
            setStartTime(data.startTime);
            setEndTime(data.endTime);
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

    const deletePlanMutation = useMutation({
        mutationFn: deletePlan,
        onSuccess: () => {
            notifications.show({
                title: "Plan Deleted",
                color: "green",
            });
            navigate("/plan");
        },
    });
    return (
        <Container>
            <Group position="apart">
                {isUser || isAdmin ? (
                    <Text size="40px" ta="center">
                        {title}
                    </Text>
                ) : null}
                <Group>
                    <Button
                        color="teal"
                        component={Link}
                        to={`/edit_plan/${id}`}
                        disabled={isUser || isAdmin ? false : true}
                    >
                        <FaRegEdit size="20" />
                    </Button>
                    <Button
                        color="red"
                        disabled={isUser || isAdmin ? false : true}
                        onClick={() => {
                            deletePlanMutation.mutate({
                                id: id,
                                token: currentUser ? currentUser.token : "",
                            });
                        }}
                    >
                        <MdOutlineEditOff size="20" />
                    </Button>
                </Group>
            </Group>
            <Space h="20px" />
            <Divider />
            <Space h="20px" />
            <Group>
                {isUser || isAdmin ? (
                    <Card hadow="sm" padding="lg" radius="md" withBorder>
                        {isAdmin && <Text>User: {email}</Text>}
                        <Text>
                            <BsCalendar2Date /> Date:{" "}
                            {startDate
                                ? new Date(startDate).toLocaleDateString()
                                : ""}{" "}
                            -
                            {endDate
                                ? new Date(endDate).toLocaleDateString()
                                : ""}
                        </Text>
                        <Text>
                            <BiTimeFive /> Time: {startTime} - {endTime}
                        </Text>
                    </Card>
                ) : null}
            </Group>

            <Space h="20px" />
            {isUser || isAdmin ? (
                <Text>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: content,
                        }}
                    />
                </Text>
            ) : null}

            <Space h="70px" />
            <Button
                component={Link}
                to="/plan"
                variant="subtle"
                size="xs"
                color="gray"
            >
                Go back to Plan
            </Button>
        </Container>
    );
}
