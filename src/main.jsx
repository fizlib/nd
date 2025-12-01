import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ArithmeticProgression from './topics/arithmetic-progression/arithmetic-progression'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/topics/arithmetic-progression" element={<ArithmeticProgression />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
