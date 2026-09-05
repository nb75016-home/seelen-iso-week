# Seelen ISO Week

A Fancy Toolbar module and popup for **Seelen UI 2.8.3**. The widget includes its toolbar plugin, so only one YAML file needs to be installed.

The toolbar displays **S36 · 05/09/2026** (example). Clicking it opens a monthly calendar with ISO-8601 week numbers, Monday-first rows, today highlighting and month navigation.

The interface currently uses French labels and date formatting; documentation and source comments are in English. No network connection is required after installation.

## Install permanently

Download **iso-week.yml** from [the latest release](https://github.com/nb75016-home/seelen-iso-week/releases/latest) or from the `bundles` directory. Copy it into:

```text
%APPDATA%\com.seelen.seelen-ui\widgets
```

Name the installed file **seelen-iso-week.yml**, fully quit Seelen and start it again. Add **Semaine ISO** through Fancy Toolbar customization. No administrator privileges, PowerShell script execution or GitHub account are required.

**Upgrading from 1.1.0 or the original local version:** resource IDs now use the organization namespace. Remove the old toolbar module, move its previous YAML file out of the widgets directory, and install seelen-iso-week.yml. Restart Seelen and add the module again. Reapply any custom popup settings: settings attached to the previous IDs are not migrated automatically. Keep only one installed copy. Portable installations may use a different data directory.

## Try for the current session

With Seelen running, open PowerShell in the downloaded repository folder:

```powershell
$slu = 'C:\Program Files\Seelen\Seelen UI\slu.exe'
& $slu resource load widget "$PWD\bundles\iso-week.yml"
```

This direct executable command also works when PowerShell scripts are disabled. A session load is temporary; use the installation directory above for persistence.

## Settings

Open the widget's settings in Seelen.

- Popup week format: Sxx, Sx, Wxx or Wx.
- Show or hide the full date in the popup.
- The toolbar uses Sxx and DD/MM/YYYY. Edit the final expression in `resource/toolbar/template.js` and rebuild to change its format.
- ISO weeks always start on Monday. The ISO year can differ from the calendar year near New Year.

Both toolbar output and popup content update over time. Escape, the close button and loss of focus dismiss the popup. Popup settings do not configure toolbar templates: Seelen 2.8.3 does not inject widget settings into those scripts.

## Theme integration

The toolbar inherits its active theme. The popup uses Seelen's shared `.slu-std-popover` class, `--slu-std-*` variables, system accent and shadow tokens. Fallbacks use CSS system colors, with no fixed color palette. Themes that only target built-in widget IDs may need additional selectors for this widget.

## Build and test

Requires Node.js 22 or newer.

```sh
npm ci
npm run build
npm test
```

The build bundles the pinned Seelen SDK, copies CSS, resolves Seelen's YAML `!include` and `!extend` tags and writes `bundles/iso-week.yml`. Everything required at runtime is embedded. Source files are in `src`; the resource definition and toolbar scripts are in `resource`.

To additionally validate and package using Seelen's official parser:

```powershell
& 'C:\Program Files\Seelen\Seelen UI\slu.exe' resource bundle widget '.\resource'
```

Seelen creates a dated YAML file in `resource`. Do not commit that dated file: the stable distributable lives in `bundles`. CI rebuilds and runs tests on pushes and pull requests.

## Compatibility and validation

Targets Seelen stable **2.8.3**, with `@seelen-ui/lib` **2.8.3** and the official `Popup` lifecycle (`Widget.self.init()`, then `ready()`). The plugin targets `@seelen/fancy-toolbar` and opens `@nb75016-home/iso-week-popup` through `onClickV2/trigger()`.

Tests cover ISO year boundaries, week 53, leap years and monthly calendars from 1990 through 2040. Tests also execute the toolbar scripts in SandboxJS 0.9.7 and inspect the standalone resource.

The original modules were loaded successfully in the user's Seelen installation. The split repository is validated through builds, tests and the official resource parser. Multi-monitor placement and exact rendering under every third-party theme have not been exhaustively tested.

## Uninstall

Remove the toolbar module, delete only `seelen-iso-week.yml` from the user widgets directory and restart Seelen. For temporary loads, use `slu resource unload widget` with the same path used to load it.

## Related project

[Seelen World Clock](https://github.com/nb75016-home/seelen-world-clock) provides the complementary toolbar module.

## References and license

- [Seelen 2.8.3](https://github.com/eythaann/Seelen-UI/releases/tag/v2.8.3)
- [Resource guidelines](https://seelen.io/docs/resource-guidelines)
- [Toolbar plugins](https://seelen.io/docs/toolbar-plugins)
- [Widget API](https://seelen.io/docs/widget-js-api)

Licensed under **AGPL-3.0-only**, matching the embedded Seelen SDK. See [LICENSE](LICENSE) and [THIRD-PARTY.md](THIRD-PARTY.md). This is an independent community resource, not an official Seelen product.
