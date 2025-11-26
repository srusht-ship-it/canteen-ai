import React from 'react';
import { Card, Alert } from 'react-bootstrap';

const MenuManagement = () => {
  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <i className="bi bi-menu-button-wide me-2"></i>
          Menu Management
        </h5>
      </Card.Header>
      <Card.Body>
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          Menu management feature coming soon! You'll be able to:
          <ul className="mt-2 mb-0">
            <li>Add new menu items</li>
            <li>Edit existing items (price, description, availability)</li>
            <li>Upload/change item images</li>
            <li>Manage categories</li>
            <li>Set item availability (in stock/out of stock)</li>
          </ul>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default MenuManagement;
