# JsConf
Generate configuration with javascript

[Screencast from 2022-12-22 12-09-40.webm](https://user-images.githubusercontent.com/22427111/209122062-be7e61eb-70e4-4570-ae19-5935813c821b.webm)

## Usage

- Create a config file in javascript, under $configDir/jsconf
  - The config should have a default export of a JsConfig variable. You can get the type by importing https://deno.land/x/jsconf/api.ts?s=JsConfig

- Now you can run jsconf `deno run -r https://deno.land/x/jsconf/jsconf.ts`
  - It will automaticly detect configs under the aformentiod location, or you can specify a config with `--config`
- The next part is interactive, jsconf will print the generated configuration and ask to save it, and the saving location

You can also test drive with a helix example `deno run -r https://deno.land/x/jsconf/jsconf.ts --config https://deno.land/x/jsconf/helix_config_example.ts`

## TODO

- [ ] Generate other formats then toml ? (lua ?)
