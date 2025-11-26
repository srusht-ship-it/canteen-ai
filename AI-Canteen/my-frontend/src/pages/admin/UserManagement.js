import React from 'react';
import { Card, Alert } from 'react-bootstrap';

const UserManagement = () => {
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-people me-2"></i>
          User Management
        </h5>
      </Card.Header>
      <Card.Body>
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          User management feature coming soon! You'll be able to:
          <ul className="mt-2 mb-0">
            <li>View all registered users</li>
            <li>View user order history and spending</li>
            <li>Manage user roles (student, staff, admin)</li>
            <li>Block/unblock users</li>
            <li>View user analytics</li>
          </ul>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default UserManagement;
