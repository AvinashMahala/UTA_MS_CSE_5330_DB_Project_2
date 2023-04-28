// This line imports configuration values from the .env file 
import "dotenv/config";

// These lines import required modules and files 
import express, { Request, Response, NextFunction } from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateenv";
import MongoStore  from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

// This middleware logs HTTP requests to the console with a specified format
app.use(morgan("dev"));

// This middleware parses incoming request data in JSON format and adds it to req.body
app.use(express.json());

// This middleware sets up express-session with options for session handling
app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 60 * 60 * 1000, 
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    })
}));

// These routes handle API endpoints for users and notes
app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, notesRoutes);

// This middleware is used as a catch-all endpoint that triggers when no other route is matched
app.use((req, res, next)=>{
    next(createHttpError(404,"Endpoint not Found!!"));
});

// This middleware is used as an error handler that catches any uncaught errors and sends an appropriate response back to the client
app.use((error:unknown, req:Request, res:Response, next:NextFunction)=>{
    //console.log(error);
    let errorMessage="An Unknown Error Occurred!";
    let statusCode=500;
    if(isHttpError(error)){
        statusCode=error.status;
        errorMessage=error.message;
    }
    res.status(statusCode).json({error: errorMessage});
});

// This exports the express app instance for use in other modules
export default app;
