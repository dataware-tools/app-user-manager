type Props = {
  size: number | string;
  direction?: "vertical" | "horizontal";
  style?: any;
  delegated?: any;
};

const Component = ({
  size,
  direction,
  style = {},
  ...delegated
}: Props): JSX.Element => {
  const width = direction === "vertical" ? 1 : size;
  const height = direction === "horizontal" ? 1 : size;
  return (
    <span
      style={{
        display: "block",
        width,
        minWidth: width,
        height,
        minHeight: height,
        ...style,
      }}
      {...delegated}
    />
  );
};

export { Component as Spacer };
