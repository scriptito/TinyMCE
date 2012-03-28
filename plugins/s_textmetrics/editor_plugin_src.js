/**
 */

(function() {

  tinymce.create('scriptito.plugins.TextMetrics', {
    
    block : 0,
    tid: null,
    ccid : null,
    wcid : null,
    scid : null,
    pcid : null,
    lcid : null,

    init : function(ed, url) {
    
      var t = this;
      
      t.editor = ed;
      
      t.tid = ed.id + "-metrics";
      t.ccid = ed.id + '-character-count';
      t.wcid = ed.id + '-word-count';
      t.scid = ed.id + '-sentence-count';
      t.pcid = ed.id + '-paragraph-count';
      t.lcid = ed.id + '-line-count';
  
      t.state = ed.getParam('s_textmetrics_on');
      
      ed.addCommand("s_toggleMetrics", t._toggleMetrics, t);
      
      ed.addButton('toggle_metrics', { title:'s_textmetrics.button_title', cmd:'s_toggleMetrics' });

      ed.onPostRender.add(function(ed, cm) {
        var row, id;
        id = ed.getParam('textmetrics_target_id');
        if (!id) {
          row = tinymce.DOM.get(ed.id + '_path_row');
          if (row) {
            tinymce.DOM.add(
              row.parentNode, 
              'div', 
              { 'id':t.tid, 'class':'metrics', 'style':'display:' + (t.state ? "block;" : "none;") }, 
              '<span>' + ed.getLang('s_textmetrics.characters', 'Characters: ') + '<span id="' + t.ccid + '">0</span></span>' +
              '<span>' + ed.getLang('s_textmetrics.words', 'Words: ') + '<span id="' + t.wcid + '">0</span></span>' +
              '<span>' + ed.getLang('s_textmetrics.sentences', 'Sentences: ') + '<span id="' + t.scid + '">0</span></span>' +
              '<span>' + ed.getLang('s_textmetrics.paragraphs', 'Paragraphs: ') + '<span id="' + t.pcid + '">0</span></span>' +
              '<span>' + ed.getLang('s_textmetrics.lines', 'Lines: ') + '<span id="' + t.lcid + '">0</span></span>');
          }
          ed.controlManager.setActive('toggle_metrics', t.state);
        } 
        else {
          tinymce.DOM.add(id, 'span', {}, '<span id="' + t.wcid + '">0</span>');
        }
      });

      ed.onSetContent.add(function(ed) {
        t._count(ed);
      });

      ed.onLoadContent.add(function(ed) {
        t._count(ed);
      });

      ed.onUndo.add(function(ed) {
        t._count(ed);
      });
      
      ed.onPaste.add(function(ed) {
        t._count(ed);
      });

      ed.onKeyUp.add(function(ed, e) {
        if (sTextUtils.isWhitespaceKeyCode(e.keyCode) || sTextUtils.isPunctuationKeyCode(e.keyCode)
          || 8 == e.keyCode // Backspace
          || 46 == e.keyCode) { // Delete
          t._count(ed);
        }
      });

    },

    _count : function(ed) {
      var t = this, tc = 0;
  
      if (!t.state || t.block)
        return;
  
      t.block = 1;
  
      setTimeout(function() {
        var tx = ed.getContent({format : 'raw'});
        if (tx) {
          var d = tinymce.DOM;
          var m = sTextUtils.getMetricsForHtml(tx);
          d.setHTML(t.ccid, m.characterCount);
          d.setHTML(t.wcid, m.wordCount);
          d.setHTML(t.scid, m.sentenceCount);
          d.setHTML(t.pcid, m.paragraphCount);
          d.setHTML(t.lcid, m.lineCount);
        }
        t.block = 0;
      }, 1);
    },

    _toggleMetrics:function() {
      var t = this, ed = t.editor;
      t.state = !t.state;
      ed.controlManager.setActive('toggle_metrics', t.state);
      tinymce.DOM.setStyle(t.tid, "display", t.state ? "block" : "none");
      if (t.state) {
        t._count(ed);
      }
     },
    
    getInfo: function() {
      return {
        longname : 'Text Metrics Plugin',
        author : 'Scriptito, LLC',
        authorurl : 'http://www.scriptito.com',
        infourl : 'http://www.scriptito.com',
        version : "1.2.1"
      };
    }
    
  });

  tinymce.PluginManager.add('s_textmetrics', scriptito.plugins.TextMetrics);

})();
