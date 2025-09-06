import { HamburgerIcon } from "@chakra-ui/icons";
import { Heading, HStack, IconButton, Spacer } from "@chakra-ui/react";

type TitleProps = {
  title: string;
  onMenuClick: () => void;
};

export const Header = ({ title, onMenuClick }: TitleProps) => {
  return (
    <HStack mb={4}>
      <Heading size={{ base: "sm", sm: "lg" }} alignContent={"space-between"}>
        {title}
      </Heading>
      <Spacer />
      <IconButton
        variant={"unstyled"}
        aria-label="header-buuton"
        icon={<HamburgerIcon boxSize={"20px"} />}
        onClick={onMenuClick}
      >
        etert
      </IconButton>
    </HStack>
  );
};
