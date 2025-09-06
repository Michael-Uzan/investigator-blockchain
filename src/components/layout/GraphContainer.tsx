import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

type GraphContainerProps = {
  children: ReactNode;
};

export const GraphContainer = ({ children }: GraphContainerProps) => {
  return (
    <Box
      mb={4}
      position="relative"
      h={{ base: "400px", md: "600px" }}
      borderWidth={1}
      borderRadius="md"
      overflow="hidden"
      alignItems={"center"}
      justifyContent={"center"}
      display={"flex"}
    >
      {children}
    </Box>
  );
};
