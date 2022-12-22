import { JsConfig } from "./api.ts";
import {
  Command,
  configDir,
  Confirm,
  ensureDir,
  Input,
  path,
  prompt,
  Select,
  stringify,
} from "./deps.ts";

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

  const jsConfig: JsConfig = await import(config.href).then((m) => m.default);

  const tomlConfigs = [];
  for (const config of jsConfig.config) {
    const configToml = stringify(config.fn());
    tomlConfigs.push({ name: config.name, toml: configToml });
    console.log(`%c${config.name}`, "color:blue");
    console.log(configToml);
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

    await ensureDir(configPath);

    for (const config of tomlConfigs) {
      const destPath = path.join(configPath, config.name);
      console.log(
        `%cSaving new configuration to ${destPath}`,
        "color: yellow",
      );
      await Deno.writeTextFile(
        destPath,
        config.toml,
      );
    }
  }
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

function assert(val: unknown, msg: string): asserts val {
  if (val === null || val === undefined) throw new Error(msg);
}

if (import.meta.main) {
  await main();
}
