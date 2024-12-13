import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaChartBar, FaBrain, FaChartLine, FaCog } from 'react-icons/fa';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    { path: '/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/predict', icon: <FaBrain />, label: 'Prediction' },
    // { path: '/analysis', icon: <FaChartLine />, label: 'Analysis' },
    { path: '/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <motion.nav 
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text"
              >
                Delhi Power AI
              </motion.span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium transition-colors duration-200
                    ${isActive(item.path)
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }
                  `}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;