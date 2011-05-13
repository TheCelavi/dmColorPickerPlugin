<?php

class dmColorPickerPluginConfiguration extends sfPluginConfiguration {

    /**
     * @see sfPluginConfiguration
     */
    // This is where I connect events that are fired when Diem admin generator generates the form, field by field
    public function initialize() {
        // This event is fired when form field will be generated
        $this->dispatcher->connect('dm.form_generator.widget_subclass', array($this, 'listenToFormGeneratorWidgetSubclassEvent'));
        // This event is fired when form field validator will be generated
        $this->dispatcher->connect('dm.form_generator.validator_class', array($this, 'listenToFormGeneratorValidatorSubclassEvent'));
    }

    // Now, we have to catch those connected evetns
    
    public function listenToFormGeneratorWidgetSubclassEvent(sfEvent $e, $subclass) {
        // Ok, lets check if field is marked with extra: colorpicker
        // In out config/doctrine/schema.yml
        if ($this->isColorPickerColumn($e['column']))
                // if it is, lets replace it with our widget
            $subclass = 'ColorPicker'; //This is kind of, i do not know, Symfony bug? It will add 'sfWidgetForm' as prefix
        // the result will be sfWidgetFormColorPicker
        return $subclass;
    }

    public function listenToFormGeneratorValidatorSubclassEvent(sfEvent $e, $subclass) {
        // Ok, lets check if field is marked with extra: colorpicker
        // In out config/doctrine/schema.yml
        // and if it is, replace it with our validator
        if ($this->isColorPickerColumn($e['column'])) $subclass = 'sfValidatorColorPicker';
        // Note -> for validator, full class name of validator is required? For widget, no -> bug maybe?
        return $subclass;
    }
    // This is just a method that cheks if field have 'extra: colorpicker'
    // Use this method, modified for your own widgets :)
    protected function isColorPickerColumn(sfDoctrineColumn $column) {
        return false !== strpos(dmArray::get($column->getTable()->getColumnDefinition($column->getName()), 'extra', ''), 'colorpicker');
    }

}