$(document).ready(function() {

  'use strict';

  const readingProgress = (contentArea, progressBar) => {
      const content = document.querySelector(contentArea);
      const progress = document.querySelector(progressBar);

      const frameListening = () => {
          const contentBox = content.getBoundingClientRect();
          const midPoint = window.innerHeight / 2;
          const minsRemaining = Math.round(progress.max - progress.value);

          if (contentBox.top > midPoint) {
              progress.value = 0;
          }

          if (contentBox.top < midPoint) {
              progress.value = progress.max;
          }

          if (contentBox.top <= midPoint && contentBox.bottom >= midPoint) {
              progress.value =
                  (progress.max * Math.abs(contentBox.top - midPoint)) /
                  contentBox.height;
          }

          window.requestAnimationFrame(frameListening);
      };

      window.requestAnimationFrame(frameListening);
  };

  readingProgress(".c-content", ".reading-progress-bar");


  // =====================
  // Koenig Gallery
  // =====================
  var gallery_images = document.querySelectorAll('.kg-gallery-image img');

  gallery_images.forEach(function (image) {
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = ratio + ' 1 0%';
  });

  // =====================
  // Decode HTML entities returned by Ghost translations
  // Input: Plus d&#x27;articles
  // Output: Plus d'articles
  // =====================

  function decoding_translation_chars(string) {
    return $('<textarea/>').html(string).text();
  }

  // =====================
  // Navigation
  // =====================

  $('.js-nav-toggle').click(function(e) {
    e.preventDefault();
    $('.c-nav-wrap').toggleClass('is-active');
    $(this).toggleClass('c-nav-toggle--close');
  });

  // =====================
  // Responsive videos
  // =====================

  $('.c-content').fitVids({
    'customSelector': [ 'iframe[src*="ted.com"]'          ,
                        'iframe[src*="player.twitch.tv"]' ,
                        'iframe[src*="dailymotion.com"]'  ,
                        'iframe[src*="facebook.com"]'
                      ]
  });

  // =====================
  // Images zoom
  // =====================

  $('.c-content img').attr('data-action', 'zoom');

  // If the image is inside a link, remove zoom
  $('.c-content a img').removeAttr('data-action');

  // =====================
  // Clipboard URL Copy
  // =====================

  var clipboard = new ClipboardJS('.js-share__link--clipboard');

  clipboard.on('success', function(e) {
    var element = $(e.trigger);

    element.addClass('tooltipped tooltipped-s');
    element.attr('aria-label', clipboard_copied_text);

    element.mouseleave(function() {
      $(this).removeAttr('aria-label');
      $(this).removeClass('tooltipped tooltipped-s');
    });
  });


  // =====================
  // Ajax Load More
  // =====================

  var pagination_next_url = $('link[rel=next]').attr('href'),
    $load_posts_button = $('.js-load-posts');

  $load_posts_button.click(function(e) {
    e.preventDefault();

    var request_next_link =
      pagination_next_url.split(/page/)[0] +
      'page/' +
      pagination_next_page_number +
      '/';

    $.ajax({
      url: request_next_link,
      beforeSend: function() {
        $load_posts_button.text(decoding_translation_chars(pagination_loading_text));
        $load_posts_button.addClass('c-btn--loading');
      }
    }).done(function(data) {
      var posts = $('.js-post-card', data);

      $('.js-grid').append(posts);

      $load_posts_button.text(decoding_translation_chars(pagination_more_posts_text));
      $load_posts_button.removeClass('c-btn--loading');

      pagination_next_page_number++;

      // If you are on the last pagination page, hide the load more button
      if (pagination_next_page_number > pagination_available_pages_number) {
        $load_posts_button.addClass('c-btn--disabled').attr('disabled', true);
      }
    });
  });
});
