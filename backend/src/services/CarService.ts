import { Car } from '../models/Car';
import { Pool, Connection } from 'oracledb';
import { Application } from 'express';

export class CarService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllCars(): Promise<Car[][] | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Car[]>(`SELECT * FROM AVINASH_TBL_CAR`);
    connection.close();
    return result.rows;
  }

  public async getCarById(id: number): Promise<Car | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Car>(`SELECT * FROM AVINASH_TBL_CAR WHERE VEHICLEID = :id`, [id]);
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async createCar(car: Car): Promise<Car | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Car>(
      `INSERT INTO AVINASH_TBL_CAR (VEHICLEID, MODEL, YEAR, TYPEID, OWNERID) VALUES (:vehicleid, :model, :year, :typeid, :ownerid)`,
      [car.vehicleId, car.model, car.year, car.typeId, car.ownerId]
    );
    connection.commit();
    connection.close();

    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async updateCar(id: number, car: Car): Promise<Car | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Car>(
      `UPDATE AVINASH_TBL_CAR SET MODEL = :model, YEAR = :year, TYPEID = :typeid, OWNERID = :ownerid WHERE VEHICLEID = :id`,
      [car.model, car.year, car.typeId, car.ownerId, id]
    );
    connection.commit();
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async deleteCar(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    await connection.execute(`DELETE FROM AVINASH_TBL_CAR WHERE VEHICLEID = :id`, [id]);
    connection.commit();
    connection.close();
  }
}
