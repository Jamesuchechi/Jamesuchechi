import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'jamesuchechi';
const GITHUB_GRAPHQL  = 'https://api.github.com/graphql';

// Vercel edge cache — revalidate every hour
export const revalidate = 3600;

const GITHUB_QUERY = `
  query($username: String!) {
    user(login: $username) {
      name
      bio
      avatarUrl
      location
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, ownerAffiliations: OWNER, isFork: false) {
        totalCount
        nodes {
          id
          name
          description
          url: url
          stargazers {
            totalCount
          }
          forkCount
          primaryLanguage {
            name
            color
          }
          updatedAt
          repositoryTopics(first: 3) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
          headers: { 'User-Agent': 'portfolio-web-app' },
          next: { revalidate: 3600 },
        }),
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`, {
          headers: { 'User-Agent': 'portfolio-web-app' },
          next: { revalidate: 3600 },
        }),
      ]);

      if (userRes.ok && reposRes.ok) {
        const user = await userRes.json();
        const repos = await reposRes.json();

        const stats = {
          followers: user.followers || 0,
          following: user.following || 0,
          publicRepos: user.public_repos || 0,
          avatarUrl: user.avatar_url,
          bio: user.bio,
          location: user.location,
        };

        const topRepos = (Array.isArray(repos) ? repos : []).map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          url: r.html_url,
          stars: r.stargazers_count || 0,
          forks: r.forks_count || 0,
          language: r.language || null,
          updatedAt: r.updated_at,
          topics: r.topics || [],
        }));

        const totalStars = topRepos.reduce((sum, r) => sum + r.stars, 0);

        return NextResponse.json({
          username: GITHUB_USERNAME,
          stats,
          topRepos,
          totalStars,
          topLanguages: ['JavaScript', 'Python', 'TypeScript', 'HTML', 'CSS'],
          contributionGrid: [],
          totalContributions: 0,
        });
      }
    } catch (e) {
      console.warn('Public GitHub fallback error:', e);
    }

    return NextResponse.json(
      { error: 'GITHUB_TOKEN not found in environment', username: GITHUB_USERNAME },
      { status: 200 }
    );
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: GITHUB_QUERY,
        variables: { username: GITHUB_USERNAME },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GraphQL Errors:', errors);
      throw new Error('GraphQL query failed');
    }

    const user = data.user;

    // ── Pre-process stats ───────────────────────────────────
    const stats = {
      followers:    user.followers.totalCount,
      following:    user.following.totalCount,
      publicRepos:  user.repositories.totalCount,
      avatarUrl:    user.avatarUrl,
      bio:          user.bio,
      location:     user.location,
    };

    // ── Repos ───────────────────────────────────────────────
    const topRepos = user.repositories.nodes.slice(0, 6).map(r => ({
      id:          r.id,
      name:        r.name,
      description: r.description,
      url:         r.url,
      stars:       r.stargazers.totalCount,
      forks:       r.forkCount,
      language:    r.primaryLanguage?.name || null,
      updatedAt:   r.updatedAt,
      topics:      r.repositoryTopics.nodes.map(n => n.topic.name),
    }));

    const totalStars = user.repositories.nodes.reduce(
      (sum, r) => sum + r.stargazers.totalCount, 
      0
    );

    // ── Languages ──────────────────────────────────────────
    const langCount = {};
    user.repositories.nodes.forEach(r => {
      if (r.primaryLanguage?.name) {
        langCount[r.primaryLanguage.name] = (langCount[r.primaryLanguage.name] ?? 0) + 1;
      }
    });
    const topLanguages = Object.entries(langCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang);

    // ── Contribution Calendar ──────────────────────────────
    const calendar = user.contributionsCollection.contributionCalendar;
    
    // Convert weeks/days into the grid structure the frontend expects
    // But now with accurate color and count directly from GitHub
    const grid = calendar.weeks.map(week => 
      week.contributionDays.map(day => ({
        count: day.contributionCount,
        color: day.color,
        date:  day.date,
      }))
    );

    // Total for the year
    const totalContributions = calendar.totalContributions;

    return NextResponse.json({
      username: GITHUB_USERNAME,
      stats,
      topRepos,
      totalStars,
      topLanguages,
      contributionGrid: grid,
      totalContributions,
    });
  } catch (error) {
    console.error('GET /api/github error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data', username: GITHUB_USERNAME },
      { status: 500 }
    );
  }
}
