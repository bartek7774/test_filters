var FILTERS=null, DB=null, DEBUG=true;

export function initFilters(IDB){
    calculateHashForms();
    enableModals();
    setDelegateActions();
    setAPI(IDB);
    
    $('.filterable').each(function(i,v){
       updateSessionStorage($(v).data('hash'), true ,function(){ showNotification(true,'Info',`Filtry zosta�y zaktualizowanie.`); });
    });

    document.querySelectorAll('.notification').forEach(function(v){
        v.addEventListener('animationend',function(evt){
          evt.target.classList.remove('show-notification--right','notification--danger');
        });
    });
}

export function setAPI(IDB){
    DB=IDB;
}

export function applyFilter(formToChange,filter,cb){    
    if(!(!!formToChange || !!filter)) return null;
    formToChange.trigger('reset');
    let values=JSON.parse(filter.json);
    Object.keys(values).forEach(v => {
       var ctrl=  formToChange.find('[name=' + v + ']');
       switch (ctrl.attr("type")) {
          case 'radio': {
          }
          case 'checkbox': {
            formToChange.find('[name=' + v + ']' + '[value="' + values[v] + '"]').prop('checked', true);
            break;
          }
          default: 
          {
            if(ctrl.is('select')){
                if(Array.prototype.isPrototypeOf(values[v])){
                    ctrl.attr('size', '10');
                    ctrl.attr('multiple','true');
                  } else{
                    ctrl.attr('size', '1');
                    ctrl.removeAttr('multiple');
                  }
                }
            ctrl.val(values[v]);
            break;
          }
        }
    });
    if(cb) cb();
    return getFields(formToChange);
}

export function calculateHashForms() {
  $('.filterable').each((idx, form) => {
    var jFields = filterFields(form);
    var hashForm = getFormHash(window.location.href, jFields);
    $(form).data('hash', hashForm);
  });
}

export function filterFields(form){
  if(!$(form).is('form')) return null;
  return  $(form).find('input[type=text], input[type=checkbox], input[type=radio], input[type=date], select, textarea').filter((i, v) => $(v).attr('name'));
}

// pola z warto�ciami dla jQuery
export function getFields(form) {
  var jquery_selector = /[\[\]]/gi, key = null;
  var valueToSave = $(form).serializeArray().reduce((arr, next) => {
    key = next.name.replace(jquery_selector, '\\\$&');
    if(key in arr) {
      arr[key] = Array.prototype.isPrototypeOf(arr[key]) ?
        [...arr[key], next.value] : [arr[key], next.value];
      return arr;
    }
    if(!!next.value) {
      arr[key] = next.value;
    }
    return arr;
  }, {});
  return (Object.keys(valueToSave).length===0)? null: valueToSave;
}

// faktyczna funkcja obliczaj�ca hash
export function getFormHash(address, jFields) {
  var hash = objectHash(
          { href: extractLocation(address) , 
            values: removeDuplicate([].map.call(jFields, x => $(x).attr('name'))) 
          });
  return hash;
}

export function extractLocation(address){
    var regexp = /https?:\/\/[\w-\.\d]+\/\?m=(\w+)\/(\w+)/g;
    var _location = regexp.exec(address);
    return (!!_location) ? _location.slice(1, 3) : null;
}

export function removeDuplicate(arr){
   return arr
    .sort()
    .reduce((acc, next, idx) => {
      (acc[acc.length - 1] !== next || idx === 0) ? acc.push(next) : ''; return acc;
    }, []);
}

