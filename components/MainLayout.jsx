import React from "react";
import {
  AppBar,
  Box,
  Container, Divider,
  Grid,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuList,
  Toolbar,
  Typography
} from "@mui/material";
import Link from "next/link";
import {Add, Dashboard} from "@mui/icons-material";

export const MainLayout = ({children}) => {
  return (
    <Box sx={{display: 'flex'}}>
      <AppBar position="absolute">
        <Toolbar sx={{pl: 5}}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{flexGrow: 1}}
          >
            Next Blog
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center"
      }}>
        <Container fixed sx={{m: 0, mt: 12}}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <MenuList>
                <Link href={"/"}>
                  <ListItemButton>
                    <ListItemIcon>
                      <Dashboard/>
                    </ListItemIcon>
                    <ListItemText primary="Home"/>
                  </ListItemButton>
                </Link>
                <Link href={"/post/add"}>
                  <ListItemButton>
                    <ListItemIcon>
                      <Add />
                    </ListItemIcon>
                    <ListItemText primary="New Post"/>
                  </ListItemButton>
                </Link>
                <Divider/>
              </MenuList>
            </Grid>
            <Grid item xs={10}>
              {children}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}