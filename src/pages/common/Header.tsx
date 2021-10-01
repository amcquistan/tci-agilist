import { Nav, Navbar, NavDropdown, NavLink } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'


function Header() {
  return (
    <Navbar bg='dark' expand='lg' variant='dark'>
      <LinkContainer to='/'>
        <Navbar.Brand>TCI Agilist</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="w-100">
          <LinkContainer to='/velocity-planning'>
            <Nav.Item as={NavLink} >Velocity Planning</Nav.Item>
          </LinkContainer>
          {/* <NavDropdown title="Account" id="basic-nav-dropdown" className="ms-auto">
            <NavDropdown.Item className="text-dark" as={NavLink} to='/signin'>Sign In</NavDropdown.Item>
            <NavDropdown.Item className="text-dark" as={NavLink} to='/signup'>Sign Up</NavDropdown.Item>
            <NavDropdown.Item className="text-dark" as={NavLink} to='/signout'>Sign Out</NavDropdown.Item>
          </NavDropdown> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
