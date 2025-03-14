import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://yourbackend.onrender.com';

function App() {
    const [coupon, setCoupon] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        const fetchRemainingTime = async () => {
            const { data } = await axios.get(`${API_URL}/remaining-time`, { withCredentials: true });
            console.log(data)
            setRemainingTime(Math.ceil(data.remainingTime / 1000));
        };
        fetchRemainingTime();
    }, []);

    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => setRemainingTime(prev => Math.max(prev - 1, 0)), 1000);
            return () => clearInterval(timer);
        }
    }, [remainingTime]);

    const claimCoupon = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/claim-coupon`, { withCredentials: true });
            console.log(data);
            setCoupon(data.coupon);
            toast.success('Coupon claimed: ' + data.coupon);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Round-Robin Coupon Distribution</h2>
            {coupon && <h3>Your Coupon: {coupon}</h3>}
            {remainingTime > 0 ? (
                <p>Next claim available in: {remainingTime} seconds</p>
            ) : (
                <button onClick={claimCoupon}>Claim Coupon</button>
            )}
            <ToastContainer />
        </div>
    );
}

export default App;
