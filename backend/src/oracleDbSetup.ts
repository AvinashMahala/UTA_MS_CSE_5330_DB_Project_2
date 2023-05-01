import oracledb, { Connection, Pool } from "oracledb";

// Function to create tables if they don't exist
export async function createTablesIfNotExist(pool: Pool): Promise<void> {
  const connection: Connection=await pool.getConnection();

  try {

    // Create AVINASH_TBL_CUSTOMER table if not exists
    await connection.execute(`
      DECLARE
        table_exists NUMBER;
      BEGIN
        SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'AVINASH_TBL_CUSTOMER';
        IF table_exists = 0 THEN
          EXECUTE IMMEDIATE 'CREATE TABLE AVINASH_TBL_CUSTOMER (
            IdNo NUMBER GENERATED ALWAYS AS IDENTITY,
            Name VARCHAR2(50),
            Phone VARCHAR2(12),
            PRIMARY KEY (IdNo)
          )';
        END IF;
      END;
    `);

    console.log('CUSTOMER table checked/created successfully');

    // Create CAR_TYPE table if not exists
    await connection.execute(`
      DECLARE
        table_exists NUMBER;
      BEGIN
        SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'AVINASH_TBL_CAR_TYPE';
        IF table_exists = 0 THEN
          EXECUTE IMMEDIATE 'CREATE TABLE AVINASH_TBL_CAR_TYPE (
            TypeId NUMBER GENERATED ALWAYS AS IDENTITY,
            TypeName VARCHAR2(50),
            DailyRate NUMBER,
            WeeklyRate NUMBER,
            LuxuryFlag CHAR(1) DEFAULT ''N'' NOT NULL,
            PRIMARY KEY (TypeId)
          )';
        END IF;
      END;
    `);

    console.log('CAR_TYPE table checked/created successfully');

    // Create OWNER table if not exists
    await connection.execute(`
      DECLARE
        table_exists NUMBER;
      BEGIN
        SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'AVINASH_TBL_OWNER';
        IF table_exists = 0 THEN
          EXECUTE IMMEDIATE 'CREATE TABLE AVINASH_TBL_OWNER (
            OwnerId NUMBER GENERATED ALWAYS AS IDENTITY,
            OwnerType CHAR(1) NOT NULL,
            Name VARCHAR2(50),
            BankName VARCHAR2(50),
            PRIMARY KEY (OwnerId)
          )';
        END IF;
      END;
    `);
    console.log('OWNER table checked/created successfully');

    // Create CAR table if not exists
    await connection.execute(`
      DECLARE
        table_exists NUMBER;
      BEGIN
        SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'AVINASH_TBL_CAR';
        IF table_exists = 0 THEN
          EXECUTE IMMEDIATE 'CREATE TABLE AVINASH_TBL_CAR (
            VehicleID NUMBER GENERATED ALWAYS AS IDENTITY,
            Model VARCHAR2(50),
            Year NUMBER,
            TypeId NUMBER,
            OwnerId NUMBER,
            PRIMARY KEY (VehicleID),
            FOREIGN KEY (TypeId) REFERENCES AVINASH_TBL_CAR_TYPE(TypeId),
            FOREIGN KEY (OwnerId) REFERENCES AVINASH_TBL_OWNER(OwnerId)
          )';
        END IF;
      END;
    `);
    console.log('CAR table checked/created successfully');
    

    // Create RENTAL table if not exists
    await connection.execute(`
      DECLARE
        table_exists NUMBER;
      BEGIN
        SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'AVINASH_TBL_RENTAL';
        IF table_exists = 0 THEN
          EXECUTE IMMEDIATE 'CREATE TABLE AVINASH_TBL_RENTAL (
            RentalId NUMBER GENERATED ALWAYS AS IDENTITY,
            RentalType CHAR(1) NOT NULL,
            NoOfDays NUMBER,
            NoOfWeeks NUMBER,
            StartDate DATE,
            ReturnDate DATE,
            AmountDue NUMBER,
            CarId NUMBER,
            CustomerId NUMBER,
            PRIMARY KEY (RentalId),
            FOREIGN KEY (CarId) REFERENCES AVINASH_TBL_CAR(VehicleID),
            FOREIGN KEY (CustomerId) REFERENCES AVINASH_TBL_CUSTOMER(IdNo)
          )';
        END IF;
      END;
    `);
    console.log('RENTAL table checked/created successfully');

    // Create CAR_AVAILABILITY table if not exists
    await connection.execute(`
      DECLARE
        table_exists NUMBER;
        BEGIN
        SELECT COUNT(*) INTO table_exists FROM user_tables WHERE table_name = 'AVINASH_TBL_CAR_AVAILABILITY';
        IF table_exists = 0 THEN
          EXECUTE IMMEDIATE 'CREATE TABLE AVINASH_TBL_CAR_AVAILABILITY (
            AvailabilityId NUMBER GENERATED ALWAYS AS IDENTITY,
            CarId NUMBER,
            StartDate DATE,
            EndDate DATE,
            PRIMARY KEY (AvailabilityId),
            FOREIGN KEY (CarId) REFERENCES AVINASH_TBL_CAR(VehicleID)
          )';
        END IF;
      END;
    `);
    console.log('CAR_AVAILABILITY table checked/created successfully');
  } catch (error) {
    console.error("Error in createTablesIfNotExist:", error);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
}
