import { Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const Home = () => {
  const createOnBoard = () => {};

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingButton variant="outlined" color="success" onClick={createOnBoard}>
        Seleccione aqui para crear tu primer Board de tareas
      </LoadingButton>
    </Box>
  );
};

export default Home;
