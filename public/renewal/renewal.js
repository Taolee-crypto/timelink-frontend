(function(){
  'use strict';
  var guest = document.getElementById('guestView');
  var member = document.getElementById('memberView');
  var token = '';
  var user = null;

  try {
    token = localStorage.getItem('tl_token') || '';
    user = JSON.parse(localStorage.getItem('tl_user') || 'null');
  } catch (e) {
    token = '';
    user = null;
  }

  var isSignedIn = !!(token && user && user.id);
  guest.hidden = isSignedIn;
  member.hidden = !isSignedIn;

  if (!isSignedIn) return;

  var displayName = String(user.username || user.name || user.email || 'TimeLink 회원');
  var initial = displayName.trim().charAt(0).toUpperCase() || 'T';
  document.getElementById('welcomeName').textContent = displayName + '님,';
  document.getElementById('sideName').textContent = displayName;
  document.getElementById('sideAvatar').textContent = initial;
  document.getElementById('topAvatar').textContent = initial;

  document.getElementById('logoutButton').addEventListener('click', function(){
    if (!window.confirm('로그아웃하시겠습니까?')) return;
    localStorage.removeItem('tl_token');
    localStorage.removeItem('tl_user');
    window.location.href = '/login.html';
  });

  var menuButton = document.getElementById('mobileMenu');
  var sidebar = document.getElementById('sidebar');
  menuButton.addEventListener('click', function(){
    sidebar.classList.toggle('open');
  });
  document.addEventListener('click', function(event){
    if (window.innerWidth > 760 || !sidebar.classList.contains('open')) return;
    if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) sidebar.classList.remove('open');
  });

  // 이 초기 화면은 기존 운영 데이터나 잔액을 임의로 생성하지 않는다.
  // 실제 집계는 백엔드 API 및 권한 모델을 대조한 뒤 연결한다.
})();
