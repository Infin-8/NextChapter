export const compose = (...fns) => initial => fns
    .reduce((result, next) => next(result), initial)

export const getSum = arr => arr.reduce((a, b) => a + b, 0)

export const mapAmounts = arr => arr.map(({ amount }) => amount)

export const usdFormatter = str => new Intl
    .NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumSignificantDigits: 6
    })
    .format(str);

export const titleCase = str => str
    .toLowerCase()
    .replace(/^\w|\s\w/g, l => l.toUpperCase())

export const sanitize = input => input
    .replace(/&/g, '&amp;')    
    .replace(/</g, '&lt;')     
    .replace(/>/g, '&gt;')     
    .replace(/"/g, '&quot;')  
    .replace(/'/g, '&#39;')  
    .replace(/[^a-zA-Z0-9 .,!?@#%&()-_]/g, '')
    .trim();            

export const sanitizeTrolls = input => input.slice(0, 8)


