angular.module('baryr.formattedNumber', [])
    .directive('formattedNumber', function() {
        function isFocused (elem) {
            return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
        }

        var config = {
            thousandSeparator : '`'
        }

        return {
            priority: 100,
            require: 'ngModel',
            restrict: 'A',
            compile: function formatedNumberCompileFunction() {
                return function formatedNumberLinkFunction(scope, iElement, iAttrs, controller) {

                    iElement.bind("keydown", function (event) {
                        var code = keyCode(event);
                        var oldViewValue = controller.$viewValue;

                        // Special handling for dot char
                        if (isDotKey(event)) {
                            // if there is already dot present than do not allow next one
                            if (oldViewValue.indexOf('.') !== -1) {
                                event.preventDefault();
                            }
                        }

                        // Special handling for Del and Backspace
                        if (isDelKey(event) || isBackspaceKey(event)) {

                            // Current caret position and selection length
                            var caretPosition = getCaretPosition(iElement[0]);
                            var selectionLength = getSelectionLength(iElement[0]);

                            // Desired caret position after key pressed
                            var afterKeyCaretPosition = caretPosition;

                            var tmpViewValue
                            // Del key
                            if (isDelKey(event)) {
                                // Special handling only for 0 length selection (for non zero length selection we simply remove selected range from oldValue)
                                if (selectionLength === 0) {
                                    // Instead of removing 'thousandSeparator' that will be added by formatter we move caret one position to the right
                                    // (skip over 'thousandSeparator' and del next char)
                                    if (oldViewValue.charAt(caretPosition) === config.thousandSeparator) {
                                        caretPosition++;
                                    }
                                }
                                tmpViewValue = handleDelKey(oldViewValue, caretPosition, selectionLength);
                            }
                            // Backspace key
                            else if (isBackspaceKey(event)) {
                                var caretPositionForBackspace = caretPosition;
                                // Special handling only for 0 length selection (for non zero length selection we simply remove selected range from oldValue)
                                if (selectionLength === 0) {
                                    // Backspace move caret to the left
                                    afterKeyCaretPosition--;
                                    // Instead of removing 'thousandSeparator' that will be added by formatter we move caret one position to the left
                                    // (skip over 'thousandSeparator' and del previous char)
                                    if (oldViewValue.charAt(caretPosition-1) === config.thousandSeparator) {
                                        caretPositionForBackspace--;
                                        afterKeyCaretPosition--;
                                    }
                                }
                                tmpViewValue = handleBackspaceKey(oldViewValue, caretPositionForBackspace, selectionLength);
                            }

                            // calculate relative caret (like if there would be no formatting)
                            var relativeCaretPosition = calculateRelativeCaretPosition(oldViewValue, afterKeyCaretPosition);

                            // reformat viewValue
                            var newViewValue = formatter(tmpViewValue);

                            controller.$setViewValue(newViewValue);
                            controller.$render();
                            setCaretPosition(iElement[0], calculateCaretPosition(newViewValue, relativeCaretPosition));

                            // prevent normal event
                            event.preventDefault();
                        }
                    });

                    controller.$formatters.unshift(formatter);
                    controller.$parsers.unshift(parser);

                    function formatter(input) {
                        var formattedInput = input ? input : '';
                        // remove non digit and non dot characters
                        formattedInput = formattedInput.replace(/[^\d\.]/g, '');
                        // remove all dots except first one
                        formattedInput = formattedInput.replace(/^([^.]*\.)(.*)$/, function (a, b, c) {
                            return b + c.replace(/\./g, '').substring (0, 2);
                        });
                        // format string using thousandSeparator
                        formattedInput = formattedInput.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + config.thousandSeparator);
                        return formattedInput;
                    }

                    function parser(input) {
                        var caretPosition = getCaretPosition(iElement[0]);
                        var relativeCaretPosition = calculateRelativeCaretPosition(input, caretPosition);
                        var viewValue = formatter(input);
                        controller.$setViewValue(viewValue);
                        controller.$render();
                        setCaretPosition(iElement[0], calculateCaretPosition(viewValue, relativeCaretPosition));
                        // remove non digit and non dot characters
                        return viewValue.replace(/[^\d\.]/g, '');
                    }

                    function keyCode(event) {
                        return event.keyCode ? event.keyCode : event.charCode;
                    }

                    function isDelKey(event) {
                        return keyCode(event) === 46;
                    }

                    function isBackspaceKey(event) {
                        return keyCode(event) === 8;
                    }

                    function isDotKey(event) {
                        var code = keyCode(event);
                        return code === 190 || code === 110;
                    }

                    function handleDelKey(input, caretPosition, selectionLength) {
                        // Special case 0 selectionLength is same as 1 selectionLength so we normalize here
                        var normalizedSelectionLength = Math.max(selectionLength, 1);
                        return input.slice(0, caretPosition) + input.slice(caretPosition + normalizedSelectionLength);
                    }

                    function handleBackspaceKey(input, caretPosition, selectionLength) {
                        // Special case: Backspace on non zero selectionLength remove selected range (delegate to handleDelKey)
                        if (selectionLength > 0) {
                            return handleDelKey(input, caretPosition, selectionLength);
                        }
                        // For zero selectionLength just remove previous char
                        else {
                            var normalizedCaretPosition = Math.max(caretPosition - 1 , 0);
                            return input.slice(0, normalizedCaretPosition) + input.slice(caretPosition);
                        }
                    }

                    function calculateRelativeCaretPosition(input, caret) {
                        var relativeCaretPosition = 0;
                        if (input) {
                            // check up to caret pos
                            var pos = Math.min(caret, input.length);
                            for (var i=0; i <pos; i++) {
                                // if char at position is digit or dot increase relative position (we skip separators)
                                if (input.charAt(i).match(/\d/) || input.charAt(i).match(/\./)) {
                                    relativeCaretPosition++;
                                }
                            }
                        }
                        return relativeCaretPosition;
                    }

                    function calculateCaretPosition(input, relativeCaretPosition) {
                        var caretPosition = 0;
                        var count = 0;
                        if (input) {
                            for (var i=0; i<input.length && count < relativeCaretPosition; i++) {
                                // if char at position is digit or dot increase counter (do not count separators)
                                if (input.charAt(i).match(/\d/) || input.charAt(i).match(/\./)) {
                                   count++;
                                }
                                // but still move caret
                                caretPosition++;
                            }
                        }
                        return caretPosition
                    }

                    function getCaretPosition(input) {
                        if (!input) {
                            return 0;
                        }
                        if (input.selectionStart !== undefined) {
                            return input.selectionStart;
                        } else if (document.selection) {
                            if (isFocused(iElement[0])) {
                                // Curse you IE
                                input.focus();
                                var selection = document.selection.createRange();
                                selection.moveStart('character', input.value ? -input.value.length : 0);
                                return selection.text.length;
                            }
                        }
                        return 0;
                    }

                    function setCaretPosition(input, pos) {
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

                    function getSelectionLength(input) {
                        if (!input) {
                            return 0;
                        }
                        if (input.selectionStart !== undefined) {
                            return (input.selectionEnd - input.selectionStart);
                        }
                        if (window.getSelection) {
                            return (window.getSelection().toString().length);
                        }
                        if (document.selection) {
                            return (document.selection.createRange().text.length);
                        }
                        return 0;
                    }
                };
            }
        };
    }
);
