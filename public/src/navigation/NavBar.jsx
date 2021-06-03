import React from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Button } from 'react-bootstrap';

const NavBar = () => {
  const history = useHistory();

  const handleReviews = () => {
    history.push('/reviews');
  };

  return (
    <div>
      <Navbar sticky='top' className='navbar'>
        <Button type='submit' onClick={handleReviews}>
          Reviews
        </Button>
      </Navbar>
    </div>
  );
};

export default NavBar;