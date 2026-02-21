<button id="check-balance">TL 잔고 확인</button>
<div id="balance-result"></div>

<script>
document.getElementById('check-balance').addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:8000/tl/balance');
    const data = await response.json();
    document.getElementById('balance-result').innerHTML = `
      <strong>TL 잔고:</strong> ${data.tl_balance} TL<br>
      <strong>TLC 잔고:</strong> ${data.tlc_balance}
    `;
  } catch (error) {
    document.getElementById('balance-result').innerHTML = '에러: ' + error.message;
  }
});
</script>
