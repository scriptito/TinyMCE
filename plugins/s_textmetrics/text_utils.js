/**
 * Copyright 2010, Scriptito LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

sTextUtils={STATE_WHITESPACE:0,STATE_TAG:1,STATE_WORD:2,STATE_CHAR_REF:3,CHAR_CODE_AMP:"&".charCodeAt(0),CHAR_CODE_CARRIAGE:"\r".charCodeAt(0),CHAR_CODE_EXCLAIM:"!".charCodeAt(0),CHAR_CODE_GT:">".charCodeAt(0),CHAR_CODE_LT:"<".charCodeAt(0),CHAR_CODE_NEWLINE:"\n".charCodeAt(0),CHAR_CODE_PERIOD:".".charCodeAt(0),CHAR_CODE_QUESTION:"?".charCodeAt(0),CHAR_CODE_SEMI:";".charCodeAt(0),CHAR_CODE_SPACE:" ".charCodeAt(0),getMetricsForHtml:function(g,p){var r=this.STATE_WHITESPACE;var d=this.STATE_WHITESPACE;
var j=0;var h=0;var q=0;var f=0;var k=0;var o=0;var n=0;var b=0;var m=0;var l=0;var a="";p=p||80;for(var e=0;e<g.length;e++){var c=g.charCodeAt(e);switch(r){case this.STATE_WHITESPACE:if(c==this.CHAR_CODE_LT){m=e;d=r;r=this.STATE_TAG}else{j++;k++;if(k>=p){f++;k=0}if(c==this.CHAR_CODE_AMP){m=e;d=r;r=this.STATE_CHAR_REF}else{if(this.isPunctuation(c)){}else{if(!this.isWhitespace(c)){q++;b++;if(b==1){o++}r=this.STATE_WORD}else{h++}}}}break;case this.STATE_TAG:if(c==this.CHAR_CODE_GT){var a=g.substring(m+1,e).toLowerCase();
if(a=="p"||a=="li"){n++;f++;k=0;b=0;r=this.STATE_WHITESPACE}else{r=d}}break;case this.STATE_CHAR_REF:if(c==this.CHAR_CODE_SEMI){var a=g.substring(m+1,e).toLowerCase();if(a=="nbsp"){h++;r=this.STATE_WHITESPACE}else{if(d==this.STATE_WHITESPACE){q++}r=this.STATE_WORD}}break;case this.STATE_WORD:if(c==this.CHAR_CODE_LT){m=e;d=r;r=this.STATE_TAG}else{j++;k++;if(k>=p){f++;k=0}b++;if(c==this.CHAR_CODE_AMP){m=e;d=r;r=this.STATE_CHAR_REF}else{if(this.isPunctuation(c)){b=0;r=this.STATE_WHITESPACE}else{if(this.isWhitespace(c)){h++;
r=this.STATE_WHITESPACE}}}}break;default:}}return{characterCount:j,paragraphCount:n,sentenceCount:o,whitespaceCount:h,wordCount:q,lineCount:f}},isPunctuation:function(a){return a==this.CHAR_CODE_PERIOD||a==this.CHAR_CODE_EXCLAIM||a==this.CHAR_CODE_QUESTION},isPunctuationKeyCode:function(a){return(a==190||a==46)||a==49||(a==191||a==47)},isWhitespace:function(a){return a==this.CHAR_CODE_SPACE||a==this.CHAR_CODE_NEWLINE||a==this.CHAR_CODE_CARRIAGE},isWhitespaceKeyCode:function(a){return a==13||a==32
}};