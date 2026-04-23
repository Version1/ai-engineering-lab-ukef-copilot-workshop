// Starter routes file — used as context during Exercise 3 (Structure)
//
// Exercise 3:
//   Ask the AI to create a new "orders" feature.
//   Watch where it puts the files — with and without the MCP server.

import express from "express";

const router = express.Router();

router.get("/:id", async (req, res) => {
  res.json({ id: req.params.id, name: "Alice Johnson", email: "alice@example.com" });
});

router.get("/", async (_req, res) => {
  res.json([
    { id: "1", name: "Alice Johnson" },
    { id: "2", name: "Bob Smith" },
  ]);
});

export default router;
