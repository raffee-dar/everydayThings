$(function() {

  var aptData, displayData, sortBy, sortDir;

  sortBy = 'aptDate';
  sortDir = 'desc';

  //FUNCTIONS
  function removeApt(aptID) {
    var whichApt = _.find(aptData, function(item) {
      return item.id == aptID;
    });
    aptData = _.without(aptData, whichApt);
    displayData = _.without(displayData, whichApt);
  }

  function listAppointments(info) {

    if (sortDir === 'asc') {
      info = _.sortBy(info, sortBy);
    } else {
      info = _.sortBy(info, sortBy).reverse()
    }

    $.addTemplateFormatter('formatDate', function(value) {
      return $.format.date(new Date(value), 'MM/dd hh:mm p' );
    }); //date formatter

    $('#petList').loadTemplate('appointment-list.html', info, {
      complete: function() {
        $('.pet-delete').on('click', function() {
          $(this).parents('.pet-item').hide(300, function() {
            var whichItem = $(this).attr('id');
            removeApt(whichItem);
            $(this).remove();  
          });
        }); //delete apt

        $('[contenteditable]').on('blur', function() {
          var whichID, fieldName, fieldData;
          whichID = Number($(this).parents('.pet-item').attr('id'));
          fieldName = $(this).data('field');
          fieldData = $(this).text();
          aptData[whichID][fieldName] = fieldData;
        }); // contenteditable on blur

      } // complete
    }); //load template    
  }

  //READ DATA
  $.ajax({
    url: 'js/data.json'
  }).done(function(data) {
    aptData = displayData = data;
    listAppointments(displayData);
  }); //ajax loaded

  //EVENTS

  // click on add appointment
  $('.apt-addheading').on('click',function() {
    $('.card-body').toggle(300);
  }); // click on add appointment

  // click on dropdown menu item
  $('.sort-menu .dropdown-item').on('click', function() {
    var sortDropDown = $(this).attr('id');

    switch (sortDropDown) {
      case 'sort-patientName':
        $('.sort-by').removeClass('active');
        sortBy = 'patientName';
        break;
      case 'sort-patientAddress':
        $('.sort-by').removeClass('active');
        sortBy = 'patientAddress';
        break;
      case 'sort-aptDate':
        $('.sort-by').removeClass('active');
        sortBy = 'aptDate';
        break;
      case 'sort-asc':
        $('.sort-dir').removeClass('active');
        sortDir = 'asc';
        break;
      case 'sort-desc':
        $('.sort-dir').removeClass('active');
        sortDir = 'desc';
        break;
    }

    $(this).addClass('active');
    listAppointments(displayData);
  });

  // Typed in search box
  $('#SearchApts').keyup(function() {
    var searchText = $(this).val();

    displayData = _.filter(aptData, function(item) {
      return (
        item.petName.toLowerCase().match(searchText.toLowerCase()) || 
        item.patientAddress.toLowerCase().match(searchText.toLowerCase()) || 
        item.aptNotes.toLowerCase().match(searchText.toLowerCase())       
      )
    }); // filter

    listAppointments(displayData);
  }); //keyup on search

  $('#aptForm').submit( function(e) {
    var newItem = {};
    e.preventDefault();

    newItem.petName = $('#patientName').val();
    newItem.patientAddress = $('#patientAddress').val();
    newItem.aptDate = $('#aptDate').val();
    newItem.aptNotes = $('#aptNotes').val();

    aptData.push(newItem);
    listAppointments(displayData);
    $('#aptForm')[0].reset();
    $('.card-body').hide(300);
  }); // Submit Form

}); // Document is ready