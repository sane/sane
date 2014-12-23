(function($) {
  var $document = $(document);
  
  // replace intro video thumbnail with youtube embed
  $document.on('flatdoc:ready', function() {
    $('#sane-stack-quickstart').prev('p').find('> a')
      .replaceWith('<iframe width="854" height="510" src="//www.youtube.com/embed/zWU6dRNpNtc" frameborder="0" allowfullscreen></iframe>')
  })
  
})(jQuery);
