import { useEffect, useState } from "react";
import { filter, includes, lowerCase, isEmpty } from 'lodash';

import {
    Popover,
    Box,
    Grid,
    TextField,
    InputAdornment,
    Typography,
} from "@mui/material";
import {
    CheckOutlined,
    KeyboardArrowDownOutlined,
    SearchOutlined
} from '@mui/icons-material';
import { grey } from '@mui/material/colors';
import type { Currency } from "../types";
import { DELAY_TIME, ICON_URL_PREFIX } from "../lib/constants";
import { isParsableNumber } from "../lib/utils";
import { TextFieldFocused } from "./ui/StyledComponents";
import { CurrencySkeleton, EmptyCurrency } from "./ui/Skeletons";

interface InputProps {
    id?: string;
    label?: string;
    value?: string;
    currencySelected?: Currency;
    currencies: Currency[];
    onChange: (val: string) => void;
    onCurrencyChange: (val: Currency) => void;
};
const InputCurrency = ({
    id,
    label,
    value,
    currencySelected,
    currencies,
    onChange,
    onCurrencyChange
}: InputProps) => {
    const [isError, setIsError] = useState(false);

    const currencySelectedHandler = (data: Currency) => {
        onCurrencyChange(data);
    };

    const onAmountChangeHandler = (val: string) => {
        onChange(val);
    };

    useEffect(() => {
        setIsError(!isParsableNumber(value));
    }, [value]);

    return (
        <TextFieldFocused
            error={isError && !isEmpty(value)}
            focused
            fullWidth
            label={label}
            id={id}
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                onAmountChangeHandler(event.target.value);
            }}
            slotProps={{
                input: {
                    endAdornment: <InputAdornment position="end">
                        <CurrencySelect
                            value={currencySelected}
                            options={currencies}
                            onChange={currencySelectedHandler}
                        />
                    </InputAdornment>,
                },
            }}
        />);
};

interface CurrencySelectProps {
    value?: Currency;
    options: Currency[];
    onChange: (currency: Currency) => void;
}
const CurrencySelect = ({value, options, onChange}: CurrencySelectProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [displayOptions, setDisplayOptions] = useState<Currency[]>([]);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSearchHandler = (val: string) => {
        if (!options) {
            return;
        }

        if (isEmpty(val)) {
            return setDisplayOptions(options);
        }

        setDisplayOptions(filter(options, (option: Currency) => {
            return includes(lowerCase(option.currency), lowerCase(val));
        }));
    };

    const onSelectedCurrencyHandler = (currency: Currency) => {
        onChange(currency);
    };

    useEffect(() => {
        setDisplayOptions(options);
    }, [options]);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, DELAY_TIME);
    }, [anchorEl, displayOptions])

    return (<>
        <Box sx={{width: '100px'}} onClick={handleClick}>
            {!value && <CurrencySkeleton count={1} />}
            {value && <Grid container sx={{ cursor: 'pointer' }}>
                <Grid size={3} sx={{ display: 'flex' }}>
                    <img src={`${ICON_URL_PREFIX}${value.currency}.svg`} onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = `${ICON_URL_PREFIX}1INCH.svg`;
                    }} />
                </Grid>
                <Grid size={7} sx={{ textAlign: 'left', paddingLeft: '0.5rem' }}>
                    <Typography variant="h6" fontSize={'1rem'} noWrap
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>{value.currency}</Typography>
                </Grid>
                <Grid size={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <KeyboardArrowDownOutlined fontSize="medium" />
                </Grid>
            </Grid>}
        </Box>
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box sx={{ width: '200px', padding: '10px' }}>
                <TextField
                    fullWidth
                    size="small"
                    label={'Search'}
                    id="search-outlined-start-adornment"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        onSearchHandler(event.target.value);
                    }}
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="start">
                                <SearchOutlined />
                            </InputAdornment>,
                        },
                    }}
                />
                <Box sx={{
                    marginTop: '10px',
                    height: '200px',
                    overflowY: 'auto',
                }}>
                    {isLoading && (<CurrencySkeleton count={3} />)}
                    {!isLoading && (!displayOptions || displayOptions.length <= 0) && <EmptyCurrency />}
                    {!isLoading && displayOptions && displayOptions.map(option => <Grid key={option.currency}
                        container
                        sx={{
                            padding: '10px',
                            border: '1px solid #fff',
                            borderRadius: '5px',
                            "&:hover": {
                                cursor: 'pointer',
                                border: (theme) => `1px solid ${theme.palette.divider}`
                            }
                        }} onClick={() => {
                            onSelectedCurrencyHandler(option);
                        }}>
                        <Grid size={10} sx={{ display: 'inline-flex', alignItems: 'center' }}>
                            <img src={`${ICON_URL_PREFIX}${option.currency}.svg`} onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = `${ICON_URL_PREFIX}1INCH.svg`;
                            }} />
                            <Typography variant="body2" sx={{ marginLeft: '0.5rem' }}>{option.currency}</Typography>
                        </Grid>
                        <Grid size={2}>
                            {lowerCase(value?.currency) === lowerCase(option.currency) && <CheckOutlined fontSize="small" sx={{
                                color: grey[500]
                            }} />}
                        </Grid>
                    </Grid>)}
                </Box>
            </Box>
        </Popover>
    </>);
}

export default InputCurrency;