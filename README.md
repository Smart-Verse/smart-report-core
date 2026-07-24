# smart-report

## Page layout contract

`POST /report` accepts the rendered HTML and an optional persisted page layout:

```json
{
  "report": "<!doctype html><html>...</html>",
  "pageFormat": "A4",
  "pageOrientation": "PORTRAIT"
}
```

When layout fields are omitted, the renderer uses `A4` and `PORTRAIT` for backward compatibility.

Supported standard formats:

- `A0`, `A1`, `A2`, `A3`, `A4`, `A5`, `A6`;
- `LETTER`, `LEGAL`, `TABLOID`, `LEDGER`.

Standard formats support `PORTRAIT` and `LANDSCAPE`.

Thermal formats:

- `THERMAL_58MM`;
- `THERMAL_80MM`.

Thermal formats support only `PORTRAIT`. Their PDF height is calculated from the rendered document content so receipts do not receive a fixed A4/Letter height.

The API rejects unknown formats, unknown orientations, empty HTML, and landscape thermal requests with HTTP 400. `CHROME_EXECUTABLE_PATH` can override the default `/usr/bin/google-chrome-stable`, and `PORT` can override the default `5071`.
