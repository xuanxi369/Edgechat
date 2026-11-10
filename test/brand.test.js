import assert from 'node:assert/strict';
import test from 'node:test';
import { APP_NAME, displaySiteName } from '../frontend/src/brand.js';

test('旧默认站名和服务端旧名称在展示时统一品牌', () => {
  for (const value of [undefined, null, '', '  ', 'Edgechat', 'edgechat', ' EdgeChat ']) {
    assert.equal(displaySiteName(value), APP_NAME);
  }
  assert.equal(displaySiteName('EdgeChat Demo'), 'IIEAO·CHAT Demo');
});
test('自定义站名保留，品牌处理可重复执行', () => {
  assert.equal(displaySiteName('  团队空间  '), '团队空间');
  assert.equal(displaySiteName(APP_NAME), APP_NAME);
  assert.equal(displaySiteName('MyEdgechatTeam'), 'MyEdgechatTeam');
});
