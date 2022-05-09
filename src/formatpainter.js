var cm = null; //codemirror reference

function plugin(CodeMirror, _context) {
    
    var listeneradded = false;
    CodeMirror.defineExtension('toggleFormatPainter', function( fore, end, enable ) {
        cm = this;
        if (!listeneradded && enable){
            document.addEventListener('mouseup', mouseup_);
            fore_ = fore;
            end_ = end;
            listeneradded = true;
        }
        else if ( !enable ){
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
    var lineLen = cm.getLine(line_).length;
    var ch_ = cursor.ch + step;
    if(ch_ <= lineLen && ch_ >= 0 ){
        return {line:line_, ch:ch_}
    }
    else if ( ch_ > lineLen ) {
        if(line_ == cm.lineCount() - 1){
            return {line:line_, ch:lineLen}
        }
        else return moveCursor({line:line_+1,ch:0}, ch_ - lineLen - 1);
    }
    else {
        if(line_ == 0){
            return {line:0, ch:0}
        }
        else {
            var prevlineLen = cm.getLine(line_-1).length;
            return moveCursor({line:line_-1,ch:prevlineLen}, ch_ + 1);
        }
    }
}

function cursorOver(cur1, cur2){
    return (cur1.line == cur2.line && cur1.ch >= cur2.ch) || (cur1.line > cur2.line) ;
}

function mouseup_(eventarg){

    if (cm.somethingSelected()) {
        var cursorL = cm.getCursor('from');
        var cursorR = cm.getCursor('to');
        /*var leftAlreadyExist = false;
        var rightAlreadyExist = false;
        var txt = cm.getSelection();
        
        var cursorLL = moveCursor(cursorL, -fore_.length);
       
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
            
            /* another implementation
            cm.setSelection(cursorR);
            cm.addSelection(cursorL);
            cm.replaceSelections([fore_ ,end_ ]);
            cm.setCursor(cursorL);
            
        }
        else if ( rightAlreadyExist && leftAlreadyExist ) {
            cm.setSelection(cursorRR, cursorR);
            cm.addSelection(cursorL, cursorLL);
            cm.replaceSelections(['','']);
            cm.setCursor(cursorLL);
        }
        else {
            //cm.setSelection(cursorR, cursorL);
            
        }*/
        //cm.setCursor(cursorLL);
        trimPainter(cursorL,cursorR);
    }
}



function trimPainter(cursorL, cursorR){
    var curs = [];
    var startOffset = (fore_.length > end_.length)?fore_.length:end_.length;
    var curStart  = moveCursor(cursorL, -startOffset);
    var curIter = curStart;
    var curSel   = cursorL;
    var stringhead = null;
    var stringend = null;
    var i = 0,j = 0;
    for (var m = 0; cursorOver(cursorR,curIter); ){
        curSel = moveCursor(curIter, fore_.length);
        cm.setSelection(curIter,curSel);
        if (  stringhead==null && (m >= startOffset) ) stringhead = curIter;
        stringend = curIter;

        if ( fore_.length < end_.length && m < end_.length - fore_.length){

        }
        else if(Stringequal(cm.getSelection(),fore_)){
            curs.push({head:curIter,end:curSel});
            i++;
            curIter = moveCursor(curIter, fore_.length);
            m+= fore_.length;
            continue;
        }

        curSel = moveCursor(curIter, end_.length);
        cm.setSelection(curIter,curSel);
        if ( fore_.length > end_.length && m < fore_.length - end_.length){

        }
        else if(Stringequal(cm.getSelection(),end_)){
            curs.push({head:curIter,end:curSel});
            j++;
            curIter = moveCursor(curIter, end_.length);
            m+= end_.length;
            continue;
        }
        
        curIter = moveCursor(curIter,1)
        m++;
    }
    if ( i == j && i > 0 ) {
        i = 1;
        j = 1;
    }
    else if ( i > j ) {
        i = i - j;
        j = 0;
    }
    else if ( i < j ) {
        j = j - i;
        i = 0;
    } 

    //if(cursorOver(cursorL,stringhead))
    if(stringhead!=null)
        cm.setSelection(stringhead);
    
    cm.addSelection(stringend);
    curs.forEach(function (select) {
        cm.addSelection(select.end, select.head);
    });
    console.log('ij:' + i + ' ' + j)

    var replace = [];
    if(cm.listSelections().length < 2 ) {
        if ( i == 0 && j == 0 ) {
            cm.replaceSelections(['']);
            return;
        }
        else {
            var countcat   = (i > j)?i:j;
            var replacetxt = (i > j)?fore_:end_;
            var cat        = '';
            for ( var m = 0; m < countcat; m++ ){
                cat += replacetxt;
            }
            replace.push(cat);
            cm.replaceSelections(replace);
            return;
        }
    }

    var replace = [];
    var cat     = '';
    if ( i == 0 && j == 0 ) {
        replace.push(fore_);
        replace.push(end_);
    }
    else if ( i == 1 && j == 1 ) {
        for (var m = 0; m < 2; m++) {
            replace.push('');
        }
    }
    else {
        var countcat   = (i > j)?i:j;
        var replacetxt = (i > j)?fore_:end_;
        var cat        = '';
        for ( var m = 0; m < countcat; m++ ){
            cat += replacetxt;
        }
        replace.push((i>j)?cat:'');
        
    }

    for (var m = 0 ; m < cm.listSelections().length - 2; m++ ) {
        replace.push('');
    }
    replace.push((i<j)?cat:'')
    cm.replaceSelections(replace, 'around');
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