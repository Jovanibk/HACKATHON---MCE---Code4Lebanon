const getSummary = async () => {
  return {
    totalLearners: 1250,
    completionRate: "68.50",
    totalPerTrack: [
      { track_name: 'Web Development', count: 450 },
      { track_name: 'Data Science', count: 300 },
      { track_name: 'UI/UX Design', count: 250 },
      { track_name: 'Digital Marketing', count: 250 }
    ],
    totalPerRegion: [
      { region: 'Beirut', count: 500 },
      { region: 'Mount Lebanon', count: 350 },
      { region: 'North', count: 200 },
      { region: 'South', count: 150 },
      { region: 'Bekaa', count: 50 }
    ],
  };
};

const getDissemination = async () => {
  return {
    perChannel: [
      { channel_type: 'Social Media', count: 600 },
      { channel_type: 'Email', count: 300 },
      { channel_type: 'Referral', count: 200 },
      { channel_type: 'Other', count: 150 }
    ],
    perEntity: [
      { entity_name: 'Facebook', channel_type: 'Social Media', count: 300 },
      { entity_name: 'Instagram', channel_type: 'Social Media', count: 200 },
      { entity_name: 'LinkedIn', channel_type: 'Social Media', count: 100 }
    ],
    growthOverTime: [
      { date: '2026-01-01', count: 10 },
      { date: '2026-01-02', count: 25 },
      { date: '2026-01-03', count: 45 },
      { date: '2026-01-04', count: 70 },
      { date: '2026-01-05', count: 100 }
    ]
  };
};

const getInterests = async () => {
  return {
    trackDemand: [
      { track_name: 'Web Development', count: 450 },
      { track_name: 'Data Science', count: 300 },
      { track_name: 'UI/UX Design', count: 250 },
      { track_name: 'Digital Marketing', count: 250 }
    ],
    motivations: [
      { motivation_name: 'Career Change', count: 500 },
      { motivation_name: 'Skill Upgrading', count: 400 },
      { motivation_name: 'Personal Interest', count: 200 },
      { motivation_name: 'Networking', count: 150 }
    ]
  };
};

const getGeography = async () => {
  return {
    learnersPerRegion: [
      { region: 'Beirut', count: 500 },
      { region: 'Mount Lebanon', count: 350 },
      { region: 'North', count: 200 },
      { region: 'South', count: 150 },
      { region: 'Bekaa', count: 50 }
    ],
    channelEffectiveness: [
      { region: 'Beirut', channel_type: 'Social Media', count: 250 },
      { region: 'Mount Lebanon', channel_type: 'Social Media', count: 150 }
    ]
  };
};

const getLearners = async (page = 1, limit = 10, filters = {}) => {
  let learners = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Learner ${i + 1}`,
    email: `learner${i + 1}@example.com`,
    region: i % 5 === 0 ? 'Beirut' : 'Mount Lebanon',
    tracks: 'Web Development, Data Science',
    channels: 'Social Media'
  }));

  if (filters.region) {
    learners = learners.filter(l => l.region === filters.region);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    learners = learners.filter(l => 
      l.name.toLowerCase().includes(searchLower) || 
      l.email.toLowerCase().includes(searchLower)
    );
  }

  const total = learners.length;
  const start = (page - 1) * limit;
  const paginated = learners.slice(start, start + limit);

  return {
    learners: paginated,
    total,
    page,
    limit
  };
};

const getLearnerById = async (id) => {
  return [{
    id,
    name: `Learner ${id}`,
    email: `learner${id}@example.com`,
    region: 'Beirut',
    preferred_format: 'Online',
    skill_level: 'Intermediate',
    track_name: 'Web Development',
    motivation_name: 'Career Change',
    channel_type: 'Social Media',
    entity_name: 'Facebook',
    provider_name: 'Coursera',
    progress_percentage: 75,
    completion_status: 'In Progress'
  }];
};

module.exports = {
  getSummary,
  getDissemination,
  getInterests,
  getGeography,
  getLearners,
  getLearnerById,
};
