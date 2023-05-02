import { CarAvailability } from "../models/CarAvailability";
import { Pool, Connection } from "oracledb";
import { Application } from "express";

export class CarAvailabilityService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllCarAvailabilities(): Promise<
    CarAvailability[] | undefined
  > {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<any>(
        `select a.AVAILABILITYID, a.CARID, a.STARTDATE, a.ENDDATE,b.model from avinash_tbl_car_availability a 
        join
        avinash_tbl_car b
        on a.CARID=b.VEHICLEID`
      );
      return result.rows?.map(
        (carAvailability) =>
          new CarAvailability(
            carAvailability[0],
            carAvailability[1],
            carAvailability[2],
            carAvailability[3],
            carAvailability[4]
          )
      );
    } catch (error) {
      console.log(error);
    } finally {
      connection.close();
    }
  }

  public async getCarAvailabilityById(
    id: number
  ): Promise<CarAvailability | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<CarAvailability>(
        `SELECT * FROM AVINASH_TBL_CAR_AVAILABILITY WHERE AVAILABILITYID = :id`,
        [id]
      );
      if (result.rows !== undefined) {
        return result.rows[0];
      }
      return undefined;
    } catch (error) {
      console.log(error);
    } finally {
      connection.close();
    }
  }

  public async createCarAvailability(
    carAvailability: CarAvailability
  ): Promise<CarAvailability | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<CarAvailability>(
        `INSERT INTO AVINASH_TBL_CAR_AVAILABILITY (CARID, STARTDATE, ENDDATE) VALUES (:carid, :startdate, :enddate)`,
        [
          carAvailability.carId,
          carAvailability.startDate,
          carAvailability.endDate,
        ]
      );
      connection.commit();

      if (result.rows !== undefined) {
        return result.rows[0];
      }
      return undefined;
    } catch (error) {
      console.log(error);
    } finally {
      connection.close();
    }
  }

  public async updateCarAvailability(
    id: number,
    carAvailability: CarAvailability
  ): Promise<CarAvailability | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<CarAvailability>(
        `UPDATE AVINASH_TBL_CAR_AVAILABILITY SET CARID = :carid, STARTDATE = :startdate, ENDDATE = :enddate WHERE AVAILABILITYID = :id`,
        [
          carAvailability.carId,
          carAvailability.startDate,
          carAvailability.endDate,
          id,
        ]
      );
      connection.commit();
      if (result.rows !== undefined) {
        return result.rows[0];
      }
      return undefined;
    } catch (error) {
      console.log(error);
    } finally {
      connection.close();
    }
  }

  public async deleteCarAvailability(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.execute(
        `DELETE FROM AVINASH_TBL_CAR_AVAILABILITY WHERE AVAILABILITYID = :id`,
        [id]
      );
      connection.commit();
    } catch (error) {
      console.log(error);
    } finally {
      connection.close();
    }
  }
}
