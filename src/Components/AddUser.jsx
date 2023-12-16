import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "../Utils/axios";
import { useSelector, useDispatch } from "react-redux";
import { getUsersSuccess, clearEditUser } from "../redux/addUserSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function AddUser() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const userDetails = useSelector((state) => state.user);
  let currentUser = userDetails?.currentUser;
  const adduserDetails = useSelector((state) => state.addUser);
  const editUser = adduserDetails?.editUser;
  const accesstoken = currentUser?.token;
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const dispatch = useDispatch();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    dispatch(clearEditUser());
  };

  useEffect(() => {
    if (editUser) {
      setOpen(true);
      setUser({
        username: editUser.username,
        email: editUser.email,
        phone: editUser.phone,
      });
    } else {
      setUser({
        username: "",
        email: "",
        phone: "",
      });
    }
  }, [editUser]);
  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!user.username || !user.email) {
        setError("Please provide all required fields.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(user.email)) {
        setError("Please provide a valid email address.");
        return;
      }

      if (editUser) {
        const hasChanges =
          user.username !== editUser.username ||
          user.email !== editUser.email ||
          user.phone !== editUser.phone;
        if (hasChanges) {
          const res = await axios.put(`user/editUser/${editUser._id}`, user, {
            headers: {
              "Content-Type": "application/json",
              token: accesstoken,
            },
          });
        
        if (res.data.success === false) {
          setError(res.data.message);

          return;
        } else {
          toast.success(res.data.message);
        }}else{
          toast.error("No changes detected");
          return;
        }
      }else {
        const res = await axios.post("user/addUser", user, {
          headers: {
            "Content-Type": "application/json",
            token: accesstoken,
          },
        });
        if (res.data.success === false) {
          setError(res.data.message);

          return;
        } else {
          toast.success(res.data.message);
        }
      }

      setUser({
        username: "",
        email: "",
        phone: "",
      });

      const response = await axios.get("user/getUser", {
        headers: {
          "Content-Type": "application/json",
          token: accesstoken,
        },
      });
      const updatedUsers = response?.data?.users;
      dispatch(getUsersSuccess(updatedUsers));
      setError(null);
      handleClose();
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add User</Button>
      <ToastContainer />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style} component="form" onSubmit={handleSubmit}>
            <Typography component="h1" variant="h5">
              Add User
            </Typography>
            <TextField
              value={user.username}
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              id="username"
              label="user name"
              name="username"
              autoComplete="username"
              autoFocus
            />

            <TextField
              value={user.email}
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              value={user.phone}
              onChange={handleChange}
              margin="normal"
              required
              fullWidth
              type="tel"
              label="Phone"
              name="phone"
            />
            {error && (
              <Typography variant="h6" gutterBottom sx={{ color: "red" }}>
                {error}
              </Typography>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: "16px" }}
            >
              <Button variant="outlined" onClick={handleClose}>
                cancel
              </Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default AddUser;
