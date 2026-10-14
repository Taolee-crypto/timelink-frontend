(function(){
  'use strict';
  var API='https://api.timelink.digital';
  var guest=document.getElementById('guestView');
  var member=document.getElementById('memberView');
  var token=localStorage.getItem('tl_token')||'';
  var storedUser=null;
  guest.hidden=false;
  member.hidden=true;

  function showMember(user){
    guest.hidden=true;
    member.hidden=false;
    var name=String(user.username||user.email||'TimeLink 회원');
    var initial=name.trim().charAt(0).toUpperCase()||'T';
    document.getElementById('welcomeName').textContent=name+'님,';
    document.getElementById('sideName').textContent=name;
    document.getElementById('sideAvatar').textContent=initial;
    document.getElementById('topAvatar').textContent=initial;

    document.getElementById('logoutButton').addEventListener('click',function(){
      if(!window.confirm('로그아웃하시겠습니까?'))return;
      localStorage.removeItem('tl_token');
      localStorage.removeItem('tl_user');
      window.location.href='/login.html';
    });

    var menuButton=document.getElementById('mobileMenu');
    var sidebar=document.getElementById('sidebar');
    menuButton.addEventListener('click',function(){sidebar.classList.toggle('open');});
    document.addEventListener('click',function(event){
      if(window.innerWidth>760||!sidebar.classList.contains('open'))return;
      if(!sidebar.contains(event.target)&&!menuButton.contains(event.target))sidebar.classList.remove('open');
    });
  }

  if(!token)return;
  try{storedUser=JSON.parse(localStorage.getItem('tl_user')||'null');}catch(e){storedUser=null;}

  var invalidSession=false;
  fetch(API+'/api/v1/auth/me',{headers:{'Authorization':'Bearer '+token}})
    .then(async function(response){
      if(!response.ok){invalidSession=response.status===401||response.status===403;throw new Error('세션 확인 실패');}
      var data=await response.json();
      var user=data.user||data||storedUser||{};
      if(!user.id&&storedUser&&storedUser.id)user.id=storedUser.id;
      if(!user.id)throw new Error('사용자 확인 실패');
      localStorage.setItem('tl_user',JSON.stringify(user));
      showMember(user);
    })
    .catch(function(){
      if(invalidSession){localStorage.removeItem('tl_token');localStorage.removeItem('tl_user');}
      guest.hidden=false;
      member.hidden=true;
    });
})();
