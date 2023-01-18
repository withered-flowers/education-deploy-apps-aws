import cors from "cors";
import express from "express";

import { fetchTodos } from "./services/jsonplaceholder.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "echo OK",
    environmentSecret: process.env.SECRET ?? "Secret not Provided",
  });
});

app.get("/api", async (req, res) => {
  const data = await fetchTodos();

  res.status(200).json({
    statusCode: 200,
    data,
  });
});

app.listen(port, (_) => console.log(`apps is listen @ port ${port}`));
