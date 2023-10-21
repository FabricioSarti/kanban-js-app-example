import {
  Drawer,
  List,
  Box,
  IconButton,
  ListItemButton,
  ListItem,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import assets from "../../assets/index";
import { useEffect, useState } from "react";
import boardApi from "../../api/boardApi";
import { setBoards } from "../../redux/features/boardSlice";

import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Sidebar = () => {
  const user = useSelector((state) => state.user.value);
  console.log("sidebar user ", user);
  const sidebarWidth = 250;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.board.value);
  const { boardID } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  console.log("boards dispatch ", boards);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll();
        dispatch(setBoards(res));
        if (res.length > 0 && boardID === undefined) {
          navigate(`/boards/${res[0].id}`);
        }
      } catch (error) {
        alert(error);
      }
    };

    getBoards();
  }, []);

  useEffect(() => {
    updateActive(boards);
  }, [boards]);

  const addBoard = async () => {};

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const updateActive = (listBoards) => {
    const activeItem = listBoards.findIndex((e) => e.id === boardID);
    setActiveIndex(activeItem);
  };

  return (
    <Drawer
      container={window.document.body}
      variant="permanent"
      open={true}
      sx={{
        width: sidebarWidth,
        height: "100%",
        "& > div: ": { borderRight: "none" },
      }}
    >
      <List
        disablePadding
        sx={{
          width: sidebarWidth,
          height: "100vh",
          backgroundColor: assets.colors.secondary,
        }}
      >
        <ListItem>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" fontWeight="700">
              {user.username}
            </Typography>
            <IconButton onClick={logout}>
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
        <Box sx={{ paddingTop: "10px" }} />

        <Box sx={{ paddingTop: "10px" }} />
        <ListItem>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" fontWeight="700">
              Private
            </Typography>
            <IconButton onClick={addBoard}>
              <AddBoxOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
