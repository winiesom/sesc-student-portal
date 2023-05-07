import React, { useState, useEffect } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Fab, Grid } from "@mui/material";
import { Edit as EditIcon, Close as CloseIcon, DownloadDone as DownloadDoneIcon } from '@mui/icons-material';

import Snackbars from "../../assets/snackbar";
import { CustomButton } from "../../assets/button"
import { TextField } from "../../assets/textfields";
import { Colors } from "../../assets/themes/colors"

import { updateProfile, profile } from "../../slices/profile"
import { clearMessage } from "../../slices/message";

import "../../styles/profile.styles.css";
import "../../styles/common.styles.css";




const EditProfile = ({profileInfo}) => {
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { message } = useSelector((state) => state.message);

    const dispatch = useDispatch();

    const handleClose = () => setOpen(false);
    const handleClickOpen = () => setOpen(true);
    const handleCloseSnack = () => setServerError(false);
    const handleSuccessClose = () => setSuccess(false);


     // form validation rules
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().required("Email is required")
  });

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    setValue("first_name", profileInfo && profileInfo.first_name);
    setValue("last_name", profileInfo && profileInfo.last_name);
    setValue("username", profileInfo && profileInfo.username);
    setValue("email", profileInfo && profileInfo.email);
  }, [profileInfo, setValue])

  const onSubmit = (data) => {
      const {first_name, last_name, username, email} = data;

      setLoading(true);

      const id = profileInfo.id;

      dispatch(updateProfile({ id, first_name, last_name, username, email }))
      .then((data) => {
          setLoading(false);
          if(data.payload !== undefined) {
            setSuccess(true);
            setOpen(false);
            dispatch(profile(id))
            reset();
          }
      })
      .catch(() => {
        setLoading(false)
        setServerError(true)
      })
      setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);

    return false
  }


  return (
    <div>
        <Fab
          size="medium"
          aria-label="edit"
          onClick={handleClickOpen}
          className="edit-fab"
        >
          <EditIcon onClick={handleClickOpen} />
        </Fab>

      <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message="Sucessful"
          isOpen={success}
        />

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        PaperProps={{
            sx:{
                width: "100%",
                height: "100%",
                maxWidth: 500,
                position: "absolute",
                right: 0,
                top: 0,
                padding: "50px 20px 20px 35px",
                "@media only screen and (max-width: 600px)": {
                maxWidth: "50%",
                }
            }
        }}
        data-aos="fade-in"
        data-aos-once="true"
      >
          <Fab
          size="small"
          aria-label="close"
          className="dialog-fab"
          onClick={handleClose}
        >
          <CloseIcon />
        </Fab>

        <Snackbars
          variant="error"
          handleClose={handleCloseSnack}
          message={message}
          isOpen={(message !== undefined && message !== "") || (serverError)}
        />
        

        <Grid container spacing={0}>
          <Grid item xs={12} sx={{marginBottom: "25px"}}>
            <div className="table-title">Edit Profile</div>
          </Grid>

          <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>

              <Grid item xs={12} className="form-grid">
                <TextField
                    id="first_name"
                    htmlFor="first_name"
                    label="First name"
                    name="first_name"
                    className="edit-profile-form"
                    error={errors.first_name ? true : false}
                    helper={errors.first_name?.message}
                    register={register}
                    disabled={loading}
                />
              </Grid>

              <Grid item xs={12} className="form-grid">
                <TextField
                    id="last_name"
                    htmlFor="last_name"
                    label="Last name"
                    name="last_name"
                    className="edit-profile-form"
                    error={errors.last_name ? true : false}
                    helper={errors.last_name?.message}
                    register={register}
                    disabled={loading}
                />
              </Grid>

              <Grid item xs={12} className="form-grid">
                <TextField
                    id="username"
                    htmlFor="username"
                    label="Username"
                    name="username"
                    className="edit-profile-form"
                    error={errors.username ? true : false}
                    helper={errors.username?.message}
                    register={register}
                    disabled={loading}
                />
              </Grid>

              {/* <Grid item xs={12} className="form-grid">
                <TextField
                    id="email"
                    htmlFor="email"
                    label="Email"
                    name="email"
                    className="edit-profile-form"
                    error={errors.email ? true : false}
                    helper={errors.email?.message}
                    register={register}
                    disabled={loading}
                />
              </Grid> */}
        

            <Grid item xs={12} className="button-grid">
              <CustomButton
                 variant="contained"
                 sx={{ background: Colors.primary}}
                 className="customBtn"
                 endIcon={ <DownloadDoneIcon />} 
                 type="submit" 
                 disabled={loading}
                >
                  {loading ? (
                    <ThreeDots color="#2e3192" height={15} width={30} />
                  ) : (
                    "Edit"
                  )}
                </CustomButton>
            </Grid>
          </Grid>
          </form> 


          </Grid>
      </Dialog>

    </div>
  )
}

export default EditProfile
