import { Owner } from '../models/Owner';
import { Pool, Connection } from 'oracledb';
import { Application } from 'express';

export class OwnerService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllOwners(): Promise<Owner[][] | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Owner[]>(`SELECT * FROM AVINASH_TBL_OWNER`);
    connection.close();
    return result.rows;
  }

  public async getOwnerById(id: number): Promise<Owner | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Owner>(`SELECT * FROM AVINASH_TBL_OWNER WHERE OWNERID = :id`, [id]);
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async createOwner(owner: Owner): Promise<Owner | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Owner>(
      `INSERT INTO AVINASH_TBL_OWNER (OWNERID, OWNERTYPE, NAME, BANKNAME) VALUES (:ownerid, :ownertype, :name, :bankname)`,
      [owner.ownerId, owner.ownerType, owner.name, owner.bankName]
    );
    connection.commit();
    connection.close();

    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async updateOwner(id: number, owner: Owner): Promise<Owner | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Owner>(
      `UPDATE AVINASH_TBL_OWNER SET OWNERTYPE = :ownertype, NAME = :name, BANKNAME = :bankname WHERE OWNERID = :id`,
      [owner.ownerType, owner.name, owner.bankName, id]
    );
    connection.commit();
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async deleteOwner(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    await connection.execute(`DELETE FROM AVINASH_TBL_OWNER WHERE OWNERID = :id`, [id]);
    connection.commit();
    connection.close();
  }
}
