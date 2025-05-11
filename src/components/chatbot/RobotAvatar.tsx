import React, { useState, useEffect } from 'react';
import './RobotAvatar.css';

interface RobotAvatarProps {
  mood?: 'happy' | 'thinking' | 'confused' | 'idle';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

const RobotAvatar: React.FC<RobotAvatarProps> = ({ 
  mood = 'happy', 
  size = 'medium',
  animated = true 
}) => {
  const [blinking, setBlinking] = useState(false);
  const [antenna, setAntenna] = useState(false);

  // Random blinking effect
  useEffect(() => {
    if (!animated) return;
    
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 200);
    }, Math.random() * 3000 + 2000); // Random blink between 2-5 seconds
    
    return () => clearInterval(blinkInterval);
  }, [animated]);

  // Antenna pulsing effect
  useEffect(() => {
    if (!animated) return;
    
    const antennaInterval = setInterval(() => {
      setAntenna(true);
      setTimeout(() => setAntenna(false), 500);
    }, Math.random() * 4000 + 3000); // Random pulse between 3-7 seconds
    
    return () => clearInterval(antennaInterval);
  }, [animated]);

  // Determine eye expression based on mood
  const getEyeExpression = () => {
    switch (mood) {
      case 'thinking':
        return 'robot-eyes-thinking';
      case 'confused':
        return 'robot-eyes-confused';
      case 'idle':
        return 'robot-eyes-idle';
      case 'happy':
      default:
        return 'robot-eyes-happy';
    }
  };

  // Determine size class
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'robot-small';
      case 'large':
        return 'robot-large';
      case 'medium':
      default:
        return 'robot-medium';
    }
  };

  return (
    <div className={`robot-avatar ${getSizeClass()}`}>
      {/* Robot head */}
      <div className="robot-head">
        {/* Antenna */}
        <div className={`robot-antenna ${antenna ? 'pulse' : ''}`}>
          <div className="robot-antenna-ball"></div>
          <div className="robot-antenna-stem"></div>
        </div>
        
        {/* Face */}
        <div className="robot-face">
          {/* Eyes */}
          <div className={`robot-eyes ${getEyeExpression()} ${blinking ? 'blink' : ''}`}>
            <div className="robot-eye left"></div>
            <div className="robot-eye right"></div>
          </div>
          
          {/* Mouth */}
          <div className={`robot-mouth ${mood === 'happy' ? 'smile' : mood === 'confused' ? 'confused' : 'neutral'}`}></div>
        </div>
        
        {/* Ears/Side components */}
        <div className="robot-ear left"></div>
        <div className="robot-ear right"></div>
      </div>
    </div>
  );
};

export default RobotAvatar;
