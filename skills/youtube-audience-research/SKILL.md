---
name: youtube-audience-research
description: Analyze public YouTube audience signals with TubeAlfred comments, replies, channel videos, and transcripts. Use for recurring questions, objections, sentiment themes, customer language, and evidence-backed content opportunities.
---

# YouTube audience research with TubeAlfred

Connect to the read-only TubeAlfred MCP server at `https://mcp.tubealfred.com/`. The workflow reads public YouTube data; it cannot identify anonymous viewers, access private Studio analytics, or take actions on a channel.

## Start from the user's scope

- For one video, resolve the URL when needed, then use `youtube_comments_list`.
- For a specific comment thread, use `youtube_comment_replies` only when replies matter to the question.
- For a channel-wide study, use `youtube_channel_get` and `youtube_channel_videos` to establish the video set, then sample comments only from the videos needed.
- Add `youtube_video_transcript` when comparing audience language with what the creator actually said.

## Pagination rules

Initial comment and reply tools return continuation tokens when more public results exist. Use `youtube_comments_page` or `youtube_comment_replies_page` with the matching token. Stop when one of these conditions is met:

1. the requested comment count is reached;
2. no continuation token remains;
3. the evidence is saturated and additional pages no longer change the themes;
4. the available credit budget would be exceeded.

Comment results are credit-metered when non-empty. Fetching every page by default is wasteful. Explain sampling limits instead of silently implying complete coverage.

## Analysis method

1. Preserve direct comment text separately from classifications.
2. Group repeated questions, desired outcomes, objections, praise, confusion, and terminology.
3. Report counts from the fetched sample, not from the entire audience unless complete coverage was explicitly obtained.
4. Include representative quotations only when useful, and avoid exposing unnecessary personal identifiers.
5. Compare comments with transcript moments when the user asks what triggered a reaction.

## Boundaries

Do not claim sentiment represents all viewers. Do not infer demographics, purchase history, identity, or intent beyond the public text. Authentication, permissions, unavailable data, rate limits, and upstream failures are operational outcomes; buying credits does not resolve them.

## Output

Provide the sample size, videos or threads covered, dominant themes, representative evidence, limitations, and recommended next actions. Name the TubeAlfred tools used so another agent can reproduce the research.
