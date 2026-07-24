const test = require('node:test');
const assert = require('node:assert/strict');
const { resolvePageLayout } = require('./page-layout');

test('defaults to A4 portrait', () => {
    assert.deepEqual(resolvePageLayout(), { format: 'A4', landscape: false });
});

test('supports standard landscape formats', () => {
    assert.deepEqual(resolvePageLayout('LETTER', 'LANDSCAPE'), {
        format: 'Letter',
        landscape: true
    });
    assert.deepEqual(resolvePageLayout('A3', 'LANDSCAPE'), {
        format: 'A3',
        landscape: true
    });
});

test('creates dynamic-height thermal layouts', () => {
    assert.deepEqual(resolvePageLayout('THERMAL_80MM', 'PORTRAIT', 812.2), {
        width: '80mm',
        height: '837px',
        landscape: false
    });
    assert.deepEqual(resolvePageLayout('THERMAL_58MM', 'PORTRAIT', 400), {
        width: '58mm',
        height: '424px',
        landscape: false
    });
});

test('rejects unsupported layouts', () => {
    assert.throws(() => resolvePageLayout('UNKNOWN', 'PORTRAIT'), /Unsupported page format/);
    assert.throws(() => resolvePageLayout('A4', 'SIDEWAYS'), /Unsupported page orientation/);
    assert.throws(() => resolvePageLayout('THERMAL_80MM', 'LANDSCAPE'), /only supports PORTRAIT/);
});
