import React from 'react';
import { Helmet } from 'react-helmet-async';
import Chatbot from '../components/chatbot/Chatbot';
import { generalFAQs } from '../data/chatbotFAQs';

const ChatbotDemo: React.FC = () => {

  return (
    <>
      <Helmet>
        <title>Chatbot Demo | CitizenReport</title>
        <meta name="description" content="Interactive robot chatbot demo" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Animated Robot Chatbot Demo</h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">About This Demo</h2>
            <p className="mb-4">
              This page demonstrates our animated robot chatbot interface. The chatbot features:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Animated robot avatar with different moods</li>
              <li>Typing indicators</li>
              <li>Smooth animations for messages</li>
              <li>Frequently asked questions</li>
              <li>Responsive design for all devices</li>
            </ul>
            <p>
              Click the robot chat button in the bottom right corner to start interacting with the chatbot!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Expressive robot avatar with multiple moods</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Smooth animations and transitions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Typing indicators for a more natural feel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Customizable colors and positioning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-2">✓</span>
                  <span>Responsive design for all screen sizes</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <p className="mb-4">
                The chatbot uses React and TypeScript to create a responsive and interactive user interface.
                The robot avatar is built with CSS animations and React state management to create
                different expressions and moods based on the conversation context.
              </p>
              <p>
                Try asking the chatbot questions or select from the provided FAQs to see how it responds
                with different expressions and animations!
              </p>
            </div>
          </div>
        </div>

        {/* Chatbot component */}
        <Chatbot
          title="Robot Assistant"
          faqs={generalFAQs}
          position="bottom-right"
          primaryColor="#4299e1"
        />
      </div>
    </>
  );
};

export default ChatbotDemo;
