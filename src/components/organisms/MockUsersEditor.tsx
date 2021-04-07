import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import Pagination from "@material-ui/core/Pagination";
import { Spacer } from "../../utils";
import { SearchForm } from "../molecules/SearchForm";
import { ToolBar } from "./ToolBar";
import { UserList } from "./UserList";
import { useState } from "react";

const exampleUsers = {
  users: [
    {
      user_id: "1",
      name: "Toshimitsu Watanabe",
      roles: [{ role_id: 1, name: "manager" }],
    },
    {
      user_id: "2",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "3",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "4",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "5",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "6",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "7",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "8",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "9",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "10",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "11",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "12",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "13",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "14",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
    {
      user_id: "15",
      name: "test",
      roles: [{ role_id: 2, name: "manager" }],
    },
  ],
  roles: [
    { role_id: 1, name: "admin" },
    { role_id: 2, name: "manager" },
    { role_id: 3, name: "producer" },
    { role_id: 4, name: "user" },
    { role_id: 5, name: "engineer" },
    { role_id: 6, name: "tester" },
  ],
};

const UsersEditor = () => {
  const [searchText, setSearchText] = useState("");
  const fetchUsers = () => {
    alert(`search users includes "${searchText}"!`);
  };

  return (
    <div style={{ flex: 1 }}>
      <Spacer axis="vertical" size="3vh" />
      <ToolBar>
        <SearchForm
          onSubmit={fetchUsers}
          searchText={searchText}
          onChange={(newSearchText) => {
            setSearchText(newSearchText);
          }}
        />
        <Spacer axis="horizontal" size="15px" />
        <div>| per page component |</div>
        <Spacer axis="horizontal" size="15px" />
        <Button
          href="https://manage.auth0.com/dashboard/us/hdwlab-com/users"
          startIcon={<AddCircle />}
        >
          Add User
        </Button>
      </ToolBar>
      <Spacer axis="vertical" size="3vh" />
      <div
        style={{
          overflow: "auto",
          minHeight: "40vh",
          maxHeight: "60vh",
        }}
      >
        <UserList {...exampleUsers} />
      </div>
      <Spacer axis="vertical" size="3vh" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination />
      </div>
    </div>
  );
};

export { UsersEditor };
