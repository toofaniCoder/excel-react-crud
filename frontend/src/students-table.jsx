import React from "react";
import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, Stack, TextField } from "@mui/material";
import _ from "lodash";
import { blue } from "@mui/material/colors";
import { Form, useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteStudents = async (selectedIds) => {
  try {
    const promises = selectedIds.map((id) =>
      axios.delete(`${axios.defaults.baseURL}/students/${id}`)
    );
    await Promise.allSettled(promises);
  } catch (error) {
    console.log(error);
  }
};

const StudentFormPanel = (props) => {
  const { row } = props;
  const { _id, ...student } = props.student;
  const { control, getValues } = useForm({
    defaultValues: student,
  });
console.log(row)
  // Access the client
  const queryClient = useQueryClient();

  console.log(student);
  return (
    <Stack
      component={Form}
      control={control}
      method="PUT"
      action={`${axios.defaults.baseURL}/students/${_id}`}
      headers={{ "Content-Type": "application/json" }}
      onSuccess={
        () => {
          queryClient.invalidateQueries({ queryKey: ["students"] });
          row.toggleExpanded(false)
        }

        // _autoResetExpanded
      }
      direction={"row"}
      flexWrap={"wrap"}
      columnGap={3}
      rowGap={3}
    >
      {_.keys(student).map((item) => (
        <Controller
          key={item}
          control={control}
          name={item}
          render={({ field }) => (
            <TextField
              {...field}
              sx={{ flexBasis: "23%", bgcolor: "white" }}
              placeholder={`Enter Your ${_.upperFirst(item)}`}
              // defaultValue={student[item]}
            />
          )}
        />
      ))}
      <Button type="submit" disableElevation variant="contained" size="large">
        Update Details
      </Button>
    </Stack>
  );
};

const StudentsTable = ({ isPending, data }) => {
  // Access the client
  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation({
    mutationFn: deleteStudents,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "E-mail Address",
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
      },
      {
        accessorKey: "section",
        header: "Section",
      },
      {
        accessorKey: "roll",
        header: "Roll Number",
      },
    ],
    [data]
  );

  const table = useMaterialReactTable({
    state: {
      isLoading: isPending,
      showProgressBars: isPending,
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
    },
    columns,
    data: data ?? [], //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: true,
    muiDetailPanelProps: {
      sx: {
        bgcolor: blue[50],
      },
    },
    renderToolbarAlertBannerContent: ({ table, selectedAlert }) => {
      return (
        <Stack
          sx={{ p: 2 }}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-start"}
          spacing={2}
        >
          {selectedAlert}
          <Button
            disableElevation
            size="small"
            color="error"
            variant="contained"
            onClick={() => {
              // console.log(table.getState().rowSelection); this is not useful for this case
              // console.log(table.getSelectedRowModel().rows); this is use for for this case
              const selectedIds = table
                .getSelectedRowModel()
                .rows.map((item) => item.original._id);
              mutation.mutate(selectedIds);
              table.toggleAllPageRowsSelected(false);
            }}
          >
            delete selected
          </Button>
        </Stack>
      );
    },
    renderDetailPanel: ({ row }) => {
      // console.log(_.omit(row.original, ["__v", "_id"]));
      // const student = _.omit(row.original, ["__v", "_id"]); ----> old code
      const student = _.omit(row.original, ["__v"]);
      return <StudentFormPanel student={student} row={row} />;
    },
  });
  console.log(table);
  return <MaterialReactTable table={table} />;
};

export default StudentsTable;
