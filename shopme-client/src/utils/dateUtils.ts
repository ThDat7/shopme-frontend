/**
 * Formats a date into relative time (e.g., "2 days ago", "Yesterday") or full date
 * for older content.
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Hiển thị thời gian tương đối cho các đánh giá gần đây
  if (diffDays === 0) {
    if (diffHours === 0) {
      if (diffMins === 0) {
        return 'Vừa xong';
      }
      return `${diffMins} phút trước`;
    }
    return `${diffHours} giờ trước`;
  } else if (diffDays === 1) {
    return 'Hôm qua';
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} tuần trước`;
  }

  // Hiển thị ngày đầy đủ cho các đánh giá cũ hơn
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
