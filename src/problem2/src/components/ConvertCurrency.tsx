import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { uniqBy } from "lodash";

import {
    Paper,
    Container,
    Grid,
    Typography,
    Box,
    IconButton,
} from "@mui/material";
import ImportExportOutlinedIcon from '@mui/icons-material/ImportExportOutlined';

import { fetchRate } from "../api";
import InputCurrency from "./InputCurrency";
import type { Currency } from "../types";
import { DELAY_TIME } from "../lib/constants";
import { calcCurrencyRate, convertCurrency, isParsableNumber } from "../lib/utils";
import RateComponent from "./ui/RateComponent";

const ConvertCurrentcy = () => {
    const { isPending, data } = useQuery<Currency[]>({
        queryKey: ['fetchRates'],
        queryFn: fetchRate,
    });

    const [isConverting, setIsConverting] = useState(false);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currencyFrom, setCurrencyFrom] = useState<Currency | undefined>(undefined);
    const [from, setFrom] = useState<string>('');
    const [currencyTo, setCurrencyTo] = useState<Currency | undefined>(undefined);
    const [to, setTo] = useState<string>('');

    const [isSwitch, setIsSwitch] = useState(false);

    const releaseLoading = () => {
        setTimeout(() => {
            setIsLoading(false);
        }, DELAY_TIME);
    };

    const switchCurrency = () => {
        let iFrom = from;
        let iCF = currencyFrom;

        if (from === to && currencyFrom?.currency === currencyTo?.currency) {
            return;
        }

        setIsLoading(true);
        setIsSwitch(true);
        setFrom(to);
        setCurrencyFrom(currencyTo);
        setTo(iFrom);
        setCurrencyTo(iCF);
    };

    const doneSwitching = () => {
        setIsSwitch(false);
        releaseLoading();
    }

    useEffect(() => {
        doneSwitching();
    }, [from, to, currencyFrom, currencyTo]);

    useEffect(() => {
        setIsLoading(true);

        if (!isPending) {
            releaseLoading();
        }
    }, [isPending]);

    useEffect(() => {
        let list = uniqBy(data, 'currency');
        setCurrencies(list);

        if (list.length <= 0) {
            return;
        }

        if (!currencyFrom) {
            setTimeout(() => {
                setCurrencyFrom(list[0]);
            }, DELAY_TIME);
        }
        if (!currencyTo) {
            setTimeout(() => {
                setCurrencyTo(list[0]);
            }, DELAY_TIME);
        }
    }, [data]);

    useEffect(() => {
        if (isConverting) {
            setIsConverting(false);
            return;
        }

        if (isSwitch || !currencyFrom || !currencyTo) {
            return;
        }

        if (isParsableNumber(from)) {
            setIsConverting(true);
            return setTo(`${convertCurrency(Number(from), calcCurrencyRate(currencyTo.price, currencyFrom.price))}`);
        }

        if (isParsableNumber(to)) {
            setIsConverting(true);
            return setFrom(`${convertCurrency(Number(to), calcCurrencyRate(currencyFrom.price, currencyTo.price))}`);
        }
    }, [currencyFrom, currencyTo]);

    useEffect(() => {
        if (isConverting) {
            setIsConverting(false);
            return;
        }

        if (isSwitch || !isParsableNumber(from) || !currencyFrom || !currencyTo) {
            return;
        }

        const converted = `${convertCurrency(Number(from), calcCurrencyRate(currencyTo.price, currencyFrom.price))}`;
        // make sure reach set converted to false in 'to' trigger
        if(to !== converted) {
            setIsConverting(true);
            setTo(converted);
        }
    }, [from]);

    useEffect(() => {
        if (isConverting) {
            setIsConverting(false);
            return;
        }

        if (isSwitch || !isParsableNumber(to) || !currencyFrom || !currencyTo) {
            return;
        }

        const converted = `${convertCurrency(Number(to), calcCurrencyRate(currencyFrom.price, currencyTo.price))}`;
        // make sure reach set converted to false in 'from' trigger
        if (from !== converted) {
            setIsConverting(true);
            setFrom(converted);
        }
    }, [to]);

    return (<Container maxWidth="sm">
        <Paper sx={{
            padding: '10px'
        }}>
            <Grid container>
                <Grid size={12}>
                    <Typography variant="h6">market exchange rate</Typography>
                </Grid>
                <Grid size={12} sx={{display: 'flex', justifyContent: 'center'}}>
                    <RateComponent isLoading={isLoading} currencyFrom={currencyFrom} currencyTo={currencyTo} />
                </Grid>
                <Grid size={12}>
                    <Box sx={{padding: '1rem'}}>
                        <InputCurrency
                            id="outlined-from-input"
                            label="Amount"
                            value={from}
                            currencySelected={currencyFrom}
                            currencies={currencies}
                            onChange={(amount) => setFrom(amount)}
                            onCurrencyChange={(currency) => setCurrencyFrom(currency)}
                        />
                    </Box>
                </Grid>
                <Grid size={12}>
                    <IconButton sx={{
                        color: (theme) => theme.palette.success.main,
                        backgroundColor: (theme) => theme.palette.success.light,
                        "&:hover": {
                            color: "#fff",
                            backgroundColor: (theme) => theme.palette.success.main,
                        },
                        "&:focus": {
                            outline: 'none'
                        }
                    }} onClick={switchCurrency}>
                        <ImportExportOutlinedIcon />
                    </IconButton>
                </Grid>
                <Grid size={12}>
                    <Box sx={{padding: '1rem'}}>
                        <InputCurrency
                            id="outlined-to-input"
                            label="Converted to"
                            value={to}
                            currencySelected={currencyTo}
                            currencies={currencies}
                            onChange={(amount) => setTo(amount)}
                            onCurrencyChange={(currency) => setCurrencyTo(currency)}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    </Container>);
};
export default ConvertCurrentcy