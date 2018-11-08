/**
 * Create Puzzel.org extension for TinyMCE 
 */
(function() {
    var puzzles = JSON.parse(puzzelorg.puzzles);
    var puzzlesArr = Object.keys(puzzles).map(function(key) { 
        return puzzles[key];
    });

    /**
     * Replace the shortcode width the right Puzzel.org iframe
     * 
     * @param {string} content 
     * @return {HTML}
     */
    function replaceShortcodes( content ) {
		return content.replace( /\[puzzelorg([^\]]*)\]/g, function( match ) {
			return html( 'puzzelorg', match );
		});
    }

    /**
     * Parse the shortcode attribute from the full shortcode
     * 
     * @param {string} shortcode 
     * @param {string} attr 
     * @return {string}
     */
    function getShortcodeAttribute(shortcode, attr) {
        const expression = attr + '="([^"]+)"';
        const regex = new RegExp(expression, "i");
        return shortcode.match(regex)[1]
    }
    
    /**
     * Integrate the shortcode attributes into an iframe
     * 
     * @param {string} id 
     * @param {string} shortcode 
     */
	function html( id, shortcode ) {
        var key = getShortcodeAttribute(shortcode, "key");
        var width = getShortcodeAttribute(shortcode, "width");
        var height = getShortcodeAttribute(shortcode, "height");
        var type = getShortcodeAttribute(shortcode, "type");
        var language = getShortcodeAttribute(shortcode, "language");
		return "<div><iframe src='https://puzzel.org/" + language + "/" + type + "/embed?p=" + key + "' width='" + width + "' height='" + height + "' frameborder='0'></iframe></div>";
    }
    
    /**
     * Add the puzzles to the popup, fetched from the JS Vars provided by PHP
     * 
     * @param {Node} popup 
     * @param {object} settings 
     * @param {object} ed 
     */
    function addPuzzlesToPopup(popup, settings, ed) {
        puzzlesArr.forEach(function(puzzleObj) {
            var puzzle = document.createElement("div");
            puzzle.classList.add("puzzle");
            puzzle.setAttribute("data-id", puzzleObj.key)
            puzzle.setAttribute("data-type", puzzleObj.type);
            puzzle.innerHTML = puzzleObj.name;

            puzzle.addEventListener("click", addHTML);

            popup.appendChild(puzzle);
        });

        /**
         * Convert the provided settings and puzzle choice to a shortcode
         * and remove the popup afterwards
         */
        function addHTML() {
            var key = this.getAttribute("data-id");
            var type = this.getAttribute("data-type");
            var width = settings.widthInput.value;
            var height = settings.heightInput.value;
            var language = settings.languageSelect.value;
            ed.selection.setContent('[puzzelorg key="' + key + '" width="' + width +'" height="' + height +'" type="' + type + '" language="' + language + '"]');
            removePopup();
        }

        /**
         * Kill popup after clicking on puzzle
         */
        function removePopup() {
            popup.parentNode.removeChild(popup);
        }
    }

    /**
     * Add close button to popup
     * 
     * @param {Node} popup 
     */
    function addCloseToPopup(popup) {
        var close = document.createElement("span");
        close.classList.add("close");
        close.innerHTML = "X";
        close.addEventListener("click", removePopup);
        popup.appendChild(close);

        /**
         * Remove popup when clicking on the 'X'
         */
        function removePopup() {
            popup.parentNode.removeChild(popup);
        }
    }

    /**
     * Create the multiple settings for customizing the shortcode
     * 
     * @param {Node} popup 
     */
    function createSettings(popup) {
        var widthDiv = document.createElement("div");

        var widthLabel = document.createElement("label");
        widthLabel.innerHTML = "Width";

        var widthInput = document.createElement("input");
        widthInput.setAttribute("type", "number");
        widthInput.setAttribute("value", 750);

        widthDiv.appendChild(widthLabel);
        widthDiv.appendChild(widthInput);

        var heightDiv = document.createElement("div");

        var heightLabel = document.createElement("label");
        heightLabel.innerHTML = "Height";

        var heightInput = document.createElement("input");
        heightInput.setAttribute("type", "number");
        heightInput.setAttribute("value", 800);

        heightDiv.appendChild(heightLabel);
        heightDiv.appendChild(heightInput);

        var languageDiv = document.createElement("div");

        var languageLabel = document.createElement("label");
        languageLabel.innerHTML = "Language";

        var languageSelect = document.createElement("select");
        var nlOption = document.createElement("option");
        nlOption.setAttribute("value", "nl");
        nlOption.innerHTML = "NL";

        var enOption = document.createElement("option");
        enOption.setAttribute("value", "en");
        enOption.innerHTML = "EN";

        languageSelect.appendChild(nlOption);
        languageSelect.appendChild(enOption);

        languageDiv.appendChild(languageLabel);
        languageDiv.appendChild(languageSelect);

        popup.appendChild(widthDiv);
        popup.appendChild(heightDiv);
        popup.appendChild(languageDiv);

        return {
            widthInput: widthInput,
            heightInput: heightInput,
            languageSelect: languageSelect
        }
    }

    /* Register the buttons */
    tinymce.create('tinymce.plugins.PuzzelorgButtons', {
         init : function(ed, url) {
              /**
              * Inserts shortcode content
              */
              ed.addButton( 'puzzelorg_button', {
                   title : 'Insert Puzzle',
                   image : puzzelorg.plugin_url + '/images/icon.png',

                   /**
                    * Trigger the popup when clicking on the Puzzel.org icon
                    */
                   onclick : function() {
                        var popup = document.createElement("div");
                        popup.classList.add("puzzelorg-popup");

                        var header = document.createElement("h2");
                        header.innerHTML = "Select your puzzle here";
                        popup.appendChild(header);

                        var settings = createSettings(popup);

                        addPuzzlesToPopup(popup, settings, ed);
                        addCloseToPopup(popup);
                        document.body.appendChild(popup);
                   }
              });

            ed.on( 'BeforeSetContent', function( event ) {
                event.content = replaceShortcodes( event.content );
            });
         },
         createControl : function(n, cm) {
              return null;
         },
    });
    /* Start the buttons */
    tinymce.PluginManager.add( 'puzzelorg_button_script', tinymce.plugins.PuzzelorgButtons );
})();