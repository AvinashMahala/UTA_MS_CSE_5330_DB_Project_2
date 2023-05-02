import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Owner as OwnerModel } from "../../models/Owner";
import * as OwnerApi from "../../network/owner_api";
import { darken } from "@mui/material";
import { Select } from "@mui/material";

import MaterialReactTable, {
  type MaterialReactTableProps,
  type MRT_Cell,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
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
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { formatBlankField, formatOwnerType } from "../../utils/formatDate";

export type Owner = {
  ownerId: number;
  ownerType: string;
  name: string;
  bankName: string;
};

class OwnerType {
  ownerTypeName: string;
  ownerTypeId: string;
  constructor(ownerTypeName: string, ownerTypeId: string) {
    this.ownerTypeName = ownerTypeName;
    this.ownerTypeId = ownerTypeId;
  }
}

const ownerTypeList = [
  new OwnerType("Company", "C"),
  new OwnerType("Individual", "I"),
  new OwnerType("Bank", "B"),
];

const RetrieveAllOwnersView = () => {
  type OwnerInput = {
    ownerId: number;
    ownerType: string;
    name: string;
    bankName: string;
  };

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<Owner[]>(() => []);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});



  const handleCreateNewRow = (values: Owner) => {
    tableData.push(values);
    setTableData([...tableData]);

    const insertOwner: OwnerInput = {
      ownerId: 0,
      ownerType: values.ownerType,
      name: values.name,
      bankName: values.bankName,
    };

    // Send the API request to update the Owner
    OwnerApi.createOwner(insertOwner).then(() => {
      console.log("Owner added!");
    });
  };

  const handleSaveRowEdits: MaterialReactTableProps<Owner>["onEditingRowSave"] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values;

        //send/receive api updates here, then refetch or update local table data for re-render
        const updatedOwner: OwnerInput = {
          ownerId: parseInt(values.ownerId),
          ownerType: values.ownerType,
          name: values.name,
          bankName: values.bankName,
        };

        // Send the API request to update the Owner
        await OwnerApi.updateOwner(updatedOwner.ownerId, updatedOwner);

        setTableData([...tableData]);
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row: MRT_Row<Owner>) => {
      if (
        !window.confirm(
          `Are you sure you want to delete ${row.getValue("name")}`
        )
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render

      OwnerApi.deleteOwner(row.getValue("ownerId")).then(() => {
        console.log("Owner Deleted!");
      });

      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Owner>
    ): MRT_ColumnDef<Owner>["muiTableBodyCellEditTextFieldProps"] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onChange: (e) => {
          const value = e.target.value;
          if (!value) {
            setValidationErrors((prev) => ({
              ...prev,
              [cell.id]: "Required",
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
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<Owner>[]>(
    () => [
      {
        accessorKey: "ownerId",
        header: "ownerId",
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        enableHiding: false,
        size: 10,
        editable: "never",
      },
      {
        accessorKey: "ownerType",
        header: "Owner Type",
        size: 5,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        //customize normal cell render on normal non-aggregated rows
        Cell: ({ cell }) => <>{formatOwnerType(cell.getValue<string>())}</>,
      },
      {
        accessorKey: "name",
        header: "Name Of The Owner",
        size: 20,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        //customize normal cell render on normal non-aggregated rows
        Cell: ({ cell }) => <>{formatBlankField(cell.getValue<string>())}</>,
      },
      {
        accessorKey: "bankName",
        header: "Bank Name",
        size: 20,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        //customize normal cell render on normal non-aggregated rows
        Cell: ({ cell }) => <>{formatBlankField(cell.getValue<string>())}</>,
      },
    ],
    [getCommonEditTextFieldProps]
  );

  useEffect(() => {
    OwnerApi.fetchOwner().then((owners) => {
      //tableData=owners;
      setTableData(owners);
      console.log(owners);
    });
  }, []);

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        initialState={{ columnVisibility: { ownerId: false } }} //hide firstName column by default
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
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
            Create New Owner
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
  columns: MRT_ColumnDef<Owner>[];
  onClose: () => void;
  onSubmit: (values: Owner) => void;
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
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {} as any)
  );

  const [selectedOwnerType, setSelectedOwnerType] = useState('');


  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Owner</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns
              .filter((column) => column.accessorKey === "ownerType")
              .map((column) => (
                <Select
                  label="Owner Type"
                  key={column.accessorKey}
                  name={column.accessorKey}
                  value={selectedOwnerType}
                  // onChange={(event) => setSelectedOwnerType(event.target.value)}
                  onChange={(event) =>{
                    setValues({ ...values, [event.target.name]: event.target.value });
                    setSelectedOwnerType(event.target.value);
                  }
                  }
                  displayEmpty
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="" disabled>
                    Select a Owner Type
                  </MenuItem>
                  {ownerTypeList.map((option) => (
                    <MenuItem
                      key={option.ownerTypeId}
                      value={option.ownerTypeId}
                    >
                      {option.ownerTypeName}
                    </MenuItem>
                  ))}
                </Select>
              ))}

            {columns
              .filter(
                (column) =>
                  column.accessorKey !== "ownerId" &&
                  column.accessorKey !== "ownerType"
              )
              .map((column) => (
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
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New Owner
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RetrieveAllOwnersView;
