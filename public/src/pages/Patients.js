import React, {useState,useEffect} from 'react'
import { DataGrid } from '@material-ui/data-grid';
import {Button, TextField} from '@material-ui/core'
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, Formik } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import axios from "axios";
import { MenuItem } from 'material-ui';
import Autocomplete from '@material-ui/lab/Autocomplete';
import 'react-notifications/lib/notifications.css';
import Checkbox from '@material-ui/core/Checkbox';


function Patients() {
    const [patients, setpatients] = useState([])
    const [open, setopen] = useState(false)
    const [availtherapy, setavailtherapy] = useState(true)
    const handleTherapy = (event) => {

        setavailtherapy(event.target.checked);
      };


    const handleClose = () => {
        setopen(false);
      };

    function currentlySelected(params) {
        console.log(params)
    }
    const baseUrl = 'https://7832-206-84-181-28.ngrok.io'


    useEffect(async () => {
        await fetch(`${baseUrl}/api/v1/patients`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(data.data.data)
                setpatients(data.data.data)
            })
            .catch(err => console.log(err.message))

    },[])
    const therapyAreas = ['Speech Therapy', 'Physical Therapy', 'Occupational Therapy']

    const patientSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        age: Yup.number().integer().min(0).max(6.5).required('Age is required must be greater than 0 and less than 6.5'),
        gender: Yup.string().required('Gender is required'),
        guardianName: Yup.string().required('Guardian Name is required'),
        guardianCNIC: Yup.string().required('Guardian CNIC is required'),
        sessionFrequency: Yup.string().when('availtherapy',{
            is: true,
            then: Yup.string().required('Session frequency is required'),
        }),
        availtherapy: Yup.boolean().oneOf([true, false]),
        totalSessions: Yup.number().integer().min(0).max(100).when('availtherapy',{
            is: true,
            then: Yup.number().integer().min(0).max(100).required('Total sessions are required, must be greater than 0 and less than 100')
        }),
        remarks: Yup.string().required('Remarks are required'),
        address: Yup.string().required('Address is required'),
        weight: Yup.string().required('Weight is required'),
        height: Yup.string().required('Height is required'),
        therapyAreas: Yup.array().min(1).when('availtherapy',{
            is: true,
            then: Yup.array().min(1).required('Therapy Areas is required'),
        })

      });



    const columns = [
        {field: 'fullName', headerName: 'Patient Name', width: 200},
        {field: 'age', headerName: 'Age', width: 150},
        {field: 'gender', headerName: 'Gender', width: 150}, 
        {field: 'therapyAreas', headerName: 'Therapy Areas', width: 400},
        {field: 'weight', headerName: 'Weight', width: 150}, 
        {field: 'height', headerName: 'Height', width: 150}, 
        {field: 'guardianFullName', headerName: 'Guardian', width: 150},
        {field: 'guardianCNIC', headerName: 'Guardian CNIC', width: 200},
        {field: 'address', headerName: 'Address', width: 200},

    ]


    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
            <h1 style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', marginLeft: '1rem'}}>Patients</h1>
            <Button style={{width: '15rem', height: '3rem', backgroundColor: '#0055b3'}} onClick={() => setopen(true)} variant='contained'>Add Patient</Button>
            </div>
            <Dialog
    fullWidth={true}
    maxWidth='lg' 
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle style={{display: 'flex', justifyContent: 'center'}} id="alert-dialog-title">Add Patient</DialogTitle>
   <Formik initialValues={{
       name: '',
       age: '',
       gender: '',
       guardianName: '',
       guardianCNIC: '',
       address: '',
       therapyAreas: [],
       weight: '',
       height: '',
       sessionFrequency: '',
       totalSessions: '',
       remarks: '',
       availtherapy: true

   }}
   onSubmit = {async values => {
    // setopen(false)

    if(values.therapyAreas)
    values.therapyAreas = values.therapyAreas[values.therapyAreas.length-1]
   
    const response = await fetch(`${baseUrl}/api/v1/patients`,{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({fullName: values.name, age: values.age, address: values.address, gender: values.gender, guardianFullName: values.guardianName, guardianCNIC: values.guardianCNIC, therapyAreas: values.therapyAreas, weight: values.weight, height: values.height, sessionFrequency: values.sessionFrequency, totalSessions: values.totalSessions, remarks: values.remarks, availtherapy: availtherapy})
    })
    const data = await response.json();
    console.log(data)
    if(data.status === 'success')
    {
        NotificationManager.success('Patient added successfully', 'Success');
      
            setTimeout(() => {
                window.location.reload()
            }, 2000);
    }
    else
    {
        NotificationManager.error(`There was an error while adding patient`, 'Error');
    }

  
   }}
   validationSchema={patientSchema}
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
   label="Patient name"
   value={formik.values.name}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.name && formik.errors.name)}
   helperText={formik.touched.name && formik.errors.name}
 />
  <TextField style={{marginRight: '1rem'}}
   autoComplete="age"
   type="age"
   id="age"
   name="age"
   InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
   label="Age"
   value={formik.values.age}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.age && formik.errors.age)}
   helperText={formik.touched.age && formik.errors.age}
 />
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
   <TextField style={{marginRight: '1rem'}}
   autoComplete="guardianName"
   type="guardianName"
   id="guardianName"
   name="guardianName"
   InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
   label="Guardian Name"
   value={formik.values.guardianName}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.guardianName && formik.errors.guardianName)}
   helperText={formik.touched.guardianName && formik.errors.guardianName}
 />
    <TextField style={{marginRight: '1rem'}}
   autoComplete="guardianCNIC"
   type="guardianCNIC"
   id="guardianCNIC"
   name="guardianCNIC"
   InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
   label="Guardian CNIC"
   value={formik.values.guardianCNIC}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.guardianCNIC && formik.errors.guardianCNIC)}
   helperText={formik.touched.guardianCNIC && formik.errors.guardianCNIC}
 />
  
 
    </div>
    <div style={{display: 'flex', marginTop: '2rem', marginLeft: '2rem', marginLeft: '2rem'}}>

 
    <TextField style={{marginRight: '1rem'}}
   autoComplete="address"
   type="address"
   id="address"
   name="address"
   InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
   label="Address"
   value={formik.values.address}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.address && formik.errors.address)}
   helperText={formik.touched.address && formik.errors.address}
 />

 
         <TextField style={{marginRight: '1rem'}}
   autoComplete="weight"
   type="weight"
   id="weight"
   name="weight"
   InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
   label="Weight"
   value={formik.values.weight}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.weight && formik.errors.weight)}
   helperText={formik.touched.weight && formik.errors.weight}
 />
   <TextField style={{marginRight: '1rem'}}
   autoComplete="height"
   type="height"
   id="height"
   name="height"
   InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
   label="Height"
   value={formik.values.height}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.height && formik.errors.height)}
   helperText={formik.touched.height && formik.errors.height}
 />
     <TextField style={{width: '20rem'}}
                    label="Please add your remarks"
                    multiline
                    id='remarks'
                    maxRows={4}
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    error={Boolean(formik.touched.remarks && formik.errors.remarks)}
                    helperText={formik.touched.remarks && formik.errors.remarks}
                    />

      <Checkbox style={{color: '#ffaa1d', marginLeft: '1rem'}}
                    checked={availtherapy}
                    value={availtherapy}
                    onChange={e => {handleTherapy(e); formik.setFieldValue('availtherapy', e.target.value)}}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                <div style={{marginTop: '1.8rem', fontSize: '0.7rem', fontWeight: '100'}}>availTherapy</div>
  
    </div>
    

   <div style={{display: 'flex', marginLeft: '2rem', marginLeft: '2rem'}}>




        {availtherapy? (
    <div style={{display: 'flex', marginTop: '2rem'}}>

   <Autocomplete style={{width: '37rem', marginRight: '1rem'}}
   multiple
   id="therapyAreas"
   options={therapyAreas}
   onChange={(event, value) => formik.values.therapyAreas.push(value)}
   getOptionLabel={(option) => option}
   renderInput={(params) => (
   <TextField
   {...params}
   variant="standard"
   error={Boolean(formik.touched.therapyAreas && formik.errors.therapyAreas)}
   helperText={formik.touched.therapyAreas && formik.errors.therapyAreas}
   value={formik.values.therapyAreas}
   label="Therapy Areas"
   placeholder="You may select multiple therapyAreas"
   />
   )}
   />
       <FormControl style={{width: '12rem', marginRight: '1rem'}}>
       <InputLabel id="sessionFrequency">Session frequency</InputLabel>
       <Select
       id="sessionFrequency"
       name="sessionFrequency"
       value={formik.values.sessionFrequency}
       onChange={formik.handleChange}
       error={formik.touched.sessionFrequency && Boolean(formik.errors.sessionFrequency)}
       helperText={formik.touched.sessionFrequency && formik.errors.sessionFrequency}
       >
      <MenuItem value='Weekly'>Weekly</MenuItem>
      <MenuItem value='Bi-weekly'>Bi-weekly</MenuItem>
      <MenuItem value='Monthly'>Monthly</MenuItem>
   
       </Select>
   </FormControl>
   <TextField style={{marginRight: '1rem', width: '9rem'}}
   autoComplete="totalSessions"
   type="totalSessions"
   id="totalSessions"
   name="totalSessions"
   InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
   label="Total sessions"
   value={formik.values.totalSessions}
   onChange={formik.handleChange}
   error={Boolean(formik.touched.totalSessions && formik.errors.totalSessions)}
   helperText={formik.touched.totalSessions && formik.errors.totalSessions}
 />
   </div>
        ):(<div></div>)}


</div>
    <div style={{display: 'flex', justifyContent: 'center'}}>
   <Button style={{width: '15rem', height: '3rem', backgroundColor: '#0055b3', marginTop: '2rem', marginBottom: '2rem'}} type="submit"  variant='contained'>Add Patient</Button>
   </div>
    </form>}
    </Formik>
</Dialog>
             {patients.length > 0? (
            <div style={{height: 650, width: '100%'}}>
                <DataGrid style={{marginLeft: '1rem'}}
                    rows={patients}
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

export default Patients
