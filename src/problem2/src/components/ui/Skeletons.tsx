import {
    Box,
    Grid,
    Skeleton,
    Typography,
} from "@mui/material";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { useEffect, useState } from "react";

interface CurrencySkeletonProps {
    count: number;
}
export const CurrencySkeleton = ({ count }: CurrencySkeletonProps) => {
    const [items, setItems] = useState([1]);

    if (count === 1) {
        return (<Grid container sx={{ width: '100%' }} rowSpacing={1}>
            <Grid size={12}>
                <Box sx={{ width: '100%', display: 'inline-flex', alignItems: 'center' }}>
                    <Skeleton variant="circular" sx={{ width: '24px', height: '24px' }} />
                    <Skeleton variant="text" sx={{ width: '60%', height: '1.5rem', marginLeft: '0.5rem' }} />
                </Box>
            </Grid>
        </Grid>)
    }

    useEffect(() => {
        const start = 1;
        setItems(Array.from({ length: count - start + 1 }, (_, i) => start + i));
    }, [count]);

    return items.map(item => (<Grid key={item} container sx={{
        width: '100%',
        padding: '10px',
        border: '1px solid #fff',
        borderRadius: '5px',
    }}>
        <Grid size={12} sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <Skeleton variant="circular" sx={{ width: '24px', height: '24px' }} />
            <Skeleton variant="text" sx={{ width: '50%', height: '1.5rem', marginLeft: '0.5rem' }} />
        </Grid>
    </Grid>))
};

export const TextSkeleton = () => {
    return <Skeleton variant="text" sx={{ width: '100%', fontSize: '1rem' }} />;
};

export const EmptyCurrency = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                textAlign: 'center',
            }}
        >
            <CurrencyExchangeIcon sx={{ color: "text.secondary", fontSize: '1.5rem', marginBottom: 1 }} />
            <Typography variant="h6" color="text.secondary">
                No items found
            </Typography>
        </Box>
    );
}