/* Open a nav section */

function openNav(elementToOpen, elementToClose) {
    elementToOpen = (elementToOpen == null ? "sm-0" : elementToOpen );

    document.getElementById("sm-menu").classList.add("sm-opened"); // menu container needs to be open.
    document.getElementById("sm-menu").classList.remove("sm-hidden"); // menu container needs to be open.
    document.getElementById("sm-menu").classList.add("sm-current");
    setTimeout(function(){
      document.documentElement.classList.add("sm-opening");
    },300);


    let targetElement = document.getElementById(elementToOpen);
    setTimeout(function(){
		targetElement.classList.add("sm-opened");
	},100);
	targetElement.classList.remove('sm-hidden');

    if (typeof elementToClose !== 'undefined') {
        let targetParentElement = document.getElementById(elementToClose);
        setTimeout(function(){
			targetParentElement.classList.add("sm-hidden");
		},300);
        targetParentElement.classList.remove("sm-opened");

        // Remove classes from siblings

        let menus = document.querySelectorAll('.sm-panel');

	    for (let i = 0; i < menus.length; i++) {

			if (menus[i].id === elementToOpen) continue;

			menus[i].classList.add('sm-hidden');
			menus[i].classList.remove('sm-opened');

		}

		// Give list items the active state when clicked

		let menuItems = document.querySelectorAll('.sm-main-menu .active');

		for (let i = 0; i < menuItems.length; i++) {

			if (menuItems[i].getAttribute('data-id') === elementToOpen) continue;

			menuItems[i].classList.remove('active');

		}
    }
}

function closeNav(targetElementClass) {
    targetElementClass = (targetElementClass == null ? "sm-panel" : targetElementClass );
    let elementToUpdate = document.getElementById("sm-menu");
    const openMenu = document.querySelector('.header__mobile');
    elementToUpdate.classList.add("sm-hidden");
    elementToUpdate.classList.remove("sm-current");
    document.documentElement.classList.remove("sm-opening");
    openMenu.classList.remove('header__mobile-open');
}

document.getElementsByClassName('header__mobile-opened')[0].addEventListener("click", function() {
    openNav();
    this.parentNode.classList.add('header__mobile-open');
});

let addOpenButtonInteraction = document.getElementsByClassName("sm-next");
for(let i = 0; i < addOpenButtonInteraction.length; i++) {
	addOpenButtonInteraction[i].addEventListener("click", function(){
		let target = this.getAttribute('data-target');
		let parent = this.getAttribute('data-parent');
		this.parentNode.classList.add('active');
		openNav(target, parent);
	});
}
