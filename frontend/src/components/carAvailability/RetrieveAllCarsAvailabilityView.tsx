import React, { useEffect, useState, useMemo, useCallback } from "react";
import { CarAvailability as CarAvailabilityModel } from "../../models/CarAvailability";
import * as CarAvailabilityApi from "../../network/caravailability_api";
import { darken } from "@mui/material";
import * as CarsApi from "../../network/cars_api";


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
import { formatDate } from "../../utils/formatDate";
import { Car } from "../../models/Car";

export type CarAvailability = {
    availabilityId: number;
    carId: number;
    startDate: Date;
    endDate: Date;
    carModel: string;
};

let carAvailabilityList: CarAvailability[] = [];
let carArray: Car[] = [];

const RetrieveAllCarsAvailabilityView = () => {

  type CarAvailabilityInput = {
    availabilityId: number,
    carId: number,
    startDate: Date,
    endDate: Date,
    carModel: string,
  };

    const [carList, setCarList] = useState<Car[]>(() => []);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<CarAvailability[]>(() => []);
    const [validationErrors, setValidationErrors] = useState<{
      [cellId: string]: string;
    }>({});
  
    const handleCreateNewRow = (values: CarAvailability) => {
      tableData.push(values);
      setTableData([...tableData]);

      const insertCarAvailability: CarAvailabilityInput = {
        availabilityId: 0,
        carId: values.carId,
        startDate:  values.startDate,
        endDate: values.endDate,
        carModel: values.carModel,
      };

      // Send the API request to update the Car Availability
      CarAvailabilityApi.createCarAvailability(insertCarAvailability).then(() => {
        console.log("Car Availability added!");
      });

    };
    
    const handleSaveRowEdits: MaterialReactTableProps<CarAvailability>['onEditingRowSave'] =
      async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
          tableData[row.index] = values;

          
          //send/receive api updates here, then refetch or update local table data for re-render
          const updatedCarAvailability: CarAvailabilityInput = {
            availabilityId: parseInt(values.availabilityId),
            carId: values.carId,
            startDate: values.startDate,
            endDate: values.endDate,
            carModel: values.carModel,
          };
    
          // Send the API request to update the Car Availability
          await CarAvailabilityApi.updateCarAvailability(updatedCarAvailability.availabilityId, updatedCarAvailability);

          setTableData([...tableData]);
          exitEditingMode(); //required to exit editing mode and close modal
        }
      };
  
    const handleCancelRowEdits = () => {
      setValidationErrors({});
    };
  
    const handleDeleteRow = useCallback(
      (row: MRT_Row<CarAvailability>) => {
        if (
          !window.confirm(`Are you sure you want to delete ${row.getValue('availabilityId')}`)
        ) {
          return;
        }
        //send api delete request here, then refetch or update local table data for re-render

        CarAvailabilityApi.deletecarAvailability(row.getValue('availabilityId')).then(() => {
          console.log("Car Availability Deleted!");
        });


        tableData.splice(row.index, 1);
        setTableData([...tableData]);
      },
      [tableData],
    );
  
    const getCommonEditTextFieldProps = useCallback(
      (
        cell: MRT_Cell<CarAvailability>,
      ): MRT_ColumnDef<CarAvailability>['muiTableBodyCellEditTextFieldProps'] => {
        
        if(cell.column.id === 'carId'){
          return {
            select: true,
            label: 'Car Model Name',
            children: carArray.map((option) => (
              <MenuItem key={option.car_typeId} value={option.car_typeId}>
                {option.car_model}
              </MenuItem>
            )),
            value: cell.getValue<string>(),
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
            },
          };
        }
        
        
        
        
      },
      [validationErrors],
    );
  
    const columns = useMemo<MRT_ColumnDef<CarAvailability>[]>(
      () => [
        {
          accessorKey: 'availabilityId',
          header: 'availabilityId',
          enableColumnOrdering: false,
          enableEditing: false, //disable editing on this column
          enableSorting: false,
          enableHiding: false,
          size: 10,
          editable: "never"
          
        },
        {
          accessorKey: 'carId',
          header: 'Car Model Name',
          size: 5,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
          //customize normal cell render on normal non-aggregated rows
          Cell: ({ cell }) => <>{carAvailabilityList.filter(a=>a.carId===parseInt(cell.getValue<string>())).map(a => ({ ...a }))[0].carModel}</>,
        },
        {
          accessorKey: 'startDate',
          header: 'startDate',
          size: 20,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
          //customize normal cell render on normal non-aggregated rows
          Cell: ({ cell }) => <>{formatDate(cell.getValue<string>())}</>,
          
        },
        {
            accessorKey: 'endDate',
            header: 'endDate',
            size: 20,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              ...getCommonEditTextFieldProps(cell),
            }),
            //customize normal cell render on normal non-aggregated rows
          Cell: ({ cell }) => <>{formatDate(cell.getValue<string>())}</>,
          },
      ],
      [getCommonEditTextFieldProps],
    );

    
    useEffect(() => {
      CarAvailabilityApi.fetchCarAvailability().then((carAvailabilities) => {
        //tableData=carAvailabilities;
        setTableData(carAvailabilities);
        carAvailabilityList = carAvailabilities;
        console.log(carAvailabilities);
      });
      CarsApi.fetchCar().then((cars) => {
        //tableData=cars;
        setCarList(cars);
        carArray = cars;
        console.log(cars);
      });
    }, []);
  
    return (
      <>
        <MaterialReactTable
          displayColumnDefOptions={{
            // 'mrt-row-actions': {
            //   muiTableHeadCellProps: {
            //     align: 'center',
            //   },
            //   size: 120,
            // },
          }}
          columns={columns}
          data={tableData}
          
          //editingMode="modal" //default
          enableColumnOrdering
          initialState={{ columnVisibility: { availabilityId: false } }} //hide firstName column by default
          //enableEditing
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          // renderRowActions={({ row, table }) => (
          //   <Box sx={{ display: 'flex', gap: '1rem' }}>
          //     <Tooltip arrow placement="left" title="Edit">
          //       <IconButton onClick={() => table.setEditingRow(row)}>
          //         <Edit />
          //       </IconButton>
          //     </Tooltip>
          //     <Tooltip arrow placement="right" title="Delete">
          //       <IconButton color="error" onClick={() => handleDeleteRow(row)}>
          //         <Delete />
          //       </IconButton>
          //     </Tooltip>
          //   </Box>
          // )}
          // renderTopToolbarCustomActions={() => (
          //   <Button
          //     color="secondary"
          //     onClick={() => setCreateModalOpen(true)}
          //     variant="contained"
          //   >
          //     Create New Car Availability
          //   </Button>
          // )}
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
    columns: MRT_ColumnDef<CarAvailability>[];
    onClose: () => void;
    onSubmit: (values: CarAvailability) => void;
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
        <DialogTitle textAlign="center">Create New Car Availability</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.filter(column=>column.accessorKey !=="availabilityId").map((column) => (
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
            Create New Car Availability
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  
  export default RetrieveAllCarsAvailabilityView;