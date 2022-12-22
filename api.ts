export interface JsConfig {
  config: {
    name: string;
    fn: () => Record<string, unknown>;
  }[];
}
