/* TLV5-004: Store-owner staff management. Server remains the authority for all permissions. */
(function () {
  'use strict';
  var API = (window.TL3_API_BASE || 'https://api.timelink.digital').replace(/\/$/, '');
  var $ = function (id) { return document.getElementById(id); };
  var token = localStorage.getItem('tl_token') || '';
  var channels = [], currentId = '', requestBusy = false, inviteValue = '';

  function status(message, error) {
    $('pageStatus').textContent = message;
    $('pageStatus').classList.toggle('error', !!error);
  }
  async function request(path, method) {
    var headers = { Authorization: 'Bearer ' + token };
    var response = await fetch(API + path, { method: method || 'GET', headers: headers, cache: 'no-store' });
    var body = await response.json().catch(function () { return {}; });
    if (!response.ok || body.ok === false) {
      var error = new Error(body.error || '요청에 실패했습니다. (' + response.status + ')');
      error.status = response.status;
      throw error;
    }
    return body;
  }
  function setBusy(busy) {
    requestBusy = busy;
    $('issueInvite').disabled = busy;
    $('refreshStaff').disabled = busy;
    $('channelSelect').disabled = busy;
  }
  function clearInvite() {
    inviteValue = '';
    $('inviteResult').hidden = true;
    $('inviteCode').textContent = '';
    $('inviteChannel').textContent = '';
    $('inviteExpires').textContent = '';
  }
  function element(tag, content, className) {
    var node = document.createElement(tag);
    if (content !== undefined && content !== null) node.textContent = String(content);
    if (className) node.className = className;
    return node;
  }
  function drawStaff(members) {
    var list = $('staffList');
    list.replaceChildren();
    if (!members.length) {
      list.appendChild(element('p', '아직 직원 등록 요청이 없습니다.'));
      return;
    }
    members.forEach(function (m) {
      var row = element('div', undefined, 'member');
      var summary = element('div');
      var title = element('strong', m.username || m.email || ('회원 #' + m.user_id));
      var label = { pending: '대표 승인 대기', active: '승인됨', revoked: '권한 회수됨' }[m.status] || '상태 확인 필요';
      var detail = element('small', (m.email && m.username ? m.email + ' · ' : '') + '회원 #' + m.user_id);
      summary.appendChild(title);
      summary.appendChild(detail);
      summary.appendChild(element('span', label, 'tag'));
      row.appendChild(summary);
      var actions = element('div', undefined, 'actions');
      if (m.status === 'pending') {
        var approve = element('button', '승인');
        approve.type = 'button';
        approve.addEventListener('click', function () { changeMember(m.id, 'POST', 'approve'); });
        actions.appendChild(approve);
      }
      if (m.status === 'pending' || m.status === 'active') {
        var revoke = element('button', '권한 회수', 'danger');
        revoke.type = 'button';
        revoke.addEventListener('click', function () {
          if (window.confirm('이 직원의 방송 운영 권한을 회수하시겠습니까?')) changeMember(m.id, 'DELETE');
        });
        actions.appendChild(revoke);
      }
      row.appendChild(actions);
      list.appendChild(row);
    });
  }
  async function refreshStaff() {
    if (!currentId || requestBusy) return;
    try {
      setBusy(true);
      $('staffList').replaceChildren(element('p', '직원 목록을 불러오는 중입니다.'));
      var data = await request('/api/cafe/channels/' + encodeURIComponent(currentId) + '/staff');
      drawStaff(Array.isArray(data.staff) ? data.staff : []);
      status('직원 관리 정보를 확인했습니다.');
    } catch (error) {
      $('staffList').replaceChildren(element('p', '직원 목록을 확인할 수 없습니다. 새로고침하거나 다시 로그인해주세요.'));
      status(error.message, true);
    } finally { setBusy(false); }
  }
  async function changeMember(memberId, method, action) {
    if (requestBusy || !currentId) return;
    if (!Number.isSafeInteger(Number(memberId)) || Number(memberId) <= 0) {
      status('잘못된 직원 식별자입니다.', true);
      return;
    }
    var path = '/api/cafe/channels/' + encodeURIComponent(currentId) + '/staff/' + encodeURIComponent(String(memberId));
    if (action === 'approve') path += '/approve';
    try {
      setBusy(true);
      await request(path, method);
      status(action === 'approve' ? '직원 승인이 완료되었습니다.' : '직원 권한을 회수했습니다.');
    } catch (error) {
      status(error.status === 409 ? '다른 요청으로 직원 상태가 변경되었습니다. 다시 확인해주세요.' : error.message, true);
    } finally {
      setBusy(false);
      await refreshStaff();
    }
  }
  async function issueInvite() {
    if (requestBusy || !currentId) return;
    clearInvite();
    try {
      setBusy(true);
      var data = await request('/api/cafe/channels/' + encodeURIComponent(currentId) + '/staff/invites', 'POST');
      if (!/^[A-Z0-9]{8}$/.test(String(data.invite_code || ''))) throw new Error('초대 코드 응답을 확인할 수 없습니다.');
      inviteValue = data.invite_code;
      $('inviteChannel').textContent = currentId;
      $('inviteCode').textContent = inviteValue;
      $('inviteExpires').textContent = '만료: ' + (Number.isFinite(Number(data.expires_at)) ? new Date(Number(data.expires_at)).toLocaleString('ko-KR') : '7일 이내') + ' · 최대 ' + (Number(data.max_uses) || 10) + '회 사용';
      $('inviteResult').hidden = false;
      status('초대 코드를 발급했습니다. 코드는 이 화면을 떠나면 다시 표시되지 않습니다.');
    } catch (error) { status(error.message, true); }
    finally { setBusy(false); }
  }
  function chooseChannel(id) {
    if (!channels.some(function (x) { return String(x.channel_id) === String(id); })) return;
    currentId = String(id);
    $('joinLink').href = '/cafe-staff.html?channel_id=' + encodeURIComponent(currentId);
    clearInvite();
    refreshStaff();
  }
  async function start() {
    if (!token) {
      status('대표자 로그인이 필요합니다.', true);
      var login = element('a', '로그인하기');
      login.href = '/login.html?redirect=cafe-staff-manage.html';
      $('pageStatus').appendChild(document.createTextNode(' '));
      $('pageStatus').appendChild(login);
      return;
    }
    try {
      var data = await request('/api/cafe/my-channels');
      channels = Array.isArray(data.channels) ? data.channels.filter(function (c) { return c && c.channel_id; }) : [];
      if (!channels.length) {
        $('emptyWorkspace').hidden = false;
        status('등록된 내 매장이 없습니다.');
        return;
      }
      $('ownerWorkspace').hidden = false;
      var select = $('channelSelect');
      channels.forEach(function (channel) {
        var option = element('option', (channel.name || channel.channel_name || channel.channel_id) + ' (' + channel.channel_id + ')');
        option.value = channel.channel_id;
        select.appendChild(option);
      });
      var preferred = new URLSearchParams(location.search).get('channel_id');
      var selected = channels.some(function (c) { return c.channel_id === preferred; }) ? preferred : String(channels[0].channel_id);
      select.value = selected;
      chooseChannel(selected);
    } catch (error) { status('내 매장 조회 실패: ' + error.message, true); }
  }
  $('channelSelect').addEventListener('change', function () { chooseChannel(this.value); });
  $('refreshStaff').addEventListener('click', refreshStaff);
  $('issueInvite').addEventListener('click', issueInvite);
  $('copyInvite').addEventListener('click', async function () {
    if (!inviteValue) return;
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('이 브라우저에서는 자동 복사를 지원하지 않습니다.');
      await navigator.clipboard.writeText('매장 ID: ' + currentId + '\n초대 코드: ' + inviteValue);
      status('매장 ID와 초대 코드를 복사했습니다.');
    } catch (error) { status(error.message + ' 화면의 코드를 직접 전달해주세요.', true); }
  });
  start();
})();
