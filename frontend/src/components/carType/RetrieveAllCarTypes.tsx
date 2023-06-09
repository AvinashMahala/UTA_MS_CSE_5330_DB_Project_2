import React, { useEffect, useState, useMemo, useCallback } from "react";
import { CarType as CarTypeModel } from "../../models/CarType";
import * as CarTypeApi from "../../network/cartypes_api";
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

export type CarType = {
    typeId: number;
    typeName: string;
    dailyRate: number;
    weeklyRate: number;
    luxuryFlag: string;
};


const RetrieveAllCarTypesView = () => {

  type CarTypeInput = {
    typeId: number;
    typeName: string;
    dailyRate: number;
    weeklyRate: number;
    luxuryFlag: string;
  };

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<CarType[]>(() => []);
    const [validationErrors, setValidationErrors] = useState<{
      [cellId: string]: string;
    }>({});
  
    const handleCreateNewRow = (values: CarType) => {
      tableData.push(values);
      setTableData([...tableData]);

      const insertCarType: CarTypeInput = {
        typeId: 0,
        typeName: values.typeName,
        dailyRate: values.dailyRate,
        weeklyRate: values.weeklyRate,
        luxuryFlag: values.luxuryFlag,
      };

      // Send the API request to update the CarType
      CarTypeApi.createCarType(insertCarType).then(() => {
        console.log("Car Type added!");
      });

    };
    
    const handleSaveRowEdits: MaterialReactTableProps<CarType>['onEditingRowSave'] =
      async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
          tableData[row.index] = values;

          
          //send/receive api updates here, then refetch or update local table data for re-render
          const updatedCarType: CarTypeInput = {
            typeId: parseInt(values.typeId),
            typeName: values.typeName,
            dailyRate: values.dailyRate,
            weeklyRate: values.weeklyRate,
            luxuryFlag: values.luxuryFlag,
          };
    
          // Send the API request to update the CarType
          await CarTypeApi.updateCarType(updatedCarType.typeId, updatedCarType);

          setTableData([...tableData]);
          exitEditingMode(); //required to exit editing mode and close modal
        }
      };
  
    const handleCancelRowEdits = () => {
      setValidationErrors({});
    };
  
    const handleDeleteRow = useCallback(
      (row: MRT_Row<CarType>) => {
        if (
          !window.confirm(`Are you sure you want to delete ${row.getValue('typeName')}`)
        ) {
          return;
        }
        //send api delete request here, then refetch or update local table data for re-render

        CarTypeApi.deleteCarType(row.getValue('typeId')).then(() => {
          console.log("Car Type Deleted!");
        });


        tableData.splice(row.index, 1);
        setTableData([...tableData]);
      },
      [tableData],
    );
  
    const getCommonEditTextFieldProps = useCallback(
      (
        cell: MRT_Cell<CarType>,
      ): MRT_ColumnDef<CarType>['muiTableBodyCellEditTextFieldProps'] => {
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
  
    const columns = useMemo<MRT_ColumnDef<CarType>[]>(
      () => [
        {
          accessorKey: 'typeId',
          header: 'ID',
          enableColumnOrdering: false,
          enableEditing: false, //disable editing on this column
          enableSorting: false,
          enableHiding: false,
          size: 10,
          editable: "never"
          
        },
        {
          accessorKey: 'typeName',
          header: 'Type Name',
          size: 50,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
        },
        {
          accessorKey: 'dailyRate',
          header: 'Daily Rate',
          size: 20,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
        },
        {
            accessorKey: 'weeklyRate',
            header: 'Weekly Rate',
            size: 20,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              ...getCommonEditTextFieldProps(cell),
            }),
          },

          {
            accessorKey: 'luxuryFlag',
            header: 'Luxury Flag',
            size: 20,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              ...getCommonEditTextFieldProps(cell),
            }),
          },
      ],
      [getCommonEditTextFieldProps],
    );

    
    useEffect(() => {
      CarTypeApi.fetchCarTypes().then((carTypes) => {
        //tableData=carTypes;
        setTableData(carTypes);
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
          initialState={{ columnVisibility: { typeId: false } }} //hide firstName column by default
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
              Create New CarType
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
    columns: MRT_ColumnDef<CarType>[];
    onClose: () => void;
    onSubmit: (values: CarType) => void;
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
        <DialogTitle textAlign="center">Create New Car Type</DialogTitle>
        <DialogContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack
              sx={{
                width: '100%',
                minWidth: { xs: '300px', sm: '360px', md: '400px' },
                gap: '1.5rem',
              }}
            >
              {columns.filter(column=>column.accessorKey !=="typeId").map((column) => (
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
            Create New Car Type
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
  
  export default RetrieveAllCarTypesView;