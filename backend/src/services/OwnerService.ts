import { Owner } from "../models/Owner";
import { Pool, Connection } from "oracledb";
import { Application } from "express";

export class OwnerService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllOwners(): Promise<Owner[] | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<any>(
        `SELECT * FROM AVINASH_TBL_OWNER`
      );
      return result.rows?.map(
        (owner) => new Owner(owner[0], owner[1], owner[2], owner[3])
      );
    } catch (error) {
      console.log(error);
    } finally {
      connection.close();
    }
  }

  public async getOwnerById(id: number): Promise<Owner | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<Owner>(
        `SELECT * FROM AVINASH_TBL_OWNER WHERE OWNERID = :id`,
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

  public async createOwner(owner: Owner): Promise<Owner | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<Owner>(
        `INSERT INTO AVINASH_TBL_OWNER (OWNERTYPE, NAME, BANKNAME) VALUES (:ownertype, :name, :bankname)`,
        [owner.ownerType, owner.name, owner.bankName]
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

  public async updateOwner(
    id: number,
    owner: Owner
  ): Promise<Owner | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const result = await connection.execute<Owner>(
        `UPDATE AVINASH_TBL_OWNER SET OWNERTYPE = :ownertype, NAME = :name, BANKNAME = :bankname WHERE OWNERID = :id`,
        [owner.ownerType, owner.name, owner.bankName, id]
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

  public async deleteOwner(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    try {
      await connection.execute(
        `DELETE FROM AVINASH_TBL_OWNER WHERE OWNERID = :id`,
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
