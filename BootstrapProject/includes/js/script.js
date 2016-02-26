/*

My Custom JS
============

Author:  Balgopal
Updated: feb 2016
Notes:	 Hand coded for Udemy.com

*/
$(function(){
    $('#alertMe').click(function(e){
    e.preventDefault();
    $('#successAlert').slideDown();
  });


  $('button.pop').popover();
  $('[rel="tooltip"]').tooltip();
});
