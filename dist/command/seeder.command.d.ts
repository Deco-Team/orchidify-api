import { ISettingService } from '@setting/services/setting.service';
import { CommandRunner } from 'nest-commander';
interface BasicCommandOptions {
    string?: string;
    boolean?: boolean;
    number?: number;
}
export declare class SeederCommand extends CommandRunner {
    private readonly settingService;
    private readonly appLogger;
    constructor(settingService: ISettingService);
    run(passedParam: string[], options?: BasicCommandOptions): Promise<void>;
    runWithSettingData(): Promise<void>;
}
export {};
