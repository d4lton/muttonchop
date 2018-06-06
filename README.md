# MuttonChop

  Template Compiler
  
  `usage: $ muttonchop [--webroot <directory-name>] [--port <port>] [--index <index-file-path>] [--datafile <data-file-path>]`
  
  defaults:  
  `--webroot`: `webroot`  
  `--port`: `8080`  
  `--index`: `index.template` (under `--webroot`)  
  `--datafile`: (none)  
  
  `$ ./muttonchop --datafile ./example-data.json`

  This command will run MuttonChop on the default port and use `./example-data.json` as the data source for all template rendering.
  
---
  
## MuttonChop Template Tokens

All MuttonChop tokens are surrounded by `<<` and `>>`.

All file paths are relative under the `--webroot` directory.

### Importing another template

`<< import filepath [data-key-prefix] >>`

The `filepath` is the path under `webroot`.

The optional `data-key-prefix` specifies a prefix to be added to a key in the provided datafile to give (for example) customer-specific values that override a default value.

### Looping of another template

`<< loop filepath variable data-key [data-key-prefix] >>`

Like above, `filepath` is the path under `webroot`.

The `variable` is the name you want the value from the `data-key` array placed in for each pass through the loop.

The `data-key` is the name of the key in the provided datafile, it must be an array.

As with normal `import`, there is an optional `data-key-prefix`.

### Examples

See the example templates under the `webroot` directory in the repo.
