import { JsConfig } from "https://deno.land/x/jsconf/api.ts";

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

export function config() {
  return {
    theme: "gruvbox",

    keys: {
      insert: {
        "C-s": ["normal_mode", ":w"],
        "µ": "shell_pipe",
      },
      normal: {
        "C-s": ":w",
        "µ": "shell_pipe",
        ")": {
          "µ": "shell_pipe",
          "d": "goto_next_diag",
          "D": "goto_last_diag",
          "f": "goto_next_function",
          "t": "goto_next_class",
          "a": "goto_next_parameter",
          "c": "goto_next_comment",
          "T": "goto_next_test",
          "p": "goto_next_paragraph",
          "g": "goto_next_change",
          "G": "goto_first_change",
        },

        "(": {
          "d": "goto_prev_diag",
          "D": "goto_first_diag",
          "f": "goto_prev_function",
          "t": "goto_prev_class",
          "a": "goto_prev_parameter",
          "c": "goto_prev_comment",
          "p": "goto_prev_paragraph",
          "T": "goto_prev_test",
          "g": "goto_prev_change",
          "G": "goto_last_change",
        },
      },
    },
  };
}

function languages() {
  const languages = {
    language: [
      {
        "name": "typescript",
        "file-types": ["ts", "js", "tsx", "jsx"],
        "language-server": { command: "deno", args: ["lsp"] },
        "config": { deno: { enable: true } },
        "auto-format": true,
      },
      //   {
      //     "name": "typescript",
      //     "file-types": ["ts", "js", "tsx", "jsx"],
      //     "language-server": {
      //       command: "typescript-language-server",
      //       args: ["--stdio"],
      //     },
      //     "roots": ["package.json"],
      //     "auto-format": true,
      //   },
    ],
  };
  return languages;
}

export default jsConfig;