// funkcja aktualizuj�ca list� wyboru fitr�w dla danego formularza
function updateList(formHash){
  // wywo�anie zapytania db
  updateSessionStorage(formHash);
  // update listy na podstawie danych z db
  return $('.filters')
  .find('.filters__list').data('hash',formHash)
  .empty()
  .append(
     !!FILTERS.length?FILTERS.map(x=>
        $('<div>',
            {
              class:'filters__item',
              click: function(evt){ 
                applyFilter( 
                    $('form').filter((i,v)=>$(v).data('hash')===$(this).closest('.filters__list').data('hash')), x , 
                      ()=>showNotification(true,'Info',`Filtr ${ x.name } zostal zastosowany.`)
                    ); 
                    $(this).closest('.modal').removeClass('show');
              } 
            }
        )
        .append($('<div/>',
          { 
            class:'filters__item-delete',html:'&times;', 
            click:function(evt){
              evt.preventDefault();
              evt.stopPropagation();
              removeFilter(
                      $('form').filter((i,v)=>$(v).data('hash')===$(this).closest('.filters__list').data('hash')), x );
                      $(this).closest('.modal').removeClass('show');  
              }
          })
         )              
        .append(
           $('<div/>', { class: 'filters__name', text: x.name })
        )
        .append(
            (x.description && x.description.trim().length ) ? 
                ( 
                  (x.description.trim().split(';').length>1)? 
                    $('<div/>', { class: 'filters__description', css: { margin:'3px 0' }}).append(x.description.trim().split(';').map( v=>$('<div/>',{ class: 'filters__element', text: v })))
                    : $('<div/>', { class: 'filters__description', text: x.description })
                ): $('<div/>', { class: 'filters__description', text: 'Brak opisu.'})
            )
        ): $('<div>', { class: 'filters__empty', text: 'Nie posiadasz filtrow dla tego formularza.' })
    );
}

function updateSessionStorage(formHash,refresh,cb){
   if(!refresh){
      FILTERS=JSON.parse(sessionStorage.getItem('filters'));
      return FILTERS;
   }   
   var processResult=(data)=>{
      if(data){          
        sessionStorage.setItem('filters',
         JSON.stringify(data));
         FILTERS=JSON.parse(sessionStorage.getItem('filters'));
         if(cb) cb();
      } else {
        sessionStorage.setItem('filters',
         JSON.stringify([]));
         FILTERS=JSON.parse(sessionStorage.getItem('filters'));
      }
   };
   
   DB.list(formHash).then(processResult).catch((err)=>{
        if(DEBUG) console.log('errMsg ',err);
        showNotification(false,'Blad ','errMsg');
    });

}

export function setDefaultDescription(jFields){
    var regex=/[\w\d]+\[([\w\d_]+)\]/;
    var _temp=jFields.map(function(i,v){ return { 
                    key:  !!regex.exec($(v).attr('name'))?regex.exec($(v).attr('name')).slice(1,2) : $(v).attr('name') , 
                    value : 
                    $(v).is('select')? 
                    $(v).find('option').filter(function(i,x){ return $(v).val()==$(x).val(); }).text().trim()  : 
                            $(v).val() } } );
    return ([].map.call(_temp, v=> v.key[0].toUpperCase().concat(v.key.slice(1))+': '+v.value)).slice(0,4).join('; \n');
}

function showNotification(context,title,message){
  $('.notification').find('.notification__title').empty().text(title).end()
  .find('.notification__message').empty().text(message).end().toggleClass('show-notification--right '+((!context)?'notification--danger':''));
}

function createConfirm(title,message){
  return $('<div/>',{class:'filters' })
    .append(
      $('<div/>',{class:'filters__header',text:title})
    )
    .append(
      $('<div/>',{class:'filters__content'})
      .append($('<div/>',{class:'filters__empty',text:message, css:{'margin':'30px 0'}}))
    )
    .append(
      $('<div/>',{class:'filters__actions'})
      .append($('<div/>',{class:'filters__btn-group'})
        .append($('<input/>',{ type:'button', value:'Tak', id:'yes', class:'btn-agree'}))
        .append($('<input/>',{ type:'button', value:'Nie', id:'no', class:'btn-dis'}))
      )
    );
}

function CustomConfirm(info,cb,err){
    $('#confirm').find('.modal__content').empty()
      .append(createConfirm(info.title,info.message));
    $('#confirm').toggleClass('show');

    $('#confirm').find('#yes').one('click',function(evt){
      cb();
      $('#confirm').removeClass('show');
      $('#confirm').find('input[type="button"]').off('click');
    });
    $('#confirm').find('#no').one('click',function(evt){
      err();
      $('#confirm').removeClass('show');
      $('#confirm').find('input[type="button"]').off('click');
    });
}

