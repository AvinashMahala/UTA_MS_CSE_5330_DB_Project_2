import { Rental } from '../models/Rental';
import { Pool, Connection } from 'oracledb';
import { Application } from 'express';

export class RentalService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllRentals(): Promise<Rental[][] | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Rental[]>(`SELECT * FROM AVINASH_TBL_RENTAL`);
    connection.close();
    return result.rows;
  }

  public async getRentalById(id: number): Promise<Rental | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Rental>(`SELECT * FROM AVINASH_TBL_RENTAL WHERE RENTALID = :id`, [id]);
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async createRental(rental: Rental): Promise<Rental | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Rental>(
      `INSERT INTO AVINASH_TBL_RENTAL (RENTALID, RENTALTYPE, NOOFDAYS, NOOFWEEKS, STARTDATE, RETURNDATE, AMOUNTDUE, CARID, CUSTOMERID) VALUES (:rentalid, :rentaltype, :noofdays, :noofweeks, :startdate, :returndate, :amountdue, :carid, :customerid) RETURNING *`,
      [rental.rentalId, rental.rentalType, rental.noOfDays, rental.noOfWeeks, rental.startDate, rental.returnDate, rental.amountDue, rental.carId, rental.customerId]
    );
    connection.commit();
    connection.close();

    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async updateRental(id: number, rental: Rental): Promise<Rental | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Rental>(
      `UPDATE AVINASH_TBL_RENTAL SET RENTALTYPE = :rentaltype, NOOFDAYS = :noofdays, NOOFWEEKS = :noofweeks, STARTDATE = :startdate, RETURNDATE = :returndate, AMOUNTDUE = :amountdue, CARID = :carid, CUSTOMERID = :customerid WHERE RENTALID = :id RETURNING *`,
      [rental.rentalType, rental.noOfDays, rental.noOfWeeks, rental.startDate, rental.returnDate, rental.amountDue, rental.carId, rental.customerId, id]
    );
    connection.commit();
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async deleteRental(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    await connection.execute(`DELETE FROM AVINASH_TBL_RENTAL WHERE RENTALID = :id`, [id]);
    connection.commit();
    connection.close();
  }
}
