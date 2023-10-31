import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import './index.css';

import Predictor from './pages/Predictor';
import About from './pages/About';
import Resources from './pages/Resources';
import Error from './pages/Error';
import Contact from './pages/Contact';

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
    ],
  },
]);

// Render the RouterProvider component
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
