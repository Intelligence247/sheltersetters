const addIdAlias = (obj) => {
  if (!obj || typeof obj !== 'object') return obj
  if (!obj._id && obj.id) {
    obj._id = obj.id
  }
  return obj
}

const addIdAliasArray = (arr) => {
  return arr.map((item) => addIdAlias(item))
}

// Ensure date is a valid ISO string that can be parsed by new Date()
const ensureValidDate = (dateValue) => {
  if (!dateValue) return dateValue
  if (dateValue instanceof Date) {
    return dateValue.toISOString()
  }
  if (typeof dateValue === 'string') {
    // Try to parse and re-stringify to ensure it's valid
    const parsed = new Date(dateValue)
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
  }
  return dateValue
}

// Convert Sequelize snake_case date fields to camelCase for frontend compatibility
const normalizeDates = (obj) => {
  if (!obj || typeof obj !== 'object') return obj
  
  // Convert snake_case date fields to camelCase and ensure valid ISO strings
  if (obj.created_at !== undefined) {
    obj.createdAt = ensureValidDate(obj.created_at || obj.createdAt)
    // Remove snake_case version if camelCase exists
    if (obj.created_at && obj.createdAt) {
      delete obj.created_at
    }
  }
  if (obj.updated_at !== undefined) {
    obj.updatedAt = ensureValidDate(obj.updated_at || obj.updatedAt)
    if (obj.updated_at && obj.updatedAt) {
      delete obj.updated_at
    }
  }
  if (obj.responded_at !== undefined) {
    obj.respondedAt = ensureValidDate(obj.responded_at || obj.respondedAt)
    if (obj.responded_at && obj.respondedAt) {
      delete obj.responded_at
    }
  }
  if (obj.replied_at !== undefined) {
    obj.repliedAt = ensureValidDate(obj.replied_at || obj.repliedAt)
    if (obj.replied_at && obj.repliedAt) {
      delete obj.replied_at
    }
  }
  if (obj.published_at !== undefined) {
    obj.publishedAt = ensureValidDate(obj.published_at || obj.publishedAt)
    if (obj.published_at && obj.publishedAt) {
      delete obj.published_at
    }
  }
  if (obj.completed_at !== undefined) {
    obj.completedAt = ensureValidDate(obj.completed_at || obj.completedAt)
    if (obj.completed_at && obj.completedAt) {
      delete obj.completed_at
    }
  }
  if (obj.last_login_at !== undefined) {
    obj.lastLoginAt = ensureValidDate(obj.last_login_at || obj.lastLoginAt)
    if (obj.last_login_at && obj.lastLoginAt) {
      delete obj.last_login_at
    }
  }
  
  // Also ensure existing camelCase dates are valid ISO strings
  if (obj.createdAt) obj.createdAt = ensureValidDate(obj.createdAt)
  if (obj.updatedAt) obj.updatedAt = ensureValidDate(obj.updatedAt)
  if (obj.respondedAt) obj.respondedAt = ensureValidDate(obj.respondedAt)
  if (obj.repliedAt) obj.repliedAt = ensureValidDate(obj.repliedAt)
  if (obj.publishedAt) obj.publishedAt = ensureValidDate(obj.publishedAt)
  if (obj.completedAt) obj.completedAt = ensureValidDate(obj.completedAt)
  if (obj.lastLoginAt) obj.lastLoginAt = ensureValidDate(obj.lastLoginAt)
  
  return obj
}

// Combined helper: add _id alias and normalize dates
const normalizeForFrontend = (obj) => {
  return normalizeDates(addIdAlias(obj))
}

module.exports = {
  addIdAlias,
  addIdAliasArray,
  normalizeDates,
  normalizeForFrontend,
}
