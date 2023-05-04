import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Rental as RentalModel, RentalView } from "../../models/Rental";
import * as RentalApi from "../../network/rentals_api";
import { darken } from "@mui/material";
import * as CarsApi from "../../network/cars_api";
import * as CustomerApi from "../../network/customer_api";


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
import { formatAmountDue, formatDate, formatNoOfDaysOrWeeks, formatRentalType } from "../../utils/formatDate";
import { Car } from "../../models/Car";
import { Owner } from "../../models/Owner";
import { Customer } from "../../models/Customer";

export type rental = {
    rentalId: number;
    rentalType: string;
    noOfDays: number | null;
    noOfWeeks: number | null;
    startDate: Date;
    returnDate: Date;
    amountDue: number;
    vehicleId: number;
    customerId: number;
};

let customersList:Customer[]=[];
let carsList:Car[]=[];

const RetrieveAllRentalsView = () => {

  type RentalInput = {
    rentalId: number,
    rentalType: string,
    noOfDays: number | null,
    noOfWeeks: number | null,
    startDate: Date,
    returnDate: Date,
    amountDue: number,
    carId: number,
    customerId: number,
  };

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<RentalView[]>(() => []);
    const [validationErrors, setValidationErrors] = useState<{
      [cellId: string]: string;
    }>({});
  
    const handleCreateNewRow = (values: RentalView) => {
      tableData.push(values);
      setTableData([...tableData]);

      const insertRental: RentalInput = {
        rentalId: 0,
        rentalType: values.rentalType,
        noOfDays: values.noOfDays,
        noOfWeeks:  values.noOfWeeks,
        startDate: values.startDate,
        returnDate: values.returnDate,
        amountDue: values.amountDue,
        carId: values.vehicleId,
        customerId: values.customerId,
      };

      // Send the API request to update the Rental
      RentalApi.createRental(insertRental).then(() => {
        console.log("Rental added!");
      });

    };
    
    const handleSaveRowEdits: MaterialReactTableProps<RentalView>['onEditingRowSave'] =
      async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
          tableData[row.index] = values;

          
          //send/receive api updates here, then refetch or update local table data for re-render
          const updatedRental: RentalInput = {
            rentalId: parseInt(values.rentalId),
            rentalType: values.rentalType,
            noOfDays: values.noOfDays,
            noOfWeeks:  values.noOfWeeks,
            startDate: values.startDate,
            returnDate: values.returnDate,
            amountDue: values.amountDue,
            carId: values.carId,
            customerId: values.customerId,
          };
    
          // Send the API request to update the Rental
          await RentalApi.updateRental(updatedRental.rentalId, updatedRental);

          setTableData([...tableData]);
          exitEditingMode(); //required to exit editing mode and close modal
        }
      };
  
    const handleCancelRowEdits = () => {
      setValidationErrors({});
    };
  
    const handleDeleteRow = useCallback(
      (row: MRT_Row<RentalView>) => {
        if (
          !window.confirm(`Are you sure you want to delete ${row.getValue('rentalType')}`)
        ) {
          return;
        }
        //send api delete request here, then refetch or update local table data for re-render

        RentalApi.deleteRental(row.getValue('rentalId')).then(() => {
          console.log("Rental Deleted!");
        });


        tableData.splice(row.index, 1);
        setTableData([...tableData]);
      },
      [tableData],
    );
  
    const getCommonEditTextFieldProps = useCallback(
      (
        cell: MRT_Cell<RentalView>,
      ): MRT_ColumnDef<RentalView>['muiTableBodyCellEditTextFieldProps'] => {
        if(cell.column.id === 'vehicleId'){
          return {
            select: true,
            label: 'Car Type',
            children: carsList.map((option) => (
              <MenuItem key={option.car_vehicleId} value={option.car_vehicleId}>
                {option.car_model}
              </MenuItem>
            )),
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
          }
          }
        }
        else if(cell.column.id === 'customerId'){
          return {
            select: true,
            label: 'Customer Name',
            children: customersList.map((option) => (
              <MenuItem key={option.idNo} value={option.idNo}>
                {option.name}
              </MenuItem>
            )),
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
          }
          }
        }
        else if(cell.column.id === 'model' || cell.column.id === 'customerName'){
          return {
            style: { display: 'none' },
          }
        }
        else if(cell.column.id === 'startDate'){
          return {
            type: 'date',
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
          }
          }
        }
        else if(cell.column.id === 'returnDate'){
          return {
            type: 'date',
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
          }
          }
        }
        else{
        
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
          }
        };
      }
      },
      [validationErrors],
    );
  
    const columns = useMemo<MRT_ColumnDef<RentalView>[]>(
      () => [
        {
          accessorKey: 'rentalId',
          header: 'Rental ID',
          enableColumnOrdering: false,
          enableEditing: false, //disable editing on this column
          enableSorting: false,
          enableHiding: false,
          size: 0,
          editable: "never"
        },
        {
          accessorKey: 'rentalType',
          header: 'Rental Type',
          size: 10,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
          //customize normal cell render on normal non-aggregated rows
          Cell: ({ cell }) => <>{formatRentalType(cell.getValue<string>())}</>,
        },
        {
          accessorKey: 'vehicleId',
          header: 'Car ID',
          size: 16,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
          
        },
        {
          accessorKey: 'model',
          header: 'Vehicle Model',
          size: 16,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
          
        },
        {
          accessorKey: 'customerId',
          header: 'Customer ID',
          size: 16,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
        },
        {
          accessorKey: 'customerName',
          header: 'Customer Name',
          size: 16,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
        },
        {
          accessorKey: 'startDate',
          header: 'Start Date',
          size: 16,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
          //customize normal cell render on normal non-aggregated rows
          Cell: ({ cell }) => <>{formatDate(cell.getValue<string>())}</>,
        },
        {
          accessorKey: 'returnDate',
          header: 'Return Date',
          size: 16,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
          //customize normal cell render on normal non-aggregated rows
          Cell: ({ cell }) => <>{formatDate(cell.getValue<string>())}</>,
        },
        {
          accessorKey: 'noOfDays',
          header: 'No. of Days',
          size: 5,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
          //customize normal cell render on normal non-aggregated rows
          Cell: ({ cell }) => <>{formatNoOfDaysOrWeeks(cell.getValue<string>())}</>,
        },
        {
            accessorKey: 'noOfWeeks',
            header: 'No. of Weeks',
            size: 5,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              ...getCommonEditTextFieldProps(cell),
            }),
            //customize normal cell render on normal non-aggregated rows
            Cell: ({ cell }) => <>{formatNoOfDaysOrWeeks(cell.getValue<string>())}</>,
          },
        {
            accessorKey: 'amountDue',
            header: 'Amount Due',
            size: 16,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              ...getCommonEditTextFieldProps(cell),
            }),
            //customize normal cell render on normal non-aggregated rows
            Cell: ({ cell }) => <>{formatAmountDue(cell.getValue<string>())}</>,
          },
      ],
      [getCommonEditTextFieldProps],
    );

    
    useEffect(() => {
      RentalApi.fetchRental().then((rentals) => {
        //tableData=rentals;
        setTableData(rentals);
        console.log(rentals);
      });
      CarsApi.fetchCar().then((cars) => {
        //tableData=cars;
        carsList=cars;
        console.log(cars);
      });
      CustomerApi.fetchCustomers().then((customers) => {
        //tableData=customers;
        customersList=customers;
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
              size: 90,
            },
          }}
          columns={columns}
          data={tableData}
          
          editingMode="modal" //default
          enableColumnOrdering
          initialState={{ columnVisibility: { rentalId: false, vehicleId: false, customerId: false } }} //hide firstName column by default
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
              Create New Rental
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
    columns: MRT_ColumnDef<RentalView>[];
    onClose: () => void;
    onSubmit: (values: RentalView) => void;
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
        <DialogTitle textAlign="center">Create New Rental</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.filter(column=>column.accessorKey !=="rentalId").map((column) => (
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
            Create New Rental
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  
  export default RetrieveAllRentalsView;