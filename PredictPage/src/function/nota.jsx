import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const NotaVisual = ({ nota }) => {
  const percentage = (nota / 7) * 100; // Asume que la nota máxima es 10

  return (
    <div style={{ width: '200px', height: '200px' }}>
      <CircularProgressbar
        value={percentage}
        text={`${nota}`}
        background
        backgroundPadding={6}
        styles={buildStyles({
          backgroundColor: "#161A30",
          textColor: "#F0ECE5",
          pathColor: "#B6BBC4",
          trailColor: "transparent"
        })}
      />
    </div>
  );
};

export default NotaVisual;