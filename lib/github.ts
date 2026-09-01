export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GithubContributions {
  total: number;
  days: ContributionDay[];
}

/**
 * Public, unauthenticated mirror of GitHub's contribution calendar.
 * Cached for an hour so we're not hitting it on every request.
 */
export async function getGithubContributions(
  username: string
): Promise<GithubContributions | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const days = Array.isArray(data?.contributions) ? data.contributions : [];
    if (!days.length) return null;

    return { total: data?.total?.lastYear ?? 0, days };
  } catch {
    return null;
  }
}
