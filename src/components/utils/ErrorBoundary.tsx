import React from "react";
import { Button, Text, VStack } from "@chakra-ui/react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

function FallbackComponent({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <VStack>
      <Text color="red.500">Something went wrong: {error.message}</Text>
      <Button mt={2} onClick={resetErrorBoundary}>
        Retry
      </Button>
    </VStack>
  );
}

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ReactErrorBoundary>
  );
}
