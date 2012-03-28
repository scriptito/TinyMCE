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

sTextUtils = {
    
  STATE_WHITESPACE:0,
  STATE_TAG:1,
  STATE_WORD:2,
  STATE_CHAR_REF:3,
  
  CHAR_CODE_AMP:"&".charCodeAt(0),
  CHAR_CODE_CARRIAGE:"\r".charCodeAt(0),
  CHAR_CODE_EXCLAIM:"!".charCodeAt(0),
  CHAR_CODE_GT:">".charCodeAt(0),
  CHAR_CODE_LT:"<".charCodeAt(0),
  CHAR_CODE_NEWLINE:"\n".charCodeAt(0),
  CHAR_CODE_PERIOD:".".charCodeAt(0),
  CHAR_CODE_QUESTION:"?".charCodeAt(0),
  CHAR_CODE_SEMI:";".charCodeAt(0),
  CHAR_CODE_SPACE:" ".charCodeAt(0),

  CHARS_PER_LINE: 80,
    
  getMetricsForHtml:function(pText) {

    var lState = this.STATE_WHITESPACE;
    var lPrevState = this.STATE_WHITESPACE;
    var lCharCount = 0;
    var lWhitespaceCount = 0;
    var lWordCount = 0;
    var lLineCount = 0;
    var lLineChars = 0;
    var lSentenceCount = 0;
    var lParagraphCount = 0;
    var lSentenceChars = 0;
    var lBufferStart = 0;
    var lBufferLen = 0;
    var lBuffer = "";

    for (var i = 0; i < pText.length; i++)
    {
      var lCharCode = pText.charCodeAt(i);
      
      switch (lState) {
        case this.STATE_WHITESPACE : 
          if (lCharCode == this.CHAR_CODE_LT) {
            lBufferStart = i;
            lPrevState = lState;
            lState = this.STATE_TAG;
          }
          else 
          {
            lCharCount++;
            lLineChars++;
            if (lLineChars >= this.CHARS_PER_LINE) {
              lLineCount++;
              lLineChars = 0;
            }  
            if (lCharCode == this.CHAR_CODE_AMP) {
              lBufferStart = i;
              lPrevState = lState;
              lState = this.STATE_CHAR_REF;
            }
            else if (this.isPunctuation(lCharCode)) {
              // Nothing to do, but prevent next 2 from being invoked
            }
            else if (!this.isWhitespace(lCharCode)) {
              lWordCount++;
              lSentenceChars++;
              if (lSentenceChars == 1) {
                lSentenceCount++;
              }
              lState = this.STATE_WORD;
            }
            else {
              lWhitespaceCount++;
            }
          }
          break;
        case this.STATE_TAG :
          if (lCharCode == this.CHAR_CODE_GT) {
            var lBuffer = pText.substring(lBufferStart + 1, i).toLowerCase();
            if (lBuffer == "p" || lBuffer == "li") {
              lParagraphCount++;
              lLineCount++;
              lLineChars = 0;
                
              lSentenceChars = 0;
              lState = this.STATE_WHITESPACE;
            }
            else {
              lState = lPrevState;
            }
          }
          break; 
        case this.STATE_CHAR_REF :
          if (lCharCode == this.CHAR_CODE_SEMI) {
            var lBuffer = pText.substring(lBufferStart + 1, i).toLowerCase();
            if (lBuffer == "nbsp") {
              lWhitespaceCount++;
              lState = this.STATE_WHITESPACE;
            }
            else {
              if (lPrevState == this.STATE_WHITESPACE) {
                lWordCount++;
              }
              lState = this.STATE_WORD;
            }
          }
          break;
        case this.STATE_WORD :
          if (lCharCode == this.CHAR_CODE_LT) {
            lBufferStart = i;
            lPrevState = lState;
            lState = this.STATE_TAG;
          }
          else {
            lCharCount++;
            lLineChars++;
            if (lLineChars >= this.CHARS_PER_LINE) {
              lLineCount++;
              lLineChars = 0;
            }  
            lSentenceChars++;
            if (lCharCode == this.CHAR_CODE_AMP) {
              lBufferStart = i;
              lPrevState = lState;
              lState = this.STATE_CHAR_REF;
            }
            else if (this.isPunctuation(lCharCode)) {
              lSentenceChars = 0;
              lState = this.STATE_WHITESPACE;
            }
            else if (this.isWhitespace(lCharCode)) {
              lWhitespaceCount++;
              lState = this.STATE_WHITESPACE;
            }
          }
          break;
        default:
          // TODO throw exception - illegal state
      }
    }

    return {
      "characterCount":lCharCount,
      "paragraphCount":lParagraphCount,
      "sentenceCount":lSentenceCount,
      "whitespaceCount":lWhitespaceCount,
      "wordCount":lWordCount,
      "lineCount":lLineCount
    };
  },
  
  isPunctuation:function(pCharCode) {
    return pCharCode == this.CHAR_CODE_PERIOD || pCharCode == this.CHAR_CODE_EXCLAIM || pCharCode == this.CHAR_CODE_QUESTION;
  },
  
  isPunctuationKeyCode:function(pKeyCode) {
    return (pKeyCode == 190 || pKeyCode == 46) || pKeyCode == 49 || (pKeyCode == 191 || pKeyCode == 47);
  },
  
  isWhitespace:function(pCharCode) {
    return pCharCode == this.CHAR_CODE_SPACE || pCharCode == this.CHAR_CODE_NEWLINE || pCharCode == this.CHAR_CODE_CARRIAGE;
  },
  
  isWhitespaceKeyCode:function(pKeyCode) {
    return pKeyCode == 13 || pKeyCode == 32;
  }
  
};
