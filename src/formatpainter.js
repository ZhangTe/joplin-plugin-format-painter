function plugin(CodeMirror) {
    
    CodeMirror.defineOption('enable-formatpainter', false, async function(cm, val, old) {
		// Cleanup
		if (old && old != CodeMirror.Init) {
			dbg(' old cleared ');
		}
		// setup
		if (val) {
			dbg(' enabled format painter ');
            /*cm.on('mousedown',function(cmarg, docobj){
                dbg(cm.getSelection());
            });*/
            doc = document.getElementsByClassName('CodeMirror-code');
            dbg(doc);
            doc[0].addEventListener('mouseup', function(eventarg){
                dbg(cm.getSelection());
            });
		}
	});
}

function dbg(logarg){
    console.log('painterdbg: ', logarg);
}

module.exports = {
    default: function(_context) { 
        return {
            
            plugin: function(CodeMirror) {
				return plugin(CodeMirror, _context);
			},
            codeMirrorResources: ['addon/mode/multiplex'],
            codeMirrorOptions: {'enable-formatpainter':true},
        }
    },
}