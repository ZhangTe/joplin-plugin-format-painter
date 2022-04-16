var cm = null; //codemirror reference

function plugin(CodeMirror) {
    
    var listeneradded = false;
    CodeMirror.defineExtension('toggleFormatPainter', function( fore, end, enable ) {
        dbg('enable: ' + enable);
        cm = this;
        if (enable && !listeneradded){
            document.addEventListener('mouseup', mouseup_);
            fore_ = fore;
            end_ = end;
            listeneradded = true;
        }
        else {
            dbg('toggle off');
            document.removeEventListener('mouseup', mouseup_);
            listeneradded = false;
        }
    });
}
function dbg(stringarg){
    console.info('dbg : ' + stringarg);
}
//cm = this;

var fore_ = '';
var end_ = '';
function mouseup_(eventarg){
    txt = cm.getSelection();
    if (txt != '') {
        cm.replaceSelection(fore_ + txt + end_ );
    }
}


module.exports = {
    default: function(_context) { 
        return {
            plugin: plugin,
        }
    },
}