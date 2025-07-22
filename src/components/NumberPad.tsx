import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { speechService } from '../utils/speech';
import { soundService } from '../utils/sound';

interface NumberPadProps {
  onNumberClick: (num: number) => void;
  onClear: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const NumberPad: React.FC<NumberPadProps> = ({ 
  onNumberClick, 
  onClear, 
  onSubmit,
  disabled = false 
}) => {
  const buttons = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 0, label: '0' },
  ];

  return (
    <div className="number-pad">
      <div className="number-grid">
        {buttons.map((button, index) => (
          <motion.button
            key={button.value}
            className="number-button"
            onClick={() => {
              soundService.playSound('click');
              speechService.speakNumber(button.value);
              onNumberClick(button.value);
            }}
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
          >
            <span className="number-label">{button.label}</span>
            <span className="number-dots">
              {Array(button.value).fill('●').join(' ')}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="action-buttons">
        <motion.button
          className="action-button clear"
          onClick={onClear}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <X size={30} />
          <span>けす</span>
        </motion.button>

        <motion.button
          className="action-button submit"
          onClick={onSubmit}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Check size={30} />
          <span>こたえる</span>
        </motion.button>
      </div>
    </div>
  );
};