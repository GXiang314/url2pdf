/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "~/routes": "<rootDir>/src/routes",
    "~/(.*)": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(t|j)s?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "typescript",
            jsx: false,
            decorators: true,
            dynamicImport: true,
          },
        },
      },
    ],
  },
  testEnvironment: "node",
};
