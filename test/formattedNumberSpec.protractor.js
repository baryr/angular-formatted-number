describe('user input', function() {

    function setCaretPosition(input, pos) {
        function isFocused (elem) {
            return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        }
        
        if (!input) {
            return 0;
        }
        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
            return; // Input's hidden
        }
        if (input.setSelectionRange) {
            if (isFocused(input)) {
                input.focus();
                input.setSelectionRange(pos, pos);
            }
        }
        else if (input.createTextRange) {
            // Curse you IE
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
    
    it('should properly remove characters and set caret position when backspacing', function() {
        browser.get('index.html');

        var inputElement = element(by.id('formattedInput'));
        
        inputElement.click();
        
        // ----------------------------------

        // 123 -> 123        
        inputElement.clear();
        inputElement.sendKeys('123');
        expect(inputElement.getAttribute('value')).toBe("123");

        // set caret
        browser.executeScript(setCaretPosition, inputElement.getWebElement(), 1);
        
        // 1|23 + Backspace -> |23
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("23");
        
        // |23 + 1 -> 1|23
        inputElement.sendKeys('1');
        expect(inputElement.getAttribute('value')).toBe("123");
        
        // ----------------------------------
                
        // 1234 -> 1`234
        inputElement.clear();
        inputElement.sendKeys('1234');
        expect(inputElement.getAttribute('value')).toBe("1`234");
        
        // set caret
        browser.executeScript(setCaretPosition, inputElement.getWebElement(), 1);
        
        // 1|`234 + Backspace -> |234
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("234");
        
        // ----------------------------------
        
        // 1234 -> 1`234
        inputElement.clear();
        inputElement.sendKeys('1234');
        expect(inputElement.getAttribute('value')).toBe("1`234");

        // set caret
        browser.executeScript(setCaretPosition, inputElement.getWebElement(), 2);
                
        // 1`|234 + Backspace -> |234
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("234");
        
        // ----------------------------------

        // 1234567890 -> 1`234`567`890
        inputElement.clear();
        inputElement.sendKeys('1234567890');
        expect(inputElement.getAttribute('value')).toBe("1`234`567`890");
        
        // set caret to 11: 1`234`567`8|90
        browser.executeScript(setCaretPosition, inputElement.getWebElement(), 11);
        
        // 1`234`567`8|90 + Backspace -> 123`456`7|90        
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("123`456`790");
        // 123`456`7|90 + Backspace -> 12`345`6|90 
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("12`345`690");
        // 12`345`6|90 + Backspace -> 1`234`5|90 
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("1`234`590");
        // 1`234`5|90 + Backspace -> 123`4|90 
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("123`490");
        // 123`4|90 + Backspace -> 12`3|90 
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("12`390");
        // 12`3|90 + Backspace -> 1`2|90 
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("1`290");
        // 1`2|90 + Backspace -> 1|90 
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("190");
        // 1|90  + Backspace -> |90 
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("90");
        // |90  + Backspace -> |90 
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("90");
        // ----------------------------------

        // ----------------------------------

        // 1234567890 -> 1`234`567`890
        inputElement.clear();
        inputElement.sendKeys('1234567890');
        expect(inputElement.getAttribute('value')).toBe("1`234`567`890");
        
        // set caret to 11: 1`234`567`|890
        browser.executeScript(setCaretPosition, inputElement.getWebElement(), 10);
        
        // 1`234`567`|890 + Backspace -> 123`456|`890        
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("123`456`890");
        // 123`456|`890 + Backspace -> 12`345|`890        
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("12`345`890");
        // 12`345|`890 + Backspace -> 1`234|`890    
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("1`234`890");
        // 1`234|`890 + Backspace -> 123|`890    
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("123`890");
        // 123|`890 + Backspace -> 12|`890    
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("12`890");
        // 12|`890 + Backspace -> 1|`890    
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("1`890");
        // 1|`890 + Backspace -> |890    
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("890");
        // |890 + Backspace -> |890    
        inputElement.sendKeys(protractor.Key.BACK_SPACE);
        expect(inputElement.getAttribute('value')).toBe("890");
        // ----------------------------------
        
    });
    
    it('should properly remove characters and set caret position when deleting', function() {
        browser.get('index.html');

        var inputElement = element(by.id('formattedInput'));
        
        inputElement.click();
        
        // ----------------------------------

        // 123 -> 123        
        inputElement.clear();
        inputElement.sendKeys('123');
        expect(inputElement.getAttribute('value')).toBe("123");

        // set caret
        browser.executeScript(setCaretPosition, inputElement.getWebElement(), 1);
        
        // 1|23 + Backspace -> 1|3
        inputElement.sendKeys(protractor.Key.DELETE);
        expect(inputElement.getAttribute('value')).toBe("13");
        
        // 1|3 + 2 -> 12|3
        inputElement.sendKeys('2');
        expect(inputElement.getAttribute('value')).toBe("123");
        // 12|3 + 4 -> 124|3
        inputElement.sendKeys('4');
        expect(inputElement.getAttribute('value')).toBe("1`243");
        
        // TODO: cover more cases
        
        // ----------------------------------
    });

});
