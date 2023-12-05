import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css';

import Predictor from './pages/Predictor';
import About from './pages/About';
import Resources from './pages/Resources';
import Error from './pages/Error';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import App from './App';
import reportWebVitals from './reportWebVitals';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Predictor />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/resources',
        element: <Resources />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/privacy',
        element: <Privacy />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
root.render(<RouterProvider router={router} />);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
