export const EXTRA_ARGS: "extraArgs";
export type DriverType = import('@appium/types').DriverType;
export type PluginType = import('@appium/types').PluginType;
/**
 * Creates a {@link ArgParser} instance; finalizes the config schema.
 *
 * @constructs ArgParser
 * @param {boolean} [debug] - If `true`, throw instead of exit upon parsing error
 * @returns {ArgParser}
 */
export function getParser(debug?: boolean | undefined): ArgParser;
/**
 * A wrapper around `argparse`
 *
 * - Handles instantiation, configuration, and monkeypatching of an
 *    `ArgumentParser` instance for Appium server and its extensions
 * - Handles error conditions, messages, and exit behavior
 */
export class ArgParser {
    /**
     * Given an object full of arguments as returned by `argparser.parse_args`,
     * expand the ones for extensions into a nested object structure and rename
     * keys to match the intended destination.
     *
     * E.g., `{'driver-foo-bar': baz}` becomes `{driver: {foo: {bar: 'baz'}}}`
     * @param {object} args
     * @param {string[]} [unknownArgs]
     * @returns {object}
     */
    static _transformParsedArgs(args: object, unknownArgs?: string[] | undefined): object;
    /**
     * Patches the `exit()` method of the parser to throw an error, so we can handle it manually.
     * @param {ArgumentParser} parser
     */
    static _patchExit(parser: ArgumentParser): void;
    /**
     *
     * @param {import('argparse').SubParser} subParser
     * @returns {import('./args').ArgumentDefinitions}
     */
    static _addServerToParser(subParser: import('argparse').SubParser): import('./args').ArgumentDefinitions;
    /**
     * Adds extension sub-sub-commands to `driver`/`plugin` subcommands
     * @param {import('argparse').SubParser} subParsers
     */
    static _addExtensionCommandsToParser(subParsers: import('argparse').SubParser): void;
    /**
     * @param {boolean} [debug] - If true, throw instead of exit on error.
     */
    constructor(debug?: boolean | undefined);
    /**
     * Program name (typically `appium`)
     * @type {string}
     */
    prog: string;
    /**
     * If `true`, throw an error on parse failure instead of printing help
     * @type {boolean}
     */
    debug: boolean;
    /**
     * Wrapped `ArgumentParser` instance
     * @type {ArgumentParser}
     */
    parser: ArgumentParser;
    rawArgs: import("./args").ArgumentDefinitions;
    /**
     * @type {ArgParser['parseArgs']}
     */
    parse_args: ArgParser['parseArgs'];
    /**
     * Parse arguments from the command line.
     *
     * If no subcommand is passed in, this method will inject the `server` subcommand.
     *
     * `ArgParser.prototype.parse_args` is an alias of this method.
     * @template [T=import('appium/types').WithServerSubcommand]
     * @param {string[]} [args] - Array of arguments, ostensibly from `process.argv`. Gathers args from `process.argv` if not provided.
     * @returns {import('appium/types').Args<T>} - The parsed arguments
     */
    parseArgs<T = import("appium/types").WithServerSubcommand>(args?: string[] | undefined): import("appium/types").Args<T>;
}
import { ArgumentParser } from "argparse";
//# sourceMappingURL=parser.d.ts.map