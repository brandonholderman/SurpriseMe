'use strict';

const generatorView = {};

// const render = function(drink){
//   let template = Handlebars.compile($('#drink-template').text());
//   return template(drink);
// };

//////// ** DRINK / ING OPTIONS FILTERS ** ////////
////////////////////////////////////////

generatorView.populateFilters = function(){
  let template = Handlebars.compile($('#option-template').text());
  // Drinks.fetchAll();
  // console.log(Drinks.all);
  Drinks.all.map(ele => {
    // console.log(ele);
    $('#drink-filter').append(ele);

  });

  Drinks.allDrinks(function(rows) {
    if($('#drink-filter option').length < 2) {
      $('#drink-filter').append(rows.map(row => template({val:row.drinks})));
    }
  });

  Drinks.allIngredients(function(rows) {
    if($('#ingredient-filter option').length < 2) {
      $('#ingredient-filter').append(rows.map(row => template({val:row.ingredients})));
    }
  });

};

generatorView.index = function(drinkSelect){
//   $('#drink-data-section').show().siblings().hide();
// $('#drink-data-section div').remove();
  drinksSelect.forEach(a => $('#drink-data-section').append(render(a)))
  generatorView.populateFilters();
  // generatorView.handleFilters();
}


//////// ** HANDLE  OPTIONS FILTERS ** ////////
////////////////////////////////////////
// generatorView.handleFilters = function(){
//   $('#filters').on('change', 'select', function( {
//     let resource = this.id.replace('-filter', '');
//     page(`/${resource}/${$(this).val().replace(/\W+/g, '+')}`);
//   }));
// };





Drinks.fetchAll(generatorView.populateFilters);
// generatorView.handleFilters();
