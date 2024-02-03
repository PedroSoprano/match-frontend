import { Box, Button, TextField } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#b4dadd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "500px",
          height: "500px",
          backgroundColor: "#ffffff",
          padding: 3,
          borderRadius: 4,
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField placeholder="Nome" sx={{ marginBottom: 2 }} />
        <TextField placeholder="E-mail" sx={{ marginBottom: 2 }} />
        <TextField placeholder="Senha" type="password" sx={{ marginBottom: 2 }} />

        <Button variant="contained" onClick={() => alert("Salvo!")}>
          Salvar
        </Button>
      </Box>
    </Box>
  );
}

export default App;
