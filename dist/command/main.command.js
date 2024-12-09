"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nest_commander_1 = require("nest-commander");
const common_1 = require("@nestjs/common");
const app_module_1 = require("../app.module");
const commanderLogger = new common_1.Logger('Commander');
async function bootstrap() {
    await nest_commander_1.CommandFactory.run(app_module_1.AppModule, {
        errorHandler: (err) => {
            commanderLogger.error(err);
        },
    });
}
bootstrap();
//# sourceMappingURL=main.command.js.map