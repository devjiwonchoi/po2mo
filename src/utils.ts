export const formatDuration = (duration: number) =>
  duration >= 1000 ? `${duration / 1000}s` : `${duration}ms`
