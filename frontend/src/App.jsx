import { Container, Button, Stack } from "@mui/material";
import "./App.css";
import * as XLSX from "xlsx";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import StudentsTable from "./students-table";

// const createManyStudents = (data) => axios.post("/students", data);
const getStudents = async () => axios.get("/students");
const createManyStudents = async (data) => axios.post("/students", data);

function App() {
  // Access the client
  const queryClient = useQueryClient();

  // Mutations
  const mutation = useMutation({
    mutationFn: createManyStudents,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const {
    isPending,
    error,
    data: res,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  console.log(res);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Parse the file data
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const json = XLSX.utils.sheet_to_json(sheet);
        mutation.mutate(json);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Button
          sx={{ alignSelf: "flex-start" }}
          variant="contained"
          component="label"
          htmlFor="excel"
        >
          Import Excel Data
        </Button>
        <input hidden type="file" id="excel" onChange={handleFileUpload} />
        {/* <Typography variant="h2">Welcome Subroto Biswas</Typography> */}
        <StudentsTable
          isPending={isPending || mutation.isPending}
          data={res?.data}
        />
        {/* <div>{JSON.stringify(jsonData)}</div> */}
      </Stack>
    </Container>
  );
}

export default App;
