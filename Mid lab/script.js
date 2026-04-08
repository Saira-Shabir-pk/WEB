/* ==========================================================
   RALPH LAUREN — PAKISTAN  |  script.js
   1. Nav scroll & hamburger
   2. Featured Deals — jQuery AJAX fetch
   3. Deal card rendering (DOM injection)
   4. Quick View modal
   ========================================================== */

$(document).ready(function () {

  /* ── 1. NAV ─────────────────────────────────────────── */
  var $nav        = $('#main-nav');
  var $hamburger  = $('#hamburger-btn');
  var $mobileMenu = $('#mobile-menu');
  var menuOpen    = false;

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 50) {
      $nav.addClass('scrolled');
    } else {
      $nav.removeClass('scrolled');
    }
  });

  $hamburger.on('click', function () {
    menuOpen = !menuOpen;
    if (menuOpen) {
      $mobileMenu.addClass('open').attr('aria-hidden', 'false');
      $hamburger.addClass('active').attr('aria-expanded', 'true');
    } else {
      $mobileMenu.removeClass('open').attr('aria-hidden', 'true');
      $hamburger.removeClass('active').attr('aria-expanded', 'false');
    }
  });

  $(document).on('click', '.mobile-link', function () {
    menuOpen = false;
    $mobileMenu.removeClass('open').attr('aria-hidden', 'true');
    $hamburger.removeClass('active').attr('aria-expanded', 'false');
  });


  /* ── 2. AJAX — fetch 4 products from Fake Store API ── */
  $.ajax({
    url     : 'https://fakestoreapi.com/products?limit=4',
    method  : 'GET',
    dataType: 'json',

    success: function (products) {
      var $grid = $('#deals-grid');
      $grid.empty();

      $.each(products, function (i, product) {
        $grid.append(buildDealCard(product));
      });

      $grid.addClass('loaded');
    },

    error: function () {
      $('#deals-grid').hide();
      $('#deals-error').addClass('visible');
    }
  });


  /* ── 3. BUILD CARD ──────────────────────────────────── */
  function buildDealCard(p) {
    var discountPct  = 10 + (p.id * 7 % 31);
    var originalPrice = (p.price / (1 - discountPct / 100)).toFixed(2);
    var shortTitle   = p.title.length > 50 ? p.title.substring(0, 50) + '...' : p.title;
    var shortDesc    = p.description.length > 90 ? p.description.substring(0, 90) + '...' : p.description;

    var $card   = $('<div>').addClass('deal-card').attr('data-id', p.id);
    var $ribbon = $('<div>').addClass('deal-ribbon').text('-' + discountPct + '%');

    var $imgWrap = $('<div>').addClass('deal-img-wrap');
    $imgWrap.append($('<img>').attr({ src: p.image, alt: shortTitle, loading: 'lazy' }));

    var $body    = $('<div>').addClass('deal-body');
    var $cat     = $('<span>').addClass('deal-category').text(p.category.toUpperCase());
    var $title   = $('<h3>').addClass('deal-title').text(shortTitle);
    var $desc    = $('<p>').addClass('deal-desc').text(shortDesc);

    var $ratingRow = $('<div>').addClass('deal-rating');
    $ratingRow.append(
      $('<span>').addClass('deal-stars').html(buildStars(p.rating ? p.rating.rate : 0)),
      $('<span>').addClass('deal-count').text('(' + (p.rating ? p.rating.count : 0) + ')')
    );

    var $priceRow = $('<div>').addClass('deal-price-wrap');
    $priceRow.append(
      $('<span>').addClass('deal-price').text('$' + p.price.toFixed(2)),
      $('<span>').addClass('deal-orig-price').text('$' + originalPrice)
    );

    var $btnRow  = $('<div>').addClass('deal-btns');
    var $qv      = $('<button>')
                    .addClass('btn deal-quick-view')
                    .text('QUICK VIEW')
                    .attr('data-product', JSON.stringify(p));
    var $addBag  = $('<a>').attr('href', '#').addClass('btn btn-dark').text('ADD TO BAG');

    $btnRow.append($qv, $addBag);
    $body.append($cat, $title, $desc, $ratingRow, $priceRow, $btnRow);
    $card.append($ribbon, $imgWrap, $body);
    return $card;
  }


  /* ── 4. MODAL ───────────────────────────────────────── */
  var $overlay = $('#modal-overlay');

  // Delegated click — cards are injected after page load
  $(document).on('click', '.deal-quick-view', function () {
    var p = JSON.parse($(this).attr('data-product'));
    openModal(p);
  });

  function openModal(p) {
    $('#modal-img').attr({ src: p.image, alt: p.title });
    $('#modal-category').text(p.category.toUpperCase());
    $('#modal-title').text(p.title);
    $('#modal-price').text('$' + p.price.toFixed(2));
    $('#modal-desc').text(p.description);
    $('#modal-rating').html(
      '<span class="deal-stars">' + buildStars(p.rating ? p.rating.rate : 0) + '</span>' +
      '<span class="deal-count"> (' + (p.rating ? p.rating.count : 0) + ' reviews)</span>'
    );
    $overlay.addClass('visible').attr('aria-hidden', 'false');
    $('body').addClass('modal-open');
  }

  function closeModal() {
    $overlay.removeClass('visible').attr('aria-hidden', 'true');
    $('body').removeClass('modal-open');
  }

  $('#modal-close').on('click', closeModal);
  $overlay.on('click', function (e) {
    if ($(e.target).is($overlay)) closeModal();
  });
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });


  /* ── HELPER: star HTML ──────────────────────────────── */
  function buildStars(rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      if (rating >= i)          html += '<i class="fa-solid fa-star"></i>';
      else if (rating >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
      else                       html += '<i class="fa-regular fa-star"></i>';
    }
    return html;
  }

});