export function enableModals() {
   
  // zamykanie modala
  $('.modal').on('click', '[data-close]', function (evt) {
    $(evt.delegateTarget).removeClass('show');
  });

  // okno z wyborem filtra dla danego formularza
  $("form [data-filter='choose']").on("click", function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var hash = $(evt.target).closest('form').data('hash');
    updateList(hash);
    $('#filterList').addClass('show');
  });

  // przycisk otwierajcy zapis filtra
  $("form.filterable [data-filter='save']").on("click", function (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // zapis filtra do bazy
    var jFields = filterFields($(this).closest('form'));

    var defaultDescription=setDefaultDescription(jFields);
    var hash = $(this).closest('form.filterable').data('hash');

    $('#filterAdd').find('textarea').val(defaultDescription).end().addClass('show');
    $('#filterAdd').find('form').data('info', { hash: hash, filterToSave: jFields });
 
  });

  // okno z zapisem filtra dla danego formularza
  $('form#addForm').on('submit', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
    
    saveFilter(this, $(this).data('info'), setSuccessFunc, setErrorFunc, setConfirmFunc);
    
    $(this).closest('.modal').removeClass('show');
    $(this).data('info', null);
  });
  
  // powiadomienia o rezultach
  document.querySelectorAll('.notification').forEach(v=>
    v.addEventListener('animationend',evt=> evt.target.classList.remove('show-notification'))
  );
}

export function removeFilter(form, filter) {
  var processResult=(data)=>{
      if(DEBUG) console.log('data',data);
      (!!data)? updateSessionStorage($(form).data('hash'), true, showNotification.bind(this,true,'Info', 'Filtr ' + filter.name+ ' zostal usuniety.'))
        :showNotification(false,'Blad',!!data['message']?data['message']:'Nieokreslony blad.');
  };
  var processError=(err)=>{
        if(DEBUG) console.log('errMsg ',err);
        showNotification(false,'Blad ','errMsg');
  }
  if (!!filter) {
    CustomConfirm({
      title: 'Uwaga',
      message: 'Czy napewno chcesz usun filtr ' + filter.name + '?'
    }, function () {        
        DB.remove($(form).data('hash'),filter).then(processResult).catch(processError); 
    }, function () {
      console.log('Anuluj');
    });
  }
}

export function saveFilter(data,formInfo,successFunc,failureFunc){
    var infoFields = { ...getFields(formInfo)}, filterValues= getFields(data.filterToSave);

    var toSave=JSON.stringify({
        hashform: data.hash,
        filter: { values: JSON.stringify(filterValues), ...infoFields } 
    });

    var filter = !!FILTERS ? FILTERS.filter(x=> x.name == infoFields.name && x.hashform==data.hash) : null;

    if (!!filter.length) 
    {
      CustomConfirm({
        title: 'Uwaga',
        message: 'Filtr o nazwie już istnieje. Nadpisac istniejacy?'
      }, 
      ()=> DB.edit(toSave)
              .then(successFunc({ hash:data.hash, edit:true, name:infoFields.name}))
              .catch(failureFunc()), 
      ()=> console.log('no'));
    } else {
        DB.save(toSave)
          .then(successFunc(({ hash:data.hash, name:infoFields.name})))
          .catch(failureFunc());      
    }
}

function isFilterExists(filters,{name,hash}){
  return !!filters ? !!filters.filter(x=> x.name === name && x.hashform === hash).length:null;
}

function prepareDataToSend(
  infoForm,
  formVal={hash:null,filterToSave=null}){
    var infoFields = { ...getFields(infoForm)}, filterValues= getFields(formVal.filterToSave);
    return {
        hashform: formVal.hash,
        filter: { values: JSON.stringify(filterValues), ...infoFields } 
    };
}

export function setSuccessFunc(config={}){
  return (res)=>{
    if(DEBUG) console.log('log: ',res);
    !!res? 
      updateSessionStorage(
        config.hash, true, 
        showNotification.bind(this,true,'Info','Filtr '+config.name+(config.edit?' zaktualizowany.':' zostal dodany.'))
      )
    : showNotification(false,'Blad',!!res['message']?res['message']:'Nieokreslony blad.');
  };
}

export function setErrorFunc(){
  return (err)=>{
    if(DEBUG) console.log('errMsg ',err);
    showNotification(false,'Blad ','errMsg');
  };
}