
'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { th } from 'date-fns/locale';

export default function DateProvider({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
      {children}
    </LocalizationProvider>
  );
}