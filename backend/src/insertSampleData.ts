import { Pool, Connection } from "oracledb";

export async function insertSampleData(pool: Pool): Promise<void> {
    const connection: Connection=await pool.getConnection();
  try {


    // //--------------------------------------------------------------------------------
    // // Insert sample data into AVINASH_TBL_CUSTOMER table
    // const customerSampleData = [
    //     { name: 'J.Smith', phone: '817-272-3000' },
    //     { name: 'R.Wong', phone: '817-272-4000' },
    //     { name: 'A.Patel', phone: '817-272-5000' },
    //     { name: 'C.Lewis', phone: '817-272-6000' },
    //     { name: 'S.Jones', phone: '817-272-7000' },
    //     { name: 'M.Garcia', phone: '817-272-8000' },
    //     { name: 'J.Hernandez', phone: '817-272-9000' },
    //     { name: 'M.Lopez', phone: '817-272-1000' },
    //     { name: 'M.Gonzalez', phone: '817-272-2000' },
    //     { name: 'A.Wilson', phone: '817-272-3000' },
    //   ];
      
    //   const insertCustomerSql = `
    //     INSERT INTO AVINASH_TBL_CUSTOMER (NAME, PHONE)
    //     VALUES (:name, :phone)
    //   `;
      
    //   try {
    //     await connection.executeMany(insertCustomerSql, customerSampleData);
    //     await connection.commit();
    //     console.log('CUSTOMER table sample data inserted successfully');
    //   } catch (err) {
    //     console.error('Error inserting customer sample data:', err);
    //   }
    // //--------------------------------------------------------------------------------


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
        { model: 'Chevy', year: 2015, typeId: 1, ownerId: 1 },
        { model: 'Toyota', year: 2014, typeId: 2, ownerId: 1 },
        { model: 'Ford', year: 2016, typeId: 3, ownerId: 2 },
        { model: 'Honda', year: 2017, typeId: 1, ownerId: 1 },
        { model: 'Nissan', year: 2018, typeId: 2, ownerId: 2 },
        { model: 'BMW', year: 2019, typeId: 3, ownerId: 3 },
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
        { rentalType: 'D', noOfDays: 3, noOfWeeks: null, startDate: new Date('2023-05-01'), returnDate: new Date('2023-05-04'), amountDue: 150, carId: 1, customerId: 1 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 2, startDate: new Date('2023-05-10'), returnDate: new Date('2023-05-24'), amountDue: 400, carId: 2, customerId: 2 },
        { rentalType: 'D', noOfDays: 5, noOfWeeks: null, startDate: new Date('2023-05-15'), returnDate: new Date('2023-05-20'), amountDue: 250, carId: 3, customerId: 3 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 1, startDate: new Date('2023-05-20'), returnDate: new Date('2023-05-27'), amountDue: 200, carId: 4, customerId: 4 },
        { rentalType: 'D', noOfDays: 2, noOfWeeks: null, startDate: new Date('2023-05-25'), returnDate: new Date('2023-05-27'), amountDue: 100, carId: 5, customerId: 5 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 3, startDate: new Date('2023-05-30'), returnDate: new Date('2023-06-20'), amountDue: 750, carId: 6, customerId: 6 },
        { rentalType: 'D', noOfDays: 4, noOfWeeks: null, startDate: new Date('2023-06-01'), returnDate: new Date('2023-06-05'), amountDue: 200, carId: 1, customerId: 7 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 2, startDate: new Date('2023-06-10'), returnDate: new Date('2023-06-24'), amountDue: 400, carId: 2, customerId: 8 },
        { rentalType: 'D', noOfDays: 5, noOfWeeks: null, startDate: new Date('2023-06-15'), returnDate: new Date('2023-06-20'), amountDue: 250, carId: 3, customerId: 9 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 1, startDate: new Date('2023-06-20'), returnDate: new Date('2023-06-27'), amountDue: 200, carId: 4, customerId: 10 },
        { rentalType: 'D', noOfDays: 2, noOfWeeks: null, startDate: new Date('2023-06-25'), returnDate: new Date('2023-06-27'), amountDue: 100, carId: 5, customerId: 1 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 3, startDate: new Date('2023-06-30'), returnDate: new Date('2023-07-20'), amountDue: 750, carId: 5, customerId: 2 },
        { rentalType: 'D', noOfDays: 4, noOfWeeks: null, startDate: new Date('2023-07-01'), returnDate: new Date('2023-07-05'), amountDue: 200, carId: 5, customerId: 2 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 2, startDate: new Date('2023-07-10'), returnDate: new Date('2023-07-24'), amountDue: 400, carId: 5, customerId: 2 },
        { rentalType: 'D', noOfDays: 5, noOfWeeks: null, startDate: new Date('2023-07-15'), returnDate: new Date('2023-07-20'), amountDue: 250, carId: 6, customerId: 3 },
        { rentalType: 'W', noOfDays: null, noOfWeeks: 1, startDate: new Date('2023-07-20'), returnDate: new Date('2023-07-27'), amountDue: 200, carId: 6, customerId: 8 },
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
        { carId: 1, startDate: new Date('2023-05-04'), endDate: new Date('2023-05-10') },
        { carId: 2, startDate: new Date('2023-05-24'), endDate: new Date('2023-05-30') },
        { carId: 3, startDate: new Date('2023-05-20'), endDate: new Date('2023-05-25') },
        { carId: 4, startDate: new Date('2023-06-20'), endDate: new Date('2023-06-25') },
        { carId: 5, startDate: new Date('2023-06-10'), endDate: new Date('2023-06-15') },
        { carId: 6, startDate: new Date('2023-06-15'), endDate: new Date('2023-06-20') },
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
