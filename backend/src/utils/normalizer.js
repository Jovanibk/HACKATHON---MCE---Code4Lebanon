const normalizeLearner = (raw) => {
  const responses = raw.responses || {};
  
  // Mapping API access_channel and associated entity
  let channelType = responses.access_channel || raw.utm_source || 'Unknown';
  let entityName = 'Unknown';

  if (responses.university_name) entityName = responses.university_name;
  else if (responses.employer_name) entityName = responses.employer_name;
  else if (responses.syndicate_name) entityName = responses.syndicate_name;
  else if (responses.ngo_name) entityName = responses.ngo_name;
  else if (responses.public_sector_entity) entityName = responses.public_sector_entity;

  return {
    name: (raw.respondent_name || responses.name || 'Anonymous').trim(),
    email: (raw.respondent_email || responses.email || '').trim().toLowerCase(),
    phone: (raw.respondent_phone || responses.phone || '').trim() || null,
    age_range: responses.age_range || 'Unknown',
    employment_status: responses.employment_status || 'Unknown',
    job_level: responses.job_level || 'Entry Level',
    industry: responses.industry || 'Other',
    years_experience: responses.experience_years || '0',
    region: (raw.geo_region || 'Other').trim(),
    city: (raw.geo_city || 'Other').trim(),
    dissemination_channel: {
      type: channelType,
      entity: entityName,
    },
    track: responses.training_track || 'AI Fundamentals',
    motivation: Array.isArray(responses.learning_reason) ? responses.learning_reason[0] : (responses.learning_reason || 'Other'),
    preferred_format: responses.preferred_format || 'Online',
    skill_level: responses.digital_literacy_level || 'Beginner',
    provider_data: raw.providerData || [],
  };
};

module.exports = { normalizeLearner };
