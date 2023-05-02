import { Car } from '../models/Car';
import { Pool, Connection } from 'oracledb';
import { Application } from 'express';

export class CarService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllCars(): Promise<Car[] | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<any>(`SELECT * FROM avinash_view_car_details`);
    return result.rows?.map((car) => new Car(car[0], car[1], car[2],car[3],car[4],car[5],car[6]));
    } catch (error) {
      console.log(error);
    }finally{
      connection.close();
    }
    
  }

  public async getCarById(id: number): Promise<Car | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<Car>(`SELECT * FROM AVINASH_TBL_CAR WHERE VEHICLEID = :id`, [id]);
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

  public async createCar(car: Car): Promise<Car | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<Car>(
        `INSERT INTO AVINASH_TBL_CAR (MODEL, YEAR, TYPEID, OWNERID) VALUES (:model, :year, :typeid, :ownerid)`,
        [car.car_model, car.car_year, car.car_typeId, car.car_ownerId]
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

  public async updateCar(id: number, car: Car): Promise<Car | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<Car>(
        `UPDATE AVINASH_TBL_CAR SET MODEL = :model, YEAR = :year, TYPEID = :typeid, OWNERID = :ownerid WHERE VEHICLEID = :id`,
        [car.car_model, car.car_year, car.car_typeId, car.car_ownerId,id]
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

  public async deleteCar(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.execute(`DELETE FROM AVINASH_TBL_CAR WHERE VEHICLEID = :id`, [id]);
    connection.commit();
    } catch (error) {
      console.log(error);
    }finally{
      connection.close();
    }
    
  }
}
