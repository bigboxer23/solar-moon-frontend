import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BsAlarm, BsDatabase } from 'react-icons/bs';
import { MdOutlineDashboard, MdSolarPower } from 'react-icons/md';
import { Link, NavLink } from 'react-router-dom';

import logo from '../assets/logo.svg';
import UserMenu from './UserMenu';

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColor, updateNavbar] = useState(false);
  const { route } = useAuthenticator((context) => [context.route]);

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener('scroll', scrollHandler);

  return route === 'authenticated' ? (
    <Navbar
      className={navColor ? 'sticky' : 'navbar'}
      expand='md'
      expanded={expand}
      fixed='top'
    >
      <Container>
        <Navbar.Brand
          as={Link}
          className='d-flex'
          onClick={() => {
            updateExpanded(false);
          }}
          to='/'
        >
          <img alt='brand' className='img-fluid logo' src={logo} />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls='responsive-navbar-nav'
          onClick={() => {
            updateExpanded(expand ? false : 'expanded');
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='w-100' defaultActiveKey='/'>
            <Nav.Item>
              <NavLink
                className='nav-link text-nowrap'
                onClick={() => updateExpanded(false)}
                to='/dashboard'
              >
                <MdOutlineDashboard style={{ marginBottom: '2px' }} />{' '}
                Dashboards
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                className='nav-link text-nowrap'
                onClick={() => updateExpanded(false)}
                to='/reports'
              >
                <BsDatabase style={{ marginBottom: '2px' }} /> Reports
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                className='nav-link text-nowrap'
                onClick={() => updateExpanded(false)}
                to='/alarms'
              >
                <BsAlarm style={{ marginBottom: '2px' }} /> Alarms
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                as={Link}
                className='nav-link text-nowrap'
                onClick={() => updateExpanded(false)}
                to='/sites'
              >
                <MdSolarPower style={{ marginBottom: '2px' }} /> Management
              </NavLink>
            </Nav.Item>
            <div className='grow-1'></div>
            <UserMenu />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  ) : (
    <div />
  );
}

export default NavBar;
