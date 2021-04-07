type Props = {
  size: number | string;
  axis?: "vertical" | "horizontal";
  style?: any;
  delegated?: any;
};

const Component = ({ size, axis, style = {}, ...delegated }: Props) => {
  const width = axis === "vertical" ? 1 : size;
  const height = axis === "horizontal" ? 1 : size;
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
