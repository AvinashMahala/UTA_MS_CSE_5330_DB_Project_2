import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Car as CarModel } from "../../models/Car";
import * as CarsApi from "../../network/cars_api";
import { darken } from "@mui/material";
import * as OwnerApi from "../../network/owner_api";
import * as CarTypeApi from "../../network/cartypes_api";
import { Select } from "@mui/material";


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
import { Owner } from "../owner/RetrieveAllOwnersView";
import { CarType } from "../carType/RetrieveAllCarTypes";

export type Car = {
  car_vehicleId: number;
  car_model?: string;
  car_year?: number;
  car_typeId?: number;
  car_typeName?: string;
  car_ownerId?: number;
  car_ownerName?: string;
};




let carOwnersList:Owner[]=[];
let carTypesList:CarType[]=[];

const RetrieveAllCarsView = () => {

  type CarInput = {
    car_vehicleId: number;
    car_model?: string;
    car_year?: number;
    car_typeId?: number;
    car_ownerId?: number;
  };

  const [carOwnersData, setCarOwnersData] = useState<Owner[]>(() => []);
  const [carTypesData, setCarTypesData] = useState<CarType[]>(() => []);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<Car[]>(() => []);
    const [validationErrors, setValidationErrors] = useState<{
      [cellId: string]: string;
    }>({});

    
  
    const handleCreateNewRow = (values: Car) => {
      tableData.push(values);
      setTableData([...tableData]);

      const insertCar: CarInput = {
        car_vehicleId: 0,
        car_model: values.car_model,
        car_year: values.car_year,
        car_typeId: values.car_typeId,
        car_ownerId: values.car_ownerId,
      };

      // Send the API request to update the Owner
      CarsApi.createCar(insertCar).then(() => {
        console.log("Car added!");
      });

    };
    
    const handleSaveRowEdits: MaterialReactTableProps<Car>['onEditingRowSave'] =
      async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
          tableData[row.index] = values;

          
          //send/receive api updates here, then refetch or update local table data for re-render
          const updatedCar: CarInput = {
            
            car_vehicleId: parseInt(values.car_vehicleId),
            car_model: values.car_model,
            car_year: values.car_year,
            car_typeId: values.car_typeId,
            car_ownerId: values.car_ownerId,
          };
    
          // Send the API request to update the Owner
          await CarsApi.updateCar(updatedCar.car_vehicleId, updatedCar);

          setTableData([...tableData]);
          exitEditingMode(); //required to exit editing mode and close modal
        }
      };
  
    const handleCancelRowEdits = () => {
      setValidationErrors({});
    };
  
    const handleDeleteRow = useCallback(
      (row: MRT_Row<Car>) => {
        if (
          !window.confirm(`Are you sure you want to delete ${row.getValue('car_model')}`)
        ) {
          return;
        }
        //send api delete request here, then refetch or update local table data for re-render

        CarsApi.deleteCar(row.getValue('car_vehicleId')).then(() => {
          console.log("Car Deleted!");
        });


        tableData.splice(row.index, 1);
        setTableData([...tableData]);
      },
      [tableData],
    );
  
    const getCommonEditTextFieldProps = useCallback(
      (
        cell: MRT_Cell<Car>,
      ): MRT_ColumnDef<Car>['muiTableBodyCellEditTextFieldProps'] => {
        
      if(cell.column.id === 'car_typeId'){
        return {
          select: true,
          label: 'Car Type',
          children: carTypesData.map((option) => (
            <MenuItem key={option.typeId} value={option.typeId}>
              {option.typeName}
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
      else if(cell.column.id === 'car_ownerId'){
        return {
          select: true,
          label: 'Car Owner',
          children: carOwnersData.map((option) => (
            <MenuItem key={option.ownerId} value={option.ownerId}>
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
      else if(cell.column.id === 'car_typeName' || cell.column.id === 'car_ownerName'){
        return {
          style: { display: 'none' },
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
  
    const columns = useMemo<MRT_ColumnDef<Car>[]>(
      () => [
        {
          accessorKey: 'car_vehicleId',
          header: 'Vehicle ID',
          enableColumnOrdering: false,
          enableEditing: false, //disable editing on this column
          enableSorting: false,
          enableHiding: false,
          size: 10,
          editable: "never"
          
        },
        {
          accessorKey: 'car_model',
          header: 'Car Model',
          size: 5,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
        },
        {
          accessorKey: 'car_year',
          header: 'Year',
          size: 20,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
        },
        {
            accessorKey: 'car_typeName',
            header: 'Car Type Name',
            size: 20,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              ...getCommonEditTextFieldProps(cell),
            }),
          },
        {
            accessorKey: 'car_ownerName',
            header: 'Car Owner Name',
            size: 20,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              ...getCommonEditTextFieldProps(cell),
            }),
          },
          {
            accessorKey: 'car_typeId',
            header: 'car_typeId',
            size: 20,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              ...getCommonEditTextFieldProps(cell),
            }),
          },
          {
            accessorKey: 'car_ownerId',
            header: 'car_ownerId',
            size: 20,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              ...getCommonEditTextFieldProps(cell),
            }),
          },
      ],
      [getCommonEditTextFieldProps],
    );

    
    useEffect(() => {
      CarsApi.fetchCar().then((cars) => {
        //tableData=cars;
        setTableData(cars);
        console.log(cars);
      });
      OwnerApi.fetchOwner().then((owners) => {
        setCarOwnersData(owners);
        carOwnersList=owners;
        console.log(owners);
      });

      CarTypeApi.fetchCarTypes().then((carTypes) => {
        setCarTypesData(carTypes);
        carTypesList=carTypes;
        console.log(carTypes);
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
          initialState={{ columnVisibility: { car_vehicleId: false,car_typeId:false,car_ownerId:false } }} //hide firstName column by default
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
              Create New Vehicle
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
    columns: MRT_ColumnDef<Car>[];
    onClose: () => void;
    onSubmit: (values: Car) => void;
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

    const [selectedCarType, setSelectedCarType] = useState('');
    const [selectedCarOwner, setSelectedCarOwner] = useState('');
  
    const handleSubmit = () => {
      //put your validation logic here
      onSubmit(values);
      onClose();
    };
  
    return (
      <Dialog open={open}>
        <DialogTitle textAlign="center">Create New Car</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.filter(column=>column.accessorKey !=="car_vehicleId" 
              && column.accessorKey!=="car_typeId" && column.accessorKey!=="car_ownerId"
              && column.accessorKey!=="car_typeName" && column.accessorKey!=="car_ownerName"
              ).map((column) => (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ))}

             {columns
              .filter((column) => column.accessorKey === "car_typeId")
              .map((column) => (
                <Select
                  label={"Car Type Name"}
                  key={column.accessorKey}
                  name={column.accessorKey}
                  value={selectedCarType}
                  // onChange={(event) => setSelectedOwnerType(event.target.value)}
                  onChange={(event) =>{
                    setValues({ ...values, [event.target.name]: event.target.value });
                    setSelectedCarType(event.target.value);
                  }
                  }
                  displayEmpty
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="" disabled>
                  {column.header}
                  </MenuItem>
                  {carTypesList.map((option) => (
                    <MenuItem
                      key={option.typeId}
                      value={option.typeId}
                    >
                      {option.typeName}
                    </MenuItem>
                  ))}
                </Select>
              ))}

              {columns
              .filter((column) => column.accessorKey === "car_ownerId")
              .map((column) => (
                <Select
                  label={"Car Owner Name"}
                  key={column.accessorKey}
                  name={column.accessorKey}
                  value={selectedCarOwner}
                  // onChange={(event) => setSelectedOwnerType(event.target.value)}
                  onChange={(event) =>{
                    setValues({ ...values, [event.target.name]: event.target.value });
                    setSelectedCarOwner(event.target.value);
                  }
                  }
                  displayEmpty
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="" disabled>
                  {column.header}
                  </MenuItem>
                  {carOwnersList.map((option) => (
                    <MenuItem
                      key={option.ownerId}
                      value={option.ownerId}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              ))} 
             

            </Stack>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="secondary" onClick={handleSubmit} variant="contained">
            Create New Car
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  
  export default RetrieveAllCarsView;