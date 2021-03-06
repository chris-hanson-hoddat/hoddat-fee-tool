/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (
  window.sessionStorage && window.sessionStorage.getItem('prototypeWarning') !== 'false' &&
  window.console && window.console.info
) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
  window.sessionStorage.setItem('prototypeWarning', true)
}

$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()
})



// VALIDATION
// https://github.com/abbott567/validation-for-prototypes

// Config
var defaultErrorHeading = 'There\u2019s been a problem';
var defaultErrorDescription = 'Check the following';
var defaultErrorMessage = 'There is an error';

function clearValidation() {
  $('.error-summary').remove();

  $('.error').each(function () {
    $(this).removeClass('error');
  });

  $('.error-message').each(function () {
    $(this).remove();
  });
}

function checkTextFields(errors) {
  $(document).find('input[type="text"], textarea').each(function () {
    var $fieldset = $(this).parents('fieldset');
    var label = $(this).parent().find('label').clone().children().remove().end().text();

    if ($fieldset.attr('data-required') !== undefined && $(this).val() === '' && !$(this).parent().hasClass('js-hidden')) {
      if ($(this).attr('id') === undefined) {
        $(this).attr('id', $(this).attr('name'));
      }

      errors.push(
        {
          id: $(this).attr('id'),
          name: $(this).attr('name'),
          errorMessage: $fieldset.attr('data-error').toLowerCase() || defaultErrorMessage.toLowerCase(),
          label: label,
          type: 'text'
        }
      );
    }
  });
  return;
}

function checkSelectors(errors) {
  var checked = [];

  $(document).find('input[type="radio"], input[type="checkbox"]').each(function () {
    var $fieldset = $(this).parents('fieldset');
    var label = $fieldset.find('legend').clone().children().remove().end().text();

    if ($fieldset.attr('data-required') !== undefined && $fieldset.find(':checked').length === 0) {
      if ($(this).attr('id') === undefined) {
        $(this).attr('id', $(this).attr('name'));
      }

      if (checked.indexOf($(this).attr('name')) < 0) {
        checked.push($(this).attr('name'));
        errors.push(
          {
            id: $(this).attr('id'),
            name: $(this).attr('name'),
            errorMessage: $fieldset.attr('data-error') || defaultErrorMessage,
            label: label,
            type: 'text'
          }
        );
      }
    }
  });
}

function appendErrorSummary() {
  var summaryNotPresent = $(document).find('.error-summary').length === 0;

  if (summaryNotPresent) {
    $('.link-back').after(
      '<div class="error-summary" role="group" aria-labelledby="error-summary-heading" tabindex="-1">' +
        '<h1 class="heading-medium error-summary-heading" id="error-summary-heading">' +
          defaultErrorHeading +
        '</h1>' +
        '<p>' +
          defaultErrorDescription +
        '</p>' +
        '<ul class="error-summary-list">' +
        '</ul>' +
      '</div>'
    );
  }
}

function appendErrorMessages(errors) {
  for (var i = 0; i < errors.length; i++) {
    if ($(document).find('a[href="#' + errors[i].id + '"]').length === 0) {
      $('.error-summary-list').append(
        '<li><a href="#' + errors[i].id + '">' + errors[i].label + ' - ' + errors[i].errorMessage + '</a></li>'
      );
      var $fieldset = $(document).find('#' + errors[i].id).parents('fieldset');
      var $formgroup = $(document).find('#' + errors[i].id).parents('.form-group');

      $formgroup.addClass('form-group-error');

      if ($fieldset.find('.error-message').length === 0) {
        if ($fieldset.find('input[type="text"]').length > 0 || $fieldset.find('textarea').length > 0) {
          if ($fieldset.find('.form-date').length > 0) {
            $fieldset.find('.form-date').before(
              '<span class="error-message">' +
                errors[i].errorMessage +
              '</span>'
            );
          } else {
            $fieldset.find('label').append(
              '<span class="error-message">' +
                errors[i].errorMessage +
              '</span>'
            );
          }
        } else if ($fieldset.find('input[type="radio"]').length > 0 || $fieldset.find('input[type="checkbox"]')) {
          $formgroup.prepend(
            '<span class="error-message">' +
              errors[i].errorMessage +
            '</span>'
          );
        }
      }
    }
  }
}

$(document).on('submit', 'form', function (e) {
  var requiredFieldsPresent = $(document).find('[data-required]').length > 0;

  clearValidation();

  if (requiredFieldsPresent) {
    var errors = [];

    checkTextFields(errors);
    checkSelectors(errors);

    if (errors.length > 0) {
      e.preventDefault();
      appendErrorSummary();
      appendErrorMessages(errors);
      $(document).scrollTop(0);
    }

  }
});
