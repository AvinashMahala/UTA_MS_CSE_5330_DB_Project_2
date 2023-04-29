import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, { HttpError, isHttpError } from "http-errors";
import session from "express-session";
import oracledb from "oracledb";
import env from "./util/validateenv";
import { requiresAuth } from "./middleware/auth";
import { createTablesIfNotExist } from "./oracleDbSetup";
import { insertSampleData } from "./insertSampleData";
import { CustomerRoutes } from "./routes/CustomerRoutes";
import { CarTypeRoutes } from "./routes/CarTypeRoutes";
import { CarRoutes } from "./routes/CarRoutes";
import { RentalRoutes } from "./routes/RentalRoutes";
import { CarAvailabilityRoutes } from "./routes/CarAvailabilityRoutes";

interface SessionData extends session.SessionData {
  [key: string]: any;
}

const app = express();

app.use(morgan("dev"));

app.use(express.json());

// Connect to Oracle database using a connection pool
oracledb
  .createPool({
    user: env.ORACLE_DB_USER,
    password: env.ORACLE_DB_PASSWORD,
    connectString: env.ORACLE_DB_CONNECTION_STRING,
    poolMin: 10,
    poolMax: 10,
  })
  .then((pool) => {
    console.log("Oracle Connection Pool Created!");
    // Add pool to app.locals for further usage in the app
    app.locals.pool = pool;
    // Invoke createTablesIfNotExist to create tables if they don't exist
    
    // createTablesIfNotExist(pool)
    //   .then(() => {
    //     console.log("Tables checked/created successfully");
    //     // Insert sample data
    //     insertSampleData(app.locals.pool)
    //       .then(() => {
    //         console.log("Sample data inserted successfully");
    //       })
    //       .catch((error) => {
    //         console.error("Error inserting sample data:", error);
    //       });
    //   })
    //   .catch((error) => {
    //     console.error("Error checking/creating tables:", error);
    //   });

    app.use(
      session({
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 60 * 60 * 1000,
        },
        rolling: true,
        store: new (class OracleDBStore extends session.Store {
          pool: oracledb.Pool;

          constructor() {
            super();
            this.pool = oracledb.getPool();
          }

          async set(sid: string, sessionData: SessionData) {
            const conn = await this.pool.getConnection();
            try {
              const result = await conn.execute(
                "MERGE INTO sessions USING DUAL ON (sid = :1) WHEN MATCHED THEN UPDATE SET data = :2 WHEN NOT MATCHED THEN INSERT (sid, data) VALUES (:1, :2)",
                [sid, JSON.stringify(sessionData)]
              );
              if (result.rowsAffected === 0) {
                throw new Error("Unable to set session data");
              }
            } finally {
              conn.release();
            }
          }

          async get(sid: string) {
            const conn = await this.pool.getConnection();
            try {
              const result = await conn.execute(
                "SELECT data FROM sessions WHERE sid = :1",
                [sid]
              );
              if ((result as any).rows && (result as any).rows.length > 0) {
                return JSON.parse((result as any).rows[0][0]) as SessionData;
              } else {
                return null;
              }
            } finally {
              conn.release();
            }
          }

          async destroy(sid: string) {
            const conn = await this.pool.getConnection();
            try {
              const result = await conn.execute(
                "DELETE FROM sessions WHERE sid = :1",
                [sid]
              );
              if (result.rowsAffected === 0) {
                throw new Error("Unable to destroy session data");
              }
            } finally {
              conn.release();
            }
          }
        })(),
      })
    );

    // Initialize Customer routes
    const customerRoutes = new CustomerRoutes(app);
    app.use('/api/customers', customerRoutes.router);

    // Initialize Car Type routes
    const carTypeRoutes = new CarTypeRoutes(app);
    app.use('/api/cartype', carTypeRoutes.router);

    // Initialize Owner routes
    const ownerRoutes = new CarTypeRoutes(app);
    app.use('/api/owner', ownerRoutes.router);

    // Initialize Car routes
    const carRoutes = new CarRoutes(app);
    app.use('/api/car', carRoutes.router);

    // Initialize Rental routes
    const rentalRoutes = new RentalRoutes(app);
    app.use('/api/rental', rentalRoutes.router);

    // Initialize CarAvailability routes
    const carAvailabilityRoutes = new CarAvailabilityRoutes(app);
    app.use('/api/caravailability', carAvailabilityRoutes.router);

    app.use("/api/users", userRoutes);
    app.use("/api/notes", requiresAuth, notesRoutes);

    app.use((req, res, next) => {
      next(createHttpError(404, "Endpoint not Found!!"));
    });

    app.use(
      (error: unknown, req: Request, res: Response, next: NextFunction) => {
        let errorMessage = "An Unknown Error Occurred!";
        let statusCode = 500;
        if (isHttpError(error)) {
          statusCode = error.status;
          errorMessage = error.message;
        }
        res.status(statusCode).json({ error: errorMessage });
      }
    );
  })
  .catch(console.error);

export default app;
