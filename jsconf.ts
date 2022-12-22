import { stringify } from "https://deno.land/std@0.170.0/encoding/toml.ts";
import { ensureDir } from "https://deno.land/std@0.170.0/fs/ensure_dir.ts";
import * as path from "https://deno.land/std@0.170.0/path/mod.ts";
import configDir from "https://deno.land/x/dir@1.5.1/config_dir/mod.ts";
import { Command } from "https://deno.land/x/cliffy@v0.25.6/command/mod.ts";
import { Select } from "https://deno.land/x/cliffy@v0.25.5/prompt/select.ts";
import {
  Confirm,
  Input,
  prompt,
} from "https://deno.land/x/cliffy@v0.25.5/prompt/mod.ts";

async function main() {
  const command = await new Command()
    .name("jsconf")
    .description(
      "Create toml configuration with typescript",
    )
    .option("--config <config:string>", "path to a configuration")
    .option(
      "--save-location <location:string>",
      "location to save the configuration inside",
    )
    .parse(Deno.args);

  let configRaw;
  if (command.options.config) configRaw = command.options.config;
  else configRaw = await getConfigs();

  let config: URL;
  try {
    // If its a url leave it like it is
    config = new URL(configRaw);
  } catch {
    // Otherwise consider it a file and resolve it
    let configFile: string;
    if (path.isAbsolute(configRaw)) configFile = configRaw;
    else {
      configFile = path.join(Deno.cwd(), configRaw);
    }
    // Make it a url so it can be imported
    config = new URL("file:///" + configFile);
  }

  // deno-lint-ignore no-explicit-any
  const jsConfig: { config?: () => any; languages?: () => any } = await import(
    config.href
  );

  let configToml: string | null = null;
  let languagesToml: string | null = null;

  if (jsConfig.config) {
    configToml = stringify(jsConfig.config());
    console.log(`%cconfig.toml`, "color:blue");
    console.log(configToml);
  }

  if (jsConfig.languages) {
    languagesToml = stringify(jsConfig.languages());
    console.log(`%clanguages.toml`, "color:blue");
    console.log(languagesToml);
  }

  if (
    (await prompt([{
      name: "save",
      message: "Save the configuration",
      type: Confirm,
    }])).save
  ) {
    let configPath;
    if (command.options.saveLocation) configPath = command.options.saveLocation;
    else configPath = await Input.prompt("Where to save the configuration");

    if (!configPath) throw "invalid path";

    try {
      await Deno.remove(configPath, { recursive: true });
    } catch {
      /*ignore*/
    } finally {
      await Deno.mkdir(configPath);
    }

    console.log(
      `%cSaving new configuration to ${configPath}`,
      "color: yellow",
    );
    if (configToml) {
      await Deno.writeTextFile(
        path.join(configPath, "config.toml"),
        configToml,
      );
    }
    if (languagesToml) {
      await Deno.writeTextFile(
        path.join(configPath, "languages.toml"),
        languagesToml,
      );
    }
  }
}

if (import.meta.main) {
  await main();
}

function assert(val: unknown, msg: string): asserts val {
  if (val === null || val === undefined) throw new Error(msg);
}

async function getConfigs() {
  const configDirPath = configDir();
  assert(configDirPath, "could not find config dir");
  const configsPath = path.join(configDirPath, "jsconf");
  await ensureDir(configsPath);

  console.log(`%cLooking for configs in: ${configsPath}`, "color:yellow");
  const configs = [];
  for await (const config of Deno.readDir(configsPath)) {
    configs.push({
      name: config.name,
      value: path.join(configsPath, config.name),
    });
  }

  if (configs.length === 0) throw "No config found";

  return await Select.prompt({
    message: "Pick a config",
    options: configs,
  });
}
