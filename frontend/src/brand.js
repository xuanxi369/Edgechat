export const APP_NAME = 'IIEAO·CHAT';

// 兼容服务端已有站点名称；仅更新展示文案，保留管理员自定义名称。
export function displaySiteName(value) {
  return String(value || '').trim().replace(/\bEdgechat\b/gi, APP_NAME) || APP_NAME;
}
