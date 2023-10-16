import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useMemo } from "react";

import Login from "./Login";
import SignUp from "./SignUp";
import Journal from "./Journal";
import AddJournal from "./AddJournal";
import EditJournal from "./EditJournal";
import ShowJournal from "./ShowJournal";
import Plan from "./Plan";
import AddPlan from "./AddPlan";
import EditPlan from "./EditPlan";
import ShowPlan from "./ShowPlan";
import TodoList from "./TodoList";
import Budget from "./Budget";
import Income from "./Income";
import Expenses from "./Expenses";
import ShowBill from "./ShowBill";
import History from "./History";
import ShowList from "./ShowList";
import ManageUsers from "./ManageUsers";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import EditPwd from "./EditPwd";

import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
    Title,
    Space,
    Group,
    Button,
    Text,
    Avatar,
    AppShell,
    Navbar,
    UnstyledButton,
    Header,
    MediaQuery,
    Burger,
} from "@mantine/core";

import { PiPencilLineDuotone } from "react-icons/pi";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { RiListCheck3 } from "react-icons/ri";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdOutlinePeopleAlt } from "react-icons/md";

function App() {
    const [opened, setOpened] = useState(false);
    const [cookies, setCookies, removeCookies] = useCookies(["currentUser"]);

    const isAdmin = useMemo(() => {
        return cookies &&
            cookies.currentUser &&
            cookies.currentUser.role === "admin"
            ? true
            : false;
    }, [cookies]);
    return (
        <Router>
            {" "}
            <AppShell
                padding="md"
                header={
                    <Header height={{ base: 70, md: 70 }} p="md">
                        <Group position="apart">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    height: "100%",
                                }}
                            >
                                <MediaQuery
                                    largerThan="sm"
                                    styles={{ display: "none" }}
                                >
                                    <Burger
                                        opened={opened}
                                        onClick={() => setOpened((o) => !o)}
                                        size="sm"
                                        mr="xl"
                                    />
                                </MediaQuery>

                                <Title size="30">SJKC</Title>
                            </div>
                            {cookies && cookies.currentUser ? (
                                <>
                                    <Group>
                                        <Avatar
                                            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser_2105556&psig=AOvVaw1U4bZIR5hr16QSfghItvFz&ust=1697302215344000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMiN8tG984EDFQAAAAAdAAAAABAR"
                                            radius="xl"
                                        />
                                        <div style={{ flex: 1 }}>
                                            <Text size="sm" fw={500}>
                                                {cookies.currentUser.name}
                                            </Text>

                                            <Text c="dimmed" size="xs">
                                                {cookies.currentUser.email}
                                            </Text>
                                        </div>
                                        <Button
                                            variant={"light"}
                                            onClick={() => {
                                                removeCookies("currentUser");
                                            }}
                                        >
                                            Logout
                                        </Button>
                                    </Group>
                                </>
                            ) : (
                                <>
                                    <Group>
                                        <Button component={Link} to="/login">
                                            Login
                                        </Button>
                                        <Button component={Link} to="/signup">
                                            Sign Up
                                        </Button>
                                    </Group>
                                </>
                            )}
                        </Group>
                    </Header>
                }
                navbarOffsetBreakpoint="sm"
                navbar={
                    <Navbar
                        p="md"
                        hiddenBreakpoint="sm"
                        hidden={!opened}
                        width={{ sm: 200, lg: 200 }}
                    >
                        <Space h={20} />
                        <UnstyledButton component={Link} to="/">
                            <Group position="apart">
                                <Title size="30">Journal</Title>
                                <PiPencilLineDuotone size="30" />
                            </Group>
                        </UnstyledButton>
                        <Space h={30} />
                        <UnstyledButton component={Link} to="/plan">
                            <Group position="apart">
                                <Title size="30">Plan</Title>
                                <BsJournalBookmarkFill size="30" />
                            </Group>
                        </UnstyledButton>
                        <Space h={30} />
                        <UnstyledButton component={Link} to="/todolist">
                            <Group position="apart">
                                <Title size="30">TodoList</Title>
                                <RiListCheck3 size="30" />
                            </Group>
                        </UnstyledButton>
                        <Space h={30} />
                        <UnstyledButton component={Link} to="/budget">
                            <Group position="apart">
                                <Title size="30">Budget</Title>
                                <HiOutlineClipboardDocumentList size="40" />
                            </Group>
                        </UnstyledButton>

                        {isAdmin && (
                            <>
                                <Space h={30} />
                                <UnstyledButton
                                    component={Link}
                                    to="/manageusers"
                                >
                                    <Group position="apart">
                                        <Title size="30">Manage</Title>
                                        <Title size="30">Users</Title>
                                        <Group>
                                            <MdOutlinePeopleAlt size="40" />
                                        </Group>
                                    </Group>
                                </UnstyledButton>
                            </>
                        )}
                    </Navbar>
                }
            >
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/" element={<Journal />} />
                    <Route path="/add_journal" element={<AddJournal />} />
                    <Route path="/edit_journal/:id" element={<EditJournal />} />
                    <Route path="/showjournal/:id" element={<ShowJournal />} />
                    <Route path="/plan" element={<Plan />} />
                    <Route path="/add_plan" element={<AddPlan />} />
                    <Route path="/edit_plan/:id" element={<EditPlan />} />
                    <Route path="/showplan/:id" element={<ShowPlan />} />
                    <Route path="/todolist" element={<TodoList />} />
                    <Route path="/showlist/:id" element={<ShowList />} />
                    <Route path="/budget" element={<Budget />} />
                    <Route path="/income/:id" element={<Income />} />
                    <Route path="/expenses/:id" element={<Expenses />} />
                    <Route path="/showbill/:id" element={<ShowBill />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/manageusers" element={<ManageUsers />} />
                    <Route path="/adduser" element={<AddUser />} />
                    <Route path="/edituser/:id" element={<EditUser />} />
                    <Route path="/editpassword/:id" element={<EditPwd />} />
                </Routes>
            </AppShell>
        </Router>
    );
}

export default App;
