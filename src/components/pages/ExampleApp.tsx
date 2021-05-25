import { PageWrapper } from "../organisms/PageWrapper";
import { Sample } from "../molecules/Sample";
import Container from "@material-ui/core/Container";

const ExampleApp = (): JSX.Element => {
  return (
    <PageWrapper>
      <Container>
        <Sample sample="sample" />
      </Container>
    </PageWrapper>
  );
};

export { ExampleApp };
