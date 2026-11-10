// Filtering never mutates the full conversation list or changes the active room.
export function filterConversations(items, query = '', filter = 'all') {
  const search = query.trim().toLocaleLowerCase();
  return items.filter(item => {
    if (filter === 'unread' && !(item.unreadCount > 0 || item.mentionUnreadCount > 0)) return false;
    if (filter === 'groups' && item.kind === 'dm') return false;
    if (!search) return true;
    return [item.title, item.subtitle, item.source?.otherUser?.username]
      .some(value => String(value || '').toLocaleLowerCase().includes(search));
  });
}
