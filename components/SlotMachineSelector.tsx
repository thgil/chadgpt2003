'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AVAILABLE_MODELS } from '@/lib/types';

interface SlotMachineSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SlotMachineSelector({ value, onChange }: SlotMachineSelectorProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [leverPulled, setLeverPulled] = useState(false);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spinCountRef = useRef(0);

  // Find current model index
  const currentIndex = AVAILABLE_MODELS.findIndex(m => m.id === value);

  useEffect(() => {
    if (!isSpinning) {
      setDisplayIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [currentIndex, isSpinning]);

  const startSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setLeverPulled(true);
    spinCountRef.current = 0;

    // Fast spinning phase
    const totalSpins = 20 + Math.floor(Math.random() * 15);
    let currentSpeed = 50;

    const spin = () => {
      spinCountRef.current++;
      setDisplayIndex(prev => (prev + 1) % AVAILABLE_MODELS.length);

      if (spinCountRef.current >= totalSpins) {
        // Stop and select
        setIsSpinning(false);
        setLeverPulled(false);
        const finalIndex = Math.floor(Math.random() * AVAILABLE_MODELS.length);
        setDisplayIndex(finalIndex);
        onChange(AVAILABLE_MODELS[finalIndex].id);
        return;
      }

      // Slow down towards the end
      if (spinCountRef.current > totalSpins - 10) {
        currentSpeed += 30;
      } else if (spinCountRef.current > totalSpins - 5) {
        currentSpeed += 80;
      }

      spinIntervalRef.current = setTimeout(spin, currentSpeed);
    };

    spin();
  }, [isSpinning, onChange]);

  const stopSpin = useCallback(() => {
    if (!isSpinning) return;

    // Force stop within next few spins
    spinCountRef.current = 100;
  }, [isSpinning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearTimeout(spinIntervalRef.current);
      }
    };
  }, []);

  const displayModel = AVAILABLE_MODELS[displayIndex];
  const prevModel = AVAILABLE_MODELS[(displayIndex - 1 + AVAILABLE_MODELS.length) % AVAILABLE_MODELS.length];
  const nextModel = AVAILABLE_MODELS[(displayIndex + 1) % AVAILABLE_MODELS.length];

  return (
    <div className="slot-machine">
      <div className="slot-machine-header">
        <span className="slot-title">MODEL SELECTOR</span>
        <div className="slot-lights">
          <span className={`slot-light ${isSpinning ? 'active' : ''}`}>●</span>
          <span className={`slot-light ${isSpinning ? 'active' : ''}`}>●</span>
          <span className={`slot-light ${isSpinning ? 'active' : ''}`}>●</span>
        </div>
      </div>

      <div className="slot-machine-body">
        <div className="slot-lever-container">
          <div
            className={`slot-lever ${leverPulled ? 'pulled' : ''}`}
            onClick={startSpin}
          >
            <div className="lever-stick"></div>
            <div className="lever-ball"></div>
          </div>
          <div className="lever-base"></div>
        </div>

        <div className="slot-window-container">
          <div className="slot-window-frame">
            <div className={`slot-window ${isSpinning ? 'spinning' : ''}`}>
              <div className="slot-item prev">{prevModel.name}</div>
              <div className="slot-item current">{displayModel.name}</div>
              <div className="slot-item next">{nextModel.name}</div>
            </div>
            <div className="slot-indicator">▶</div>
            <div className="slot-indicator right">◀</div>
          </div>

          <div className="slot-reflection"></div>
        </div>
      </div>

      <div className="slot-machine-footer">
        <button
          className={`slot-spin-btn ${isSpinning ? 'spinning' : ''}`}
          onClick={isSpinning ? stopSpin : startSpin}
          disabled={false}
        >
          {isSpinning ? '■ STOP' : '▶ SPIN'}
        </button>
        <div className="slot-credits">
          <span>CREDIT: 999</span>
          <span>WIN: {isSpinning ? '???' : displayModel.id.toUpperCase()}</span>
        </div>
      </div>

      <div className="slot-decorations">
        <div className="slot-star top-left">★</div>
        <div className="slot-star top-right">★</div>
        <div className="slot-star bottom-left">☆</div>
        <div className="slot-star bottom-right">☆</div>
      </div>
    </div>
  );
}
