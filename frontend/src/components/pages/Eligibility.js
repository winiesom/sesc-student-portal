import React, {useState, useEffect} from 'react';
import {Grid, Card, CardContent, Typography} from '@mui/material';

import {PuffSpinner} from '../../assets/spinner';
import {Colors} from '../../assets/themes/colors';
import CloseIcon from '@mui/icons-material/Close';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import {useDispatch, useSelector} from "react-redux";

import { getOutstanding } from "../../slices/external";

import "../../styles/common.styles.css";
import "../../styles/eligibility.styles.css";


const Eligibility = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const { outstanding } = useSelector((state) => state.external);
  const dispatch = useDispatch();


  useEffect(() => {
    setLoading(true);
    const account_id = user && user.student_id;
    dispatch(getOutstanding({account_id}))
    .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dispatch, user])


  return (
    <div className="main-eligibility-container">
    <div className="eligibility-container"> 
    {loading ? 
    <Grid container spacing={0}>
     <Grid item xs={12} className="table-tools-container-tab">
     <PuffSpinner 
     height={50} 
     width={50} 
     color={Colors.primary}
     label='Loading...'
     />
   </Grid>
    </Grid> : 
    outstanding && outstanding.data && (
        <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography className="eligibility-content" sx={{ textTransform: "capitalize" }} color="text.secondary" gutterBottom>
          {outstanding && outstanding.data.first_name + " " + outstanding.data.last_name}
        </Typography>
        
        <Typography className="eligibility-content" color="text.secondary" gutterBottom>
        {outstanding && outstanding.data.account_id}
        </Typography>

        <Typography className="eligibility-content" sx={{ marginTop: "20px" }} color="text.secondary" gutterBottom>
          Eligibility to graduate? 
        </Typography>
        <Typography>
        {outstanding && outstanding.data.outstanding === false ? 
        <div className="eligibility-text-icon-yes">
          <div className="eligibility-yes">You are eligible to graduate</div>
          <div className="eligibility-icon"><TaskAltIcon /></div>
        </div>
         : 
        <div className="eligibility-text-icon-no">
        <div className="eligibility-no">
          You are not eligible to graduate at this time
          <br />
          Please login to your finance portal to pay all invoices
        </div>
        <div className="eligibility-icon"><CloseIcon /></div>
        </div>
        }
        </Typography>
      </CardContent>

    </Card>
    )
    }
    </div>
    </div>
  );
}

export default Eligibility;