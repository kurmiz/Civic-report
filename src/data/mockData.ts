import { Issue, Comment, Profile } from '../types';

// Helper to generate random dates within the last month
const getRandomDate = (days = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date.toISOString();
};

// Mock profiles
export const mockProfiles: Profile[] = [
  {
    id: '101',
    name: 'Jane Smith',
    avatar_url: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
  },
  {
    id: '102',
    name: 'David Johnson',
    avatar_url: 'https://ui-avatars.com/api/?name=David+Johnson&background=random'
  },
  {
    id: '103',
    name: 'Sofia Rodriguez',
    avatar_url: 'https://ui-avatars.com/api/?name=Sofia+Rodriguez&background=random'
  },
  {
    id: '104',
    name: 'Michael Chen',
    avatar_url: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random'
  },
  {
    id: '105',
    name: 'Emily Wilson',
    avatar_url: 'https://ui-avatars.com/api/?name=Emily+Wilson&background=random'
  },
  {
    id: '106',
    name: 'Robert Taylor',
    avatar_url: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=random'
  },
  {
    id: '107',
    name: 'Aisha Johnson',
    avatar_url: 'https://ui-avatars.com/api/?name=Aisha+Johnson&background=random'
  }
];

// Mock data for issues
export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Dangerous pothole on Main Street',
    description: 'There\'s a large pothole that\'s been growing for weeks near the intersection of Main and Oak. It\'s already caused damage to several cars and is a hazard for cyclists.',
    category: 'pothole',
    status: 'pending',
    location: 'Main St & Oak Ave',
    lat: 40.7128,
    lng: -74.006,
    image_url: 'https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    user_id: '101',
    created_at: getRandomDate(2),
    updated_at: getRandomDate(1),
    author: mockProfiles[0],
    upvotes_count: 24,
    comments_count: 7,
    has_upvoted: false
  },
  {
    id: '2',
    title: 'Street light out for over a week',
    description: 'The street light at the corner of Elm and 5th has been out for over a week now. This area is already poorly lit, and it\'s creating safety concerns for pedestrians at night.',
    category: 'street-light',
    status: 'in-progress',
    location: 'Elm St & 5th Ave',
    lat: 40.7112,
    lng: -74.0059,
    image_url: 'https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    user_id: '102',
    created_at: getRandomDate(5),
    updated_at: getRandomDate(2),
    author: mockProfiles[1],
    upvotes_count: 18,
    comments_count: 3,
    has_upvoted: false
  },
  {
    id: '3',
    title: 'Overflowing trash bins at City Park',
    description: 'The trash bins at City Park haven\'t been emptied in what seems like weeks. Trash is now overflowing and spreading all over the park. Wildlife is getting into it, and it\'s creating an unsanitary situation.',
    category: 'garbage',
    status: 'resolved',
    location: 'City Park, Central Area',
    lat: 40.7135,
    lng: -74.0046,
    image_url: 'https://images.pexels.com/photos/2409022/pexels-photo-2409022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    user_id: '103',
    created_at: getRandomDate(10),
    updated_at: getRandomDate(1),
    author: mockProfiles[2],
    upvotes_count: 37,
    comments_count: 12,
    has_upvoted: true
  },
  {
    id: '4',
    title: 'Water main leak flooding sidewalk',
    description: 'There appears to be a water main leak on Washington Blvd that\'s been flooding the sidewalk for days. The water is starting to cause damage to the surrounding pavement and is wasting a lot of water.',
    category: 'water-leak',
    status: 'pending',
    location: 'Washington Blvd, near #425',
    lat: 40.7141,
    lng: -74.0030,
    image_url: 'https://images.pexels.com/photos/1046639/pexels-photo-1046639.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    user_id: '104',
    created_at: getRandomDate(3),
    updated_at: getRandomDate(2),
    author: mockProfiles[3],
    upvotes_count: 15,
    comments_count: 4,
    has_upvoted: false
  },
  {
    id: '5',
    title: 'Damaged playground equipment',
    description: 'The slide at Riverside Park playground has a large crack running through it that looks dangerous for children. It should be repaired or replaced before someone gets hurt.',
    category: 'park',
    status: 'pending',
    location: 'Riverside Park Playground',
    lat: 40.7126,
    lng: -74.0066,
    image_url: 'https://images.pexels.com/photos/1037992/pexels-photo-1037992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    user_id: '105',
    created_at: getRandomDate(7),
    updated_at: getRandomDate(4),
    author: mockProfiles[4],
    upvotes_count: 42,
    comments_count: 8,
    has_upvoted: true
  },
  {
    id: '6',
    title: 'Homeless encampment growing under bridge',
    description: 'There\'s a growing homeless encampment under the Jefferson St bridge. The area is becoming unsafe, with reports of open drug use and harassment of pedestrians. We need social services to intervene and help these people.',
    category: 'safety',
    status: 'in-progress',
    location: 'Jefferson St Bridge',
    lat: 40.7138,
    lng: -74.0052,
    user_id: '106',
    created_at: getRandomDate(14),
    updated_at: getRandomDate(2),
    author: mockProfiles[5],
    upvotes_count: 31,
    comments_count: 16,
    has_upvoted: false
  },
  {
    id: '7',
    title: 'Broken sidewalk creating accessibility issues',
    description: 'The sidewalk on Lincoln Ave between 10th and 11th is severely buckled from tree roots. It\'s become impossible for wheelchair users to navigate, and several people have tripped and fallen.',
    category: 'sidewalk',
    status: 'pending',
    location: 'Lincoln Ave, between 10th and 11th',
    lat: 40.7144,
    lng: -74.0040,
    image_url: 'https://images.pexels.com/photos/134058/pexels-photo-134058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    user_id: '107',
    created_at: getRandomDate(9),
    updated_at: getRandomDate(8),
    author: mockProfiles[6],
    upvotes_count: 28,
    comments_count: 6,
    has_upvoted: false
  }
];

