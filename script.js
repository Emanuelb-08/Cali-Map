document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.main-section').forEach((section) => {
        const subsections = Array.from(section.children).filter((child) => child.classList.contains('subsection'));

        if (!subsections.length) return;

        if (!section.querySelector('.subsections-grid')) {
            const grid = document.createElement('div');
            grid.className = 'subsections-grid';
            subsections.forEach((subsection) => grid.appendChild(subsection));
            section.appendChild(grid);
        }
    });

    document.querySelectorAll('.subsection').forEach((subsection, index) => {
        const title = subsection.querySelector('.subsection-title');
        if (!title) return;

        if (index === 0) {
            subsection.classList.add('is-open');
        }

        title.setAttribute('aria-expanded', String(subsection.classList.contains('is-open')));

        title.addEventListener('click', () => {
            const section = subsection.closest('.main-section');
            if (!section) return;

            const sectionCards = section.querySelectorAll('.subsection');
            sectionCards.forEach((card) => {
                const shouldOpen = card === subsection;
                card.classList.toggle('is-open', shouldOpen);
                const trigger = card.querySelector('.subsection-title');
                if (trigger) {
                    trigger.setAttribute('aria-expanded', String(shouldOpen));
                }
            });
        });
    });
});
