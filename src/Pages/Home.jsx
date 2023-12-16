import React from 'react'
import UsersList from '../Components/UsersList'
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AddUser from '../Components/AddUser';
function Home() {
  return (
    <div>
       <Container
        maxWidth="md"
        style={{
          display: "flex",
          justifyContent: "center",
          height: "auto",
          marginTop: "5vh",
        }}
      >

        <Box sx={{ border: 2, width: "90%", marginTop: 5, padding: "10px" }}>
         <Box sx={{  marginTop: 2, marginBottom:2,float:"inline-end"}}>
         <AddUser />
         </Box>      
            <UsersList/>
          

        </Box>
      </Container>
      
    </div>
  )
}

export default Home