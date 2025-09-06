import { Container } from "@chakra-ui/react";
import { type ReactNode } from "react";

type MainContainerProps = {
  children: ReactNode;
};

export const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <Container maxW="container.xl" py={{ base: 4, md: 6 }}>
      {children}
    </Container>
  );
};
