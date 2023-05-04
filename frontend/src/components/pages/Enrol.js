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

import {courseEnrol, getCourseEnrolments} from "../../slices/enrolments"
import {courses as getCourses} from "../../slices/courses"
import {generateInvoice} from "../../slices/external"
import { clearMessage } from "../../slices/message";

import "../../styles/courses.styles.css"
import "../../styles/common.styles.css"




const Enrol = ({allowEnrol, row}) => {
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [invoiceDetails, setInvoiceDetails] = useState(null);
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

    function generateUniqueReference() {
      let data = '';
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const lettersLength = letters.length;
      for (let i = 0; i < 7; i++) {
          data += letters.charAt(Math.floor(Math.random() * lettersLength));
      }
  
      // check if the string is unique
      if (uniqueStrings.has(data)) {
        // if not, generate a new string recursively
        return generateUniqueReference();
      } else {
        // add the string to the set of unique strings
        uniqueStrings.add(data);
        return data;
      }
    }
    
    // initialize an empty set to store unique strings
    const uniqueStrings = new Set();
    
    // generate a unique string
    const uniqueString = generateUniqueReference();


const handleEnrol = (rowData) => {
  setLoading(true);
  
  const enrolData = {
    "course_id": rowData.id,
    "student_id": user.user_id
  };

  const invoiceData = {
    "account_id": user && user.student_id,
    "amount": rowData.fee,
    "type": 1,
    "reference": uniqueString,
    "paid": false,
    "book_id": null,
    "course_id": rowData.id
  }
  
  dispatch(generateInvoice({invoiceData}))
  .then((data) => {
    // dispatch(getCourses({ page: 0, pagesize: 10, search: "" }));
    setLoading(false);
    setOpen(false)
    if(data.payload !== undefined) {
      dispatch(courseEnrol({enrolData}))
      setSuccess(true);
      setInvoiceDetails(data.payload);
      dispatch(getCourses({ page: 0, pagesize: 10, search: "" }));
      dispatch(getCourseEnrolments())
    }
  })
  .catch(() => {
    setLoading(false);
    setServerError(true);
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
      {/* <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message="Enrolled Sucessfully"
          isOpen={success}
        /> */}

        <Snackbars
          variant="success"
          handleClose={handleSuccessClose}
          message={invoiceDetails && invoiceDetails.data.reference !== null ? `An invoice with reference: ${invoiceDetails && invoiceDetails.data.reference} has been generated for you. please login to your finance portal and pay your enrolment fee` : "Enrolled successfully"}
          isOpen={success}
          autoHide={8000}
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
          isOpen={message !== undefined && message !== ""}
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
             disabled={loading || enrolledState || success}
             onClick={() => handleEnrol(row)}
            >
              {loading ? (
                <ThreeDots color="#2e3192" height={15} width={30} />
              ) : 
                enrolledState ? "Enrolled" : "Enrol"
              }
            </CustomButton>
          </Grid>
        </Grid>
      </Dialog>

    </div>
  )
}

export default Enrol
