import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function MyNav() {
  return (
    <Navbar expand="lg" className="mainMenu" variant="dark">
      <Container>
        <Navbar.Brand>
          <NavLink to="/" className="myName">
            Alzheimer's Disease Predictor
          </NavLink>
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          <Nav id="navigation">
            <NavLink to="/" className="menu">
              Predictor
            </NavLink>
            <NavLink to="/about" className="menu">
             About
            </NavLink>
            <NavLink to="/resources" className="menu">
              Resources
            </NavLink>
            <NavLink to="/contact" className="menu">
              Contact
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
