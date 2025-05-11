import { FAQ } from '../components/chatbot/Chatbot';

// Home page FAQs
export const homeFAQs: FAQ[] = [
  {
    question: "How do I report a new issue?",
    answer: "Click on the 'Report Issue' button in the navigation bar or on the homepage. You'll be able to fill out a form with details about the issue, select a location on the map, and upload a photo if needed."
  },
  {
    question: "How do I filter issues?",
    answer: "You can use the filter options at the top of the issues list to filter by category, status, or date. You can also sort issues by newest, oldest, or most upvoted."
  },
  {
    question: "What do the different issue statuses mean?",
    answer: "Issues can have three statuses: 'Pending' (newly reported, not yet addressed), 'In Progress' (being worked on by authorities), and 'Resolved' (the issue has been fixed)."
  },
  {
    question: "Do I need an account to view issues?",
    answer: "No, you can view all reported issues without an account. However, you'll need to create an account and log in to report new issues, upvote existing ones, or leave comments."
  },
  {
    question: "How can I see issues near my location?",
    answer: "The issues are displayed on the map with markers. You can zoom in to your area to see nearby issues. We're also working on a feature to filter issues by proximity to your current location."
  }
];

// Issue Details page FAQs
export const issueDetailsFAQs: FAQ[] = [
  {
    question: "How do I upvote an issue?",
    answer: "Click the thumbs-up button below the issue description. You need to be logged in to upvote issues. More upvotes help highlight important issues to authorities."
  },
  {
    question: "Can I edit an issue after reporting it?",
    answer: "Currently, you can only edit issues that you've reported yourself. If you need to make changes to someone else's report, please leave a comment with the correct information."
  },
  {
    question: "How do I add a comment?",
    answer: "Scroll down to the comments section below the issue details. You need to be logged in to leave a comment. Type your comment in the text box and click 'Post Comment'."
  },
  {
    question: "What happens after I report an issue?",
    answer: "Your issue will be visible to all users and local authorities. Others can upvote it to increase visibility. Local authorities monitor the platform and will update the status as they address the issue."
  },
  {
    question: "How can I share this issue with others?",
    answer: "Click the 'Share' button below the issue description. This will copy the direct link to this issue to your clipboard, which you can then paste and share via email, social media, or messaging apps."
  }
];

// Report Issue page FAQs
export const reportIssueFAQs: FAQ[] = [
  {
    question: "What information should I include in my report?",
    answer: "Please provide a clear title, detailed description, accurate location, and the category of the issue. Adding a photo is optional but highly recommended as it helps authorities understand the problem better."
  },
  {
    question: "How do I select the location on the map?",
    answer: "Click directly on the map to place a marker at the issue's location. You can drag the marker to adjust the position if needed. Try to be as accurate as possible."
  },
  {
    question: "What issue categories are available?",
    answer: "Categories include: Pothole, Street Light, Water Leak, Garbage, Sidewalk, Park, Safety, and Other. Choose the one that best describes your issue."
  },
  {
    question: "Is my personal information shared when I report an issue?",
    answer: "Only your name and profile picture will be visible to other users. Your email and other account details remain private. If you're concerned about privacy, you can update your profile settings."
  },
  {
    question: "Can I report an issue anonymously?",
    answer: "Currently, you need to be logged in to report issues. This helps maintain quality and accountability. However, we're considering adding an anonymous reporting option in the future."
  }
];

// Profile page FAQs
export const profileFAQs: FAQ[] = [
  {
    question: "How do I edit my profile information?",
    answer: "Click the 'Edit Profile' button on your profile page. You can update your name, email, location, bio, and profile picture."
  },
  {
    question: "Where can I see the issues I've reported?",
    answer: "On your profile page, click the 'My Reports' tab to see all the issues you've reported."
  },
  {
    question: "How do I view issues I've upvoted?",
    answer: "On your profile page, click the 'Upvoted Issues' tab to see all the issues you've upvoted."
  },
  {
    question: "How do I change my password?",
    answer: "Go to your profile page, click the 'Account Settings' tab, and then click on 'Change password'. You'll need to enter your current password and a new password."
  },
  {
    question: "Can I delete my account?",
    answer: "Yes, you can delete your account from the 'Account Settings' tab on your profile page. Please note that this action is permanent and will delete all your data."
  }
];

// General FAQs that can be used on any page
export const generalFAQs: FAQ[] = [
  {
    question: "What is Citizen Report?",
    answer: "Citizen Report is a platform that allows citizens to report and track civic issues in their community, such as potholes, broken street lights, or garbage collection problems. It helps connect citizens with local authorities to resolve these issues."
  },
  {
    question: "How do I create an account?",
    answer: "Click on the 'Sign Up' button in the navigation bar. You'll need to provide your name, email, and create a password. You can also add optional information like your location and profile picture later."
  },
  {
    question: "Is this service free to use?",
    answer: "Yes, Citizen Report is completely free for citizens to use. Our goal is to improve communities by facilitating communication between citizens and local authorities."
  },
  {
    question: "Which areas are covered by this service?",
    answer: "Currently, we're operating in select cities as part of our pilot program. We're continuously expanding our coverage. Check the homepage for updates on newly added areas."
  },
  {
    question: "How can I contact support?",
    answer: "For technical support or questions about the platform, please email support@citizenreport.com or use the contact form in the footer of the website."
  }
];
