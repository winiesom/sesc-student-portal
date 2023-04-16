import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { Paper, Grid } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { CustomButton } from "../../assets/button"
import { PasswordField, TextField } from "../../assets/textfields";
import Snackbars from "../../assets/snackbar";
import { Colors } from "../../assets/themes/colors"

import { useDispatch, useSelector } from 'react-redux';

import { register as signup } from '../../slices/auth'
import { clearMessage } from "../../slices/message";


import '../../styles/auth.styles.css'
import '../../styles/common.styles.css'


const Register = () => {
  const [loading, setLoading] = useState(false);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form validation rules
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
        .min(8, "Password must have atleast 8 characters")
        .required("Password is required")
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm(formOptions);
    
    const onSubmit = (data) => {
      const { first_name, last_name, username, email, password } = data;
      setLoading(true);

      const regData = {
        first_name,
        last_name,
        username,
        email,
        password
      };

      dispatch(signup(regData))
      .then((data) => {
        setLoading(false);
        if(data.payload !== undefined) {
          navigate("/")
        }
      })
      .catch(() => {
        setLoading(false);
      });
          setTimeout(() => {
            dispatch(clearMessage());
          }, 3000);
    return false;
    }


  return (
    <div className="main-container">
    <Snackbars
      variant="error"
      message={message}
      isOpen={message !== undefined && message !== ""}
    />
    
    <Paper elevation={3} className="reg-container">
     <div className={`${"title"} ${"title-style"}`}>Register</div>
     <form onSubmit={handleSubmit(onSubmit)}>
     <Grid container spacing={2} className="textfield-grid-container">
       <Grid item xs={12} sm={12} md={6} className="textfield-grid">
            <TextField
              id="first_name"
              htmlFor="first_name"
              label="First name"
              name="first_name"
              error={errors.first_name ? true : false}
              helper={errors.first_name?.message}
              register={register}
              disabled={loading}
              // onChange={(e) => setRegData({ ...regData, first_name: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} className="textfield-grid">
            <TextField
              id="last_name"
              htmlFor="last_name"
              label="Last name"
              name="last_name"
              error={errors.last_name ? true : false}
              helper={errors.last_name?.message}
              register={register}
              disabled={loading}
              // onChange={(e) => setRegData({ ...regData, last_name: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} className="textfield-grid">
            <TextField
              id="username"
              htmlFor="username"
              label="Username"
              name="username"
              error={errors.username ? true : false}
              helper={errors.username?.message}
              register={register}
              disabled={loading}
              // onChange={(e) => setRegData({ ...regData, username: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} className="textfield-grid">
            <TextField 
              id="email"
              htmlFor="email"
              label="Email"
              name="email"
              error={errors.email ? true : false}
              helper={errors.email?.message}
              register={register}
              disabled={loading}
              // onChange={(e) => setRegData({ ...regData, email: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} className="textfield-grid">
            <PasswordField 
                id="password"
                htmlFor="password"
                name="password"
                type="password"
                label="Password"
                register={register}
                error={errors.password ? true : false}
                helper={errors.password?.message}
                disabled={loading}
                // onChange={(e) => setRegData({ ...regData, password: e.target.value })}
            />
          </Grid>

          <Grid item xs={12} className="textfield-grid">
            <CustomButton
             variant="contained"
             sx={{ background: Colors.primary}}
             className="submitBtn"
             endIcon={ <HowToRegIcon/>} 
             type="submit" 
             disabled={loading}
            >
              {loading ? (
                <ThreeDots color="#2e3192" height={15} width={30} />
              ) : (
                "Create account"
              )}
            </CustomButton>
          </Grid>
      </Grid>
     </form>

    <Link className={`${"title-small"} ${"title-style"}`} to="/">Already have an account? Login</Link>
    </Paper>

  

  </div>
  );
}

export default Register