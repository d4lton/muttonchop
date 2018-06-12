# MuttonChop

  Template Compiler
  
  `usage: $ muttonchop [--webroot <directory-name>] [--port <port>] [--index <index-file-path>] [--datafile <data-file-path>] [--output <html-output-path>]`
  
  defaults:  
  `--webroot`: `webroot`  
  `--port`: `8080`  
  `--index`: `index.template` (under `--webroot`)  
  `--datafile`: (none)  
  `--output`: `output`
  
  `$ ./muttonchop --datafile /Users/dana/muttonchop/example-data.json`

  This command will run MuttonChop on the default port and use `/Users/dana/muttonchop/example-data.json` as the data source for all template rendering.
  
  Point your web browser at the URL shown by MuttonChop when it runs. By default, this is `http://localhost:8080`. From there, each template under `--webroot` will be listed. Clicking on one will render the HTML, display it in the browser, and also create an HTML file under `--output`.
  
---
  
## MuttonChop Template Tokens

All MuttonChop tokens are surrounded by `<<` and `>>`.

All file paths are relative under the `--webroot` directory.

All code inside `<<` and `>>` is standard Javascript. There are two provided functions: `import()` and `print()`, see below.

### Data variables

All data available in a template is provided in the `data` Javascript object. If you provided a data file using `--datafile`, those values will be merged into the `data` object.

### Importing another template

`<< import('filepath'); >>`

The `filepath` is the path under `webroot`.

### Looping

`<< data.users.forEach(function(user) { >>`

`<!-- do something with "user" inside here, such as printing the user's name -->`

`<h1>Hello, << print(user.name); >>! </h1>`

`<< }); >>`

Like above, `filepath` is the path under `webroot`.

### Printing a value

`<< print(data.users.length); >>`

### Examples

See the example templates under the `webroot` directory in the repo.

### Installation

After cloning the muttonchop repo to your computer, make sure to:

```
$ cd muttonchop
$ npm install
```

This will make sure the required NodeJS modules are installed.
