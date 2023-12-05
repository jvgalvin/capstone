import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Footer() {
    return (
        <footer className="myFooter">
                © Isabelle Amick, Paul Arellano, Jack Galvin, Martin Lim 2023
                <div>
                <Button size="small" as={Link} to="/privacy">Privacy Policy</Button>
                </div>
        </footer>
    );
}
