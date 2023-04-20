import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import FolderOffIcon from '@mui/icons-material/FolderOff';

import {PuffSpinner} from '../../assets/spinner';
import {Colors} from '../../assets/themes/colors';
import Snackbars from "../../assets/snackbar";

import "../../styles/courses.styles.css"
import "../../styles/common.styles.css"

import {useSelector, useDispatch} from 'react-redux';

import {getCourseEnrolments} from '../../slices/enrolments';
import { clearMessage } from  "../../slices/message";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#cccccc",
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 10
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const columns = [
  { id: 'sn', label: 'SN', align: 'center' },
  { id: 'title', label: 'Title', minWidth: 220 },
  { id: 'description', label: 'Description', minWidth: 100 },
  { id: 'fee', label: 'Fee', minWidth: 100 },
  { id: 'enrolled', label: 'Enrolled On', minWidth: 200 },
];

function createData(sn, title, description, fee, enrolled) {
  return { sn, title, description, fee, enrolled };
}


const Enrolments = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [serverSuccess, setServerSuccess] = useState(false);
  const { message } = useSelector((state) => state.message);
  const { enrolments } = useSelector((state) => state.enrolments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
    setLoading(true);
    dispatch(getCourseEnrolments())
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
  }, [dispatch]);


  const handleCloseSnack = () => {
    setServerError(false);
    setServerSuccess(false);
  };

  

  const rows = enrolments && enrolments.length !== 0 ? enrolments.map((row, i) => {
      return createData(
        i + 1,
        row.course.title,
        row.course.description,
        row.course.fee && <span> £{row.course.fee} </span>,
        row.created_at && row.created_at.substring(0, 10)
      );
    })
  : [];


  return (
    <div className="main-container">
      <Snackbars
          variant="error"
          handleClose={handleCloseSnack}
          message={message}
          isOpen={serverError}
      />

      <Snackbars
          variant="success"
          handleClose={handleCloseSnack}
          message="Successful"
          isOpen={serverSuccess}
      />

      <Grid container spacing={2}>
      <Grid item xs={12} sm={12} >
        <div className="table-title">Enrolments</div>
      </Grid>
      </Grid>
      
      {
      loading ? 
        <Grid item xs={12} className="table-tools-container">
          <PuffSpinner 
            height={50} 
            width={50} 
            color={Colors.primary}
            label='Loading...'
            />
        </Grid> : 

        rows.length === 0 ? 
        <Grid item xs={12} className={`${"table-tools-container"} ${"table-title"}`}>
          <div>
            <FolderOffIcon className="table-no-record-icon" />
          </div>
          <div>No record found</div>
        </Grid> : 
        
        <Grid item xs={12}>
          <Paper className="table-paper">
          <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
          <TableHead>
          <StyledTableRow>
            {columns.map((column) => (
                <StyledTableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </StyledTableCell>
            ))}
          </StyledTableRow>
          </TableHead>

          <TableBody>
          {rows.map((row, index) => {
            return (
              <StyledTableRow hover key={index + 1}>
                {columns.map((column) => {
                   const value = row[column.id];
                    return (
                      <StyledTableCell
                       key={column.id}
                       align={column.align}
                       >
                       {value}
                      </StyledTableCell>
                      );
                })}
              </StyledTableRow>
                );
          })}
          </TableBody>
          </Table>
          </TableContainer>
          </Paper>
        </Grid>
      }

    </div>
  );
}

export default Enrolments;