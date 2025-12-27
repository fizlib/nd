import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import ArithmeticTopic from './topics/arithmetic/arithmetic'
import IntervalsTopic from './topics/intervals/intervals'
import InequalitiesTopic from './topics/inequalities/inequalities'
import './index.css'

function RedirectHandler() {
    const navigate = useNavigate();
    useEffect(() => {
        if (window.location.hash === '#arithmetic-progression') {
            navigate('/topics/arithmetic', { replace: true });
        }
    }, [navigate]);
    return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <RedirectHandler />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/topics/arithmetic" element={<ArithmeticTopic />} />
                <Route path="/topics/intervals" element={<IntervalsTopic />} />
                <Route path="/topics/inequalities" element={<InequalitiesTopic />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
