import "dotenv/config";
import express, { Express } from "express";
import { configurePreRouteMiddleware } from "./middleware/pre-route.middleware";

const app: Express = express();

const PORT = process.env.PORT || 4000;
console.log(PORT);

configurePreRouteMiddleware(app);

app.get("/", (_, res) => {
    res.send({ message: "Hello World! from Healify360" }).status(200);
});

// Listen to server port
app.listen(PORT, async () => {
    console.log(`:::> Server listening on port ${PORT} @ http://localhost:${PORT} <:::`);
});

// On server error
app.on("error", (error) => {
    console.error(`<::: An error occurred on the server: \n ${error}`);
});

export default app;
