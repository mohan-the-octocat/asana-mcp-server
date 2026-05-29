# Technology Stack: Asana MCP Server

## 1. Core Runtime & Language
- **Runtime:** Node.js (v18+ recommended)
- **Language:** TypeScript (v6.0+)
- **Module System:** ES Modules (ESM) via `"type": "module"` in `package.json`

## 2. Core Dependencies
- **Model Context Protocol SDK (`@modelcontextprotocol/sdk`):** Used to build the MCP server, defining tools, resources, and handling the JSON-RPC communication protocol over standard I/O.
- **Asana SDK (`asana`):** Node.js client library used for authenticating with the Asana API and executing task, workspace, project, and goal management operations.

## 3. Development & Build Tooling
- **Compiler:** `tsc` (TypeScript Compiler) compiling code into the `dist/` directory.
- **Development Execution:** `ts-node` for running TypeScript source files directly without a manual compilation step.
- **Test Framework:** `vitest` for fast, native ESM unit and integration testing.
