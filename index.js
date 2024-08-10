import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { resolve } from "path";
import routes from "./routes";

const app = express();

app.set("view engine", "ejs");
app.set("views", resolve(".", "views"));
app.use(express.static(resolve(".", "static")));
app.use(express.json());
app.use(routes);

app.listen(8000, console.log("Listening on http://localhost:8000"));
