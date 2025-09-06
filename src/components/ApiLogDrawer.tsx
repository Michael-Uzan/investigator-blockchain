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
              <Text fontSize="xs" color={l.error ? "red.500" : "green.500"}>
                {l.state.toUpperCase()} —{" "}
                <span style={{ color: "black" }}>{l.url}</span>
              </Text>
              {l.params && (
                <Text fontSize="xs">params: {JSON.stringify(l.params)}</Text>
              )}
              {l.error && <Text color="red.500">{l.error}</Text>}
            </Box>
          ))}
          {!logs.length ? <Text>There is no logs. </Text> : null}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
