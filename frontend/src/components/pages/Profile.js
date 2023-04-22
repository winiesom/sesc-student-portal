import React, {useState, useEffect} from 'react';
import {Grid, Paper} from '@mui/material';

import {useDispatch, useSelector} from "react-redux";

import { profile } from "../../slices/profile"

import EditProfile from "./EditProfile"

import "../../styles/common.styles.css"
import "../../styles/profile.styles.css"



const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [serverSuccess, setServerSuccess] = useState(false);
  const { message } = useSelector((state) => state.message);
  const { data } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  useEffect(() => {
    setLoading(true);
    const userId = user.user_id
    dispatch(profile(userId))
    .unwrap()
      .then(() => {
        setLoading(false);
        setServerSuccess(true);
      })
      .catch(() => {
        setLoading(false);
        setServerSuccess(false);
        setServerError(true);
      });
  }, [dispatch, user])

  return (
    <div className="main-container">
        <Paper className="profile-paper">
        <Grid container spacing={2}>
        <Grid item xs={10}>
          <Grid item xs={12}>
            <div className="table-title">Profile</div>
          </Grid>

          <Grid item xs={12}>
            <div className="sub-title">First name</div>
            <div className="sub-title-text">{data && data[0].first_name}</div>
          </Grid>

          <Grid item xs={12}>
          <div className="sub-title">Last name</div>
            <div className="sub-title-text">{data && data[0].last_name}</div>
          </Grid>

          <Grid item xs={12}>
          <div className="sub-title">Username</div>
            <div className="sub-title-text-email">{data && data[0].username}</div>
          </Grid>

          <Grid item xs={12}>
          <div className="sub-title">Email</div>
            <div className="sub-title-text-email">{data && data[0].email}</div>
          </Grid>

          <Grid item xs={12}>
          <div className="sub-title">Student number</div>
            <div className="sub-title-text">{data && data[0].student_id}</div>
          </Grid>
        </Grid>

        <Grid item xs={2}><EditProfile profileInfo={data && data[0]} /></Grid>
        </Grid>
        </Paper>
    </div>
  );
}

export default Profile;