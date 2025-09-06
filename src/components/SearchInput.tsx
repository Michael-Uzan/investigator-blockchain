import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";

type SearchInputProps = {
  title: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
};

export const SearchInput = ({
  title,
  value,
  onChange,
  onSubmit,
}: SearchInputProps) => {
  return (
    <Box>
      <Text fontSize={"18px"} mb={{ base: "2px", sm: "5px" }}>
        {title}
      </Text>
      <HStack mb={4} spacing={{ base: 1, sm: 2 }} flexWrap="wrap">
        <Input
          w={{ base: "100%", sm: "350px" }}
          placeholder="Enter Bitcoin address"
          value={value}
          onChange={({ target }) => onChange(target.value)}
        />
        <Button
          flexShrink={0}
          size={{ base: "sm", sm: "md" }}
          w={{ base: "100%", sm: "auto" }}
          onClick={onSubmit}
        >
          Search
        </Button>
      </HStack>
    </Box>
  );
};
