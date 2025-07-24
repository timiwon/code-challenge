import {
    Box,
    Typography,
} from "@mui/material";
import { TextSkeleton } from "./Skeletons";
import { calcCurrencyRate } from "../../lib/utils";
import type { Currency } from "../../types";

interface RateComponentProps {
    isLoading: boolean;
    currencyFrom?: Currency;
    currencyTo?: Currency;
}
const RateComponent = ({isLoading, currencyFrom, currencyTo}: RateComponentProps) => {
    return (<>
        {(isLoading || !currencyTo || !currencyFrom) && (<Box sx={{ height: '25px', width: '200px' }}>
            <TextSkeleton />
        </Box>)}

        {!isLoading && currencyTo && currencyFrom && (<Box sx={{ height: '25px', width: '300px' }}>
            <Typography variant="subtitle2">
                {`1 ${currencyFrom.currency} = ${calcCurrencyRate(currencyTo.price, currencyFrom.price)} ${currencyTo.currency}`}
            </Typography>
        </Box>)}
    </>);
};

export default RateComponent;