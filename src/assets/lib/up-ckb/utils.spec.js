"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const utils_1 = require("./utils");
(0, ava_1.default)('test sha256', (t) => {
    const hash = (0, utils_1.sha256)('hello world');
    t.is(hash, '0xb94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG1DQUFpQztBQUVqQyxJQUFBLGFBQUksRUFBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUN4QixNQUFNLElBQUksR0FBRyxJQUFBLGNBQU0sRUFBQyxhQUFhLENBQUMsQ0FBQztJQUVuQyxDQUFDLENBQUMsRUFBRSxDQUNGLElBQUksRUFDSixvRUFBb0UsQ0FDckUsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIn0=