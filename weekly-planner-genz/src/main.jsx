import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import WeeklyPlannerApp from './WeeklyPlannerApp.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WeeklyPlannerApp />
  </React.StrictMode>
);
