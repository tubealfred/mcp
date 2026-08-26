---
name: youtube-discovery-research
description: Explore public YouTube topics with TubeAlfred search, trending, hashtags, playlists, channels, Shorts, and batch lookups. Use for market maps, competitor sets, topic validation, trend scans, and content discovery.
---

# YouTube discovery research with TubeAlfred

Use the hosted read-only MCP server at `https://mcp.tubealfred.com/`. TubeAlfred provides public YouTube discovery data without changing YouTube accounts or requiring the user's Google YouTube Data API quota.

## Select an entry point

- Use `youtube_search_query` for a natural-language topic or named competitor.
- Use `youtube_search_hashtag` for a hashtag-specific question.
- Use `youtube_trending_videos` or `youtube_trending_shorts` only when the user asks what is currently trending.
- Use `youtube_search_suggestions` to inspect query phrasing and adjacent audience language.
- Use `youtube_url_resolve` when the supplied URL could represent a video, channel, playlist, or another YouTube resource.
- Use playlist and channel tools after discovery to inspect a selected result in depth.

## Expand deliberately

Search and related list operations can return continuation tokens. Fetch another page only when the requested result count, diversity, or confidence requires it. For large comparisons, collect identifiers first and use `youtube_videos_batch` or `youtube_channels_batch` rather than issuing avoidable one-by-one calls. Batch calls cost credits per successfully resolved identifier.

## Research method

1. Record the query, hashtag, region, or trend surface used.
2. Build a candidate set before enriching individual results.
3. Deduplicate repeated videos, channels, and playlists.
4. Compare public metadata on a consistent basis such as publication time, topic, duration, channel, and available engagement fields.
5. Use transcripts or comments only for shortlisted results and only when the user's question needs that evidence.
6. Distinguish search ranking, recommendation adjacency, and trending placement; they are different discovery signals.

## Boundaries

Search results are time-, region-, and upstream-dependent. Do not present a snapshot as permanent ranking truth. Do not infer private keyword volume, impressions, click-through rate, viewer cohorts, or causality from public discovery data. Respect `Retry-After`, stop on permission or unavailable-data outcomes, and avoid repeating successful calls because they can consume credits.

## Output

Return the query context, candidate set, comparison criteria, notable patterns, limitations, and a source list of TubeAlfred tools used. Keep factual observations separate from strategic recommendations.
