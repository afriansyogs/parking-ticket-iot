export function formatDuration(diffMs: number | null): string {
  if(diffMs === null) return "Tidak Valid";
  const totalSeconds = Math.floor(diffMs / 1000); 
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} jam${minutes > 0 ? ` ${minutes} menit` : ''}`;
  } else if (minutes > 0) {
    return `${minutes} menit`;
  } else {
    return `${seconds} detik`;
  }
}