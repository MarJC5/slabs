import type { Plugin, ResolvedConfig } from 'vite';
import { watch as createWatcher } from 'chokidar';
import path from 'node:path';
import { BlockScanner } from '../domain/scanner/BlockScanner';
import { BlockValidator } from '../domain/validator/BlockValidator';
import { RegistryGenerator } from '../domain/generator/RegistryGenerator';
import type { SlabsPluginOptions } from './types';
import type { BlockDefinition, ValidationResult } from '../domain/types';

const VIRTUAL_MODULE_ID = 'virtual:slabs-registry';
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID;

/**
 * Slabs Vite Plugin
 *
 * Scans blocks directory, validates blocks, and generates a virtual module
 * that can be imported by @slabs/client and @slabs/renderer
 */
export function slabsPlugin(options: SlabsPluginOptions): Plugin {
  let config: ResolvedConfig;
  let generatedCode: string = '';
  let scannedBlocks: BlockDefinition[] = [];
  let isDev: boolean = false;
  let blocksDir: string;

  const scanner = new BlockScanner();
  const validator = new BlockValidator();
  const generator = new RegistryGenerator();

  /**
   * Scan and validate blocks, then generate virtual module
   */
  async function scanAndGenerate(): Promise<void> {
    console.log('[Slabs] Scanning blocks...');

    try {
      // Scan blocks directory
      scannedBlocks = await scanner.scanBlocks(blocksDir, options.scanOptions);

      console.log(`[Slabs] Found ${scannedBlocks.length} blocks`);

      // Validate all blocks
      const validationResults: ValidationResult[] = [];
      const validBlocks: BlockDefinition[] = [];

      for (const block of scannedBlocks) {
        const result = await validator.validate(block.path);
        validationResults.push(result);

        if (result.valid) {
          validBlocks.push(block);
          console.log(`  ✓ ${block.name} (${block.meta.title})`);
        } else {
          console.error(`  ✗ ${block.name} - ${result.errors.length} error(s)`);
          result.errors.forEach(error => {
            console.error(`    - ${error.message}`);
          });
        }

        // Show warnings if enabled
        if (options.validation?.warnings !== false && result.warnings.length > 0) {
          result.warnings.forEach(warning => {
            console.warn(`[Slabs Warning] ${block.path}: ${warning.message}`);
            if (warning.suggestion) {
              console.warn(`  Suggestion: ${warning.suggestion}`);
            }
          });
        }
      }

      // Call custom validation handler
      if (options.onValidation) {
        options.onValidation(validationResults);
      }

      // Handle validation errors in strict mode
      const hasErrors = validationResults.some(r => !r.valid);
      if (hasErrors && options.validation?.strict) {
        const totalErrors = validationResults.reduce((sum, r) => sum + r.errors.length, 0);
        throw new Error(
          `[Slabs] Found ${totalErrors} validation error(s). Build failed due to strict mode.`
        );
      }

      // Log error summary if not in strict mode
      if (hasErrors) {
        const invalidBlocks = validationResults.filter(r => !r.valid).length;
        console.error(
          `[Slabs] Found ${invalidBlocks} invalid block(s). ` +
          `Run with validation.strict: true to fail the build.`
        );
      }

      // Generate virtual module with valid blocks only
      scannedBlocks = validBlocks;
      generatedCode = generator.generateModule(validBlocks);

      console.log(`[Slabs] Generated virtual module with ${validBlocks.length} valid block(s)`);
    } catch (error) {
      console.error('[Slabs] Error during scanning:', error);
      throw error;
    }
  }

  return {
    name: 'slabs',

    /**
     * Store resolved config
     */
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      isDev = config.mode === 'development';

      // Resolve blocks directory relative to project root
      blocksDir = path.resolve(config.root, options.blocksDir);

      console.log(`[Slabs] Blocks directory: ${blocksDir}`);
      console.log(`[Slabs] Mode: ${config.mode}`);
    },

    /**
     * Scan blocks during build start
     */
    async buildStart() {
      await scanAndGenerate();
    },

    /**
     * Resolve virtual module ID
     */
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID;
      }
    },

    /**
     * Load virtual module content
     */
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return {
          code: generatedCode,
          map: null // TODO: Generate source map for debugging
        };
      }
    },

    /**
     * Set up file watching in development mode
     */
    configureServer(server) {
      const shouldWatch = options.watch !== false && isDev;

      if (!shouldWatch) {
        return;
      }

      console.log('[Slabs] Enabling file watcher for blocks directory');

      const watcher = createWatcher(blocksDir, {
        ignored: /(^|[/\\])\../, // Ignore dotfiles
        persistent: true,
        ignoreInitial: true,
        depth: options.scanOptions?.maxDepth ?? 2
      });

      // Handle file changes
      watcher.on('change', async (filePath) => {
        console.log(`[Slabs] File changed: ${path.relative(config.root, filePath)}`);
        await handleFileChange(server, filePath);
      });

      // Handle new files
      watcher.on('add', async (filePath) => {
        console.log(`[Slabs] File added: ${path.relative(config.root, filePath)}`);
        await handleFileChange(server, filePath);
      });

      // Handle deleted files
      watcher.on('unlink', async (filePath) => {
        console.log(`[Slabs] File deleted: ${path.relative(config.root, filePath)}`);
        await handleFileChange(server, filePath);
      });

      // Clean up watcher on server close
      server.httpServer?.on('close', () => {
        watcher.close();
      });
    }
  };

  /**
   * Handle file changes and trigger HMR
   */
  async function handleFileChange(server: any, _filePath: string): Promise<void> {
    try {
      // Rescan and regenerate
      await scanAndGenerate();

      // Invalidate virtual module
      const module = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
      if (module) {
        server.moduleGraph.invalidateModule(module);
      }

      // Trigger full reload
      server.ws.send({
        type: 'full-reload',
        path: '*'
      });

      console.log('[Slabs] Hot reload triggered');
    } catch (error) {
      console.error('[Slabs] Error during hot reload:', error);
      server.ws.send({
        type: 'error',
        err: {
          message: `[Slabs] ${error instanceof Error ? error.message : 'Unknown error'}`,
          stack: error instanceof Error ? error.stack : ''
        }
      });
    }
  }
}
