<?php
/**
 *
 * @author TheCelavi
 */
class sfValidatorColorPicker extends sfValidatorRegex {
    
    public function __construct($options = array(), $messages = array()) {       
        // This is simple inherited Regex validator
        // Regex is found on internet, that is, the pattern
        // It validates if HEX is the valid color code
        $this->addOption('pattern', '/^#[a-f0-9]{6}$/i');                
        parent::__construct($options, $messages);       
        // This is just modified 'invalid' message, this one explains the error more specific
        $this->setMessage('invalid', 'Invalid HEX color code.');
    }
    
}

?>
