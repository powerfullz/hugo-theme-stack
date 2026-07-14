interface GitHubRepoData {
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    html_url: string;
    full_name: string;
}

const languageColors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Go: '#00ADD8',
    Rust: '#dea584',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Shell: '#89e051',
    Lua: '#000080',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Haskell: '#5e5086',
    Elixir: '#6e4a7e',
    Zig: '#ec915c',
    Nix: '#7e7eff'
};

function formatCount(count: number): string {
    if (count >= 1000) {
        return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
}

async function fetchRepoData(repo: string): Promise<GitHubRepoData> {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
    }

    return response.json();
}

function updateCard(card: HTMLElement, data: GitHubRepoData): void {
    const name = card.querySelector('[data-github-repo-name]') as HTMLAnchorElement;
    const description = card.querySelector('[data-github-repo-description]') as HTMLParagraphElement;
    const language = card.querySelector('[data-github-repo-language]') as HTMLSpanElement;
    const languageDot = card.querySelector('[data-github-repo-language-dot]') as HTMLSpanElement;
    const languageName = card.querySelector('[data-github-repo-language-name]') as HTMLSpanElement;
    const stars = card.querySelector('[data-github-repo-stars]') as HTMLSpanElement;
    const forks = card.querySelector('[data-github-repo-forks]') as HTMLSpanElement;

    name.href = data.html_url;
    name.textContent = data.full_name;
    description.textContent = data.description || '';
    description.hidden = !data.description;
    stars.textContent = formatCount(data.stargazers_count);
    forks.textContent = formatCount(data.forks_count);

    if (data.language) {
        languageDot.style.backgroundColor = languageColors[data.language] || '#8b8b8b';
        languageName.textContent = data.language;
        language.hidden = false;
    }
}

export function setupGithubRepo(): void {
    const cards = document.querySelectorAll('.github-repo-card') as NodeListOf<HTMLElement>;
    if (!cards.length) return;

    cards.forEach(async (card) => {
        const repo = card.dataset.repo;
        if (!repo) return;

        try {
            const data = await fetchRepoData(repo);
            updateCard(card, data);
        } catch {
            const error = card.querySelector('[data-github-repo-error]') as HTMLParagraphElement;
            error.textContent = 'Failed to fetch repository info';
            error.hidden = false;
        } finally {
            card.removeAttribute('aria-busy');
        }
    });
}
