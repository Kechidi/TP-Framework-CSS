
const desktopMenuContainer = document.querySelector('.header__main-menu');
desktopMenuContainer.addEventListener('keydown', function(event) {
    keyboardNavigation(event);
});

/**
 * @title Navigation controller
 * @description Based on key input decide what actions should be taken to control
 * menu
 *
 * @param {event} event
 */
function keyboardNavigation(event) {
    const classList = {
        hasChildren: 'menu__item--children',
        openedLi: 'menu-item--open',
        expandedUl: 'menu__expand',
    };
    const nextElementAfterMenu = '.header__meta .header__search i.icon-search';
    const activeElement = document.activeElement;
    const parentLi = getClosestParentTag(activeElement, 'LI');
    const openedMenu = parentLi.classList.contains(classList.openedLi);

    switch (event.keyCode) {
        case 27:
            if (isSubMenu(activeElement)) {
                closeSubMenu(parentLi, classList);
            } else if (openedMenu) {
                closeMainMenu(parentLi, classList);
            } else {
                document.querySelector(nextElementAfterMenu).focus();
            }
            break;

        case 37:
            if (isSubMenu(activeElement)) {
                navSubMenuSideways('left', activeElement, parentLi, classList);
            } else {
                navMainMenuSideways('left', parentLi, classList);
            }
            break;

        case 38:
            event.preventDefault();

            if (isSubMenu(activeElement)) {
                navSubMenuUp(parentLi);
            } else {
                closeMainMenu(parentLi, classList);
            }
            break;

        case 39:
            if (isSubMenu(activeElement)) {
                navSubMenuSideways('right', activeElement, parentLi, classList);
            } else {
                navMainMenuSideways('right', parentLi, classList);
            }
            break;

        case 40:
            event.preventDefault();

            if (!isSubMenu(activeElement)) {
                navMainMenuDown(activeElement, parentLi, classList);

            } else if (parentLi.nextElementSibling && parentLi.nextElementSibling.nodeName === 'LI') {
                parentLi.nextElementSibling.querySelector('a').focus();
            }

            break;
    }
}

/**
 * @description Close main menu
 *
 * @param {element} activeElement
 * @param {object} classList
 */
function closeMainMenu(activeElement, classList) {
    const subMenu = activeElement.querySelector('ul.sub-menu');

    if (subMenu) {
        activeElement.classList.remove(classList.openedLi);
        subMenu.classList.remove(classList.expandedUl);
    }
}

/**
 * @description Closing sub menu
 *
 * @param {element} activeElement
 * @param {object} classList
 */
function closeSubMenu(activeElement, classList) {
    const parentUl = getClosestParentTag(activeElement, 'UL');
    const parentMenu = getClosestParentTag(parentUl, 'LI');

    parentMenu.classList.remove(classList.openedLi);
    parentUl.classList.remove(classList.expandedUl);
    parentMenu.querySelector('a').focus();
}

/**
 * @description Opening main or sub menu
 *
 * @param {element} activeElement
 * @param {object} classList
 */
function openMenu(activeElement, classList) {
    const subMenu = activeElement.querySelector('ul.sub-menu');

    if (subMenu) {
        activeElement.classList.add(classList.openedLi);
        subMenu.classList.add(classList.expandedUl);
    }
}

/**
 * @description Decide what to do when key left or right is being pressed while
 * focus is on element that is in main menu
 *
 * @param {string} direction
 * @param {element} parentLi
 * @param {object} classList
 */
function navMainMenuSideways(direction, parentLi, classList) {
    const nextActiveElement = (direction === 'right') ?
        parentLi.nextElementSibling :
        parentLi.previousElementSibling;

    if (nextActiveElement !== null) {
        nextActiveElement.querySelector('a').focus();
    }

    if (parentLi.classList.contains(classList.openedLi)) {
        openMenu(nextActiveElement, classList);
        closeMainMenu(parentLi, classList);
    }
}

