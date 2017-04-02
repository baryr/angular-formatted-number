describe("user input", function() {

    function setCaretPosition(input, pos) {
        function isFocused (elem) {
            return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        }
        
        if (!input) {
            return 0;
        }
        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
            return; // Input"s hidden
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
            range.moveEnd("character", pos);
            range.moveStart("character", pos);
            range.select();
        }
    }
    
    /*
    Different test scenarios: 
     - model: initial model value
     - view: initial display value
     - carer: initial caret position (marked as |)
     - actions: 
    */
    var scenarios = [
        {model: "1",  view: "1",  caret: "1|",  actions: [
            {keys: protractor.Key.BACK_SPACE, result: "|"},
        ]},
        {model: "12", view: "12", caret: "12|", actions: [
            {keys: protractor.Key.BACK_SPACE, result: "1|"},
            {keys: protractor.Key.BACK_SPACE, result: "|"},
            {keys: protractor.Key.BACK_SPACE, result: "|"},
        ]},
        {model: "123", view: "123", caret: "12|3", actions: [
            {keys: protractor.Key.BACK_SPACE, result: "1|3"},
            {keys: protractor.Key.BACK_SPACE, result: "|3"},
            {keys: protractor.Key.BACK_SPACE, result: "|3"},
        ]},
        {model: "1234", view: "1'234", caret: "1'2|34", actions: [
            {keys: protractor.Key.BACK_SPACE, result: "1|34"},
            {keys: protractor.Key.BACK_SPACE, result: "|34"},
            {keys: protractor.Key.BACK_SPACE, result: "|34"},
            {keys: protractor.Key.DELETE,     result: "|4"},
            {keys: protractor.Key.BACK_SPACE, result: "|4"},
            {keys: protractor.Key.DELETE,     result: "|"},
        ]},
        {model: "12345", view: "12'345", caret: "12'3|45", actions: [
            {keys: protractor.Key.BACK_SPACE, result: "1'2|45"},
            {keys: protractor.Key.BACK_SPACE, result: "1|45"},
            {keys: protractor.Key.DELETE,     result: "1|5"},
            {keys: protractor.Key.DELETE,     result: "1|"},
            {keys: protractor.Key.DELETE,     result: "1|"},
            {keys: "2345",                    result: "12'345|"},
        ]},
        {model: "1234567890", view: "1'234'567'890", caret: "1'234|'567'890", actions: [
            {keys: protractor.Key.DELETE,     result: "123'4|67'890"},
            {keys: "5",                       result: "1'234'5|67'890"},
            {keys: protractor.Key.ARROW_LEFT, result: "1'234'|567'890"},
            {keys: protractor.Key.BACK_SPACE, result: "123|'567'890"},
            {keys: protractor.Key.BACK_SPACE, result: "12|'567'890"},
            {keys: protractor.Key.DELETE,     result: "1'2|67'890"},
            {keys: protractor.Key.DELETE,     result: "12|7'890"},
            {keys: protractor.Key.DELETE,     result: "12|'890"},
            {keys: protractor.Key.DELETE,     result: "1'2|90"},
            {keys: protractor.Key.BACK_SPACE, result: "1|90"},
            {keys: protractor.Key.BACK_SPACE, result: "|90"},
            {keys: protractor.Key.DELETE,     result: "|0"},
            {keys: protractor.Key.DELETE,     result: "|"},
        ]},
        {model: "1234567890.45", view: "1'234'567'890.45", caret: "1'234'567'890|.45", actions: [
            {keys: protractor.Key.DELETE,     result: "123'456'789'0|45"},
            {keys: protractor.Key.DECIMAL,    result: "1'234'567'890.|45"},
            {keys: protractor.Key.BACK_SPACE, result: "123'456'789'0|45"},
            {keys: protractor.Key.ARROW_LEFT, result: "123'456'789'|045"},
            {keys: protractor.Key.ARROW_LEFT, result: "123'456'789|'045"},
            {keys: protractor.Key.ARROW_LEFT, result: "123'456'78|9'045"},
            {keys: protractor.Key.DECIMAL,    result: "12'345'678.|90"},
            {keys: protractor.Key.BACK_SPACE, result: "1'234'567'8|90"},
            {keys: protractor.Key.BACK_SPACE, result: "123'456'7|90"},
            {keys: protractor.Key.ARROW_LEFT, result: "123'456'|790"},
            {keys: protractor.Key.BACK_SPACE, result: "12'345|'790"},
            {keys: protractor.Key.BACK_SPACE, result: "1'234|'790"},
            {keys: protractor.Key.DELETE,     result: "123'4|90"},
            {keys: "5678.",                   result: "12'345'678.|90"},
            {keys: protractor.Key.DELETE,     result: "12'345'678.|0"},
            {keys: protractor.Key.DELETE,     result: "12'345'678.|"},
            {keys: protractor.Key.BACK_SPACE, result: "12'345'678|"},
        ]},
    ];
    
    it("should properly add/remove characters format and set caret position while typing", function() {
        browser.get("index.html");

        var inputElement = element(by.id("formattedInput"));
        
        inputElement.click();
        
        for (var test = 0; test < scenarios.length; test++) {
            inputElement.clear();
            inputElement.sendKeys(scenarios[test].model);
            expect(inputElement.getAttribute("value")).toBe(scenarios[test].view);
            
            // set caret
            browser.executeScript(setCaretPosition, inputElement.getWebElement(), scenarios[test].caret.indexOf("|"));
            for (var action = 0; action < scenarios[test].actions.length; action++) {
                inputElement.sendKeys(scenarios[test].actions[action].keys);
                expect(inputElement.getAttribute("value")).toBe(scenarios[test].actions[action].result.replace(/\|/g, ""));
            }            
        }
        
    });

});
