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
        var key = data.match(/key="(.*)"/)[1];
		data = window.encodeURIComponent( data );
		return "<div><iframe src='https://puzzel.org/nl/crossword/embed?p=" + key + "' width='750' height='800' frameborder='0'></iframe></div>";
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
                   image : '../wp-includes/images/smilies/icon_eek.gif',
                   onclick : function() {
                        var popup = document.createElement("div");
                        popup.classList.add("puzzelorg-popup");
                        puzzlesArr.forEach(function(puzzleObj) {
                            var puzzle = document.createElement("div");
                            puzzle.classList.add("puzzle");
                            puzzle.setAttribute("data-id", puzzleObj.key)
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
                            ed.selection.setContent('[puzzelorg key="' + key + '"]');
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