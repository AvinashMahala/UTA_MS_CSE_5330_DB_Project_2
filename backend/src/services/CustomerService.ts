import { Customer } from '../models/Customer';
import { Pool, Connection } from 'oracledb';
import { Application } from 'express';

export class CustomerService {
  private pool: Pool;

  constructor(app: Application) {
    this.pool = app.locals.pool;
  }

  public async getAllCustomers(): Promise<Customer[] | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<any>(`SELECT * FROM AVINASH_TBL_CUSTOMER`);
    connection.close();
    return result.rows?.map((customer) => new Customer(customer[0], customer[1], customer[2]));
  }

  public async getCustomerById(id: number): Promise<Customer | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Customer>(`SELECT * FROM AVINASH_TBL_CUSTOMER WHERE IDNO = :id`, [id]);
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async createCustomer(customer: Customer): Promise<Customer | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Customer>(
      `INSERT INTO AVINASH_TBL_CUSTOMER (IDNO, NAME, PHONE) VALUES (:idno, :name, :phone) RETURNING *`,
      [customer.idNo, customer.name, customer.phone]
    );
    connection.commit();
    connection.close();
    
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async updateCustomer(id: number, customer: Customer): Promise<Customer | undefined> {
    const connection = await this.pool.getConnection();
    const result = await connection.execute<Customer>(
      `UPDATE AVINASH_TBL_CUSTOMER SET NAME = :name, PHONE = :phone WHERE IDNO = :id`,
      [customer.name, customer.phone, id]
    );
    connection.commit();
    connection.close();
    if (result.rows !== undefined) {
        return result.rows[0];
      }
        return undefined;
  }

  public async deleteCustomer(id: number): Promise<void> {
    const connection = await this.pool.getConnection();
    await connection.execute(`DELETE FROM AVINASH_TBL_CUSTOMER WHERE IDNO = :id`, [id]);
    connection.commit();
    connection.close();
  }
}
