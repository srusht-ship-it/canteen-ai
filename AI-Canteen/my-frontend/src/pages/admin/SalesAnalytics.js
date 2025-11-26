import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { adminAPI } from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SalesAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Status distribution chart data
  const statusData = {
    labels: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Orders by Status',
        data: [
          analytics.statusBreakdown?.pending || 0,
          analytics.statusBreakdown?.confirmed || 0,
          analytics.statusBreakdown?.preparing || 0,
          analytics.statusBreakdown?.ready || 0,
          analytics.statusBreakdown?.completed || 0,
          analytics.statusBreakdown?.cancelled || 0
        ],
        backgroundColor: [
          '#ffc107',
          '#17a2b8',
          '#007bff',
          '#28a745',
          '#28a745',
          '#dc3545'
        ]
      }
    ]
  };

  // Daily revenue chart
  const revenueData = {
    labels: analytics.dailyRevenue?.map(d => new Date(d.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Daily Revenue (₹)',
        data: analytics.dailyRevenue?.map(d => d.revenue) || [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Popular items chart
  const popularItemsData = {
    labels: analytics.popularItems?.map(item => item.name) || [],
    datasets: [
      {
        label: 'Order Count',
        data: analytics.popularItems?.map(item => item.orderCount) || [],
        backgroundColor: '#28a745'
      }
    ]
  };

  return (
    <div>
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="stats-card border-start border-success border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-success me-3">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Revenue</h6>
                  <h3 className="mb-0">₹{(analytics.totalRevenue || 0).toFixed(2)}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card border-start border-primary border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-primary me-3">
                  <i className="bi bi-receipt"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Orders</h6>
                  <h3 className="mb-0">{analytics.totalOrders || 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card border-start border-info border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-info me-3">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Avg Order Value</h6>
                  <h3 className="mb-0">₹{(analytics.averageOrderValue || 0).toFixed(2)}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stats-card border-start border-warning border-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stats-icon bg-warning me-3">
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0">Total Customers</h6>
                  <h3 className="mb-0">{analytics.totalCustomers || 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={8} className="mb-3">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Daily Revenue Trend
              </h5>
            </Card.Header>
            <Card.Body>
              <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: true }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-pie-chart me-2"></i>
                Orders by Status
              </h5>
            </Card.Header>
            <Card.Body>
              <Pie data={statusData} options={{ responsive: true, maintainAspectRatio: true }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-star me-2"></i>
                Popular Menu Items
              </h5>
            </Card.Header>
            <Card.Body>
              <Bar
                data={popularItemsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesAnalytics;
