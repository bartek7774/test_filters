import './../sass/context-menu.scss';

$(document).ready(function(){   
  $('.menu_src').each(function(i, v) {
    if ($(v).find('a').length > 3) {
      $(v).css('display', 'none');
      !!$('body').find('.context-menu').length ?
        $('.context-menu').find('.context-menu__content').append($(v).find('a').clone()) : $('body').append(switchToSideMenu($(v).find('a'),false));
    } else {
      $(v).css('display','block');
      var _temp= $(v).find('a').clone();
      $(v).find('a').closest('table').css({'background-color':'transparent','margin-top':'12px','border':'none'}).empty().append(switchToSideMenu(_temp,true));
    }
  });
});


function switchToSideMenu(elements,horizontal) {
  return $('<div/>', { class: 'context-menu'+(horizontal?' context-menu--h':'') }).append(
    $('<div/>', { class: 'context-menu__toggler' })
      .append($('<div/>', { class: 'context-menu__icon' }))
      .append($('<div/>',
        { class: 'context-menu__title', text: 'Menu kontekstowe' }))
  ).append($('<div/>', { class: 'context-menu__toggler-mid' })
      .append($('<div/>', { class: 'context-menu__icon' })))
  .append(
    $('<div/>', { class: 'context-menu__content' })
      .append(elements.clone())
  );
}