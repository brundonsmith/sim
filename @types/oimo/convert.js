
/*
    Array.from(document.querySelectorAll('.fields > .field h3 code'))
        .map(code => code.innerText
            .replace('inline ', '')
            .replace('new ', 'constructor ')
            .replace(' (', '(')
            .replace(/:([a-z])/gi, ': $1')
            .replace(': Float', ': number')
            .replace(': Int', ': number')
            .replace(': Bool', ': boolean')
            .replace(': Void', ': void')
            .replace(': Any', ': any')
            .replace(': String', ': string')
            .replace('static', 'static ')
            .replace('read only', 'readonly ')
        )
        .join(';\n') + ';'
*/