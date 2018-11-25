import $ from 'jquery';

export const URLAddress=
  { complete:'https://localhost/?m=mag/mag_aktlist', 
    completeWithQuery:'https://localhost/?m=mag/mag_aktlist&new=1&pwa' , 
    basic:'https://localhost' };

export function createForm(){
  return $('<form/>')
    .append($('<input/>',{name:'filter[firstname]', type:'text' }))
    .append($('<input/>',{name:'filter[lastname]', type:'text' }))
    .append($('<textarea/>',{name:'filter[message]'}))
    .append($('<input/>',{type:'date', name:'filter[bday]'}))
    .append($('<input/>',{type:'radio', name:'filter[gender]', value:'male'}))
    .append($('<input/>',{type:'radio', name:'filter[gender]', value:'female'}))
    .append($('<input/>',{type:'radio', name:'filter[gender]', value:'other'}))
    .append($('<input/>', { type:'checkbox', name: 'filter[vehicle1]', value:'bike'}))
    .append($('<input/>', { type:'checkbox', name: 'filter[vehicle2]', value:'car'}))
    .append($('<select/>',{ name:'filter[cars]'})
            .append($('<option/>'))
            .append($('<option/>',{ value:'volvo' }))
            .append($('<option/>',{ value:'fiat'  }))
            .append($('<option/>',{ value:'audi' }))
          )
    .append($('<select/>',{ name:'filter[cars_multi][]', multiple: 'multiple'})
            .append($('<option/>',{ value:'volvo'}))
            .append($('<option/>',{ value:'fiat' }))
            .append($('<option/>',{ value:'saab' }))
            .append($('<option/>',{ value:'audi' }))
          )
    .append($('<input/>',{ type:'reset'}))
    .append($('<input/>',{ type:'submit'}));
}

export function createFormWithValues(){
  return $('<form/>')
    .append($('<input/>',{name:'filter[firstname]', type:'text', value: 'Jan' }))
    .append($('<input/>',{name:'filter[lastname]', type:'text', value: 'Kowalski' }))
    .append($('<textarea/>',{name:'filter[message]', value: 'Krótki opis...'}))
    .append($('<input/>',{type:'date', name:'filter[bday]', value:'2014-02-09'}))
    .append($('<input/>',{type:'radio', name:'filter[gender]', value:'male'}))
    .append($('<input/>',{type:'radio', name:'filter[gender]', value:'female', checked:'checked'}))
    .append($('<input/>',{type:'radio', name:'filter[gender]', value:'other'}))
    .append($('<input/>', { type:'checkbox', name: 'filter[vehicle1]', value:'bike'}))
    .append($('<input/>', { type:'checkbox', name: 'filter[vehicle2]', value:'car', checked:'checked' }))
    .append($('<select/>',{ name:'filter[cars]'})
            .append($('<option/>'))
            .append($('<option/>',{ value:'volvo' }))
            .append($('<option/>',{ value:'fiat', selected:'selected' }))
            .append($('<option/>',{ value:'audi' }))
          )
    .append($('<select/>',{ name:'filter[cars_multi][]', multiple: 'multiple'})
            .append($('<option/>',{ value:'volvo'}))
            .append($('<option/>',{ value:'fiat', selected:'selected'}))
            .append($('<option/>',{ value:'saab' }))
            .append($('<option/>',{ value:'audi', selected:'selected' }))
          )
    .append($('<input/>',{ type:'reset'}))
    .append($('<input/>',{ type:'submit'}));
}