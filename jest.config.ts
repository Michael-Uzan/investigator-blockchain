import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"], // no /extend-expect
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }], // 👈 TS in ESM mode
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  extensionsToTreatAsEsm: [".ts", ".tsx"], // 👈 allow TS + JSX in ESM
  transformIgnorePatterns: [
    "node_modules/(?!(@chakra-ui|framer-motion)/)", // 👈 allow chakra + framer-motion to be transformed
    "node_modules/(?!@legendapp/state)",
  ],
};

export default config;
