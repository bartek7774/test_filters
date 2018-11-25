import './../sass/main-filters.scss';
import {initFilters} from './functions/form-filters';
import JSON_API from './helpers/filters-api';

$(document).ready(function(){
    initFilters(new JSON_API('filters'));
 });