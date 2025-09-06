import { VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";

export const FooterWarper = ({ children }: { children: ReactNode }) => {
  return (
    <VStack p={"29px"} alignContent={"center"} pb={"70px"}>
      {children}
    </VStack>
  );
};
