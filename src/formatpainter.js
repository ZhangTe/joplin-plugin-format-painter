var cm = null; //codemirror reference

function plugin(CodeMirror, _context) {
    
    var listeneradded = false;
    CodeMirror.defineExtension('toggleFormatPainter', function( fore, end/*, enable */) {
        cm = this;
        if (!listeneradded){
            document.addEventListener('mouseup', mouseup_);
            fore_ = fore;
            end_ = end;
            listeneradded = true;
        }
        else {
            document.removeEventListener('mouseup', mouseup_);
            listeneradded = false;
        }
    });
    
    CodeMirror.defineExtension('getSel', function( isEnd ){ // isEnd true:end; false:head
        var sele = getSelection() + '';
        var name_ = 'getSel_' + (isEnd?'r':'l');
        var res = {name:name_, key:sele};
        _context.postMessage(res);

    });

}

var fore_ = '';
var end_ = '';
function Stringequal (string1, string2){
    if (string1 === string2 ) return true;
    else return false;
}

function moveCursor(cursor, step) {
    var line_ = cursor.line;
    var ch_ = cursor.ch + step;
    return {line:line_, ch:ch_}
}

function mouseup_(eventarg){

    if (cm.somethingSelected()) {
        var leftAlreadyExist = false;
        var rightAlreadyExist = false;
        var txt = cm.getSelection();

        var cursorL = cm.getCursor('from');
        var cursorLL = moveCursor(cursorL, -fore_.length);
        var cursorR = cm.getCursor('to');
        var cursorRR =  moveCursor(cursorR, end_.length);


        cm.setSelection(cursorL, cursorLL);
        if (Stringequal ( cm.getSelection(), fore_ )) {
            leftAlreadyExist = true;
        }
        
        cm.setSelection(cursorRR, cursorR);
        if (Stringequal ( cm.getSelection(), end_ )) {
            rightAlreadyExist = true;
        }

        if( !rightAlreadyExist && !leftAlreadyExist ) {
            cm.setSelection(cursorR, cursorL);
            cm.replaceSelection(fore_ + txt + end_ );
            
        }
        else if ( rightAlreadyExist && leftAlreadyExist ) {
            cm.setSelection(cursorRR, cursorR);
            cm.replaceSelection('');
            cm.setSelection(cursorL, cursorLL);
            cm.replaceSelection('');
        }
        /*else if ( rightAlreadyExist ) {
            cm.setCursor(cursorL);
            cm.replaceSelection(fore_);
        }
        else if ( leftAlreadyExist ) {
            cm.setCursor(cursorR);
            cm.replaceSelection(end_);
        }*/
        else {
            cm.setSelection(cursorR, cursorL);
        }
        
    }
}


module.exports = {
    default: function(_context) { 
        return {
            plugin: function(CodeMirror) {
				return plugin(CodeMirror, _context);
			}
        }
    }
}