import React, {useState,useEffect} from 'react'
import { DataGrid } from '@material-ui/data-grid';
import {Button, TextField} from '@material-ui/core'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import 'react-notifications/lib/notifications.css';

function Waitlist() {
    const [waitlist, setwaitlist] = useState([])
    const [pid, setpid] = useState('')
    const [open, setopen] = useState(false)
    const [therapistname, settherapistname] = useState('')
    const [timeslot, settimeslot] = useState('')
    const [date, setdate] = useState('')
  const baseUrl = 'https://7832-206-84-181-28.ngrok.io'

  function handleApprove() {
      setopen(false)
        NotificationManager.success('Your slot is being confirmed', 'Processing');
        fetch(`${baseUrl}/api/v1/scheduledlist`,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({patientID: pid, therapistName: therapistname, scheduledDate: date, scheduledTime: timeslot})
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success')
            {
                NotificationManager.success('Slot booked successfully', 'Success');
              
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000);
            }
            else
            {
                NotificationManager.error(`There was an error while booking slot`, 'Error');
            }
        })
       
      
  }
  const handleClose = () => {
    setopen(false);
  };

    function currentlySelected(params) {
        console.log(params.row.patientID)
        setpid(params.row.patientID)
        const value = params.colDef.field;

        if(value === 'schedule')
           {
               setopen(true)
               fetch(`${baseUrl}/api/v1/patients/${pid}/getfreeslot`,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    },
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.data.data)
                settherapistname(data.data.data.fullName)
                settimeslot(data.data.data.timeSlot)
                setdate(data.data.data.Date)
            })
            .catch(err => console.log(err))
            // if(data.status === 'success')
            // {
            //     NotificationManager.success('Therapist added successfully', 'Success');
              
            //         setTimeout(() => {
            //             window.location.reload()
            //         }, 2000);
            // }
            // else
            // {
            //     NotificationManager.error(`There was an error while adding patient`, 'Error');
            // }
            
           }
    }

    function renderSchedule() {
        return(
            <div>
            <Button
            variant="contained"
            size="small"
        >
            Get schedule
        </Button>
        </div>
        ) 
    }


    useEffect(async () => {
        await fetch(`${baseUrl}/api/v1/waitlist`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(data.data.data)
                setwaitlist(data.data.data)
            })
            .catch(err => console.log(err.message))

    },[])




    const columns = [
        {field: 'patientName', headerName: 'Patient Name', width: 200},
        {field: 'type', headerName: 'Therapy type', width: 200},
        {field: 'status', headerName: 'Status', width: 150},
        {field: 'sessionFrequency', headerName: 'Session Frequency', width: 250},
        {field: 'totalSessions', headerName: 'Total sessions', width: 250},
        {field: 'schedule', headerName: 'Schedule', width: 200, renderCell: renderSchedule},

    ]


    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
            <h1 style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', marginLeft: '1rem'}}>Waitlist</h1>
            </div>

            <Dialog
                maxWidth='lg' 
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
            <DialogTitle style={{display: 'flex', justifyContent: 'center'}} id="alert-dialog-title">Provider Request</DialogTitle>
            <div style={{display: 'flex', marginBottom: '2rem', justifyContent: 'center', marginLeft: '2rem', marginRight: '2rem'}}>
            <TextField style={{marginRight: '1rem', marginTop: '2rem'}}
                InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
                label="Therapist name"
                value={therapistname}
                />
                 <TextField style={{marginRight: '1rem', marginTop: '2rem'}}
                InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
                label="Time slot"
                value={timeslot}
                />
                     <TextField style={{marginRight: '1rem', marginTop: '2rem'}}
                InputLabelProps={{style: {fontSize: 13, marginTop: '0.2rem'}}}
                label="Date"
                value={date}
                />
              
            </div>
            <DialogActions>
                <div style={{margin: 'auto'}}>
                <Button type="submit" onClick={handleApprove} color="primary">
                    Confirm
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                    Close
                </Button>
                </div>
                </DialogActions>
            </Dialog>
           
             {waitlist.length > 0? (
            <div style={{height: 650, width: '100%'}}>
                <DataGrid style={{marginLeft: '1rem'}}
                    rows={waitlist}
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

export default Waitlist
