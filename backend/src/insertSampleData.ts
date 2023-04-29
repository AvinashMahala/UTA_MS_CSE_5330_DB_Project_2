import { Pool, Connection } from "oracledb";

export async function insertSampleData(pool: Pool): Promise<void> {
    const connection: Connection=await pool.getConnection();
  try {

/*
    //--------------------------------------------------------------------------------
    // Insert sample data into AVINASH_TBL_CUSTOMER table
    const customerSampleData = [
        { name: 'J.Smith', phone: '817-272-3000' },
        { name: 'R.Wong', phone: '817-272-4000' },
        { name: 'A.Patel', phone: '817-272-5000' },
        { name: 'C.Lewis', phone: '817-272-6000' },
        { name: 'S.Jones', phone: '817-272-7000' },
        { name: 'M.Garcia', phone: '817-272-8000' },
        { name: 'J.Hernandez', phone: '817-272-9000' },
        { name: 'M.Lopez', phone: '817-272-1000' },
        { name: 'M.Gonzalez', phone: '817-272-2000' },
        { name: 'A.Wilson', phone: '817-272-3000' },
      ];
      
      const insertCustomerSql = `
        INSERT INTO AVINASH_TBL_CUSTOMER (NAME, PHONE)
        VALUES (:name, :phone)
      `;
      
      try {
        await connection.executeMany(insertCustomerSql, customerSampleData);
        await connection.commit();
        console.log('CUSTOMER table sample data inserted successfully');
      } catch (err) {
        console.error('Error inserting customer sample data:', err);
      }
    //--------------------------------------------------------------------------------
*/

/*
    //--------------------------------------------------------------------------------
    // Insert sample data into AVINASH_TBL_CAR_TYPE table

    const carTypeSampleData = [
        { typeName: 'COMPACT', dailyRate: 30, weeklyRate: 150, luxuryFlag: 'N' },
        { typeName: 'MEDIUM', dailyRate: 40, weeklyRate: 200, luxuryFlag: 'N' },
        { typeName: 'LARGE', dailyRate: 50, weeklyRate: 250, luxuryFlag: 'N' },
        // Add more sample data if needed
      ];
      
      const insertCarTypeSql = `
        INSERT INTO AVINASH_TBL_CAR_TYPE (TYPENAME, DAILYRATE, WEEKLYRATE, LUXURYFLAG)
        VALUES (:typeName, :dailyRate, :weeklyRate, :luxuryFlag)
      `;
      
      try {
        await connection.executeMany(insertCarTypeSql, carTypeSampleData);
        await connection.commit();
        console.log('CAR_TYPE table sample data inserted successfully');
      } catch (err) {
        console.error('Error inserting car type sample data:', err);
      }
    //--------------------------------------------------------------------------------
*/

/*
    //--------------------------------------------------------------------------------
    // Insert sample data into AVINASH_TBL_OWNER table
    const ownerSampleData = [
        { ownerType: 'C', name: 'Car Rental Company', bankName: null },
        { ownerType: 'B', name: null, bankName: 'Bank of America' },
        { ownerType: 'I', name: 'John Doe', bankName: null },
        // Add more sample data if needed
      ];
      
      const insertOwnerSql = `
        INSERT INTO AVINASH_TBL_OWNER (OWNERTYPE, NAME, BANKNAME)
        VALUES (:ownerType, :name, :bankName)
      `;
      
      try {
        await connection.executeMany(insertOwnerSql, ownerSampleData);
        await connection.commit();
        console.log('OWNER table sample data inserted successfully');
      } catch (err) {
        console.error('Error inserting owner sample data:', err);
      }
      
    //--------------------------------------------------------------------------------
*/

/*
    //--------------------------------------------------------------------------------
    // Insert sample data into AVINASH_TBL_CAR table

    const carSampleData = [
        { model: 'Chevy', year: 2015, typeId: 104, ownerId: 41 },
        { model: 'Toyota', year: 2014, typeId: 105, ownerId: 42 },
        { model: 'Ford', year: 2016, typeId: 106, ownerId: 43 },
        { model: 'Honda', year: 2017, typeId: 104, ownerId: 41 },
        { model: 'Nissan', year: 2018, typeId: 105, ownerId: 42 },
        { model: 'BMW', year: 2019, typeId: 106, ownerId: 42 },
      ];
      
      const insertCarSql = `
        INSERT INTO AVINASH_TBL_CAR (MODEL, YEAR, TYPEID, OWNERID)
        VALUES (:model, :year, :typeId, :ownerId)
      `;
      
      try {
        await connection.executeMany(insertCarSql, carSampleData);
        await connection.commit();
        console.log('CAR table sample data inserted successfully');
      } catch (err) {
        console.error('Error inserting car sample data:', err);
      }
      

    //--------------------------------------------------------------------------------
*/

/*
    //--------------------------------------------------------------------------------
    // Insert sample data into AVINASH_TBL_RENTAL table
    const rentalSampleData = [
        { rentalType: 'D', noOfDays: 3, noOfWeeks: null, startDate: new Date('2023-05-01'), returnDate: new Date('2023-05-04'), amountDue: 150, carId: 87, customerId: 201 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 2, startDate: new Date('2023-05-10'), returnDate: new Date('2023-05-24'), amountDue: 400, carId: 87, customerId: 201 },
        { rentalType: 'D', noOfDays: 5, noOfWeeks: null, startDate: new Date('2023-05-15'), returnDate: new Date('2023-05-20'), amountDue: 250, carId: 88, customerId: 201 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 1, startDate: new Date('2023-05-20'), returnDate: new Date('2023-05-27'), amountDue: 200, carId: 88, customerId: 202 },
        { rentalType: 'D', noOfDays: 2, noOfWeeks: null, startDate: new Date('2023-05-25'), returnDate: new Date('2023-05-27'), amountDue: 100, carId: 88, customerId: 202 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 3, startDate: new Date('2023-05-30'), returnDate: new Date('2023-06-20'), amountDue: 750, carId: 88, customerId: 203 },
        { rentalType: 'D', noOfDays: 4, noOfWeeks: null, startDate: new Date('2023-06-01'), returnDate: new Date('2023-06-05'), amountDue: 200, carId: 88, customerId: 203 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 2, startDate: new Date('2023-06-10'), returnDate: new Date('2023-06-24'), amountDue: 400, carId: 89, customerId: 204 },
        { rentalType: 'D', noOfDays: 5, noOfWeeks: null, startDate: new Date('2023-06-15'), returnDate: new Date('2023-06-20'), amountDue: 250, carId: 89, customerId: 205 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 1, startDate: new Date('2023-06-20'), returnDate: new Date('2023-06-27'), amountDue: 200, carId: 89, customerId: 205 },
        { rentalType: 'D', noOfDays: 2, noOfWeeks: null, startDate: new Date('2023-06-25'), returnDate: new Date('2023-06-27'), amountDue: 100, carId: 90, customerId: 206 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 3, startDate: new Date('2023-06-30'), returnDate: new Date('2023-07-20'), amountDue: 750, carId: 90, customerId: 206 },
        { rentalType: 'D', noOfDays: 4, noOfWeeks: null, startDate: new Date('2023-07-01'), returnDate: new Date('2023-07-05'), amountDue: 200, carId: 91, customerId: 206 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 2, startDate: new Date('2023-07-10'), returnDate: new Date('2023-07-24'), amountDue: 400, carId: 91, customerId: 207 },
        { rentalType: 'D', noOfDays: 5, noOfWeeks: null, startDate: new Date('2023-07-15'), returnDate: new Date('2023-07-20'), amountDue: 250, carId: 92, customerId: 208 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 1, startDate: new Date('2023-07-20'), returnDate: new Date('2023-07-27'), amountDue: 200, carId: 92, customerId: 209 },
        // Add more sample data if needed
      ];
      
      const insertRentalSql = `
        INSERT INTO AVINASH_TBL_RENTAL (RENTALTYPE, NOOFDAYS, NOOFWEEKS, STARTDATE, RETURNDATE, AMOUNTDUE, CARID, CUSTOMERID)
        VALUES (:rentalType, :noOfDays, :noOfWeeks, :startDate, :returnDate, :amountDue, :carId, :customerId)
      `;
      
      try {
        await connection.executeMany(insertRentalSql, rentalSampleData);
        await connection.commit();
        console.log('RENTAL table sample data inserted successfully');
      } catch (err) {
        console.error('Error inserting rental sample data:', err);
      }
      

    //--------------------------------------------------------------------------------
 
*/

/*
    //--------------------------------------------------------------------------------
    // Insert sample data into AVINASH_TBL_CAR_AVAILABILITY table
    const carAvailabilitySampleData = [
        { carId: 87, startDate: new Date('2023-05-04'), endDate: new Date('2023-05-10') },
        { carId: 88, startDate: new Date('2023-05-24'), endDate: new Date('2023-05-30') },
        { carId: 89, startDate: new Date('2023-05-20'), endDate: new Date('2023-05-25') },
        { carId: 90, startDate: new Date('2023-06-20'), endDate: new Date('2023-06-25') },
        { carId: 91, startDate: new Date('2023-06-10'), endDate: new Date('2023-06-15') },
        { carId: 92, startDate: new Date('2023-06-15'), endDate: new Date('2023-06-20') },
      ];
      
      const insertCarAvailabilitySql = `
        INSERT INTO AVINASH_TBL_CAR_AVAILABILITY (CARID, STARTDATE, ENDDATE)
        VALUES (:carId, :startDate, :endDate)
      `;
      
      try {
        await connection.executeMany(insertCarAvailabilitySql, carAvailabilitySampleData);
        await connection.commit();
        console.log('CAR AVAILABILITY table sample data inserted successfully');
      } catch (err) {
        console.error('Error inserting car availability sample data:', err);
      }
      
    //--------------------------------------------------------------------------------
*/
  } catch (err) {
    console.error("Error inserting sample data:", err);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error("Error rolling back transaction:", rollbackErr);
      }
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}
