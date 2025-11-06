import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ text = 'Home is loading...' }) => {
  return (
    <div style={{
      minHeight: '40vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      <div style={{
        fontSize: 48,
        color: '#36c4fa',
        filter: 'drop-shadow(0 8px 28px #b8f6ff99)'
      }}>
        🏠
      </div>
      <Spinner
        animation="grow"
        role="status"
        style={{
          width: 64,
          height: 64,
          background: 'linear-gradient(90deg,#22e3ec 10%,#1abce0 90%)',
          border: 'none',
          boxShadow: '0 8px 36px #cff8ff77, 0 2px 8px #6beefd21',
          marginTop: 10
        }}
        variant="info"
      >
        <span className="visually-hidden">{text}</span>
      </Spinner>
      <div style={{
        color: '#1a80b6',
        marginTop: 26,
        fontWeight: 700,
        fontSize: '1.23rem',
        letterSpacing: '.02em'
      }}>
        {text}
      </div>
    </div>
  );
};

export default LoadingSpinner;
