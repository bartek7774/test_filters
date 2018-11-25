import $ from 'jquery';
import objectHash from 'object-hash';

import {createForm, createFormWithValues, URLAddress} from './helpers/fixtures.form-filters';
import * as functions from './../../js/functions/form-filters';

beforeAll(()=>{
   global.$ =$;
   global.objectHash=objectHash;
});
    
describe('extracting fields using jQuery', () => {
  var formWithoutValues=null, formWithValues=null;
  
  beforeAll(() => {
    formWithoutValues=createForm();
    formWithValues=createFormWithValues();
    console.log('Creating new form');
  });

  test('should return list of 11 elements', () => {
      expect(functions.filterFields(formWithoutValues).length).toBe(11);
  });
  
  test('if it is not form element, should return null', () => {
      expect(functions.filterFields($('<div/>'))).toBeNull();
  });
  
  test('if there are no fields to save', () => {
      expect(functions.getFields(formWithoutValues)).toBeNull();
  });

  test('if there are fields to save, should return object', () => {
    expect(functions.getFields(formWithValues)).toEqual({
        "filter\\[bday\\]": "2014-02-09",
        'filter\\[cars\\]': "fiat",
        'filter\\[cars_multi\\]\\[\\]': ["fiat", "audi"],
        'filter\\[firstname\\]': "Jan",
        "filter\\[gender\\]": "female",
        'filter\\[lastname\\]': "Kowalski",
        'filter\\[vehicle2\\]': "car"
    });
  });

  test('should set values provided by filter', () => {
      expect(functions.applyFilter(
              formWithoutValues,
              {
                json: 
                JSON.stringify({
                    "filter\\[bday\\]": "2014-02-09",
                    'filter\\[cars\\]': "fiat",
                    'filter\\[cars_multi\\]\\[\\]': ["fiat", "audi"],
                    'filter\\[firstname\\]': "Jan",
                    "filter\\[gender\\]": "female",
                    'filter\\[lastname\\]': "Kowalski",
                    'filter\\[vehicle2\\]': "car"
                })
              }
            )
         ).toEqual({
        "filter\\[bday\\]": "2014-02-09",
        'filter\\[cars\\]': "fiat",
        'filter\\[cars_multi\\]\\[\\]': ["fiat", "audi"],
        'filter\\[firstname\\]': "Jan",
        "filter\\[gender\\]": "female",
        'filter\\[lastname\\]': "Kowalski",
        'filter\\[vehicle2\\]': "car"
    });
  });
    
});

describe('processing data which can be used by script', () => {
    
    var formWithoutValues=null, formWithValues=null;
  
    beforeAll(() => {
        formWithoutValues=createForm();
        formWithValues=createFormWithValues();
        console.log('Creating new form');
    });
   
   test('two forms with the same fields name(different values) and url should have the same hash', 
    () => {
        expect(functions.getFormHash(URLAddress.complete, formWithoutValues))
            .toEqual(functions.getFormHash(URLAddress.complete, formWithValues));
   });
   
   test('two forms with the same fields name and different url(extracted modules,view) should have different hash', 
    () => {
        expect(functions.getFormHash(URLAddress.complete, formWithoutValues))
                .not.toEqual(functions.getFormHash(URLAddress.basic, formWithValues));
   });   
   
   test('should remove duplicate and sort array [1,2,2,3,4,55,2,5]', 
    () => {
        expect(functions.removeDuplicate([1,2,2,3,4,55,2,5])).toEqual([1,2,3,4,5,55]);
   });
   
   test('should return null from url without specified module and view', 
    () => {
        expect(functions.extractLocation(URLAddress.basic)).toBeNull();
   });
   
   test('should extract module and view from url', 
    () => {
        expect(functions.extractLocation(URLAddress.complete)).toEqual(['mag','mag_aktlist']);
   });
   
   test('should extract module and view from url(with queryString)', 
    () => {
        expect(functions.extractLocation(URLAddress.completeWithQuery)).toEqual(['mag','mag_aktlist']);
   });
      
});

describe('calling external api',()=>{

});