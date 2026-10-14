"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalHttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalHttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let GlobalHttpExceptionFilter = GlobalHttpExceptionFilter_1 = class GlobalHttpExceptionFilter {
    logger = new common_1.Logger(GlobalHttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.headers["x-request-id"] || (0, crypto_1.randomUUID)();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let errorCode = "INTERNAL_SERVER_ERROR";
        let message = "An unexpected error occurred.";
        let details = {};
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === "string") {
                message = res;
            }
            else if (typeof res === "object" && res !== null) {
                const obj = res;
                errorCode = obj.errorCode || obj.error || common_1.HttpStatus[status] || "ERROR";
                message = obj.message || message;
                details = obj.details || (Array.isArray(obj.message) ? { validationErrors: obj.message } : {});
                if (Array.isArray(obj.message)) {
                    message = "Validation failed.";
                }
            }
        }
        else if (exception instanceof Error) {
            this.logger.error(`[${requestId}] Unexpected error: ${exception.message}`, exception.stack);
        }
        response.status(status).json({
            error: {
                code: errorCode,
                message,
                details,
                requestId,
            },
        });
    }
};
exports.GlobalHttpExceptionFilter = GlobalHttpExceptionFilter;
exports.GlobalHttpExceptionFilter = GlobalHttpExceptionFilter = GlobalHttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalHttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map