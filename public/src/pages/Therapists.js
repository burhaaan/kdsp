import React, {useState,useEffect} from 'react'
import { DataGrid } from '@material-ui/data-grid';
import {Button, TextField} from '@material-ui/core'
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, Formik } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { MenuItem } from 'material-ui';
import Autocomplete from '@material-ui/lab/Autocomplete';
import 'react-notifications/lib/notifications.css';


function Therapists() {
    const [therapists, settherapists] = useState([])
    const [open, setopen] = useState(false)
    const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleChange = (newValue) => {
    setValue(newValue);
    console.log(newValue)
  };
  const baseUrl = 'https://7832-206-84-181-28.ngrok.io'

    const handleClose = () => {
        setopen(false);
      };

    function currentlySelected(params) {
        console.log(params)
    }


    useEffect(async () => {
        await fetch(`${baseUrl}/api/v1/therapists`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(data.data.data)
                settherapists(data.data.data)
            })
            .catch(err => console.log(err.message))

    },[])
    const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const therapistSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        gender: Yup.string().required('Gender is required'),
        email: Yup.string().required('Email is required'),
        workingHours: Yup.string().required('Working Hours is required'),
        department: Yup.string().required('Department is required'),
        workingDays: Yup.array().min(1).required('Working Days is required'),

        // address: Yup.string().required('address is required'),
        // weight: Yup.string().required('weight is required'),
        // height: Yup.string().required('height is required'),
        // therapyAreas: Yup.array().required('therapyAreas is required'),

      });



    const columns = [
        {field: 'fullName', headerName: 'Therapist Name', width: 200},
        {field: 'email', headerName: 'Email', width: 200},
        {field: 'gender', headerName: 'Gender', width: 150},
        {field: 'therapistDept', headerName: 'Department', width: 200},
        {field: 'workingDays', headerName: 'Working Days', width: 250},

    ]


    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
            <h1 style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', marginLeft: '1rem'}}>Therapists</h1>
            <Button style={{width: '15rem', height: '3rem', backgroundColor: '#0055b3'}} onClick={() => setopen(true)} variant='contained'>Add Therapist</Button>
            </div>
            <Dialog
    fullWidth={true}
    maxWidth='lg' 
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle style={{display: 'flex', justifyContent: 'center'}} id="alert-dialog-title">Add Therapist</DialogTitle>
   <Formik initialValues={{
       name: '',
       email: '',
       gender: '',
       workingHours: '',
       department: '',
       workingDays: [],

   }}
   onSubmit = {async values => {
    setopen(false)

    if(values.workingDays)
    values.workingDays = values.workingDays[values.workingDays.length-1]
    console.log(values)
   
    const response = await fetch(`${baseUrl}/api/v1/therapists`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({fullName: values.name, gender: values.gender, email: values.email, therapistDept: values.department, workingDays: values.workingDays, workingHours: values.workingHours})
    })
    const data = await response.json();
    console.log(data.status)
    if(data.status === 'success')
    {
        NotificationManager.success('Therapist added successfully', 'Success');
      
            setTimeout(() => {
                window.location.reload()
            }, 2000);
    }
    else
    {
        NotificationManager.error(`There was an error while adding patient`, 'Error');
    }

  
   }}
   validationSchema={therapistSchema}
   >

       {(formik) => 
       <form onSubmit={formik.handleSubmit}> 

   <div style={{display: 'flex', marginTop: '1rem', marginLeft: '2rem', marginLeft: '2rem'}}>
   <TextField style={{marginRight: '1rem'}}
   autoComplete="name"
   type="name"
   id="name"
   name="name"
   InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
   label="Therapist name"
   value={formik.values.name}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.name && formik.errors.name)}
   helperText={formik.touched.name && formik.errors.name}
 />
  <TextField style={{marginRight: '1rem'}}
   autoComplete="email"
   type="email"
   id="email"
   name="email"
   InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
   label="Email"
   value={formik.values.email}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.email && formik.errors.email)}
   helperText={formik.touched.email && formik.errors.email}
 />
 

    <Autocomplete style={{width: '50rem', marginRight: '1rem'}}
       multiple
       id="workingDays"
       options={workingDays}
       onChange={(event, value) => formik.values.workingDays.push(value)}
       getOptionLabel={(option) => option}
       renderInput={(params) => (
       <TextField
       {...params}
       variant="standard"
       error={Boolean(formik.touched.workingDays && formik.errors.workingDays)}
       helperText={formik.touched.workingDays && formik.errors.workingDays}
       value={formik.values.workingDays}
       label="Working Days"
       placeholder="You may select multiple working days"
       />
       )}
       />
       </div>

    <div style={{display: 'flex', marginTop: '2rem', marginLeft: '2rem', marginLeft: '2rem'}}>

        <FormControl style={{width: '20rem', marginRight: '1rem'}}>
       <InputLabel id="department">Therapist department</InputLabel>
       <Select
       id="department"
       name="department"
       value={formik.values.department}
       onChange={formik.handleChange}
       error={formik.touched.department && Boolean(formik.errors.department)}
       helperText={formik.touched.department && formik.errors.department}
       >
      <MenuItem value='Speech Therapy'>Speech Therapy</MenuItem>
      <MenuItem value='Physical Therapy'>Physical Therapy</MenuItem>
      <MenuItem value='Occupational Therapy'>Occupational Therapy</MenuItem>
   
       </Select>
   </FormControl>

   <FormControl style={{width: '20rem', marginRight: '1rem'}}>
       <InputLabel id="workingHours">Working Hours</InputLabel>
       <Select
       id="workingHours"
       name="workingHours"
       value={formik.values.workingHours}
       onChange={formik.handleChange}
       error={formik.touched.workingHours && Boolean(formik.errors.workingHours)}
       helperText={formik.touched.workingHours && formik.errors.workingHours}
       >
      <MenuItem value='9am - 5pm'>9am - 5pm</MenuItem>
      <MenuItem value='10am - 6pm'>10am - 6pm</MenuItem>
      <MenuItem value='11am - 7pm'>11am - 7pm</MenuItem>
   
       </Select>
   </FormControl>

   <FormControl style={{width: '15rem', marginRight: '1rem'}}>
       <InputLabel id="gender">Gender</InputLabel>
       <Select
       id="gender"
       name="gender"
       value={formik.values.gender}
       onChange={formik.handleChange}
       error={formik.touched.gender && Boolean(formik.errors.gender)}
       helperText={formik.touched.gender && formik.errors.gender}
       >
      <MenuItem value='Male'>Male</MenuItem>
      <MenuItem value='Female'>Female</MenuItem>
      <MenuItem value='Other'>Other</MenuItem>
   
       </Select>
   </FormControl>

    



    </div>

    <div style={{display: 'flex', justifyContent: 'center'}}>
   <Button style={{width: '15rem', height: '3rem', backgroundColor: '#0055b3', marginTop: '2rem', marginBottom: '2rem'}} type="submit"  variant='contained'>Add </Button>
   </div>
    </form>}
    </Formik>
</Dialog>
             {therapists.length > 0? (
            <div style={{height: 650, width: '100%'}}>
                <DataGrid style={{marginLeft: '1rem'}}
                    rows={therapists}
                    getRowId={(row) => row._id}
                    columns={columns}
                    pageSize={10}
                    onCellClick={currentlySelected}

                />
                 </div>):(<div>loading...</div>)}
                 <NotificationContainer/>
        </div>
    )
}

export default Therapists
