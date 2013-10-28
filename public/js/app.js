/**
 * Created by thecht on 10/28/13.
 */
var chat = io.connect('http://localhost:2014/')
chat.on('updatechat', function (username, data) {
    $('#conversation').append('<div>' + '<b>' + username + ':</b> ' + data + '<br>' + '</div>');
});

chat.on('updateusers', function (data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        $('#users').append('<li>' + key + '</li>');
    });
    var totalUsers = $('#users').children().length;
    $('.total-users').html(totalUsers);
});
$(function () {
    $('#datasend').click(function () {
        var message = $('#data').val();
        if (message == '' || message == null) {
            return;
        }
        $('#data').val('');
        chat.emit('sendchat', message);
    });
    $('#createUser').click(function () {
        chat.emit('adduser', prompt("What's your name?"));
    });
    $('#btnUp').click(function(){
        chat.emit('movement', 'up');
    })
    $('#btnNorth').click(function(){
        chat.emit('movement', 'north');
    })
    $('#btnDown').click(function(){
        chat.emit('movement', 'down');
    })
    $('#btnWest').click(function(){
        chat.emit('movement', 'west');
    })
    $('#btnSouth').click(function(){
        chat.emit('movement', 'south');
    })
    $('#btnEast').click(function(){
        chat.emit('movement', 'east');
    })
    $('#data').keypress(function (e) {
        if (e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
            $(this).focus();
        }
    });
});