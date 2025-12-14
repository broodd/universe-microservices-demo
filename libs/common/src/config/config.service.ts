import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { config } from 'dotenv';

import { Injectable, Inject } from '@nestjs/common';

import { ConfigModuleOptions, IConfigService, ConfigMode } from './interfaces';
import { CONFIG_MODULE_OPTIONS } from './config.constants';

/**
 * Configuration service
 */
@Injectable()
export class ConfigService implements IConfigService {
  /**
   * File postfix
   */
  private readonly envFilePostfix = '_FILE';

  /**
   * Configuration service constructor
   * DotEnv config
   */
  constructor(
    @Inject(CONFIG_MODULE_OPTIONS)
    public readonly options: ConfigModuleOptions,
  ) {
    const envFileName = `.env.${process.env['NODE_ENV'] || ConfigMode.development}`;
    const envPath = join(process.cwd(), options.rootDir, envFileName);

    const { error } = config({ path: envPath });
    if (error) throw error;
  }

  /**
   * Method to get the path to a directory or file in this directory based on an environment variable
   * @param  key      The key in the environment variable object must be a string
   * @param  filename The file name for a specific directory must be string, is optional
   * @return          Returns the absolute path to a file or directory as a string
   */
  public getDest(key: string, filename?: string): string {
    filename = process.env[filename] || filename || '/';
    return join(process.cwd(), this.get(key), filename);
  }

  /**
   * Method for checking application operating modes
   * @param  mode The mode to be checked must be enum modes in ConfigMode
   * @return     Returns the boolean value
   */
  public getMode(mode: ConfigMode): boolean {
    return process.env['NODE_ENV'] === mode;
  }

  /**
   * Method for getting the value of a variable in the environment
   * @param  key The key in the environment variable object must be a string
   * @return     Returns the generated type limited the function types JSON.parse()
   */
  public get<T = NodeJS.ProcessEnv>(key: string): T {
    let variable = process.env[key];
    if (!variable) {
      const path = join(
        process.cwd(),
        this.options.rootDir,
        process.env[key + this.envFilePostfix],
      );

      variable = existsSync(path) ? readFileSync(path, 'utf8') : null;
    }
    if (!variable) throw TypeError(`The ${key} cannot be undefined`);
    try {
      return JSON.parse(variable);
    } catch {
      return <T>(<unknown>variable);
    }
  }
}
