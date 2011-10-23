// Now, javascript is the magic that does the magic
// Pay close attention to the code
// First, you have to create method that actualy do the job
// That is, swaps ugly interface with nice jquery UI interface/plugin
// Param $context? why? Because, in Diem, form fields are added or removed dynamicly
// So, when field is added, you want to add new UI to that field
// Not to add same functionality to all the fields, this can be bugy for some jQuery plugins
// $context is newly loaded DOM element, so you search it for .sfWidgetFormColorPicker
function initializeSfWidgetFormColorPicker($context) {
    // Lets find those color picker widgets
    var $widgets = null;
    // Lets search those widgets in newly loaded DOM element
    if ($context != undefined) $widgets = $($context.find('.sfWidgetFormColorPicker'));
    // How can $context can be undefined? Well, this is the case in admin, there are no dynamic adding of form fields
    // for now, I guess, maybe some day...
    // But if that happens, we will just change this portion of code, and some portion below, you will see :)
    else $widgets = $('.sfWidgetFormColorPicker');
    
    
    // When we have it, lets replace them with our jQuery color picker
    // Remeber the structure of ending HTML
    // <div class="dmColorPickerPlugin sfWidgetFormColorPicker">
    //   <input type="hidden or text? depends..." id="testbase_admin_form_testdate" style="width: 100px;" size="7" maxlength="7" value="#785959" name="testbase_admin_form[testdate]"> 
    //   <div class="colorSelector"><div style="background-color: rgb(120, 89, 89);"></div></div>
    // </div>
    $.each($widgets, function(){
        // We are searching input field
        var $inputField = $(this).find('input');
        // and our color picker will be that field
        var $cp = $inputField;
        // but what if input field is set to be hidden?
        // we have to use color selector box for click event in order to show color palete
        if ($inputField.attr('type') == 'hidden') $cp = $(this).find('.colorSelector div');
        
        
        // THIS IS FIRST JAVA SCRIPT BUG OR FEATURE
        // if the input field is hidden, we can not get 'change' event
        // In Diem -> that means that when we have changed the value, the field in admin will not be marked with green color
        // So we are doing the Diem work by our selfs
        // This is important for admin, not for view
        // But it is nice feature of Dime, so we should implement it
        // We are using this var to check if new value is different from the initial one
        // AGAIN THIS IS SUPPORT FOR DIEM ADMIN
        // AND IT IS REQUIRED ONLY WHEN FORM FIELD IS HIDDEN AND JAVASCRIPT DOES NOT FIRE CHANGE EVENT!!!
        var initialValue = $inputField.val();
        // This function will check if new value is different from initial
        var changedValue = function() {
            // In diem, .sf_admin_form_row will become green if .dm_row_modified is added to that element
            // simply, find closest (see jQuery closest() method) parent with sf_admin_form_row class
            // and if new value is different from initial add dm_row_modified class
            // or remove it, if those values are the same
            // or -> add green, remove green :)
            if ($inputField.val() != initialValue) $inputField.closest('.sf_admin_form_row').addClass('dm_row_modified');
            else $inputField.closest('.sf_admin_form_row').removeClass('dm_row_modified');
            
            // NOTE this method should be caled in code when value of the underlined sfWidgetForm field is changed
            
        }
        
        
        // Lets initialize color picker -> this is specific for each jQuery plugin, so read the docs and you will manage to create whatever you want...
        $cp.ColorPicker({            
            onShow: function (colpkr) {                 
		$(colpkr).maxZIndex().fadeIn(500);
		return false;
            },
            onHide: function (colpkr) {
                    $(colpkr).fadeOut(500);
                    return false;
            },
            onChange: function (hsb, hex, rgb) {
		$inputField.val('#' + hex);
                $inputField.parent().find('.colorSelector div').css('backgroundColor', '#' + hex);
                
                // This is place when input field will be changed
                // So call the method to 'make green' if is suitable
                changedValue();
                
                
            },
            onSubmit: function(hsb, hex, rgb, el) {
		$(el).val('#' + hex);
		$(el).ColorPickerHide();
                
                // This is place, as well, when input field will be changed
                // So call the method to 'make green' if is suitable
                changedValue();
                
            }
        });
        // Why this part of the code?
        // Well, we have created jQuery color picker
        // We have to setup its default value
        if ($inputField.val() != '') {
            // We set default value for color picker
            $inputField.ColorPickerSetColor($inputField.val());
            // and color of colored box as well
            $inputField.parent().find('.colorSelector div').css('backgroundColor', $inputField.val());
            
        };
        // we want that when color selector box is clicked as well
        // to show palete
        // this is required when booth are shown
        // because, for input field color picker is attached
        // If you dont understand this, dont bother...
        $inputField.parent().find('.colorSelector').click(function(){
            $inputField.click();
        });
        // Someone entering HEX code manualy
        // Why not to change the color on the fly? :)
        $inputField.keypress(function(){
            $inputField.ColorPickerSetColor($inputField.val());
            $inputField.parent().find('.colorSelector div').css('backgroundColor', $inputField.val());
        });        
    });
}

// Thats it! We have a code that replace borring Symfony input form field with nice color picker
// Now we have to activate it

// For Admin
// Only Admin has wrapper with ID dm_admin_content
// So, this is where we use document.ready
// If has it, we are replacing all color picker Symfony fields with jQuery color picker
$(document).ready(function(){
    var $check = $('#dm_admin_content'); // Have to check if it is an admin form :)
    if ($check.length >0) initializeSfWidgetFormColorPicker($(this)); 
});

// View
// When widget in view is added, dmWidgetLaunch is fired
// We are listening to that event in DOM portion that is loaded
// And in that context, we are creating color picker
// Since we are working in that context only, color pickers are added where new color picker widgets are added
(function($) {
    $('#dm_page div.dm_widget').bind('dmWidgetLaunch', function() {
        initializeSfWidgetFormColorPicker($(this));        
    });
})(jQuery);

// Form
// Form are rendered troug ajax -> fire event dmAjaxResponse
// We are not aware how many dialogs will be created
// So we are using live to attach events to the dialogs -> see live() event
// And when dialog loads form (new HTML DOM elements)
// We are replacing color picker widgets with jQuery color picker
(function($) {
    $('div.dm.dm_widget_edit_dialog_wrap').live('dmAjaxResponse', function() {
        initializeSfWidgetFormColorPicker($(this));        
    });
})(jQuery);

// Nice concept, isnt? This can be reused for all newly created widgets...

// Hope you understand this...