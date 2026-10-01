# TimeLink Local Agent

TimeLink Local turns the creator's own computer into the origin server for free MP3 streaming.

## MVP
1. Install Node.js 20+ and cloudflared.
2. Run `npm start` in this directory.
3. Open TimeLink Creator Center.
4. Select an MP3 and click **내 컴퓨터에서 무료 공개**.
5. The browser sends the selected MP3 to the local agent.
6. The agent exposes only explicitly shared files through a secure public tunnel.
7. Creator Center registers metadata and the public stream URL with TimeLink. The MP3 is not uploaded to TimeLink R2.

The MVP public URL is temporary and changes when the agent/tunnel restarts.

## Security
- Local control API binds only to 127.0.0.1.
- No arbitrary filesystem paths are accepted.
- Only files uploaded through the TimeLink Local API are public.
- Each file gets a random token.
- HTTP Range requests are supported for seeking.
