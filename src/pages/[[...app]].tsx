import { useEffect, useState } from "react";
import { IndexPage } from "components/pages/IndexPage";

const Page = (): JSX.Element | null => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <IndexPage />;
};

export default Page;
