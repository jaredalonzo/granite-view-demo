import { FC } from "react";
import Container from "../../components/Container";
import Logo from "../../components/Logo";
import Navigation from "../../components/Navigation";

/*
 * Public Web — polished institutional marketing header (navy/gold, serif wordmark).
 */
const PublicWebHeader: FC = () => (
  <Container>
    <div className="py-8 flex flex-col lg:flex-row gap-5 lg:gap-12 items-center">
      <Logo />
      <Navigation />
    </div>
  </Container>
);

export default PublicWebHeader;
