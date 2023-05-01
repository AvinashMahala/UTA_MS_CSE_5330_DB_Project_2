CREATE TABLE CustomerType (
  TypeId INT PRIMARY KEY,
  TypeName VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO CustomerType (TypeId, TypeName) VALUES (1, 'BUSINESS');
INSERT INTO CustomerType (TypeId, TypeName) VALUES (2, 'INDIVIDUAL');

CREATE TABLE CUSTOMER (
  IdNo INT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  Phone CHAR(12) NOT NULL,
  CustomerTypeId INT NOT NULL,
  FOREIGN KEY (CustomerTypeId) REFERENCES CustomerType(TypeId)
);


CREATE SEQUENCE customer_id_seq
  START WITH 1001
  INCREMENT BY 1;


CREATE OR REPLACE TRIGGER customer_id_trigger
  BEFORE INSERT ON CUSTOMER
  FOR EACH ROW
BEGIN
  SELECT customer_id_seq.NEXTVAL
  INTO :new.IdNo
  FROM dual;
END;
/

    select * from customer;

INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('John Doe', '555-123-4567', 1);
INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('Jane Smith', '555-234-5678', 2);
INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('Alice Johnson', '555-345-6789', 1);
INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('Bob Brown', '555-456-7890', 2);
INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('Charlie Green', '555-567-8901', 1);
INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('David Black', '555-678-9012', 2);
INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('Eva White', '555-789-0123', 1);
INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('Frank Gray', '555-890-1234', 2);
INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('Grace Blue', '555-901-2345', 1);
INSERT INTO CUSTOMER (Name, Phone, CustomerTypeId) VALUES ('Henry Red', '555-012-3456', 2);

--To create a view that displays the Customer Id, Customer Name, Phone, and Customer Type, you can use the following SQL statement:
CREATE VIEW CustomerDetails AS
SELECT c.IdNo AS "CustomerId", c.Name AS "CustomerName", c.Phone AS "Phone", ct.TypeName AS "CustomerType"
FROM CUSTOMER c
JOIN CustomerType ct ON c.CustomerTypeId = ct.TypeId;

--This view, named CustomerDetails, will join the CUSTOMER table with the CUSTOMER_TYPE table and display the desired columns with appropriate column names. You can then query the view to display the information:
SELECT * FROM CustomerDetails;


------------------OWNER-----------
--1. Create the OWNER table with a check constraint for the OwnerType column:
CREATE TABLE OWNER (
    OwnerId INT PRIMARY KEY,
    OwnerType VARCHAR(10) NOT NULL CHECK (OwnerType IN ('COMPANY', 'BANK', 'INDIVIDUAL')),
    OwnerDetails VARCHAR(255)
);
--2. Create a sequence for the OwnerId:
CREATE SEQUENCE OWNERID_SEQ START WITH 3001 INCREMENT BY 1;

--3. Create a trigger to automatically insert the sequence value into the OwnerId column:
CREATE OR REPLACE TRIGGER owner_ownerid_autoincrement
BEFORE INSERT ON OWNER
FOR EACH ROW
BEGIN
  SELECT OWNERID_SEQ.NEXTVAL
  INTO :NEW.OwnerId
  FROM DUAL;
END;

---Sample DATA
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('COMPANY', 'ABC Corporation');
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('BANK', 'Bank of Oracle');
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('INDIVIDUAL', 'John Smith');
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('COMPANY', 'XYZ Ltd.');
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('BANK', 'First Bank of SQL');
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('INDIVIDUAL', 'Jane Doe');
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('COMPANY', 'Global Enterprises');
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('BANK', 'Database Bank');
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('INDIVIDUAL', 'Alice Johnson');
INSERT INTO OWNER (OwnerType, OwnerDetails) VALUES ('COMPANY', 'Data Solutions Inc.');


Select * from Owner;


--Create a View That will retrieve the OwnerID, OwnerType, OwnerDetails
CREATE VIEW Owner_Info AS
SELECT 
    OwnerId,
    OwnerType,
    OwnerDetails
FROM
    OWNER;


SELECT * FROM Owner_Info;






-------------------------------CAR TABLE--------------------

--1. Create the sequence for the VehicleId:
CREATE SEQUENCE car_vehicleid_seq START WITH 4001;

--2. Create the CAR_TYPE and LUXURY_TYPE as Varchar2:
CREATE TABLE CAR(
    VehicleId INT Primary Key,
    Model VARCHAR2(50) NOT NULL,
    Year INT NOT NULL,
    CarType VARCHAR2(10) CHECK (CarType IN ('COMPACT', 'MEDIUM', 'LARGE', 'SUV', 'TRUCK', 'VAN')),
    Luxury VARCHAR2(10) CHECK (Luxury IN ('REGULAR', 'LUXURY')),
    DaiyRate DECIMAL(10,2) NOT NULL,
    WeeklyRate DECIMAL(10,2) NOT NULL,
    OwnerId INT,
    FOREIGN KEY (OwnerId) REFERENCES OWNER(OwnerId)
);
--3. Create a trigger to automatically insert the VehicleId using the sequence:

CREATE OR REPLACE TRIGGER car_vehicleid_auto_increment
BEFORE INSERT ON CAR
FOR EACH ROW
BEGIN
  SELECT car_vehicleid_seq.NEXTVAL
  INTO :new.VehicleId
  FROM dual;
END;

--4. Sample Data
INSERT INTO CAR (Model, Year, CarType, Luxury, DaiyRate, WeeklyRate, OwnerId) VALUES ('Toyota Corolla', 2020, 'COMPACT', 'REGULAR', 40, 250, 3001);
INSERT INTO CAR (Model, Year, CarType, Luxury, DaiyRate, WeeklyRate, OwnerId) VALUES ('Honda Civic', 2019, 'MEDIUM', 'REGULAR', 50, 300, 3002);
INSERT INTO CAR (Model, Year, CarType, Luxury, DaiyRate, WeeklyRate, OwnerId) VALUES ('Ford F-150', 2018, 'TRUCK', 'LUXURY', 80, 500, 3003);
INSERT INTO CAR (Model, Year, CarType, Luxury, DaiyRate, WeeklyRate, OwnerId) VALUES ('Chevrolet Tahoe', 2021, 'SUV', 'LUXURY', 90, 600, 3001);

--5. Select All Rows
Select * from CAR;

--To create a view that retrieves the specified columns from the CAR and OWNER tables, you can use the following SQL statement:
CREATE VIEW Car_Owner_Info AS
SELECT 
    c.VehicleId,
    c.Model,
    c.Year,
    c.CarType,
    c.Luxury,
    c.DaiyRate,
    c.WeeklyRate,
    o.OwnerId,
    o.OwnerType,
    o.OwnerDetails
FROM
    CAR c
JOIN
    OWNER o
ON
    c.OwnerId = o.OwnerId;

SELECT * FROM Car_Owner_Info;



-----------------------------RENTAL TABLE----------------
--1. First, create the RENTAL table in Oracle SQL.
CREATE TABLE RENTAL (
    RentalId INT PRIMARY KEY,
    RentalType VARCHAR2(10) NOT NULL CHECK (RentalType IN ('DAILY', 'WEEKLY')),
    Car_Vehicle_Id INT NOT NULL,
    Customer_IdNo INT NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    NoOfDaysOrWeeks INT NOT NULL,
    AmountDue DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (Car_Vehicle_Id) REFERENCES CAR(VehicleId),
    FOREIGN KEY (Customer_IdNo) REFERENCES CUSTOMER(IdNo)
);

--2. create a sequence for the RentalId starting from 5001.
CREATE SEQUENCE rental_id_seq
    START WITH 5001
    INCREMENT BY 1
    CACHE 20;

--3. create a trigger to auto-increment the RentalId.
CREATE OR REPLACE TRIGGER rental_id_auto_increment
BEFORE INSERT ON RENTAL
FOR EACH ROW
BEGIN
    SELECT rental_id_seq.NEXTVAL
    INTO :new.RentalId
    FROM dual;
END;

--4. Insert sample data into the RENTAL table.
INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('DAILY', 4005, 1001, TO_DATE('2022-08-01', 'YYYY-MM-DD'), TO_DATE('2022-08-05', 'YYYY-MM-DD'), 4, 280.00);

INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('WEEKLY', 4006, 1002, TO_DATE('2022-08-10', 'YYYY-MM-DD'), TO_DATE('2022-08-24', 'YYYY-MM-DD'), 2, 800.00);

INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('DAILY', 4007, 1005, TO_DATE('2022-09-12', 'YYYY-MM-DD'), TO_DATE('2022-09-15', 'YYYY-MM-DD'), 3, 450.00);

INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('WEEKLY', 4008, 1002, TO_DATE('2022-09-16', 'YYYY-MM-DD'), TO_DATE('2022-09-30', 'YYYY-MM-DD'), 2, 700.00);

INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('DAILY', 4005, 1004, TO_DATE('2022-10-01', 'YYYY-MM-DD'), TO_DATE('2022-10-03', 'YYYY-MM-DD'), 2, 300.00);

INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('WEEKLY', 4005, 1003, TO_DATE('2022-10-15', 'YYYY-MM-DD'), TO_DATE('2022-10-29', 'YYYY-MM-DD'), 2, 850.00);

INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('DAILY', 4006, 1003, TO_DATE('2022-11-05', 'YYYY-MM-DD'), TO_DATE('2022-11-08', 'YYYY-MM-DD'), 3, 390.00);

INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('WEEKLY', 4007, 1003, TO_DATE('2022-11-10', 'YYYY-MM-DD'), TO_DATE('2022-11-24', 'YYYY-MM-DD'), 2, 950.00);

INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('DAILY', 4008, 1009, TO_DATE('2022-12-01', 'YYYY-MM-DD'), TO_DATE('2022-12-04', 'YYYY-MM-DD'), 3, 420.00);

INSERT INTO RENTAL (RentalType, Car_Vehicle_Id, Customer_IdNo, StartDate, EndDate, NoOfDaysOrWeeks, AmountDue)
VALUES ('WEEKLY', 4008, 1010, TO_DATE('2022-12-15', 'YYYY-MM-DD'), TO_DATE('2022-12-29', 'YYYY-MM-DD'), 2, 800.00);

--5. Create View To display all the columns of rental table, car table and customer table
CREATE VIEW RENTAL_CAR_CUSTOMER_TYPE_VIEW AS
SELECT r.*, c.*, cu.*, ct.TypeName
FROM RENTAL r
JOIN CAR c ON r.Car_Vehicle_Id = c.VehicleId
JOIN CUSTOMER cu ON r.Customer_IdNo = cu.IdNo
JOIN CustomerType ct ON cu.CustomerTypeId = ct.TypeId;

--6 Select * From the View
Select * from RENTAL_CAR_CUSTOMER_TYPE_VIEW;




-----------AVAILABILITY TABLE--------
CREATE TABLE Availability(
    AvailabilityId INT Primary Key,
    Car_VehicleId INT Not Null,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Foreign Key (Car_VehicleId) References Car(VehicleId)
);

CREATE SEQUENCE availability_seq
    START WITH 6001
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE OR REPLACE TRIGGER tr_availability_id
BEFORE INSERT ON Availability
FOR EACH ROW
BEGIN
    SELECT availability_seq.NEXTVAL INTO :NEW.AvailabilityId FROM DUAL;
END;
/



INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4005, TO_DATE('2022-05-01', 'YYYY-MM-DD'), TO_DATE('2022-05-07', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4005, TO_DATE('2023-05-01', 'YYYY-MM-DD'), TO_DATE('2023-05-08', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4006, TO_DATE('2023-05-03', 'YYYY-MM-DD'), TO_DATE('2023-05-10', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4006, TO_DATE('2023-05-05', 'YYYY-MM-DD'), TO_DATE('2023-05-12', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4006, TO_DATE('2023-05-07', 'YYYY-MM-DD'), TO_DATE('2023-05-14', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4005, TO_DATE('2023-05-09', 'YYYY-MM-DD'), TO_DATE('2023-05-16', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4006, TO_DATE('2023-05-11', 'YYYY-MM-DD'), TO_DATE('2023-05-18', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4007, TO_DATE('2023-05-13', 'YYYY-MM-DD'), TO_DATE('2023-05-20', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4007, TO_DATE('2023-05-15', 'YYYY-MM-DD'), TO_DATE('2023-05-22', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4007, TO_DATE('2023-05-17', 'YYYY-MM-DD'), TO_DATE('2023-05-24', 'YYYY-MM-DD'));

INSERT INTO Availability (Car_VehicleId, StartDate, EndDate)
VALUES (4008, TO_DATE('2023-05-19', 'YYYY-MM-DD'), TO_DATE('2023-05-26', 'YYYY-MM-DD'));




CREATE VIEW AvailabilityView AS
SELECT Availability.AvailabilityId, Availability.Car_VehicleId, Availability.StartDate, Availability.EndDate, Car.VehicleId, Car.Model, Car.Year, Car.CarType, Car.Luxury, Car.DaiyRate, Car.WeeklyRate, Car.OwnerId, Owner.OwnerType, Owner.OwnerDetails
FROM Availability
JOIN Car ON Availability.Car_VehicleId = Car.VehicleId
JOIN Owner ON Car.OwnerId = Owner.OwnerId;



Select * from AvailabilityView;

desc CustomerDetails
------All Views
SELECT * FROM CustomerDetails;
SELECT * FROM Owner_Info;
SELECT * FROM Car_Owner_Info;
Select * from RENTAL_CAR_CUSTOMER_TYPE_VIEW;
Select * from AvailabilityView;


















































