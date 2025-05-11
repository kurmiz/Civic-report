import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, LogOut, Settings, Bell, ChevronRight, Edit3, User, Mail, MapPin as LocationIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { useIssues } from '../hooks/useIssues';
import IssueCard from '../components/issues/IssueCard';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import Chatbot from '../components/chatbot/Chatbot';
import { profileFAQs } from '../data/chatbotFAQs';
import { addTimestampToUrl } from '../utils/imageUtils';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { userIssues, upvotedIssues, upvoteIssue, loadUpvotedIssues, loadUserIssues } = useIssues();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'reports' | 'upvoted' | 'settings'>('reports');

  // Load appropriate issues when tab is selected
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Profile: Loading issues for tab:', activeTab);
      if (activeTab === 'upvoted') {
        loadUpvotedIssues();
      } else if (activeTab === 'reports') {
        loadUserIssues();
      }
    } else {
      console.log('Profile: User not authenticated or user data not available');
    }
  }, [activeTab, isAuthenticated, user, loadUpvotedIssues, loadUserIssues]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Get issues based on the active tab
  const displayedIssues = activeTab === 'reports'
    ? userIssues
    : activeTab === 'upvoted'
      ? upvotedIssues
      : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Profile header */}
        <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
          {isEditingProfile ? (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h2>
              <ProfileEditForm
                onCancel={() => setIsEditingProfile(false)}
                onSave={() => setIsEditingProfile(false)}
              />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative">
                <img
                  src={addTimestampToUrl(user?.avatar_url)}
                  alt={user?.name}
                  className="h-24 w-24 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name}
                </h1>
                <div className="flex items-center mt-1 text-gray-600 dark:text-gray-400">
                  <Mail size={14} className="mr-1.5" />
                  <p>{user?.email}</p>
                </div>
                {user?.location && (
                  <div className="flex items-center mt-1 text-gray-600 dark:text-gray-400">
                    <LocationIcon size={14} className="mr-1.5" />
                    <p>{user?.location}</p>
                  </div>
                )}
                {user?.bio && (
                  <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                    {user.bio}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit3 size={16} />}
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<LogOut size={16} />}
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <MapPin size={16} className="mr-2" />
              My Reports
            </button>
            <button
              onClick={() => setActiveTab('upvoted')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === 'upvoted'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Bell size={16} className="mr-2" />
              Upvoted Issues
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Settings size={16} className="mr-2" />
              Account Settings
            </button>
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {(activeTab === 'reports' || activeTab === 'upvoted') && (
            <>
              {displayedIssues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {displayedIssues.map(issue => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onUpvote={upvoteIssue}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                    {activeTab === 'reports' ? 'No reports yet' : 'No upvoted issues'}
                  </h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {activeTab === 'reports'
                      ? 'You haven\'t reported any issues yet.'
                      : 'You haven\'t upvoted any issues yet.'
                    }
                  </p>
                  {activeTab === 'reports' && (
                    <div className="mt-6">
                      <Button
                        variant="primary"
                        onClick={() => navigate('/report')}
                        leftIcon={<MapPin size={16} />}
                      >
                        Report an Issue
                      </Button>
                    </div>
                  )}
                  {activeTab === 'upvoted' && (
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/')}
                      >
                        Browse Issues
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Profile Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Profile Settings
                  </h3>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <dl>
                    <div
                      className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Display name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        <span>{user?.name}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </dd>
                    </div>
                    <div
                      className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        <span>{user?.email}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </dd>
                    </div>
                    <div
                      className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Location
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        <span>{user?.location || 'Add your location'}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </dd>
                    </div>
                    <div
                      className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Bio
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        <span className="line-clamp-1">{user?.bio || 'Add a short bio'}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </dd>
                    </div>
                    <div
                      className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Profile photo
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        <span>Update your profile picture</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Notification Settings
                  </h3>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <dl>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email notifications
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        <span>Receive email updates</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="email-toggle" className="sr-only" />
                          <div className="block h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-12"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Issue updates
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        <span>Get notified when issues are updated</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input type="checkbox" id="issue-toggle" className="sr-only" defaultChecked />
                          <div className="block h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-12"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Account Management */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Account Management
                  </h3>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <dl>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Change password
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        <span>Update your password</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Delete account
                      </dt>
                      <dd className="mt-1 text-sm text-error-600 dark:text-error-400 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        <span>Permanently delete your account</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot
        title="Profile Assistant"
        faqs={profileFAQs}
        position="bottom-right"
      />
    </div>
  );
};

export default Profile;