import { Rental, RentalView } from '../models/Rental';
import { Pool, Connection } from 'oracledb';
import { Application } from 'express';
import { formatDate } from '../util/formatDate';

export class RentalService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllRentals(): Promise<RentalView[] | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<any>(`SELECT * FROM RentalView`);
    return result.rows?.map((rental) => new RentalView(rental[0], rental[1], rental[2],rental[3],rental[4], rental[5], rental[6],rental[7],rental[8], rental[9],rental[10]));
  
    } catch (error) {
      console.log(error);
    }finally{
      connection.close();
    }
    
  }

  public async getRentalById(id: number): Promise<Rental | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<Rental>(`SELECT * FROM AVINASH_TBL_RENTAL WHERE RENTALID = :id`, [id]);
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
    } catch (error) {
      console.log(error);
    }finally{
      connection.close();
    }
    
  }

  public async createRental(rental: Rental): Promise<Rental | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<Rental>(
        `INSERT INTO AVINASH_TBL_RENTAL (RENTALTYPE, NOOFDAYS, NOOFWEEKS, STARTDATE, RETURNDATE, AMOUNTDUE, CARID, CUSTOMERID) VALUES (:rentalid, :rentaltype, :noofdays, :noofweeks, :startdate, :returndate, :amountdue, :carid, :customerid)`,
        [rental.rentalType, rental.noOfDays, rental.noOfWeeks, rental.startDate, rental.returnDate, rental.amountDue, rental.carId, rental.customerId]
      );
      connection.commit();
  
      if (result.rows !== undefined) {
          return result.rows[0];
        }
          return undefined;
    } catch (error) {
      console.log(error);
    }finally{
      connection.close();
    }
    
  }

  public async updateRental(id: number, rental: Rental): Promise<Rental | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<Rental>(
        `UPDATE AVINASH_TBL_RENTAL SET RENTALTYPE = :rentaltype, NOOFDAYS = :noofdays, NOOFWEEKS = :noofweeks, STARTDATE = :startdate, RETURNDATE = :returndate, AMOUNTDUE = :amountdue, CARID = :carid, CUSTOMERID = :customerid WHERE RENTALID = :id`,
        [rental.rentalType, rental.noOfDays, rental.noOfWeeks, formatDate(rental.startDate), formatDate(rental.returnDate), rental.amountDue, rental.carId, rental.customerId, id]
      );
      connection.commit();
      if (result.rows !== undefined) {
          return result.rows[0];
        }
          return undefined;
    } catch (error) {
      console.log(error);
    }finally{
      connection.close();
    }
    
  }

  public async deleteRental(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.execute(`DELETE FROM AVINASH_TBL_RENTAL WHERE RENTALID = :id`, [id]);
    connection.commit();
    } catch (error) {
      console.log(error);
    }finally{
      connection.close();
    }
    
  }
}
