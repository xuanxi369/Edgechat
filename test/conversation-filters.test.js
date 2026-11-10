import assert from 'node:assert/strict';
import test from 'node:test';
import { filterConversations } from '../frontend/src/conversation-filters.js';

const conversations = [
  { key: 'public:1', title: 'General', subtitle: '全员群组', kind: 'public', unreadCount: 0 },
  { key: 'dm:2', title: 'Alice', subtitle: '联系人', kind: 'dm', unreadCount: 2, source: { otherUser: { username: 'alice.dev' } } },
  { key: 'private:3', title: '设计讨论', kind: 'private', unreadCount: 0, mentionUnreadCount: 1 },
];

test('搜索支持中文名称、联系人账号和大小写，筛选不改变原始顺序或对象', () => {
  const original = structuredClone(conversations);
  assert.deepEqual(filterConversations(conversations, ' ALICE.DEV ').map(item => item.key), ['dm:2']);
  assert.deepEqual(filterConversations(conversations, '设计').map(item => item.key), ['private:3']);
  assert.deepEqual(filterConversations(conversations, '不存在'), []);
  assert.deepEqual(filterConversations(conversations), conversations);
  assert.deepEqual(conversations, original);
});

test('未读包含提及消息，阅读后从筛选移除，会话本身仍可恢复', () => {
  const items = structuredClone(conversations);
  assert.deepEqual(filterConversations(items, '', 'unread').map(item => item.key), ['dm:2', 'private:3']);
  items[1].unreadCount = 0;
  assert.deepEqual(filterConversations(items, '', 'unread').map(item => item.key), ['private:3']);
  assert.equal(filterConversations(items).length, 3);
  assert.deepEqual(filterConversations(items, '', 'groups').map(item => item.key), ['public:1', 'private:3']);
  assert.deepEqual(filterConversations(items, 'Alice', 'groups'), []);
});
