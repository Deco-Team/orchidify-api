"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseModule = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const firebase_repository_1 = require("./repositories/firebase.repository");
const setting_service_1 = require("../setting/services/setting.service");
const constant_1 = require("../setting/contracts/constant");
const firebase_controller_1 = require("./controllers/firebase.controller");
const firebase_auth_service_1 = require("./services/firebase.auth.service");
const learner_module_1 = require("../learner/learner.module");
const instructor_module_1 = require("../instructor/instructor.module");
const firebase_messaging_service_1 = require("./services/firebase.messaging.service");
const firebaseProvider = {
    provide: 'FIREBASE_APP',
    inject: [setting_service_1.ISettingService],
    useFactory: async (settingService) => {
        const firebaseConfig = ((await settingService.findByKey(constant_1.SettingKey.FirebaseConfig)).value ||
            {});
        return admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
        });
    }
};
let FirebaseModule = class FirebaseModule {
};
exports.FirebaseModule = FirebaseModule;
exports.FirebaseModule = FirebaseModule = __decorate([
    (0, common_1.Module)({
        imports: [learner_module_1.LearnerModule, instructor_module_1.InstructorModule],
        controllers: [firebase_controller_1.FirebaseController],
        providers: [
            firebaseProvider,
            {
                provide: firebase_repository_1.IFirebaseRepository,
                useClass: firebase_repository_1.FirebaseRepository
            },
            {
                provide: firebase_auth_service_1.IFirebaseAuthService,
                useClass: firebase_auth_service_1.FirebaseAuthService
            },
            {
                provide: firebase_messaging_service_1.IFirebaseMessagingService,
                useClass: firebase_messaging_service_1.FirebaseMessagingService
            }
        ],
        exports: [
            {
                provide: firebase_auth_service_1.IFirebaseAuthService,
                useClass: firebase_auth_service_1.FirebaseAuthService
            },
            {
                provide: firebase_messaging_service_1.IFirebaseMessagingService,
                useClass: firebase_messaging_service_1.FirebaseMessagingService
            }
        ]
    })
], FirebaseModule);
//# sourceMappingURL=firebase.module.js.map