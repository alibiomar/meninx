import { FaSpinner } from 'react-icons/fa';
import PropTypes from 'prop-types';

export default function LoadingSpinner({ size = 'large', color = 'red-600', message = '' }) {
  // Map size prop to specific values
  const sizeClasses = {
    small: 'h-8 w-8 text-2xl',
    medium: 'h-12 w-12 text-4xl',
    large: 'h-16 w-16 text-6xl',
  };

  // Ensure color is a valid Tailwind CSS color class
  const spinnerColor = `text-${color}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner with enhanced animation */}
        <div
          className={`${sizeClasses[size]} relative flex items-center justify-center animate-pulse`}
        >
          <FaSpinner
            className={`${spinnerColor} animate-spin`}
            style={{ animationDuration: '0.75s' }} // Faster spin for a smoother effect
          />
          {/* Optional subtle ring effect */}
          <div
            className={`absolute rounded-full border-2 ${spinnerColor.replace('text-', 'border-')} opacity-50 animate-ping`}
            style={{ width: '120%', height: '120%' }}
          />
        </div>

        {/* Optional loading message */}
        {message && (
          <p className="text-gray-700 text-lg font-medium animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// PropTypes for type checking and documentation
LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.string,
  message: PropTypes.string,
};

// Default props
LoadingSpinner.defaultProps = {
  size: 'large',
  color: 'red-600',
  message: '',
};