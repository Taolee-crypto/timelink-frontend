**GitHub Pages Custom Domain Cache Bug Report**

**Issue:**
- GitHub Pages URL shows correct page: https://taolee-crypto.github.io/timelink/
- Custom Domain shows old/cached page: https://timelink.digital/
- Both should show the same content.

**What I've tried:**
1. Force rebuild via empty commits
2. Clearing CNAME and re-adding
3. Adding .nojekyll file
4. Different subdomains
5. Waiting 24+ hours for cache expiration

**Expected:**
Custom Domain should serve the same content as the GitHub Pages URL.

**Repository:**
https://github.com/Taolee-crypto/timelink

**Evidence:**
- GitHub Pages: Shows "TL Platform - 시간 기반 콘텐츠 경제 생태계" (business page)
- Custom Domain: Shows old test/demo page
