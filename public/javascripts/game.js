var name = document.cookie.replace("name=", "");

var socket = io.connect('/');
socket.on('mark', function (data) {
  console.log(data);

  if (data.name == name) return;

  if (name == $('#xName').text() || name == $('#oName').text()) {
    $('#board').addClass('your-turn')
  }

  var mark = data.name == $('#xName').text() ? 'X' : 'O';
  $('#p' + data.placement).text(mark).removeClass('empty');
});

$(function() {
  $('#board td').click(function() {
    $this = $(this);

    // If it's not my turn or this square isn't empty, don't allow this move
    if (!$('#board').hasClass('your-turn') || !$this.hasClass('empty')) return;

    var mark = name == $('#xName').text() ? 'X' : 'O';
    $this.text(mark);
    $this.removeClass('empty');

    $('#board').removeClass('your-turn');

    socket.emit('mark', {
      name: name,
      id: window.location.pathname.replace("/games/", ""),
      placement: $this.attr('id').replace("p", "")
    });
  });
});

