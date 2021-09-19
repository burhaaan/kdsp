import React, {useState,useEffect} from 'react'
import androidFilled from '@iconify/icons-ant-design/android-filled';
import { Icon } from '@iconify/react';
// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

// const TOTAL = 71;

export default function AppWeeklySales() {
  const [patients, setpatients] = useState('')
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
            setpatients(data.data.data.length)
        })
        .catch(err => console.log(err.message))

},[])
  return (
    <RootStyle>
      <IconWrapperStyle>
        {/* <Icon icon={androidFilled} width={24} height={24} /> */}
        <Icon icon="medical-icon:i-outpatient" />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(patients)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Total Patients
      </Typography>
    </RootStyle>
  );
}
