import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { DynamicModule, Provider, Global, Module } from '@nestjs/common';

import { ConfigModuleAsyncOptions, ConfigOptionsFactory, ConfigModuleOptions } from './interfaces';
import { CONFIG_MODULE_OPTIONS, CONFIG_MODULE } from './config.constants';
import { ConfigService } from './config.service';

/**
 * [description]
 */
@Global()
@Module({})
export class ConfigModule {
  /**
   * [description]
   * @param  options [description]
   * @return         [description]
   */
  static register(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        { provide: CONFIG_MODULE_OPTIONS, useValue: options },
        { provide: CONFIG_MODULE, useValue: randomStringGenerator() },
        { provide: ConfigService, useClass: ConfigService },
      ],
      exports: [CONFIG_MODULE, CONFIG_MODULE_OPTIONS, ConfigService],
    };
  }

  /**
   * [description]
   * @param  options [description]
   */
  public static registerAsync(options: ConfigModuleAsyncOptions): DynamicModule {
    return {
      module: ConfigModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        { provide: CONFIG_MODULE, useValue: randomStringGenerator() },
        { provide: ConfigService, useClass: ConfigService },
      ],
      exports: [CONFIG_MODULE, CONFIG_MODULE_OPTIONS, ConfigService],
    };
  }

  /**
   * [description]
   * @param  options [description]
   */
  private static createAsyncProviders(options: ConfigModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  /**
   * [description]
   * @param  options [description]
   */
  private static createAsyncOptionsProvider(options: ConfigModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: CONFIG_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: CONFIG_MODULE_OPTIONS,
      useFactory: async (optionsFactory: ConfigOptionsFactory) =>
        optionsFactory.createConfigOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
