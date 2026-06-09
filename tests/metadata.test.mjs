import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const readText = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

const packageJson = JSON.parse(readText("../package.json"));
const manifest = JSON.parse(readText("../mcpb/manifest.json"));
const readme = readText("../README.md");

const expectedTools = [
  "youtube_video_get",
  "youtube_video_enhanced",
  "youtube_video_transcript",
  "youtube_video_transcript_full",
  "youtube_comments_list",
  "youtube_comments_page",
  "youtube_replies_list",
  "youtube_replies_page",
  "youtube_related_videos",
  "youtube_related_videos_page",
  "youtube_channel_get",
  "youtube_channel_about",
  "youtube_channel_videos",
  "youtube_channel_videos_page",
  "youtube_channel_streams",
  "youtube_channel_streams_page",
  "youtube_channel_shorts",
  "youtube_channel_shorts_page",
  "youtube_channel_playlists",
  "youtube_channel_playlists_page",
  "youtube_channel_community",
  "youtube_channel_community_page",
  "youtube_search_query",
  "youtube_search_page",
  "youtube_search_suggest",
  "youtube_search_hashtag",
  "youtube_search_hashtag_page",
  "youtube_trending",
  "youtube_trending_shorts",
  "youtube_playlist_get",
  "youtube_playlist_metadata",
  "youtube_playlist_page",
  "youtube_url_resolve",
  "youtube_videos_batch",
  "youtube_channels_batch",
];

assert.equal(packageJson.name, "@tubealfred/mcp");
assert.equal(expectedTools.length, 35);
assert.match(manifest.long_description, /35 read-only YouTube research tools/);

for (const tool of expectedTools) {
  assert.match(readme, new RegExp(`\\b${tool}\\b`), `README should mention ${tool}`);
  assert.match(
    manifest.long_description,
    new RegExp(`\\b${tool}\\b`),
    `MCPB manifest should mention ${tool}`,
  );
}
