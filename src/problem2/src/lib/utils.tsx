import {isNaN, isFinite, round, some} from 'lodash';

export const isParsableNumber = (value?: string) => {
    if (!value || some(value, char => /[a-zA-Z]/.test(char))) {
        return false;
    }

    return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
}

export const calcCurrencyRate = (priceFrom: number, priceTo: number) => {
    // parseFloat handles both integers and floats
    return round(priceTo / priceFrom, 4);
}

export const convertCurrency = (amount: number, rate: number) => {
    return round(amount * rate, 4);
};