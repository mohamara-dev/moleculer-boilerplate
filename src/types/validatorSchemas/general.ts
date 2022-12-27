

export const byAdmin = {
  isByAdmin: { type: 'boolean', optional: true }
}

export const getOne = {
  ...byAdmin,
  id: { type: 'string' },
}

export const getOneByName = {
  ...byAdmin,
  name: { type: 'string' }
}

export const deleteOne = {
  ...byAdmin,
  id: { type: 'string' }
}

export default {
  ...byAdmin,
  page: { type: 'number', convert: true },
  select: { type: 'string', optional: true },
  limit: { type: 'number', convert: true },
  sort: { type: 'string', optional: true },
  searchValue: { type: 'string', optional: true },
  $$strict: true,
}
