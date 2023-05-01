import { cleanEnv } from "envalid/dist/envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env,{
    ORACLE_DB_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRET: str(),
    ORACLE_DB_USER: str(),
    ORACLE_DB_PASSWORD: str(),
});