window.onload = function (event) {
  return console.log('hello');
};

$('.owl-carousel-header').owlCarousel({
  loop: true,
  margin: 10,
  nav: false,
  dots: false,
  responsive: {
    0: {
      items: 1
    }
  }
});
$('.owl-carousel-partners').owlCarousel({
  loop: true,
  margin: 10,
  nav: false,
  dots: false,
  autoplay: true,
  responsive: {
    0: {
      items: 1
    },
    765: {
      items: 3
    },
    1000: {
      items: 6
    }
  }
}); // Bread collapse script

$(document).on('click', '.bread_collapse__item__tab', function () {
  $('.bread_collapse__item').removeClass('bread_collapse__item--active');
  $(this).parent().addClass('bread_collapse__item--active');
}); // Progress bars percent sync

var syncBars = function syncBars() {
  var fullwidth = $('.progress__bars__item__bar').width();
  $('.progress__bars__item__bar span').each(function () {
    var barwidth = $(this).width();
    var percent = Math.round(barwidth * 100 / fullwidth);
    $(this).parent().prev('.progress__bars__item__info').find('.progress__bars__item__percent').html(percent + '%');
  });
};

var syncBarsInterval = function syncBarsInterval() {
  syncBars();
  setTimeout(function () {
    return syncBarsInterval();
  }, 1000);
};

$(document).ready(function () {
  syncBars();
  setTimeout(function () {
    return syncBarsInterval();
  }, 1000);
});
$('.scores__item__count').each(function () {
  var options = {
    duration: 1.5,
    useEasing: false,
    separator: '',
    decimal: ''
  };
  var id = $(this).attr('id');
  var count = parseInt($(this).data('count'));
  var demo = new CountUp(id, 0, count, 0, 3, options);

  if (!demo.error) {
    demo.start();
  } else {
    console.error(demo.error);
  }
});
$('.navbar__bar__toggler').click(function () {
  $('.navbar__bar__collapse').toggleClass('navbar__bar__collapse--open');
});