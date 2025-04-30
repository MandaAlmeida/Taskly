module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  setupFiles: ["dotenv/config"],
  testEnvironment: "node",
  preset: "ts-jest/presets/default",
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "cobertura"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/main.ts",
    "jest.config.js",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/../src/$1",
  },
};
