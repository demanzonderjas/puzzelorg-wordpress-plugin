(function() {
    var puzzles = JSON.parse(my_plugin.puzzles);
    var puzzlesArr = Object.keys(puzzles).map(function(key) { return puzzles[key] });
    console.log(puzzles)

    function replaceGalleryShortcodes( content ) {
        console.log("replacing...")
		return content.replace( /\[puzzelorg([^\]]*)\]/g, function( match ) {
			return html( 'wp-gallery', match );
		});
    }
    
	function html( cls, data ) {
        console.log(cls, data)
        var key = data.match(/key="([^"]+)"/)[1];
        var width = data.match(/width="([^"]+)"/)[1];
        var height = data.match(/height="([^"]+)"/)[1];
        var type = data.match(/type="([^"]+)"/)[1];
        console.log(key)
		data = window.encodeURIComponent( data );
		return "<div><iframe src='https://puzzel.org/nl/" + type + "/embed?p=" + key + "' width='" + width + "' height='" + height + "' frameborder='0'></iframe></div>";
	}


    /* Register the buttons */
    tinymce.create('tinymce.plugins.PuzzelorgButtons', {
         init : function(ed, url) {
              /**
              * Inserts shortcode content
              */
             console.log('initializing buttons')
              ed.addButton( 'puzzelorg_button', {
                   title : 'Insert shortcode',
                   image : '/wp-content/plugins/puzzel-org/images/icon.png',
                   onclick : function() {
                        var popup = document.createElement("div");
                        popup.classList.add("puzzelorg-popup");

                        var header = document.createElement("h2");
                        header.innerHTML = "Select your puzzle here";
                        popup.appendChild(header);

                        var settingDiv = document.createElement("div");

                        var widthLabel = document.createElement("label");
                        widthLabel.innerHTML = "Width";

                        var widthInput = document.createElement("input");
                        widthInput.setAttribute("type", "number");
                        widthInput.setAttribute("value", 750);

                        settingDiv.appendChild(widthLabel);
                        settingDiv.appendChild(widthInput);

                        var settingDiv2 = document.createElement("div");

                        var heightLabel = document.createElement("label");
                        heightLabel.innerHTML = "Height";

                        var heightInput = document.createElement("input");
                        heightInput.setAttribute("type", "number");
                        heightInput.setAttribute("value", 800);

                        settingDiv2.appendChild(heightLabel);
                        settingDiv2.appendChild(heightInput);

                        popup.appendChild(settingDiv);
                        popup.appendChild(settingDiv2);

                        puzzlesArr.forEach(function(puzzleObj) {
                            var puzzle = document.createElement("div");
                            puzzle.classList.add("puzzle");
                            puzzle.setAttribute("data-id", puzzleObj.key)
                            puzzle.setAttribute("data-type", puzzleObj.type);
                            puzzle.innerHTML = puzzleObj.name;

                            puzzle.addEventListener("click", addHTML);

                            popup.appendChild(puzzle);
                        });
                        var close = document.createElement("span");
                        close.classList.add("close");
                        close.innerHTML = "X";
                        close.addEventListener("click", removePopup);
                        popup.appendChild(close);
                        document.body.appendChild(popup);

                        function addHTML(e) {
                            var key = this.getAttribute("data-id");
                            var type = this.getAttribute("data-type");
                            var width = widthInput.value;
                            var height = heightInput.value;
                            ed.selection.setContent('[puzzelorg key="' + key + '" width="' + width +'" height="' + height +'" type="' + type + '"]');
                            removePopup();
                        }

                        function removePopup() {
                            popup.parentNode.removeChild(popup);
                        }
                   }
              });
              ed.addCommand( 'puzzelorg_button_cmd', function() {
                   var selected_text = ed.selection.getContent();
                   var return_text = '';
                   return_text = '<h1>' + selected_text + '</h1>';
                   ed.execCommand('mceInsertContent', 0, return_text);
              });

            ed.on( 'BeforeSetContent', function( event ) {
                console.log("before set content");
                // 'wpview' handles the gallery shortcode when present
                console.log(ed.plugins.wpview)
                console.log(wp.mce)
                event.content = replaceGalleryShortcodes( event.content );
            });
        
            ed.on( 'PostProcess', function( event ) {
                console.log("post processing");
                if ( event.get ) {
                    //event.content = restoreMediaShortcodes( event.content );
                }
            });
         },
         createControl : function(n, cm) {
              return null;
         },
    });
    /* Start the buttons */
    tinymce.PluginManager.add( 'puzzelorg_button_script', tinymce.plugins.PuzzelorgButtons );
})();