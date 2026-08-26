---
name: youtube-video-research
description: Research a public YouTube video with TubeAlfred by combining metadata, transcript moments, related videos, and channel context. Use for briefs, summaries, fact extraction, format analysis, and evidence-backed comparisons.
---

# YouTube video research with TubeAlfred

Use the hosted read-only MCP server at `https://mcp.tubealfred.com/`. Authenticate through OAuth when the client supports it, or use a TubeAlfred API key in a developer MCP client. TubeAlfred never modifies the user's YouTube account.

## Choose the smallest useful workflow

1. If the user supplied an unfamiliar YouTube URL, call `youtube_url_resolve` before selecting another tool.
2. Call `youtube_video_get` for title, description, channel identity, publication time, duration, and public engagement metadata.
3. Call `youtube_video_transcript` only when the task needs spoken content, quotations, timestamps, claims, chapters, or a content outline.
4. Call `youtube_related_videos` only when the user asks for competitors, adjacent topics, recommendation context, or follow-up ideas.
5. Call `youtube_channel_get` only when channel-level context changes the answer.

Do not use the deprecated `youtube_video_transcript_full` compatibility alias for new work.

## Evidence discipline

- Separate video metadata from transcript statements and your own inference.
- Preserve transcript timestamps when citing a moment.
- State clearly when captions are unavailable, incomplete, translated, or auto-generated.
- Do not infer private analytics, revenue, audience identity, viewer journeys, or YouTube Studio retention from public data.
- Do not describe a missing transcript as a tool failure when TubeAlfred reports an unavailable-data outcome.

## Pagination and retries

Related-video pages can return continuation tokens. Fetch another page only when the user's requested breadth requires it. Respect `Retry-After` on rate limits and transient failures. TubeAlfred tools are read-only, but repeated successful calls can still consume credits, so avoid speculative calls and duplicate retries.

## Recommended output

Return a concise answer with:

- the video and channel identity;
- the evidence used, including transcript timestamps when applicable;
- the requested summary, brief, comparison, or extracted facts;
- any unavailable data or uncertainty;
- a short source list naming each TubeAlfred tool used.

Never include credentials, internal billing URLs, raw OAuth tokens, or hidden tool traces in user-facing prose.
