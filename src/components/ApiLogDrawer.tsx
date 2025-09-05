import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
} from "@chakra-ui/react";
import { logStore$ } from "../store/logStore";

export default function ApiLogDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const logs = logStore$.logs.get();

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>API Log</DrawerHeader>
        <DrawerBody>
          {logs.map((l, idx) => (
            <Box key={idx} borderBottom="1px" py={2}>
              <Text fontSize="xs">
                {l.state.toUpperCase()} — {l.url}
              </Text>
              {l.params && (
                <Text fontSize="xs">params: {JSON.stringify(l.params)}</Text>
              )}
              {l.error && <Text color="red.500">{l.error}</Text>}
            </Box>
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
