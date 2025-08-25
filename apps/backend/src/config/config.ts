import { NODE_ENV, PORT } from "../constants";

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: PORT,
  nodeEnv: NODE_ENV,
};

export default config;
