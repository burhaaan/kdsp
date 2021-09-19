import { Icon } from '@iconify/react';
import windowsFilled from '@iconify/icons-ant-design/windows-filled';
import React, {useState,useEffect} from 'react'

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
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
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
  color: theme.palette.warning.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 1723315;

export default function AppItemOrders() {
  const [waitlist, setwaitlist] = useState('')
  const baseUrl = 'https://7832-206-84-181-28.ngrok.io'

  useEffect(async () => {
    await fetch(`${baseUrl}/api/v1/waitlist`,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
    })
        .then((data) => data.json())
        .then((data) => {
            setwaitlist(data.data.data.length)
            console.log(data.data.data.length)

        })
        .catch(err => console.log(err.message))

},[])
  return (
    <RootStyle>
      <IconWrapperStyle>
      <Icon icon="mdi:human-queue" width={24} height={24} />

        {/* <Icon icon={windowsFilled} width={24} height={24} /> */}
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(waitlist)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Total patients on waitlist
      </Typography>
    </RootStyle>
  );
}
