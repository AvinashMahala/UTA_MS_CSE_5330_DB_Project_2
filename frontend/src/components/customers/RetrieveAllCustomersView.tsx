import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Customer as CustomerModel } from "../../models/Customer";
import * as CustomerApi from "../../network/customer_api";
import { darken } from "@mui/material";





import MaterialReactTable, {
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

export type Person = {
    idNo: number,
    name: string,
    phone: string,
};


const RetrieveAllCustomersView = () => {

  type CustomerInput = {
    idNo: number;
    name: string;
    phone: string;
  };

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<Person[]>(() => []);
    const [validationErrors, setValidationErrors] = useState<{
      [cellId: string]: string;
    }>({});
  
    const handleCreateNewRow = (values: Person) => {
      tableData.push(values);
      setTableData([...tableData]);

      const insertCustomer: CustomerInput = {
        idNo: 0,
        name: values.name,
        phone: values.phone,
      };

      // Send the API request to update the customer
      CustomerApi.createCustomer(insertCustomer).then(() => {
        console.log("Customer added");
      });

    };
    
    const handleSaveRowEdits: MaterialReactTableProps<Person>['onEditingRowSave'] =
      async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
          tableData[row.index] = values;

          
          //send/receive api updates here, then refetch or update local table data for re-render
          const updatedCustomer: CustomerInput = {
            idNo: parseInt(values.idNo),
            name: values.name,
            phone: values.phone,
          };
    
          // Send the API request to update the customer
          await CustomerApi.updateCustomer(updatedCustomer.idNo, updatedCustomer);

          setTableData([...tableData]);
          exitEditingMode(); //required to exit editing mode and close modal
        }
      };
  
    const handleCancelRowEdits = () => {
      setValidationErrors({});
    };
  
    const handleDeleteRow = useCallback(
      (row: MRT_Row<Person>) => {
        if (
          !window.confirm(`Are you sure you want to delete ${row.getValue('name')}`)
        ) {
          return;
        }
        //send api delete request here, then refetch or update local table data for re-render

        CustomerApi.deleteCustomer(row.getValue('idNo')).then(() => {
          console.log("Customer deleted");
        });


        tableData.splice(row.index, 1);
        setTableData([...tableData]);
      },
      [tableData],
    );
  
    const getCommonEditTextFieldProps = useCallback(
      (
        cell: MRT_Cell<Person>,
      ): MRT_ColumnDef<Person>['muiTableBodyCellEditTextFieldProps'] => {
        return {
          error: !!validationErrors[cell.id],
          helperText: validationErrors[cell.id],
          onChange: (e) => {
            const value = e.target.value;
            if (!value) {
              setValidationErrors((prev) => ({
                ...prev,
                [cell.id]: 'Required',
              }));
            } else {
              setValidationErrors((prev) => {
                const next = { ...prev };
                delete next[cell.id];
                return next;
              });
            }
            //cell.setEditingCellValue(value);
          },
        };
      },
      [validationErrors],
    );
  
    const columns = useMemo<MRT_ColumnDef<Person>[]>(
      () => [
        {
          accessorKey: 'idNo',
          header: 'ID',
          enableColumnOrdering: false,
          enableEditing: false, //disable editing on this column
          enableSorting: false,
          enableHiding: false,
          size: 80,
          editable: "never"
          
        },
        {
          accessorKey: 'name',
          header: 'Name',
          size: 140,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
        },
        {
          accessorKey: 'phone',
          header: 'Phone Number',
          size: 140,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
        },
      ],
      [getCommonEditTextFieldProps],
    );

    
    useEffect(() => {
      CustomerApi.fetchCustomers().then((customers) => {
        //tableData=customers;
        setTableData(customers);
        console.log(customers);
      });
    }, []);
  
    return (
      <>
        <MaterialReactTable
          displayColumnDefOptions={{
            'mrt-row-actions': {
              muiTableHeadCellProps: {
                align: 'center',
              },
              size: 120,
            },
          }}
          columns={columns}
          data={tableData}
          
          editingMode="modal" //default
          enableColumnOrdering
          initialState={{ columnVisibility: { idNo: false } }} //hide firstName column by default
          enableEditing
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <Button
              color="secondary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
            >
              Create New Customer
            </Button>
          )}
        />
        <CreateNewAccountModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />
      </>
    );
  };
  
  interface CreateModalProps {
    columns: MRT_ColumnDef<Person>[];
    onClose: () => void;
    onSubmit: (values: Person) => void;
    open: boolean;
  }
  
  //example of creating a mui dialog modal for creating new rows
  export const CreateNewAccountModal = ({
    open,
    columns,
    onClose,
    onSubmit,
  }: CreateModalProps) => {
    const [values, setValues] = useState<any>(() =>
      columns.reduce((acc, column) => {
        acc[column.accessorKey ?? ''] = '';
        return acc;
      }, {} as any),
    );
  
    const handleSubmit = () => {
      //put your validation logic here
      onSubmit(values);
      onClose();
    };
  
    return (
      <Dialog open={open}>
        <DialogTitle textAlign="center">Create New Customer</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.filter(column=>column.accessorKey !=="idNo").map((column) => (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ))}
            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            Create New Customer
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  const validateRequired = (value: string) => !!value.length;
  const validateEmail = (email: string) =>
    !!email.length &&
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  const validateAge = (age: number) => age >= 18 && age <= 50;
  
  export default RetrieveAllCustomersView;