const STANDARD_FORMATS = Object.freeze({
    A4: 'A4',
    A3: 'A3',
    A5: 'A5',
    A6: 'A6',
    LETTER: 'Letter',
    LEGAL: 'Legal',
    TABLOID: 'Tabloid',
    LEDGER: 'Ledger',
    A0: 'A0',
    A1: 'A1',
    A2: 'A2'
});

const THERMAL_FORMATS = Object.freeze({
    THERMAL_58MM: '58mm',
    THERMAL_80MM: '80mm'
});

const THERMAL_HEIGHT_BUFFER_PX = 24;

const ORIENTATIONS = Object.freeze({
    PORTRAIT: false,
    LANDSCAPE: true
});

function resolvePageLayout(pageFormat = 'A4', pageOrientation = 'PORTRAIT', contentHeightPx = 1) {
    const format = String(pageFormat || 'A4').toUpperCase();
    const orientation = String(pageOrientation || 'PORTRAIT').toUpperCase();

    if (!(orientation in ORIENTATIONS)) {
        throw new Error(`Unsupported page orientation: ${pageOrientation}`);
    }

    if (format in THERMAL_FORMATS) {
        if (orientation !== 'PORTRAIT') {
            throw new Error(`Thermal format ${format} only supports PORTRAIT orientation`);
        }
        const height = Math.max(1, Math.ceil(Number(contentHeightPx) || 1)) + THERMAL_HEIGHT_BUFFER_PX;
        return {
            width: THERMAL_FORMATS[format],
            height: `${height}px`,
            landscape: false
        };
    }

    if (!(format in STANDARD_FORMATS)) {
        throw new Error(`Unsupported page format: ${pageFormat}`);
    }

    return {
        format: STANDARD_FORMATS[format],
        landscape: ORIENTATIONS[orientation]
    };
}

function isThermalFormat(pageFormat) {
    return String(pageFormat || '').toUpperCase() in THERMAL_FORMATS;
}

module.exports = {
    STANDARD_FORMATS,
    THERMAL_FORMATS,
    ORIENTATIONS,
    resolvePageLayout,
    isThermalFormat
};
