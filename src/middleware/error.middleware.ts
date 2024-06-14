import response from "@/utilities/response";
import { Express, NextFunction, Request, Response } from "express";

const configureErrorMiddleware = (app: Express): Express => {
    // Handle 404 requests
    app.use("*", (_req: Request, res: Response) => {
        res.status(404).send(response("Invalid request - Not found", null, false));
    });

    // Handle errors middleware
    app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
        // Handle custom errors
        res.status(500).send(response(error.message, null, false));

        console.error(error);

        next();
    });

    return app;
};

export { configureErrorMiddleware };
