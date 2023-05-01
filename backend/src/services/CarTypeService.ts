import { CarType } from "../models/CarType";
import { Pool, Connection } from "oracledb";
import { Application } from "express";

export class CarTypeService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllCarTypes(): Promise<CarType[] | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<any>(
        `SELECT * FROM AVINASH_TBL_CAR_TYPE`
      );
      return result.rows?.map(
        (carType) =>
          new CarType(
            carType[0],
            carType[1],
            carType[2],
            carType[3],
            carType[4]
          )
      );
    } catch (error) {
      console.log(error);
    } finally {
      connection.close();
    }
  }

  public async getCarTypeById(id: number): Promise<CarType | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<CarType>(
        `SELECT * FROM AVINASH_TBL_CAR_TYPE WHERE TYPEID = :id`,
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

  public async createCarType(carType: CarType): Promise<CarType | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<CarType>(
        `INSERT INTO AVINASH_TBL_CAR_TYPE (TYPENAME, DAILYRATE, WEEKLYRATE, LUXURYFLAG) VALUES (:typename, :dailyrate, :weeklyrate, :luxuryflag)`,
        [
          carType.typeName,
          carType.dailyRate,
          carType.weeklyRate,
          carType.luxuryFlag,
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

  public async updateCarType(
    id: number,
    carType: CarType
  ): Promise<CarType | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<CarType>(
        `UPDATE AVINASH_TBL_CAR_TYPE SET TYPENAME = :typename, DAILYRATE = :dailyrate, WEEKLYRATE = :weeklyrate, LUXURYFLAG = :luxuryflag WHERE TYPEID = :id`,
        [
          carType.typeName,
          carType.dailyRate,
          carType.weeklyRate,
          carType.luxuryFlag,
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

  public async deleteCarType(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.execute(
        `DELETE FROM AVINASH_TBL_CAR_TYPE WHERE TYPEID = :id`,
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