/**
 * @description Decide what to do when key left or right is being pressed while
 * focus is on element that is in sub menu
 *
 * @param {string} direction
 * @param {element} activeElement
 * @param {element} parentLi
 * @param {object} classList
 */
function navSubMenuSideways(direction, activeElement, parentLi, classList) {
    const parentMenu = getClosestParentTag(parentLi.parentNode, 'LI');

    switch (direction) {
        case 'right':
            if (hasSubMenu(activeElement, classList)) {
                const firstSubMenu = parentLi.querySelector('ul.sub-menu > li');

                openMenu(parentLi, classList);
                firstSubMenu.querySelector('a').focus();
            }
            break;

        case 'left':

            if (isSubMenu(parentMenu)) {
                closeSubMenu(parentLi, classList);
                parentMenu.querySelector('a').focus();
            }
            break;
    }
}

/**
 * @description Decide what to do when key up is being pressed while focus is on
 * element that is in sub menu
 *
 * @param {element} parentLi
 */
function navSubMenuUp(parentLi) {
    const parentMenu = getClosestParentTag(parentLi.parentNode, 'LI');

    if (parentLi.previousElementSibling) {
        parentLi.previousElementSibling.querySelector('a').focus();
    } else if (!isSubMenu(parentMenu)) {
        parentMenu.querySelector('a').focus();
    }
}

/**
 * @description Decide what to do when key down is being pressed while focus is
 * on element that is in main menu
 *
 * @param {element} activeElement
 * @param {element} parentLi
 * @param {object} classList
 */
function navMainMenuDown(activeElement, parentLi, classList) {
    const openedMenu = parentLi.classList.contains(classList.openedLi);

    if (hasSubMenu(activeElement, classList)) {
        if (!openedMenu) {
            openMenu(parentLi, classList);
        } else {
            const firstSubMenu = parentLi.querySelector('ul.sub-menu > li');
            firstSubMenu.querySelector('a').focus();
        }
    }
}

/**
 * @description Traverse the DOM upwards to find specified tag
 *
 * @param {element} activeElement
 * @param {string} tagName
 * @returns
 */
function getClosestParentTag(activeElement, tagName) {
    let parentElement = activeElement;

    while (parentElement.nodeName !== tagName) {
        parentElement = parentElement.parentNode;
    }

    return parentElement;
}

/**
 * @description Check if current active element is part of a sub menu
 *
 * @param {element} activeElement
 * @returns
 */
function isSubMenu(activeElement) {
    const parentUl = getClosestParentTag(activeElement, 'UL');

    if (parentUl.classList.contains('sub-menu')) {
        return true;
    }

    return false;
}

/**
 * @description Check if current focused element has sub menu
 *
 * @param {element} activeElement
 * @param {object} classList
 * @returns
 */
function hasSubMenu(activeElement, classList) {
    const parentLi = getClosestParentTag(activeElement, 'LI');

    if (parentLi.classList.contains(classList.hasChildren)) {
        return true;
    }

    return false;
}

//------------------- Mouse Navigation --------------------//

const subMenuParents = document.querySelectorAll('.header__main-menu [data-depth="0"] .menu__item--children .menu__icon');
const menuParents = document.querySelectorAll('.header__main-menu [data-depth="0"]');

for (let i = 0; i < menuParents.length; i++) {
    menuParents[i].parentNode.addEventListener('mouseover', function() {
        if (this.dataset.itemName === 'More') {
            this.classList.add('menu-item--open');
            this.querySelector('.sub-menu').classList.add('menu__expand');
            document.activeElement.blur();
        }
    });

    menuParents[i].parentNode.addEventListener('mouseout', function() {
        if (this.dataset.itemName === 'More') {
            this.classList.remove('menu-item--open');
            this.querySelector('.sub-menu').classList.remove('menu__expand');
        }
    });
}

