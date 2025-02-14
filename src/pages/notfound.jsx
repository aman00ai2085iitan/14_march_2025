// EditTrain.js
import React  from 'react';

import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.img
        src="https://i.imgur.com/qIufhof.png"
        alt="404 Not Found"
        className="w-80 h-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />
      <motion.h1
        className="text-4xl font-bold text-gray-800 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Oops! Page Not Found
      </motion.h1>
      <p className="text-gray-600 mt-2 text-lg">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;