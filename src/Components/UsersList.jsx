import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import axios from "../Utils/axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import { getUsersSuccess, setEditUser } from "../redux/addUserSlice";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableSortLabel from "@mui/material/TableSortLabel";


function UsersList() {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails?.currentUser;
  const adduserDetails = useSelector((state) => state.addUser);
  const users = adduserDetails?.addUser;

  const dispatch = useDispatch();
  const accesstoken = user?.token;
  const [searchInput, setSearchInput] = useState("");
  const [userSearch, setUserSearch] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("");
  
  const handleClickOpen = (userId) => {
    setOpen(true);
    setSelectedUserId(userId);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getUsers = async (value) => {
    try {
      const response = await axios.get(`user/getUser?filter=${value}`, {
        headers: {
          "Content-Type": "application/json",
          token: accesstoken,
        },
      });

      const res = response?.data;

      const userss = res.users;
      dispatch(getUsersSuccess(userss));
    } catch (error) {
      console.error(error);
    }
  };
 

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchInput) {
        setUserSearch([]);
      } else {
        try {
          const searchUsers = await axios.get(
            `user/searchUsers/${searchInput}`,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                token: accesstoken,
              },
            }
          );
          const searc = searchUsers.data;
          setUserSearch(searc.users);
        } catch (error) {
          console.error(error);
        }
      }
    };
    searchUsers();
  }, [searchInput]);

  useEffect(() => {
    getUsers();
  }, []);
  
  useEffect(() => {
    getUsers(selectedFilter); 
  }, [selectedFilter]);

  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue);
   
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`user/deleteUser/${selectedUserId}`, {
        headers: {
          "Content-Type": "application/json",
          token: accesstoken,
        },
      });
      const { success, message, users } = response.data;
      if (success) {
        dispatch(getUsersSuccess(users));
        handleClose();
        setSelectedUserId(null);
      } else {
        console.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (userId) => {
    const userToEdit = users.find((user) => user._id === userId);
    dispatch(setEditUser(userToEdit));
  };
  return (
    <Box>
      <TextField
        label="Search"
        variant="outlined"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target?.value)}
        margin="normal"
      />

      <FormControl
        margin="normal"
        variant="outlined"
        sx={{ minWidth: 120, marginLeft: 3 }}
      >
        <InputLabel id="filter-label">Filter</InputLabel>
        <Select
          labelId="filter-label"
          id="filter-select"
          onChange={handleFilterChange}
          value={selectedFilter}
        >
          <MenuItem value="lastModified">Last Modified</MenuItem>
          <MenuItem value="lastInserted">Last Added</MenuItem>
          <MenuItem value="asc">A-Z</MenuItem>
          <MenuItem value="desc">Z-A</MenuItem>
        </Select>
      </FormControl>

      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
              
                 
              
                  Name
               
              </TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone NUmber</TableCell>
              <TableCell align="right"> Edit </TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userSearch && userSearch.length > 0 ? (
              userSearch.map((item) => (
                <TableRow
                  key={item._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item.username}
                  </TableCell>
                  <TableCell align="center">{item.email}</TableCell>
                  <TableCell align="center">{item.phone}</TableCell>
                  <TableCell align="right">
                    {
                      <IconButton
                        aria-label="Edit"
                        size="large"
                        onClick={() => handleEdit(item._id)}
                      >
                        <EditIcon />
                      </IconButton>
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handleClickOpen(item._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  </TableCell>
                </TableRow>
              ))
            ) : users && users.length > 0 ? (
              users.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="center">{row.phone}</TableCell>
                  <TableCell align="right">
                    {
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handleEdit(row._id)}
                      >
                        <EditIcon />
                      </IconButton>
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handleClickOpen(row._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Deleting user"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure? You won't be able to revert this!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UsersList;
