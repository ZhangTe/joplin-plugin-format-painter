var cm = null; //codemirror reference

function plugin(CodeMirror) {
    
    var listeneradded = false;
    CodeMirror.defineExtension('toggleFormatPainter', function( fore, end/*, enable */) {
        //dbg('enable: ' + enable);
        cm = this;
        if (!listeneradded){
            document.addEventListener('mouseup', mouseup_);
            fore_ = fore;
            end_ = end;
            listeneradded = true;
        }
        else {
            //dbg('toggle off');
            document.removeEventListener('mouseup', mouseup_);
            listeneradded = false;
        }
    });
}
/*function dbg(stringarg){
    console.info('dbg : ' + stringarg);
}*/
//cm = this;

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
        
        
        //cm.replaceSelection(fore_ + txt + end_ );
    }
}


module.exports = {
    default: function(_context) { 
        return {
            plugin: plugin,
        }
    },
}