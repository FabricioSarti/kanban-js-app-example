import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authUtils from "../../utils/authUtils";
import Loading from "../common/Loading";
import Sidebar from "../common/Sidebar";
import { setUser } from "../../redux/features/userSlice";

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIsAuth = async () => {
      const user = await authUtils.isAuthenticated();

      if (!user) {
        console.log("applayout redirecciona login porque no existe usuario");
        navigate("/login");
      } else {
        dispatch(setUser(user));
        setLoading(false);
      }
    };

    checkIsAuth();
  }, [navigate]);

  return loading ? (
    <Loading fullHeight />
  ) : (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          width: "max-content",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
