import React from 'react';
import { Navbar, Button } from 'react-bootstrap';

const NavBar = () => {

  return (
    <div>
      <Navbar sticky='top' className='navbar'>
        <Button type='submit'>
          Home
        </Button>
        <Button type='submit'>
          Reviews
        </Button>
        <Button type='submit'>
          Products
        </Button>
      </Navbar>
    </div>
  );
};

export default NavBar;