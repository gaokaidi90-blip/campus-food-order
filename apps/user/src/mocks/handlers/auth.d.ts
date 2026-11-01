/**
 * 验证用户 token
 */
declare function validateUserToken(request: Request): string | null;
export declare const authHandlers: import("msw").HttpHandler[];
export { validateUserToken };
