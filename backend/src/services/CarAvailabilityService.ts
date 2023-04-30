import { CarAvailability } from '../models/CarAvailability';
import { Pool, Connection } from 'oracledb';
import { Application } from 'express';

export class CarAvailabilityService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllCarAvailabilities(): Promise<CarAvailability[] | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<any>(`SELECT * FROM AVINASH_TBL_CAR_AVAILABILITY`);
    connection.close();
    return result.rows?.map((carAvailability) => new CarAvailability(carAvailability[0], carAvailability[1], carAvailability[2],carAvailability[3]));
  }

  public async getCarAvailabilityById(id: number): Promise<CarAvailability | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<CarAvailability>(`SELECT * FROM AVINASH_TBL_CAR_AVAILABILITY WHERE AVAILABILITYID = :id`, [id]);
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async createCarAvailability(carAvailability: CarAvailability): Promise<CarAvailability | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<CarAvailability>(
      `INSERT INTO AVINASH_TBL_CAR_AVAILABILITY (CARID, STARTDATE, ENDDATE) VALUES (:carid, :startdate, :enddate)`,
      [carAvailability.carId, carAvailability.startDate, carAvailability.endDate]
    );
    connection.commit();
    connection.close();

    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async updateCarAvailability(id: number, carAvailability: CarAvailability): Promise<CarAvailability | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<CarAvailability>(
      `UPDATE AVINASH_TBL_CAR_AVAILABILITY SET CARID = :carid, STARTDATE = :startdate, ENDDATE = :enddate WHERE AVAILABILITYID = :id`,
      [carAvailability.carId, carAvailability.startDate, carAvailability.endDate, id]
    );
    connection.commit();
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async deleteCarAvailability(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    await connection.execute(`DELETE FROM AVINASH_TBL_CAR_AVAILABILITY WHERE AVAILABILITYID = :id`, [id]);
    connection.commit();
    connection.close();
  }
}
