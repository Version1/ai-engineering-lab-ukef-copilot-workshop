import express from "express";
import userRoutes from "./features/users/user-routes.js";

const app = express();
app.use(express.json());

app.use("/users", userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.error(`Workshop demo server running on port ${PORT}`);
});

export default app;
