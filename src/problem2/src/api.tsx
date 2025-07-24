import axios from 'axios';

export async function fetchRate() {
    const res = await axios.get('https://interview.switcheo.com/prices.json');
    return res.data;
}