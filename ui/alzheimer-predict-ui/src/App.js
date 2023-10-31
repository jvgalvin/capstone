import { Outlet } from 'react-router-dom';
import MyNav from './components/Nav';
import Footer from './components/Footer';

function App() {

  return (
    <>
      <MyNav />
      
      <main className="mx-3">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default App
