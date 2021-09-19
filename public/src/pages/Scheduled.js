import React, {useState,useEffect} from 'react'
import { DataGrid } from '@material-ui/data-grid';

function Scheduled() {
    const [list, setlist] = useState([])
  const baseUrl = 'https://7832-206-84-181-28.ngrok.io'

  const columns = [
    {field: 'patientName', headerName: 'Patient Name', width: 200},
    {field: 'therapistName', headerName: 'Therapist Name', width: 200},
    {field: 'scheduledDate', headerName: 'Scheduled date', width: 200},
    {field: 'scheduledTime', headerName: 'Scheduled time', width: 200},


]
    useEffect(async () => {
        await fetch(`${baseUrl}/api/v1/scheduledlist`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
        })
            .then((data) => data.json())
            .then((data) => {
                console.log(data)
                setlist(data.data.data)
            })
            .catch(err => console.log(err.message))

    },[])
    return (
        <div>
             <div>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
            <h1 style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', marginLeft: '1rem'}}>Scheduled list</h1>
            </div>
            {list.length > 0? (
            <div style={{height: 650, width: '100%'}}>
                <DataGrid style={{marginLeft: '1rem'}}
                    rows={list}
                    getRowId={(row) => row._id}
                    columns={columns}
                    pageSize={10}

                />
                 </div>):(<div>loading...</div>)}
        </div>
        </div>
    )
}

export default Scheduled
