// These lines import the app module and configuration values from validateenv file
import app from "./app";
import env from "./util/validateenv";
import sqlite3 from 'sqlite3';

// This line imports mongoose for connecting to MongoDB
import mongoose from "mongoose";

// This constant holds the port number from the environment variable
const port=env.PORT;

// This connects to MongoDB using the MONGO_CONNECTION_STRING from the environment variable and logs a message to console if successful.
// It also starts the express server listening on the specified port and logs a message to console when it starts.
mongoose.connect(env.MONGO_CONNECTION_STRING).then(()=>{
    // If connection to the database is successful, this message is logged to console.
    console.log("Mongoose Connected!");

    // This starts the express server running on the specified port and logs a message to console when it starts.
    app.listen(port, ()=>{
        console.log("Server running on port: "+port);
    });
}).catch(console.error);


