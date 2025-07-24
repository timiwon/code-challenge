import { TextField, styled } from '@mui/material';

export const TextFieldFocused = styled(TextField)(({ theme }) => {
    return {
        ['& label.Mui-focused']: {
            color: theme.palette.grey[800],
        },
        ['& label.Mui-error']: {
            color: 'red',
        },
        ['& .MuiOutlinedInput-root']: {
            ['&.Mui-focused fieldset']: {
                borderColor: theme.palette.grey[800],
                borderWidth: '1px'
            },
            ['&.Mui-error fieldset']: {
                borderColor: 'red',
                borderWidth: '1px'
            }
        },
    };
})