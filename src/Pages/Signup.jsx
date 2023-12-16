import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from 'react-router-dom'
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "../Utils/axios";
import {useNavigate} from "react-router-dom"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { FormGroup } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    connectionSource: [],
    city: "",
    state: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  

  const handleChange = (event) => {

    const { name, value, checked, type } = event.target;
    if (type === 'checkbox') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked
          ? [...prevFormData[name], value]
          : prevFormData[name].filter((item) => item !== value),
      }));
    } else {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
}



  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!formData.username || !formData.email || !formData.password) {
        setError("Please provide all required fields.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Please provide a valid email address.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password should be at least 6 characters long.");
        return;
      }
      setLoading(true);

      const res = await axios.post("auth/signup", formData,{
        headers: {
          "Content-Type": "application/json",
        },
      });
     
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      if (res.data.success === false) {
        setError(res.data.message);
        setLoading(false);
      
        return;
      }
   
      setLoading(false);
      setError(null);
     
      navigate('/login')
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.message); 
      } else {
        setError("An unexpected error occurred. Please try again."); 
      }
      
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            value={formData.username}
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
            value={formData.email}
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
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
          value={formData.phone}
          onChange={handleChange}
          margin="normal"
          required
          fullWidth
          type="tel"
          label="Phone"
          name="phone"
        />

<FormControl required>
      <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
       
      </RadioGroup>
    </FormControl>

    <FormControl  required>
  <FormLabel component="legend">How did you hear about this?</FormLabel>
  <FormGroup aria-label="position" row>
    <FormControlLabel
      control={<Checkbox />}
      label="LinkedIn"
      name="connectionSource"
      value="linkedIn"
      onChange={handleChange}
    />
    <FormControlLabel
      control={<Checkbox />}
      label="Friends"
      name="connectionSource"
      value="friends"
      onChange={handleChange}
    />
    <FormControlLabel
      control={<Checkbox />}
      label="Job Portal"
      name="connectionSource"
      value="jobPortal"
      onChange={handleChange}
    />
    <FormControlLabel
      control={<Checkbox />}
      label="Others"
      name="connectionSource"
      value="others"
      onChange={handleChange}
    />
  </FormGroup>
</FormControl>


<TextField
  value={formData.city}
  onChange={handleChange}
  margin="normal"
  required
  fullWidth
  select
  label="City"
  name="city"
>
  <MenuItem value="Mumbai">Mumbai</MenuItem>
  <MenuItem value="Pune">Pune</MenuItem>
  <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
</TextField>

<Autocomplete
  value={formData.state}
  onChange={(event, newValue) => {
    setFormData({ ...formData, state: newValue });
  }}
  options={['Gujarat', 'Maharashtra', 'Karnataka']}
  renderInput={(params) => (
    <TextField
      {...params}
      margin="normal"
      required
      fullWidth
      label="State"
      name="state"
    />
  )}
/>
          {error && (
            <Typography variant="h6" gutterBottom sx={{ color: 'red' }} >
              {error}
            </Typography>
          )}
          <Button
            disabled={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "loading" : "Sign up"}
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/login" variant="body2">
                {"Have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Signup;
