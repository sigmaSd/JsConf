import { JsConfig } from "./api.ts";

const jsConfig: JsConfig = {
  config: [
    {
      name: "config.toml",
      fn: config,
    },
    {
      name: "languages.toml",
      fn: languages,
    },
  ],
};

function config() {
  return { hello: 5 };
}
function languages() {
  return {
    lang: "..",
  };
}

export default jsConfig;
