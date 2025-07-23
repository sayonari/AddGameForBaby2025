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
  return (
    <div className="number-pad">
      <div className="number-grid">
        {/* First row: 1, 2, 3 */}
        {[1, 2, 3].map((num, index) => (
          <motion.button
            key={num}
            className="number-button"
            onClick={() => {
              soundService.playSound('click');
              speechService.speakNumber(num);
              onNumberClick(num);
            }}
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
          >
            <span className="number-label">{num}</span>
            <span className="number-dots">
              {Array(num).fill('●').map((dot, i) => (
                <span key={i}>
                  {dot}
                  {(i + 1) % 5 === 0 && i + 1 < num && <br />}
                </span>
              ))}
            </span>
          </motion.button>
        ))}

        {/* Second row: 4, 5, 6 */}
        {[4, 5, 6].map((num, index) => (
          <motion.button
            key={num}
            className="number-button"
            onClick={() => {
              soundService.playSound('click');
              speechService.speakNumber(num);
              onNumberClick(num);
            }}
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index + 3) * 0.03 }}
          >
            <span className="number-label">{num}</span>
            <span className="number-dots">
              {Array(num).fill('●').map((dot, i) => (
                <span key={i}>
                  {dot}
                  {(i + 1) % 5 === 0 && i + 1 < num && <br />}
                </span>
              ))}
            </span>
          </motion.button>
        ))}

        {/* Third row: 7, 8, 9 */}
        {[7, 8, 9].map((num, index) => (
          <motion.button
            key={num}
            className="number-button"
            onClick={() => {
              soundService.playSound('click');
              speechService.speakNumber(num);
              onNumberClick(num);
            }}
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index + 6) * 0.03 }}
          >
            <span className="number-label">{num}</span>
            <span className="number-dots">
              {Array(num).fill('●').map((dot, i) => (
                <span key={i}>
                  {dot}
                  {(i + 1) % 5 === 0 && i + 1 < num && <br />}
                </span>
              ))}
            </span>
          </motion.button>
        ))}

        {/* Fourth row: けす, 0, こたえる */}
        <motion.button
          className="action-button clear"
          onClick={() => {
            soundService.playSound('click');
            onClear();
          }}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.27 }}
        >
          <X size={30} />
          <span>けす</span>
        </motion.button>

        <motion.button
          className="number-button"
          onClick={() => {
            soundService.playSound('click');
            speechService.speakNumber(0);
            onNumberClick(0);
          }}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="number-label">0</span>
          <span className="number-dots"></span>
        </motion.button>

        <motion.button
          className="action-button submit"
          onClick={() => {
            soundService.playSound('submit');
            onSubmit();
          }}
          disabled={disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.33 }}
        >
          <Check size={30} />
          <span>こたえる</span>
        </motion.button>
      </div>
    </div>
  );
};