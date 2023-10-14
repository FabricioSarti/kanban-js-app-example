import { Container, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import assets from "../../assets";

const AuthLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIsAuth = async () => {
      const isAuth = await authUtils.isAuthenticated();

      if (!isAuth) {
        console.log("authlayout 1");
        setLoading(false);
      } else {
        console.log("authlayout 2");
        navigate("/");
      }
    };

    checkIsAuth();
  }, [navigate]);

  return loading ? (
    <Loading fullHeight />
  ) : (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img
          src={assets.images.logoDark}
          style={{ width: "100px" }}
          alt="app logo"
        />
        <Outlet />
      </Box>
    </Container>
  );
};

export default AuthLayout;
