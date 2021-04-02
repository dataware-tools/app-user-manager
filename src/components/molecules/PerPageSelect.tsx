import { Dropdown, Form, Input } from "semantic-ui-react";

const PerPageSelect = (props: any) => {
  return (
    <div>
      <Form>
        <Input
          label="#Rows per page:"
          fluid
          input={
            <Dropdown
              selection
              label="perPage"
              placeholder="20"
              onChange={(event: any, data: any) => {
                props.setPerPage(data.value);
              }}
              options={[
                { key: "20", value: 20, text: "20" },
                { key: "50", value: 50, text: "50" },
                { key: "100", value: 100, text: "100" },
                { key: "200", value: 200, text: "200" },
                { key: "500", value: 500, text: "500" },
              ]}
            />
          }
        />
      </Form>
    </div>
  );
};

export { PerPageSelect };
