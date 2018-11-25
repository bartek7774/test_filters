import $ from 'jquery';

import {setAPI, saveFilter, removeFilter} from './../../js/functions/form-filters';
import JSON_API from './../../js/helpers/filters-api.arr';

describe('testing CRUD methods', () => {
    
    var _api = new JSON_API();
   
    beforeAll(() => {
       _api = new JSON_API();
       setAPI(_api);
       console.log('Connection has been established.');
    });
    
       
    test('should add new filter', () => {
      expect.assertions(1);
      return _api.save(
          JSON.stringify(
             {
                filter: { name:'Filter1', description:'Description first' },
                hashform:'123',
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
             ).then(data=>{ expect(data).toBeTruthy() });
    });
    
    test('should return array with no elements', () => {
      expect.assertions(1);
      return _api.list('123').then(data=>{ expect(data.length).toBe(1) });
    });

    // test('should delete filter');
    // test("should update filter");

});