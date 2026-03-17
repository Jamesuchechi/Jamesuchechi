import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'jamesuchechi';
const GITHUB_API      = 'https://api.github.com';

// Vercel edge cache — revalidate every hour
export const revalidate = 3600;

function authHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'portfolio-app',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function safeFetch(url) {
  try {
    const res = await fetch(url, { headers: authHeaders(), next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const username = GITHUB_USERNAME;

    // Fetch in parallel — fail gracefully per item
    const [user, reposRaw, eventsRaw] = await Promise.all([
      safeFetch(`${GITHUB_API}/users/${username}`),
      safeFetch(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=100&type=owner`),
      safeFetch(`${GITHUB_API}/users/${username}/events/public?per_page=100`),
    ]);

    // ── User stats ──────────────────────────────────────────
    const stats = {
      followers:    user?.followers    ?? 0,
      following:    user?.following    ?? 0,
      publicRepos:  user?.public_repos ?? 0,
      avatarUrl:    user?.avatar_url   ?? null,
      bio:          user?.bio          ?? null,
      location:     user?.location     ?? null,
    };

    // ── Repos: sort by stars, pick top 6 ───────────────────
    const repos = Array.isArray(reposRaw) ? reposRaw : [];
    const topRepos = repos
      .filter(r => !r.fork)
      .sort((a, b) => (b.stargazers_count + b.watchers_count) - (a.stargazers_count + a.watchers_count))
      .slice(0, 6)
      .map(r => ({
        id:          r.id,
        name:        r.name,
        description: r.description ?? null,
        url:         r.html_url,
        stars:       r.stargazers_count,
        forks:       r.forks_count,
        language:    r.language ?? null,
        updatedAt:   r.updated_at,
        topics:      r.topics?.slice(0, 3) ?? [],
      }));

    // ── Total stars ─────────────────────────────────────────
    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);

    // ── Top languages ───────────────────────────────────────
    const langCount = {};
    repos.forEach(r => {
      if (r.language) langCount[r.language] = (langCount[r.language] ?? 0) + 1;
    });
    const topLanguages = Object.entries(langCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang);

    // ── Contribution activity — last 52 weeks grid ─────────
    // We approximate from public push events (GitHub's contrib graph
    // requires GraphQL + auth). This gives a lightweight activity map.
    const events = Array.isArray(eventsRaw) ? eventsRaw : [];
    const pushEvents = events.filter(e => e.type === 'PushEvent');

    // Build a 52-week × 7-day grid (most recent week = index 0)
    const now        = Date.now();
    const WEEK_MS    = 7 * 24 * 60 * 60 * 1000;
    const DAY_MS     = 24 * 60 * 60 * 1000;
    const gridWeeks  = 26; // show 26 weeks (6 months)
    const grid       = Array.from({ length: gridWeeks }, () => Array(7).fill(0));

    pushEvents.forEach(ev => {
      const age    = now - new Date(ev.created_at).getTime();
      const week   = Math.floor(age / WEEK_MS);
      const dayOfW = new Date(ev.created_at).getDay(); // 0=Sun
      if (week >= 0 && week < gridWeeks) {
        grid[week][dayOfW] += ev.payload?.commits?.length ?? 1;
      }
    });

    // Recent commit count (last 30 days)
    const recentCommits = pushEvents
      .filter(e => Date.now() - new Date(e.created_at).getTime() < 30 * DAY_MS)
      .reduce((sum, e) => sum + (e.payload?.commits?.length ?? 1), 0);

    return NextResponse.json({
      username,
      stats,
      topRepos,
      totalStars,
      topLanguages,
      contributionGrid: grid,
      recentCommits,
    });
  } catch (error) {
    console.error('GET /api/github error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data', username: GITHUB_USERNAME },
      { status: 500 }
    );
  }
}
