/**
 * Full Screen Menu.
 * Customized for [TailwindCSS](https://tailwindcss.com) and 
 * [animate.css](https://animate.style) library
 * 
 * @author Rafli A. Jaskandi <https://github.com/VladRafli>
 * @license MIT
 */
export class FullScreenMenu {
    /**
     * **`This class is requiring TailwindCSS and animate.css library installed!`**
     * 
     * ### How to use
     * #### HTML:
     * ```html
     * <div id="full-screen-menu" class="h-screen w-screen fixed top-0 bg-white md:hidden animate__animated hidden">
     *    <!-- Your menu goes here! -->
     * </div>
     * ```
     * #### JS:
     * ```js
     * // Your Button
     * let button = document.querySelector('#button')
     * // Init Full Screen Menu
     * new FullScreenMenu(button, 1000)
     * ```
     * 
     * **Customize behaviour**
     * 
     * You can spesify custom behaviour for the full screen menu 
     * by calling callback on second and third parameters.
     * 
     * Third paramater is called when full screen menu is opened. 
     * Fourth parameted is called when full screen menu is closed.
     * 
     * ### Example:
     * ```js
     * // Your Button
     * let button = document.querySelector('#button')
     * // Init Full Screen Menu
     * new FullScreenMenu(button, 1000, (menuClassList) => {
     *     menuClassList.add('some-class')
     * }, (menuClassList) => {
     *     menuClassList.remove('some-class')
     * })
     * ```
     * 
     * **More than one button with same id?**
     * 
     * You can too..., get all your button element by same id.
     * then pass it to the class
     * 
     * ```js
     * // Your Button
     * let button = document.querySelectorAll('#button')
     * // Init Full Screen Menu
     * new FullScreenMenu(button, 1000)
     * ```
     * 
     * @typedef {DOMTokenList} menuClass
     * @param {NodeListOf<Element>|Element} button
     * @param {Number} animationDuration
     * @param {function(menuClass)} showCallback
     * @param {function(menuClass)} hideCallback
     */
    constructor(button, animationDuration, showCallback, hideCallback) {
        /**
         * Full Screen Menu Element
         * 
         * @type {Element}
         */
        this.menu = document.querySelector('[data-full-screen-menu]')
        /**
         * Button Event Listener for Toogling Menu
         * 
         * @type {DOMTokenList}
         */
        let menuClass = this.menu.classList
        // Accessibility
        // this.menu.setAttribute('tabindex', 1)
        if (button.constructor.name === 'NodeList') {
            button.forEach(/** @param {Element} element */(element) => {
                element.addEventListener('click', () => {
                    if (menuClass.contains('hidden')) {
                        // Focus on Full Screen Menu
                        this.menu.scrollIntoView()
                        menuClass.remove('hidden')
                        menuClass.remove('animate__fadeOut')
                        menuClass.add('animate__fadeIn')
                        // Additional Behaviour by User
                        if (showCallback)
                            showCallback(menuClass)
                    } else {
                        menuClass.remove('animate__fadeIn')
                        menuClass.add('animate__fadeOut')
                        // Additional Behaviour by User
                        if (hideCallback)
                            hideCallback(menuClass)
                        setTimeout(() => {
                            menuClass.add('hidden')
                        }, animationDuration)
                    }
                })
            })
        } else if (button.constructor.name.includes('HTML')) {
            button.addEventListener('click', () => {
                if (menuClass.contains('hidden')) {
                    // Focus on Full Screen Menu
                    this.menu.scrollIntoView()
                    menuClass.remove('hidden')
                    menuClass.remove('animate__fadeOut')
                    menuClass.add('animate__fadeIn')
                    // Additional Behaviour by User
                    if (showCallback)
                        showCallback(menuClass)
                } else {
                    menuClass.remove('animate__fadeIn')
                    menuClass.add('animate__fadeOut')
                    // Additional Behaviour by User
                    if (hideCallback)
                        hideCallback(menuClass)
                    setTimeout(() => {
                        menuClass.add('hidden')
                    }, animationDuration)
                }
            })
        } else {
            throw new Error('Button element should be an NodeList or an HTML Element')
        }
    }
}