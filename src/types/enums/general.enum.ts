export const PossibleServiceStatus = ['created', 'started', 'stopped'] as const
export type ServiceStatus = typeof PossibleServiceStatus[number]
