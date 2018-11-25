import './../sass/selectable-columns.scss';

var arr_storage = [];
var _typeStorage;

$(document).ready(function () {
  $('.selectableColumns').each(function(i,v){
    selectableColumnOn('#'+$(v).attr('id'),'right');
  }); 
  $(document).on('click',function(evt){
    !!$('.columns-selectable').find(evt.target).length?'':$('.columns-selectable').removeClass('active');
  });

});

function _retrieveChanges() {
  arr_storage = JSON.parse(localStorage.getItem('selectableColumns'));
}

function _saveChanges() {
  setCounter();
  localStorage.setItem('selectableColumns', JSON.stringify(arr_storage));
}
 
function setCounter() {
  arr_storage.forEach(function (v) {
    $('.columns-selectable[data-hash="' + v.hash + '"]')
      .find('.columns-selectable__counter') 
      .text(v.columns.filter(x => x.checked).length + '/' + v.columns.length)
      .addClass('counter-show');
  }
  );
}
 
function setCheckbox(tableObj, str_head,str_body,first) {
  var _tab = arr_storage.find(function (x) { return x.hash == tableObj.hash });
  [].forEach.call(
    $('.columns-selectable').filter(function (i, v) {
      return $(v).data('hash') == tableObj.hash
    }).find('[type=checkbox]'), 
    function (v, i) {
      if (_tab.columns[i].checked === false) {
        v.checked = false;
        showOrHideColumns(tableObj, v,str_head,str_body, first);
      }
    });
}

function selectableColumnOn(table,position) {
  if (localStorage.selectableColumns)
    _retrieveChanges();
  var elem = generateObjectWithHash(table);

  if (!arr_storage.filter(function (x) { return x.hash === elem.hash; }).length) {
    arr_storage.push(elem);
  }
  var _head=$(table).data('header') || 'tbody,tr,th';
  var _body=$(table).data('body') || 'tbody,tr,td';
  var convertSelector = function(data){ return data.split(',').map(function(v){ return v.trim(); }).join('>')};
  createMenu(elem,convertSelector(_head),convertSelector(_body),position);
  setCheckbox(elem,convertSelector(_head),convertSelector(_body), true);
  setCounter();

  $(elem.name+' th, '+elem.name+' td')
    .each(function (i, v) {
      v.addEventListener("animationend", (evt) => {
        if (evt.animationName == 'col-hide') {
          $(evt.target).css('display', 'none');
        }
      }, false);
    });
}

function fetchMenuItems(table) {
  var arr = [];
  $(table + " th").each(function (i, v) {
    $(v).text().trim().length ?
      arr.push({ id: i + 1, value: $(v).text().trim(), checked: true }) : '';
  });
  return arr;
}

function generateObjectWithHash(table) {
  var arr = fetchMenuItems(table);
  var elem = { name: table, columns: arr.slice() };
  elem.hash =
    objectHash({
      name: elem.name,
      columns: elem.columns.map(function (x) { return { id: x.id, value: x.value } })
    });
  return elem;
}

function createMenu(tableObj,str_head,str_body,position) {
  $(tableObj.name+'>tbody>tr>th:last-of-type').css({paddingRight:'25px'});

  $(tableObj.name).css({position:'relative'}).append(
    $('<div/>',{class:'columns-selectable-container'+(position=='right'?' columns-selectable-container--right':'')})
    .append(
    $('<div/>', { class: 'columns-selectable', 'data-ref': tableObj.name, 'data-hash': tableObj.hash })
      .append($('<div/>',
        {
          class: 'columns-selectable__toggler',
          click: function (evt) {
            evt.stopPropagation();
            $(evt.target).closest('.columns-selectable').toggleClass('active');
          }
        })
        .append($('<div/>', { class: 'columns-selectable__counter', text: 'x/y' }))
      )
      .append($('<div/>', { class: 'columns-selectable__list' })
        .append(
          tableObj.columns.map(function (x) {
            return $('<label/>', { class: 'columns-selectable__item', text: x.value })
              .append(
                createCheckboxBindWithColumn(tableObj,str_head,str_body, x.id)
              )
              .append(
                $('<span/>', {
                  class: 'columns-selectable__item-checkmark'
                })
              );
          }
          )
        )
      )
    )
  )
}

function createCheckboxBindWithColumn(tableObj, str_head, str_body ,id) {
  let _check = $('<input/>', { type: "checkbox", 'data-id': id, checked: true });
  _check.on('change', function (evt) {
    showOrHideColumns(tableObj,evt.target, str_head, str_body);
    _saveChanges();
  });
  return _check;
}

function showOrHideColumns(tableObj, element, str_head, str_body , first) {

  arr_storage
    .find(
      function (x) { return x.hash == tableObj.hash; })
    .columns
    .find(function (x) { return x.id == $(element).data('id'); })
    .checked = element.checked;
  if (element.checked) {
    changeState(tableObj, str_head, str_body ,element, 'table-cell');
    $(tableObj.name+'>'+str_head+':nth-of-type('+$(element).data('id')+')')
      .removeClass('col-hide').addClass('col-show');
    $(tableObj.name+'>'+str_body+':nth-of-type('+$(element).data('id')+')')
      .removeClass('col-hide').addClass('col-show');
  } else {
    if (!!first) {
      changeState(tableObj, str_head, str_body ,element, 'none');
    }
    $(tableObj.name+'>'+str_head+':nth-of-type('+$(element).data('id')+')')
      .removeClass('col-show').addClass('col-hide');
    $(tableObj.name+'>'+str_body+':nth-of-type('+$(element).data('id')+')')
      .removeClass('col-show').addClass('col-hide');
  }
}

function changeState(tableObj, str_head, str_body ,element, val) {
  $(tableObj.name+'>'+str_head+':nth-of-type('+$(element).data('id')+')').css('display', val);
  $(tableObj.name+'>'+str_body+':nth-of-type('+$(element).data('id')+')').css('display', val);
}
