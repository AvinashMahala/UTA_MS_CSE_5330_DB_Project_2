import { CarType } from '../models/CarType';
import { Pool, Connection } from 'oracledb';
import { Application } from 'express';

export class CarTypeService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllCarTypes(): Promise<CarType[][] | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<CarType[]>(`SELECT * FROM AVINASH_TBL_CAR_TYPE`);
    connection.close();
    return result.rows;
  }

  public async getCarTypeById(id: number): Promise<CarType | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<CarType>(`SELECT * FROM AVINASH_TBL_CAR_TYPE WHERE TYPEID = :id`, [id]);
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async createCarType(carType: CarType): Promise<CarType | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<CarType>(
      `INSERT INTO AVINASH_TBL_CAR_TYPE (TYPEID, TYPENAME, DAILYRATE, WEEKLYRATE, LUXURYFLAG) VALUES (:typeid, :typename, :dailyrate, :weeklyrate, :luxuryflag) RETURNING *`,
      [carType.typeId, carType.typeName, carType.dailyRate, carType.weeklyRate, carType.luxuryFlag]
    );
    connection.commit();
    connection.close();
    
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async updateCarType(id: number, carType: CarType): Promise<CarType | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<CarType>(
      `UPDATE AVINASH_TBL_CAR_TYPE SET TYPENAME = :typename, DAILYRATE = :dailyrate, WEEKLYRATE = :weeklyrate, LUXURYFLAG = :luxuryflag WHERE TYPEID = :id RETURNING *`,
      [carType.typeName, carType.dailyRate, carType.weeklyRate, carType.luxuryFlag, id]
    );
    connection.commit();
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async deleteCarType(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    await connection.execute(`DELETE FROM AVINASH_TBL_CAR_TYPE WHERE TYPEID = :id`, [id]);
    connection.commit();
    connection.close();
  }
}
