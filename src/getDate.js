$(function() {
    $( "#datepicker" ).datepicker();
    
    //selecting the button and adding a click event
    $("#alert").click(function() {
      //alerting the value inside the textbox
      var date = $("#datepicker").datepicker("getDate");
      alert($.datepicker.formatDate("dd-mm-yy", date));
    });
  });