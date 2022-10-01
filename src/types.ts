interface ParseArgsOptionConfig {
  type: "string" | "boolean";
  short?: string;
  multiple?: boolean;
}

interface ParseArgsOptionsConfig {
  [longOption: string]: ParseArgsOptionConfig;
}

export interface Config {
  strict?: boolean;
  allowPositionals?: boolean;
  tokens?: boolean;
  options?: ParseArgsOptionsConfig;
  args?: string[];
}
