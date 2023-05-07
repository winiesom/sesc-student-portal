import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Divider, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import FolderOffIcon from '@mui/icons-material/FolderOff';

import {PuffSpinner} from '../../assets/spinner';
import {Colors} from '../../assets/themes/colors';
import Snackbars from "../../assets/snackbar";

import "../../styles/courses.styles.css"
import "../../styles/common.styles.css"

import {useSelector, useDispatch} from 'react-redux';

import Enrol from './Enrol';
import {courses as getCourses} from '../../slices/courses';
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
    padding: 5
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
  { id: 'title', label: 'Title', minWidth: 200 },
  { id: 'description', label: 'Description', minWidth: 170 },
  { id: 'fee', label: 'Fee', minWidth: 100 },
  { id: 'action', label: 'Action', minWidth: 50, align:'center' },
];

function createData(sn, title, description, fee, action) {
  return { sn, title, description, fee, action };
}


const Courses = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [serverSuccess, setServerSuccess] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [page, setPage] = useState(0);
  const [pagesize, setPagesize] = useState(10);
  const [search, setSearch] = useState("");
  const { message } = useSelector((state) => state.message);
  const { data } = useSelector((state) => state.courses);
  const { enrolments } = useSelector((state) => state.enrolments);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
    setLoading(true);
    dispatch(getCourses({ page, pagesize, search }))
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
  }, [dispatch, page, pagesize, search]);

  useEffect(() => {
    dispatch(getCourseEnrolments())
},[dispatch])

useEffect(() => {
  const findEnrolment = data && data.courses.filter(obj1 => {
    return enrolments && enrolments.some(obj2 => obj1.id === obj2.course_id);
  });
  setEnrolled(findEnrolment)
}, [data, enrolments])


  const handleChangePage = () => {
    let credentials = {
      pagesize,
      page: page + 1,
      search: search,
    };
    setLoading(true);
    dispatch(getCourses(credentials))
      .unwrap()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setServerError(true);
      });
  };



  const handleChangeRowsPerPage = (event) => {
    setPagesize(+event.target.value);
    setPage(0);
  };
  

  const handleSearch = (e) => setSearch(e.target.value);

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      dispatch(getCourses({ page, pagesize, search: e.target.value }));
      setSearch(e.target.value);
    }
  };

  const handleClick = (e) =>
    dispatch(getCourses({ page, pagesize, search: e.target.value }));

  const handleCloseSnack = () => {
    setServerError(false);
    setServerSuccess(false);
  };

  

  const rows = data && data.courses.length !== 0 ? data.courses.map((row, i) => {
      return createData(
        (pagesize * (data.page + 1)) + i - 9,
        row.title,
        row.description,
        row.fee && <span> £{row.fee} </span>,
        <Enrol allowEnrol={enrolled} row={row} />
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
      <Grid item xs={12} sm={12} md={6}>
        <div className="table-title">Courses</div>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
              <input 
                type="search" 
                id="search" 
                name="search"
                value={search}
                onChange={handleSearch}
                placeholder="Search"
                onKeyUp={handleKeyUp}
                onClick={handleClick}
                className="course-search"
              />
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
          <Divider />
          <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={data?.total_count || 0}
          rowsPerPage={pagesize}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          />
          </Paper>
        </Grid>
      }

    </div>
  );
}

export default Courses;