<?php
/**
 * sfWidgetFormColorPicker replaces text field with jQuery color picker
 *
 * @author TheCelavi
 */
class sfWidgetFormColorPicker extends sfWidgetFormInputText {
    
    // The widget
    // Added configuration that will suit our widget needs
    public function __construct($options = array(), $attributes = array()) {        
        parent::__construct($options, $attributes);
        // See config.yml -> there are explanation what is what for
        $this->addOption('default_maxlength', sfConfig::get('dm_dmColorPickerPlugin_default_maxlength')); 
        $this->addOption('widget_width', sfConfig::get('dm_dmColorPickerPlugin_defualt_widget_width'));
        $this->addOption('show_elements', sfConfig::get('dm_dmColorPickerPlugin_show_elements'));
    }

    public function render($name, $value = null, $attributes = array(), $errors = array()) {
        
        // This is just setting up of the options and attributes of widget based on configuration of the widget
        // This can be done better, of course
        // We check if the user have set for this specific widget its own specific values
        // Or we are using the defaults one from the config.yml
        $maxlength = ($this->getAttribute('maxlength')) ? $this->getAttribute('maxlength') : $this->getOption('default_maxlength');
        $size = ($this->getAttribute('size')) ? $this->getAttribute('size') : $this->getOption('default_maxlength');
        if ($style = $this->getAttribute('style')) {
            if (!strpos($style, 'width')) {
                $style .= 'width: '. $this->getOption('widget_width'). ';';
            }
        } else $style = 'width: '.$this->getOption('widget_width').';';        
        if ($this->getOption('show_elements') == 'color') $this->setOption ('type', 'hidden');
        
        // This is HTML code to render input field
        $input = parent::render($name, $value, array_merge($attributes, array_merge($attributes, array("maxlength"=>$maxlength, "size"=>$size, "style"=>$style))), $errors);
        // This is HTML code to render colored box -> see provided CSS file
        $colorSelector = ($this->getOption('show_elements') == 'input') ? '' : '<div class="colorSelector"><div></div></div>';
        
        
        // This could be nice if we can use Front layout helper :) but, we have to hard code HTML
        return sprintf('
            <div class="dmColorPickerPlugin sfWidgetFormColorPicker">
               %s %s
            </div>', $input, $colorSelector);
        // Note sfWidgetFormColorPicker class -> we use that for the javascript to select the container and other elements inside
    }
    
    public function getJavaScripts() {     
        return array(
            'lib.max-z-index',
            '/dmColorPickerPlugin/js/jquery.colorpicker.js',
            '/dmColorPickerPlugin/js/dmColorPickerPlugin.js'
        );        
    }
    
    public function getStylesheets() {        
        return array_merge(parent::getStylesheets(), array(
            '/dmColorPickerPlugin/css/jquery.colorpicker.css'=>null
        ));
    }    
}

?>
