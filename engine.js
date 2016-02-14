$(document).ready(function () {
    $('#text').keyup(function () {
        replace();
    });
    $('*').click(function () {
        replace();
    });
});

function replace() {
    $('#error').text('');
    var text = $('#text').val();
    var newText = text;

    /**
     * Remove empty line.
     */
    newText = newText.replace(/\n\s*\n/g, '\n');

    /**
     * Replace symbols.
     */

    var symbolList = [
        [/＋/g, "+"],
        [/－/g, "-"],
        [/×/g, " \\times "],
        [/÷/g, " \\div "],
        [/＝/g, "="],
        [/···/g, " \\cdots "],
        [/·/g, " \\cdot "],
        [/≥/g, " \\geqslant "],
        [/≤/g, " \\leqslant "],
        [/±/g, " \\pm "],
        [/π/g, " \\pi "],
        [/≠/g, " \\ne "],
        [/∠/g, " \\angle "],
        [/△/g, " \\triangle "],
        [/data/g, " \\Delta "],
        [/α/g, " \\alpha "],
        [/β/g, " \\beta "],
        [/γ/g, " \\gamma "],
        [/°/g, " ^\\circ "],
        [/⊥/g, " \\perp "],
        [/%/g, " \\% "],
        [/∽/g, " \\backsim "],
        [/圆O/g, " \\odot O "],
        [/∵/g, " \\because "],
        [/∴/g, " \\therefore "],
        [/\*/g, " \\ast "],
        [/≈/g, " \\approx "],
        [/～/g, " \\sim "]
    ];
    for (var sli in symbolList) {
        var symbol = symbolList[sli];
        newText = newText.replace(symbol[0], symbol[1]);
    }

    /**
     * Translate 1/3 with \frac{}{}.
     */
    newText = newText.replace(/(\d+\w*)\/(\d+\w*)/g, " \\frac{$1}{$2} ");

    /**
     * Remove white space for "（  ）".
     */
    newText = newText.replace(/(（)\s+(）)/g, "$1$2");

    /**
     * Add "$".
     */

    newText = newText.replace(/([\x21-\x5e\x60-\x7e█┤]+)/g, "$$$1$$");// Add "$" at the front and end of all ASCII strings except "_".
    newText = newText.replace(/\$([A-Z])\$(．)/g, "$1$2");// Remove "$" for the option line.
    newText = newText.replace(/\$([A-Z]\.)/g, "$1$$");// Remove "$" for the option line.
    newText = newText.replace(/\$[ ]*\$/g, " ");// Remove "$" for valueless use example "$  $".
    newText = newText.replace(/\$(\d+\.)\$/g, "$1");// Remove "$" for the first line of stem.
    newText = newText.replace(/([\^]?\\[\w\{}]+)/g, " $1 ");// Add white space to the front and the end of all KaTaX escape characters.

    /**
     * Square such as x2 should be x^2.
     */
    newText = newText.replace(/([\)a-zA-Z])(\d+)/g, '$1^$2');

    /**
     * Deal this {█(y=ax+b@y=kx)┤ with $\begin .
     */
    newText = newText.replace(/\{█\(([\d\w\+\-=\\\{} ]+)@([\d\w\+\-=\\\{}} ]+)\)┤/g, ' \\begin{cases}$1\\\\$2\\end{cases} ');

    /**
     * When numerator or denominator is a formula.
     */
    // Have not got an good idea...

    /**
     * Add "<br>"
     */

    var newTextSplit = newText.split('\n');
    newText = '';
    for (var ntsi = 0; ntsi < newTextSplit.length; ntsi++) {
        var newTextLine = newTextSplit[ntsi].trim();
        if (newTextLine.indexOf('A．') == 0) {
        } else if (ntsi == (newTextSplit.length - 1)) {
        } else {
            var newTextNextLine = newTextSplit[ntsi + 1].trim();
            if (
                (newTextNextLine.indexOf("A．") == 0) ||
                (newTextNextLine.search(/\d\./) == 0) ||
                (newTextNextLine.indexOf("解析：") == 0) ||
                (newTextNextLine.indexOf("总结：") == 0) ||
                (newTextNextLine == '')
            ) {
                if (newTextNextLine.search(/\d\./) == 0) {
                    // This is the last line of this part.
                    newTextSplit[ntsi] += '\n';
                }
            } else {
                newTextSplit[ntsi] = newTextSplit[ntsi].replace(/\s+$/gm, '') + '<br>';
            }
        }
        newText += newTextSplit[ntsi] + '\n';
    }

    /**
     * Count rows.
     */

    var lineArray = newText.split('\n');
    var lineNumber = lineArray.length;
    //$('.textarea').css('height', '');
    $('.textarea').attr('rows', lineNumber + 4);
    //$('.textarea').css('height', $('.textarea:first').css('height'));

    /**
     * Show new text.
     */
    $('#newText').text(newText);
    try {
        var kStr = newText.replace(/\$([^\$]*)\$/gm, function (match, tex) {
            return katex.renderToString(tex, {displayMode: false});
        });
        $('#KaTeX').html(kStr);
    } catch (err) {
        $('#error').text(err);
    }
}