// Mock comments
export const mockComments: Comment[] = [
  {
    id: 'c1',
    text: 'I hit this pothole last week and got a flat tire. This needs to be fixed ASAP!',
    issue_id: '1',
    user_id: '201',
    created_at: getRandomDate(1),
    author: {
      id: '201',
      name: 'Mark Wilson',
      avatar_url: 'https://ui-avatars.com/api/?name=Mark+Wilson&background=random'
    }
  },
  {
    id: 'c2',
    text: 'I\'ve reported this through the city\'s website too, but no response yet.',
    issue_id: '1',
    user_id: '202',
    created_at: getRandomDate(1),
    author: {
      id: '202',
      name: 'Sarah Johnson',
      avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random'
    }
  },
  {
    id: 'c3',
    text: 'It\'s gotten bigger since it was first reported. I measured it yesterday - almost 2 feet wide now!',
    issue_id: '1',
    user_id: '203',
    created_at: getRandomDate(0),
    author: {
      id: '203',
      name: 'James Lee',
      avatar_url: 'https://ui-avatars.com/api/?name=James+Lee&background=random'
    }
  }
];

// Mock user data
export const mockCurrentUser = {
  id: '101',
  email: 'jane.smith@example.com',
  name: 'Jane Smith',
  avatar_url: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
  bio: 'Community advocate and nature lover. I enjoy reporting issues that affect our neighborhood.',
  location: 'New York, NY'
};

// Mock upvotes data - which issues the current user has upvoted
export const mockUserUpvotes = ['3', '5'];

// Function to fetch mock issues (simulating API call)
export const fetchIssues = (sortBy = 'latest', filterBy = 'all'): Promise<Issue[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredIssues = [...mockIssues];

      // Apply filter
      if (filterBy !== 'all') {
        if (filterBy === 'resolved' || filterBy === 'pending' || filterBy === 'in-progress') {
          filteredIssues = filteredIssues.filter(issue => issue.status === filterBy);
        } else {
          filteredIssues = filteredIssues.filter(issue => issue.category === filterBy);
        }
      }

      // Apply sort
      switch (sortBy) {
        case 'latest':
          filteredIssues.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'oldest':
          filteredIssues.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          break;
        case 'most-upvotes':
          filteredIssues.sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
          break;
        case 'least-upvotes':
          filteredIssues.sort((a, b) => (a.upvotes_count || 0) - (b.upvotes_count || 0));
          break;
      }

      resolve(filteredIssues);
    }, 800); // Simulate network delay
  });
};

// Function to fetch issue details (simulating API call)
export const fetchIssueById = (id: string): Promise<Issue | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const issue = mockIssues.find(issue => issue.id === id);
      resolve(issue || null);
    }, 600);
  });
};

// Function to fetch comments for an issue (simulating API call)
export const fetchCommentsByIssueId = (issueId: string): Promise<Comment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const comments = mockComments.filter(comment => comment.issue_id === issueId);
      resolve(comments);
    }, 700);
  });
};

// Mock authentication functions
export const mockLogin = async (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, any email/password combination works
      resolve(true);
    }, 500);
  });
};

export const mockSignup = async (email: string, password: string, name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, any signup works
      resolve(true);
    }, 500);
  });
};

export const mockLogout = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

export const mockGetCurrentUser = async (): Promise<typeof mockCurrentUser | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, always return the mock user
      resolve(mockCurrentUser);
    }, 300);
  });
};

// Mock function to update user profile
export const mockUpdateProfile = async (profileData: Partial<typeof mockCurrentUser>): Promise<typeof mockCurrentUser> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Update the mock user data
      Object.assign(mockCurrentUser, profileData);

      // Return the updated user
      resolve(mockCurrentUser);
    }, 500);
  });
};