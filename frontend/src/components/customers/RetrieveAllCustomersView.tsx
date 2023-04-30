import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Customer as CustomerModel } from "../../models/Customer";
import * as CustomerApi from "../../network/customer_api";
//import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { darken } from "@mui/material";

const RetrieveAllCustomersView = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [showCustomersLoadingError, setShowCustomersLoadingError] =
    useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setShowCustomersLoadingError(false);
        setCustomersLoading(true);
        const customers = await CustomerApi.fetchCustomers();
        setCustomers(customers);
      } catch (error) {
        console.error(error);
        setShowCustomersLoadingError(true);
      } finally {
        setCustomersLoading(false);
      }
    }
    loadCustomers().then(()=>{
        console.log("loadCustomers().then");
        console.log(customers);
    });
  }, []);

  //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
  const columns = useMemo<MRT_ColumnDef<CustomerModel>[]>(
    () => [
      {
        accessorKey: "idNo", //simple recommended way to define a column
        header: "ID No",
        muiTableHeadCellProps: {
             sx: { color: "green" } ,
             align: "left",
            }, //custom props
      },
      {
        accessorFn: (originalRow) => originalRow.name, //alternate way
        id: "Name", //id required if you use accessorFn instead of accessorKey
        header: "Name",
        Header: <i style={{ color: "red" }}>Name</i>, //optional custom markup
        Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>, //optional custom cell renderer
        muiTableHeadCellProps: {
            sx: { color: "green" } ,
            align: "left",
           }, //custom props
      },
      {
        accessorFn: (originalRow) => originalRow.phone, //alternate way
        id: "Phone Number", //id required if you use accessorFn instead of accessorKey
        header: "Phone",
        Header: <i style={{ color: "red" }}>Phone</i>, //optional custom markup
        muiTableHeadCellProps: {
            sx: { color: "green" } ,
            align: "left",
           }, //custom props
      },
    ],
    []
  );

  return (
    
    <>
    <MaterialReactTable
      columns={columns}
      data={customers}
      muiTablePaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '0',
          border: '1px dashed #e0e0e0',
        },
      }}
      muiTableBodyProps={{
        sx: (theme) => ({
          '& tr:nth-of-type(odd)': {
            backgroundColor: darken(theme.palette.background.default, 0.1),
          },
        }),
      }}
    />
    </>
  );
};

export default RetrieveAllCustomersView;
