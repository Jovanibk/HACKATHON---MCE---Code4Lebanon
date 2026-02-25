const surveyService = require('./surveyService');
const { normalizeLearner } = require('../utils/normalizer');

const getAllNormalizedData = async () => {
  const rawData = await surveyService.fetchSurveyData();
  return rawData.map(normalizeLearner);
};

const getSummary = async () => {
  const data = await getAllNormalizedData();
  
  const totalLearners = data.length;
  
  // Completion rate (from provider_data)
  let totalProviders = 0;
  let completedProviders = 0;
  data.forEach(l => {
    (l.provider_data || []).forEach(p => {
      totalProviders++;
      if (p.status === 'Completed') completedProviders++;
    });
  });
  const completionRate = totalProviders > 0 ? (completedProviders * 100 / totalProviders).toFixed(2) : "0.00";

  // Tracks
  const trackCounts = {};
  data.forEach(l => {
    trackCounts[l.track] = (trackCounts[l.track] || 0) + 1;
  });
  const totalPerTrack = Object.entries(trackCounts).map(([track_name, count]) => ({ track_name, count }));

  // Regions
  const regionCounts = {};
  data.forEach(l => {
    regionCounts[l.region] = (regionCounts[l.region] || 0) + 1;
  });
  const totalPerRegion = Object.entries(regionCounts).map(([region, count]) => ({ region, count }));

  return {
    totalLearners,
    completionRate,
    totalPerTrack,
    totalPerRegion,
  };
};

const getDissemination = async () => {
  const data = await getAllNormalizedData();
  
  const channelCounts = {};
  const entityCounts = {};
  data.forEach(l => {
    const channel = l.dissemination_channel.type;
    const entity = l.dissemination_channel.entity;
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;
    
    const entityKey = `${entity}|${channel}`;
    entityCounts[entityKey] = (entityCounts[entityKey] || 0) + 1;
  });

  const perChannel = Object.entries(channelCounts).map(([channel_type, count]) => ({ channel_type, count }));
  const perEntity = Object.entries(entityCounts).map(([key, count]) => {
    const [entity_name, channel_type] = key.split('|');
    return { entity_name, channel_type, count };
  });

  // Growth over time (we don't have created_at in API responses directly, maybe use a dummy or skip)
  // Actually raw responses usually have a timestamp if we look back at the previous session
  // But for now let's return a static or empty array if missing.
  
  return {
    perChannel,
    perEntity,
    growthOverTime: [] 
  };
};

const getInterests = async () => {
  const summary = await getSummary();
  const data = await getAllNormalizedData();

  const motivationCounts = {};
  data.forEach(l => {
    motivationCounts[l.motivation] = (motivationCounts[l.motivation] || 0) + 1;
  });
  const motivations = Object.entries(motivationCounts).map(([motivation_name, count]) => ({ motivation_name, count }));

  return {
    trackDemand: summary.totalPerTrack,
    motivations,
  };
};

const getGeography = async () => {
  const data = await getAllNormalizedData();
  
  const regionCounts = {};
  const regionChannelCounts = {};

  data.forEach(l => {
    regionCounts[l.region] = (regionCounts[l.region] || 0) + 1;
    
    const key = `${l.region}|${l.dissemination_channel.type}`;
    regionChannelCounts[key] = (regionChannelCounts[key] || 0) + 1;
  });

  const learnersPerRegion = Object.entries(regionCounts).map(([region, count]) => ({ region, count }));
  const channelEffectiveness = Object.entries(regionChannelCounts).map(([key, count]) => {
    const [region, channel_type] = key.split('|');
    return { region, channel_type, count };
  });

  return {
    learnersPerRegion,
    channelEffectiveness,
  };
};

const getLearners = async (page = 1, limit = 10, filters = {}) => {
  const allData = await getAllNormalizedData();
  
  // Group by email to avoid duplicates and aggregate tracks
  const groupedLearners = {};
  allData.forEach(l => {
    if (!groupedLearners[l.email]) {
      groupedLearners[l.email] = {
        ...l,
        tracksList: new Set([l.track]),
        channelsList: new Set([l.dissemination_channel.type])
      };
    } else {
      groupedLearners[l.email].tracksList.add(l.track);
      groupedLearners[l.email].channelsList.add(l.dissemination_channel.type);
    }
  });

  let learnersArray = Object.values(groupedLearners).map(l => ({
    ...l,
    tracks: Array.from(l.tracksList).join(', '),
    channels: Array.from(l.channelsList).join(', ')
  }));
  
  if (filters.region) {
    learnersArray = learnersArray.filter(l => l.region === filters.region);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    learnersArray = learnersArray.filter(l => 
      (l.name && l.name.toLowerCase().includes(searchLower)) || 
      (l.email && l.email.toLowerCase().includes(searchLower))
    );
  }

  const total = learnersArray.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = learnersArray.slice(start, end).map((l, index) => ({
    ...l,
    id: start + index + 1 // Artificial ID for this list
  }));

  return {
    learners: paginated,
    total,
    page,
    limit
  };
};

const getLearnerById = async (id) => {
  const data = await getAllNormalizedData();
  const index = parseInt(id) - 1;
  const learner = data[index];
  
  if (!learner) return [];

  // Map to the structure expected by the frontend
  return [{
    id,
    ...learner,
    track_name: learner.track,
    motivation_name: learner.motivation,
    channel_type: learner.dissemination_channel.type,
    entity_name: learner.dissemination_channel.entity,
    // Flatten provider data if needed, but the frontend maps over it
    provider_name: learner.provider_data?.[0]?.provider_name || 'N/A',
    progress_percentage: learner.provider_data?.[0]?.progress || 0,
    completion_status: learner.provider_data?.[0]?.status || 'Not Started'
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
