
import React, { useState, useCallback } from 'react';
import Button from './components/Button';

const App: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('0');

  const handleButtonClick = useCallback((label: string) => {
    switch (label) {
      case 'C':
        setDisplayValue('0');
        break;
      case 'DEL':
        setDisplayValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        break;
      case '=':
        try {
          // This is a simple, unsafe eval. For a production app, a proper math expression parser is recommended.
          const expression = displayValue.replace(/%/g, '/100*');
          // Avoid evaluating empty or operator-ending expressions
          if (!expression || /[/*\-+]$/.test(expression)) {
            return;
          }
          const result = new Function('return ' + expression)();

          if (!isFinite(result)) {
            setDisplayValue('Error');
          } else {
            // Format to a reasonable number of decimal places to avoid floating point issues
            setDisplayValue(String(Number(result.toPrecision(14))));
          }
        } catch (error) {
          setDisplayValue('Error');
        }
        break;
      default:
        setDisplayValue(prev => {
          if (prev === '0' && !['.','*','/','+','-'].includes(label)) {
            return label;
          }
          if (prev === 'Error') {
             return label;
          }
          // Prevent multiple operators in a row
          const lastChar = prev.slice(-1);
          if (['*','/','+','-'].includes(lastChar) && ['*','/','+','-'].includes(label)){
            return prev.slice(0,-1) + label;
          }
          // Prevent multiple decimal points in one number
          const parts = prev.split(/(\+|-|\*|\/)/);
          if(label === '.' && parts[parts.length - 1].includes('.')){
            return prev;
          }
          return prev + label;
        });
        break;
    }
  }, [displayValue]);

  const getButtonClass = (label: string): string => {
    if (['/', '*', '-', '+', '='].includes(label)) {
      return 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400';
    }
    if (['C', 'DEL', '%'].includes(label)) {
      return 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-400';
    }
    return 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500';
  };

  const buttons = [
    'C', '%', 'DEL', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center font-mono select-none">
      <div className="w-full max-w-xs sm:max-w-sm mx-auto bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="bg-gray-900 text-white text-right font-light rounded-lg px-4 py-5 overflow-x-auto break-words" style={{minHeight: '80px'}}>
          <span className="text-5xl sm:text-6xl">{displayValue}</span>
        </div>
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {buttons.map((label) => (
            <Button
              key={label}
              label={label}
              onClick={handleButtonClick}
              className={`${getButtonClass(label)} ${label === '0' ? 'col-span-2' : ''} h-16 sm:h-20`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
