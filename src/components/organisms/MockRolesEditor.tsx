import Button from "@material-ui/core/Button";
import AddCircle from "@material-ui/icons/AddCircle";
import Pagination from "@material-ui/core/Pagination";
import { Spacer } from "../../utils";
import { SearchForm } from "../molecules/SearchForm";
import { ToolBar } from "./ToolBar";
import { createRef, useState } from "react";
import { RoleList } from "./RoleList";
import { RoleEditModal, RoleEditModalProps } from "./RoleEditModal";

const exampleRoles = {
  rows: [
    { name: "user", description: "外部の人", role_id: "1" },
    { name: "internal user", description: "内部の人", role_id: "2" },
    { name: "admin", description: "教員", role_id: "3" },
    { name: "test", description: "test", role_id: "4" },
    { name: "test", description: "test", role_id: "5" },
    { name: "test", description: "test", role_id: "6" },
    { name: "test", description: "test", role_id: "7" },
    { name: "test", description: "test", role_id: "8" },
    { name: "test", description: "test", role_id: "9" },
    { name: "test", description: "test", role_id: "10" },
  ],
  columns: [
    { field: "role_id", type: "number" as const },
    { field: "name", type: "string" as const },
    { field: "description", type: "string" as const },
  ],
};

const RolesEditor = () => {
  const [modalProps, setModalProps] = useState({
    roleId: undefined as RoleEditModalProps["roleId"],
    fetchMethod: undefined as RoleEditModalProps["fetchMethod"],
    focusTarget: undefined as RoleEditModalProps["focusTarget"],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const onModalClose = () => {
    setModalOpen(false);
  };
  const bottomRef = createRef<HTMLDivElement>();

  const AddRole = () => {
    setModalProps({
      fetchMethod: "update" as const,
      roleId: undefined,
      focusTarget: "roleName",
    });
    setModalOpen(true);
  };

  const [searchText, setSearchText] = useState("");
  const fetchUsers = () => {
    alert(`search roles includes "${searchText}"!`);
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
        <Button startIcon={<AddCircle />} onClick={AddRole}>
          Add Role
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
        <RoleList
          {...exampleRoles}
          stickyHeader
          bottomRef={bottomRef}
          onClickRow={(_, targetDetail) => {
            setModalProps({
              fetchMethod: "create" as const,
              roleId: targetDetail.row.role_id as number,
              focusTarget: undefined,
            });
            setModalOpen(true);
          }}
        />
        <RoleEditModal
          open={modalOpen}
          onClose={onModalClose}
          {...modalProps}
        />
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

export { RolesEditor };
