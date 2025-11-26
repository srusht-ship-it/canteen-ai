import React, { useState, useEffect } from 'react';
import { Modal, ProgressBar } from 'react-bootstrap';
import { CheckCircleFill, Clock, Truck, CheckCircle } from 'react-bootstrap-icons';
import './OrderAnimation.css';

const OrderAnimation = ({ show, orderNumber, estimatedTime, onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(estimatedTime);

  const stages = [
    { 
      icon: CheckCircleFill, 
      label: 'Order Placed', 
      color: '#28a745',
      duration: estimatedTime * 0.1 // 10% of total time
    },
    { 
      icon: Clock, 
      label: 'Preparing Your Order', 
      color: '#ffc107',
      duration: estimatedTime * 0.5 // 50% of total time
    },
    { 
      icon: Truck, 
      label: 'Out for Delivery', 
      color: '#17a2b8',
      duration: estimatedTime * 0.3 // 30% of total time
    },
    { 
      icon: CheckCircle, 
      label: 'Delivered', 
      color: '#28a745',
      duration: estimatedTime * 0.1 // 10% of total time
    }
  ];

  useEffect(() => {
    if (!show) {
      setCurrentStage(0);
      setProgress(0);
      setTimeLeft(estimatedTime);
      return;
    }

    let totalElapsed = 0;
    let stageIndex = 0;
    let stageProgress = 0;

    const interval = setInterval(() => {
      totalElapsed += 100; // 100ms intervals
      const totalProgress = (totalElapsed / (estimatedTime * 1000)) * 100;
      
      setProgress(Math.min(totalProgress, 100));
      setTimeLeft(Math.max(0, Math.ceil((estimatedTime * 1000 - totalElapsed) / 1000)));

      // Calculate which stage we're in
      let cumulativeTime = 0;
      for (let i = 0; i < stages.length; i++) {
        cumulativeTime += stages[i].duration * 1000;
        if (totalElapsed < cumulativeTime) {
          if (stageIndex !== i) {
            setCurrentStage(i);
            stageIndex = i;
          }
          break;
        }
      }

      // Complete when time is up
      if (totalElapsed >= estimatedTime * 1000) {
        setCurrentStage(stages.length - 1);
        setProgress(100);
        setTimeout(() => {
          onComplete();
        }, 2000); // Show delivered message for 2 seconds
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [show, estimatedTime, onComplete]);

  const CurrentIcon = stages[currentStage]?.icon || CheckCircleFill;

  return (
    <Modal
      show={show}
      centered
      backdrop="static"
      keyboard={false}
      className="order-animation-modal"
    >
      <Modal.Body className="text-center p-5">
        {/* Animated Icon */}
        <div className="order-icon-container mb-4">
          <CurrentIcon 
            className="order-icon pulse"
            size={80} 
            style={{ color: stages[currentStage]?.color }}
          />
        </div>

        {/* Order Number */}
        <h4 className="mb-3">Order #{orderNumber}</h4>

        {/* Current Stage */}
        <h5 className="mb-4" style={{ color: stages[currentStage]?.color }}>
          {stages[currentStage]?.label}
        </h5>

        {/* Progress Bar */}
        <ProgressBar 
          now={progress} 
          variant={currentStage === stages.length - 1 ? 'success' : 'info'}
          className="mb-3"
          style={{ height: '10px' }}
          animated={currentStage !== stages.length - 1}
        />

        {/* Time Remaining */}
        {currentStage !== stages.length - 1 ? (
          <p className="text-muted mb-4">
            <Clock size={16} className="me-2" />
            Estimated time: {timeLeft} seconds
          </p>
        ) : (
          <p className="text-success mb-4">
            <CheckCircleFill size={16} className="me-2" />
            Your order has been delivered!
          </p>
        )}

        {/* Stage Timeline */}
        <div className="stage-timeline mt-4">
          {stages.map((stage, index) => {
            const StageIcon = stage.icon;
            const isCompleted = index < currentStage;
            const isCurrent = index === currentStage;
            
            return (
              <div 
                key={index} 
                className={`timeline-stage ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div 
                  className="timeline-icon-wrapper"
                  style={{ 
                    backgroundColor: isCompleted || isCurrent ? stage.color : '#e0e0e0',
                    borderColor: isCompleted || isCurrent ? stage.color : '#e0e0e0'
                  }}
                >
                  <StageIcon size={16} color="white" />
                </div>
                <span className="timeline-label">{stage.label}</span>
              </div>
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default OrderAnimation;
