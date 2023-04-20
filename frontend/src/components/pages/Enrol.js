import React, {useState, useEffect} from 'react';
import { ThreeDots } from "react-loader-spinner";

import { useDispatch, useSelector } from "react-redux";

import {
    Dialog,
    Fab,
    Grid,
    ListItemIcon,
    MenuItem,
  } from "@mui/material";
import { ReadMore as ReadMoreIcon, Close as CloseIcon } from '@mui/icons-material';

import Snackbars from "../../assets/snackbar";
import { CustomButton } from "../../assets/button"
import { Colors } from "../../assets/themes/colors"

import {courseEnrol} from "../../slices/enrolments"
import { clearMessage } from "../../slices/message";

import "../../styles/courses.styles.css"
import "../../styles/common.styles.css"




const Enrol = ({allowEnrol, row}) => {
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [enrolledState, setEnrolledState] = useState(false);
    const { message } = useSelector((state) => state.message);
    const { user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const handleClose = () => setOpen(false);
    const handleClickOpen = () => setOpen(true);
    const handleCloseSnack = () => setServerError(false);
    const handleSuccessClose = () => setSuccess(false);


    useEffect(() => {
        const findEnrolled = allowEnrol && allowEnrol.find((item) => item.id === row.id);
        if(findEnrolled !== undefined) {
            setEnrolledState(true)
        }
    }, [allowEnrol, row.id])


    const handleEnrol = (rowData) => {
        setLoading(true);

        const enrolData = {
            "course_id": rowData.id,
            "student_id": user.user_id
        };

        dispatch(courseEnrol({enrolData}))
        .then((data) => {
            setLoading(false);
            if(data.payload !== undefined) {
                setSuccess(true);
                setOpen(false);
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
      <MenuItem
        disableRipple
        className="more-icon-menu"
        onClick={handleClickOpen}
      >
          <ListItemIcon>
          <ReadMoreIcon className="more-icon" />
        </ListItemIcon>
      </MenuItem>
      <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message="Enrolled Sucessfully"
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
          <Grid item xs={12}>
            <div className="table-title">Course details</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Title</div>
            <div className="sub-title-text">{row.title}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Description</div>
            <div className="sub-title-text">{row.description}</div>
          </Grid>
          <Grid item xs={12}>
            <div className="sub-title">Course Fee</div>
            <div className="sub-title-text">{row.fee}</div>
          </Grid>
          <Grid item xs={12}>
          <CustomButton
             variant="contained"
             sx={{ background: Colors.primary}}
             className="customBtn"
             endIcon={ <ReadMoreIcon />} 
             type="submit" 
             disabled={loading || enrolledState}
             onClick={() => handleEnrol(row)}
            >
              {loading ? (
                <ThreeDots color="#2e3192" height={15} width={30} />
              ) : (
                "Enrol"
              )}
            </CustomButton>
          </Grid>
        </Grid>
      </Dialog>

    </div>
  )
}

export default Enrol
