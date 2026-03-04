function shuffleGrid(grid: HTMLElement): void {
	const cards = Array.from(grid.children) as HTMLElement[];

	// Fisher-Yates shuffle
	for (let i = cards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = cards[i];
		cards[i] = cards[j];
		cards[j] = temp;
	}

	// Re-insert in shuffled order (move nodes, no cloning)
	for (const card of cards) {
		grid.appendChild(card);
	}

	// Reveal grid after shuffle to prevent flash of original order
	grid.classList.add('shuffled');
}

function shuffleLinks(): void {
	const grids = document.querySelectorAll<HTMLElement>('.link-grid');
	grids.forEach(shuffleGrid);
}

shuffleLinks();
