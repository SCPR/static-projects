(function() {
  // If the viewer is already loaded, don't repeat the process.
  if (window.DV && window.DV.loaded) return;

  window.DV = window.DV || {};
  window.DV.recordHit = "//www.documentcloud.org/pixel.gif";

  var loadCSS = function(url, media) {
    var link   = document.createElement('link');
    link.rel   = 'stylesheet';
    link.type  = 'text/css';
    link.media = media || 'screen';
    link.href  = url;
    var head   = document.getElementsByTagName('head')[0];
    head.appendChild(link);
  };

  /*@cc_on
  /*@if (@_jscript_version < 5.8)
    loadCSS('//s3.amazonaws.com/s3.documentcloud.org/viewer/viewer.css');
  @else @*/
    loadCSS('//s3.amazonaws.com/s3.documentcloud.org/viewer/viewer-datauri.css');
  /*@end
  @*/
  loadCSS('//s3.amazonaws.com/s3.documentcloud.org/viewer/printviewer.css', 'print');

  // Record the fact that the viewer is loaded.
  DV.loaded = true;

  // Request the viewer JavaScript.
  document.write('<script type="text/javascript" src="//s3.amazonaws.com/s3.documentcloud.org/viewer/viewer.js"></script>');
})();