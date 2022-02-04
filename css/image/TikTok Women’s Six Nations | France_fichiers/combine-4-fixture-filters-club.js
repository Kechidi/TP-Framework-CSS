/*
window.addEventListener('stats-api-data-ready', function(){
	const fixtureFilters = document.querySelectorAll('[data-filter-fixtures]');
	const fixtures = document.querySelectorAll('[data-fixture]');

	for (let i = 0; i < fixtureFilters.length; i++) {
		const fixtureFilterType = fixtureFilters[i].dataset.filterFixtures;

		fixtureFilters[i].addEventListener('change', function(){
			const filterValue = this.value;

			if (fixtureFilterType === 'status') {
				const fixtureStatus = document.querySelectorAll('[data-fixture="' + filterValue + '"]');
				displayFixtures(fixtures, 'none');
				displayFixtures(fixtureStatus, 'inline-flex');

				fixtureFilters[i + 1].selectedIndex = 0;
			} else {
				const fixtureTeams = document.querySelectorAll('[data-teama="' + filterValue + '"], [data-teamb="' + filterValue + '"]');
				displayFixtures(fixtures, 'none');
				displayFixtures(fixtureTeams, 'inline-flex');

				fixtureFilters[i - 1].selectedIndex = 0;
			}

		});
	}

	const clearFilters = document.querySelector('[data-filter-clear]');
	if (clearFilters) {
		clearFilters.addEventListener('click', function(){

			displayFixtures(fixtures, 'inline-flex');

			for (let i = 0; i < fixtureFilters.length; i++) {
				fixtureFilters[i].selectedIndex = 0;
			}

		});
	}
});

/**
 * @description	Governs the display and hide actions of fixture elements
 * @param {HTMLDomCollection} fixtures - the selected element from querySelector
 * @param {string} display - the CSS declaration required for the selected elements
 *
function displayFixtures(fixtures, display) {
	for (let j = 0; j < fixtures.length; j++) {
		fixtures[j].style.display = display;
	}
}

*/
