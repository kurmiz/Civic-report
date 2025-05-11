import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import Button from '../ui/Button';
import RobotAvatar from './RobotAvatar';
import TypingAnimation from './TypingAnimation';
import './Chatbot.css';

// Define the types for our messages and FAQs
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface FAQ {
  question: string;
  answer: string;
}

interface ChatbotProps {
  title?: string;
  faqs: FAQ[];
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  robotColor?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({
  title = 'Help Assistant',
  faqs,
  position = 'bottom-right',
  primaryColor = 'var(--color-primary-600)',
  robotColor = '#4299e1' // Default blue color
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showFAQs, setShowFAQs] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [robotMood, setRobotMood] = useState<'happy' | 'thinking' | 'confused' | 'idle'>('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add initial welcome message when the component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          text: `Hello! I'm here to help. You can ask me questions or select from the frequently asked questions below.`,
          isUser: false,
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Show typing animation and change robot mood to thinking
    setIsTyping(true);
    setRobotMood('thinking');

    // Store the input value for later use
    const currentInput = inputValue;

    // Find a matching FAQ or provide a default response
    setTimeout(() => {
      const lowerCaseInput = currentInput.toLowerCase();
      const matchingFAQ = faqs.find(faq =>
        faq.question.toLowerCase().includes(lowerCaseInput) ||
        lowerCaseInput.includes(faq.question.toLowerCase().substring(0, 10))
      );

      // Hide typing animation
      setIsTyping(false);

      // Set robot mood based on whether we found a matching FAQ
      setRobotMood(matchingFAQ ? 'happy' : 'confused');

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: matchingFAQ
          ? matchingFAQ.answer
          : "I'm not sure about that. Please check the FAQs below or try asking another question.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Reset robot mood to happy after a delay
      setTimeout(() => {
        setRobotMood('happy');
      }, 2000);
    }, 1500); // Longer delay to make the typing animation visible
  };

  const handleFAQClick = (faq: FAQ) => {
    // Add user question
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: faq.question,
      isUser: true,
      timestamp: new Date()
    };

    // Add the user message immediately
    setMessages(prev => [...prev, userMessage]);

    // Show typing animation and change robot mood to thinking
    setIsTyping(true);
    setRobotMood('thinking');

    // Add bot answer after a delay to simulate typing
    setTimeout(() => {
      // Hide typing animation
      setIsTyping(false);
      setRobotMood('happy');

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: faq.answer,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setShowFAQs(false); // Hide FAQs after selection
  };

  const toggleFAQs = () => {
    setShowFAQs(prev => !prev);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`fixed ${position === 'bottom-right' ? 'right-4' : 'left-4'} bottom-4 z-50`}>
      {/* Chatbot button with robot avatar */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="chatbot-button w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors"
        style={{ backgroundColor: primaryColor }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="scale-75">
            <RobotAvatar mood="happy" animated={true} />
          </div>
        )}
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="chatbot-window absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div
            className="p-4 font-medium text-white chatbot-header"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="chatbot-avatar-container">
              <RobotAvatar mood={robotMood} size="small" animated={true} />
            </div>
            <h3>{title}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 ml-auto"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-[300px]">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <div className="mr-2 flex-shrink-0 self-end mb-1">
                      <RobotAvatar
                        mood={message.id === 'welcome' ? 'happy' : robotMood}
                        size="small"
                        animated={false}
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-lg chatbot-message ${message.isUser ? 'user' : 'bot'} ${
                      message.isUser
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}
                    style={message.isUser ? { backgroundColor: primaryColor } : {}}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className={`text-xs mt-1 block ${message.isUser ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing animation */}
              {isTyping && (
                <div className="flex justify-start chatbot-typing">
                  <div className="mr-2 flex-shrink-0 self-end mb-1">
                    <RobotAvatar mood="thinking" size="small" animated={true} />
                  </div>
                  <TypingAnimation />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* FAQs */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleFAQs}
              className="w-full p-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center">
                <RobotAvatar mood="happy" size="small" animated={false} />
                <span className="ml-2">Frequently Asked Questions</span>
              </div>
              {showFAQs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showFAQs && (
              <div className="max-h-40 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700/30">
                <div className="space-y-1">
                  {faqs.map((faq, index) => (
                    <button
                      key={index}
                      onClick={() => handleFAQClick(faq)}
                      className="w-full text-left p-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 chatbot-faq-item"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // Change robot mood to "thinking" when user is typing
                setRobotMood(e.target.value ? 'thinking' : 'happy');
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your question..."
              className="chatbot-input flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <button
              onClick={handleSendMessage}
              className="chatbot-send-button p-2 rounded-r-md text-white"
              style={{ backgroundColor: primaryColor }}
              disabled={!inputValue.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
