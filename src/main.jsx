import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import MathHomeworkApp from '../medos.jsx'
import GeometricHomeworkApp from '../GeometricApp.jsx'
import LandingPage from '../LandingPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/aritmetine" element={<MathHomeworkApp />} />
                <Route path="/geometrine" element={<GeometricHomeworkApp />} />
            </Routes>
        </HashRouter>
    </React.StrictMode>,
)
