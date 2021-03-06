import React, { memo } from 'react';
import { Nav } from 'react-bootstrap';
import { Sidebar as Wrapper, Link } from 'components/Sidebar/style';
import { AppRoutes, DashboardRoutes } from 'routes';

const Sidebar = memo(() => {
  return (
    <Wrapper>
      <Nav>
        <Link to={DashboardRoutes.MAIN.path}>Dashboard</Link>
        <Link to={AppRoutes.LOGOUT.path}>Logout</Link>
      </Nav>
    </Wrapper>
  );
});

export default Sidebar;
