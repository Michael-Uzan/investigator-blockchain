import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import ApiLogDrawer from "./components/ApiLogDrawer";
import { MainContainer } from "./components/layout/MainContainer";
import { Header } from "./components/layout/Header";
import { GraphApp } from "./view/GraphApp";
import { AppFooter } from "./components/AppFooter";

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <MainContainer>
        <Header title="Blockchain Investigator" onMenuClick={onOpen} />
        <GraphApp />
        <ApiLogDrawer isOpen={isOpen} onClose={onClose} />
        <AppFooter />
      </MainContainer>
    </ChakraProvider>
  );
}
