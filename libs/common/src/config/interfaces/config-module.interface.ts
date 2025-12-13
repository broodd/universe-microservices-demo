import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';

/**
 * [description]
 */
export interface ConfigModuleOptions {
  readonly rootDir?: string;
}

/**
 * [description]
 */
export interface ConfigOptionsFactory {
  /**
   * [description]
   */
  createConfigOptions(): Promise<ConfigModuleOptions> | ConfigModuleOptions;
}

/**
 * [description]
 */
export interface ConfigModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  /**
   * [description]
   */
  useExisting?: Type<ConfigOptionsFactory>;

  /**
   * [description]
   */
  useClass?: Type<ConfigOptionsFactory>;

  /**
   * [description]
   */
  useFactory?: (...args: any[]) => Promise<ConfigModuleOptions> | ConfigModuleOptions;

  /**
   * [description]
   */
  inject?: any[];
}