for (let i = 0; i < subMenuParents.length; i++) {
    subMenuParents[i].addEventListener('click', function( event ) {
        for (let x = 0; x < subMenuParents.length; x++) {
            subMenuParents[x].parentNode.querySelector('a').blur();
        }
        // const grandparentNode = event.target.parentNode.parentNode;
        const grandparentNode = getClosestParentTag(event.target, 'LI');

        grandparentNode.classList.toggle('menu-item--open');
        event.target.parentNode.nextElementSibling.classList.toggle('menu__expand');
        event.target.toggleAttribute('aria-expanded', 'true');

        this.classList.toggle('icon-minus');

        if (event.keyCode == 27) {
            grandparentNode.classList.toggle('menu-item--open');
            event.target.parentNode.nextElementSibling.classList.toggle('menu__expand');
            event.target.toggleAttribute('aria-expanded', 'true');
        }
    });
}

function minimisedMenu() {
    const menuContainer = document.querySelector('.header__main-menu .menu');
    const menuContainerWidth = menuContainer.offsetWidth;
    const parentMenuItems = document.querySelectorAll('.header__main-menu [data-item-depth="0"]');
    const moreMenuItem = document.querySelector('[data-item-name="More"] > .sub-menu');
    let parentMenuWidth = 0;

    if (moreMenuItem !== null) {
        for (let i = 0; i < parentMenuItems.length; i++) {

            if (!parentMenuItems[i].classList.contains('hidden-desktop')) {
                parentMenuWidth += parentMenuItems[i].offsetWidth;
            }
        }

        if (parentMenuWidth > menuContainerWidth) {
            while (parentMenuWidth > menuContainerWidth) {
                parentMenuWidth = 0;

                for (let i = 0; i < parentMenuItems.length; i++) {

                    if (!parentMenuItems[i].classList.contains('hidden-desktop')) {
                        parentMenuWidth += parentMenuItems[i].offsetWidth;
                    }
                }

                const lastMenuItem = menuContainer.lastElementChild.previousElementSibling;
                lastMenuItem.setAttribute('data-width', lastMenuItem.offsetWidth);
                moreMenuItem.insertBefore(lastMenuItem, moreMenuItem.firstElementChild);
            }
        } else {
            const firstMenuItem = moreMenuItem.firstElementChild;
            const itemsWidths = parseInt(parentMenuWidth) + parseInt(firstMenuItem.getAttribute('data-width'));

            if (itemsWidths < menuContainerWidth) {
                menuContainer.insertBefore(firstMenuItem, menuContainer.lastElementChild);
            }
        }
    }
}

function searchOpen() {
    const searchIcon = document.querySelector('.header__search i');
    const searchForm = document.querySelector('.header__search-form');
    searchIcon.addEventListener('click', function(event) {
        searchForm.classList.toggle('header__search-form--visible');
    });
}

function metaOpen() {
    const metaChild = document.querySelectorAll('.header__meta-child');

    for (let i = 0; i < metaChild.length; i++) {
        const metaHeading = metaChild[i].querySelector('.header__meta-heading');

        metaChild[i].addEventListener('mouseover', function( event ) {
            metaHeading.classList.add('active');
            metaHeading.nextElementSibling.classList.add('active');
        });

        metaChild[i].addEventListener('mouseout', function( event ) {
            metaHeading.classList.remove('active');
            metaHeading.nextElementSibling.classList.remove('active');
        });
    }
}

window.addEventListener('load', (e) => {
    minimisedMenu();
    searchOpen();
    metaOpen();
});

window.addEventListener('resize', (e) => {
    minimisedMenu();
});


$(function(){
    /** SUBMENU CONDITIONAL **/

    if ($('.sub-menu__main')[0]) {
        const str = $('.sub-menu__menu').html();
        if($.trim(str) === "") {
            $('.sub-menu__menu').parent().hide();
        }
    }

});
