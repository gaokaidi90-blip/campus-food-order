import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { useAuth } from '@/composables/useAuth';
const router = useRouter();
const { login } = useAuth();
const studentId = ref('');
const password = ref('');
const loading = ref(false);
async function handleLogin() {
    if (!studentId.value) {
        showToast('请输入学号');
        return;
    }
    if (!password.value) {
        showToast('请输入密码');
        return;
    }
    loading.value = true;
    const success = await login(studentId.value, password.value);
    loading.value = false;
    if (success) {
        showToast('登录成功');
        router.push('/');
    }
    else {
        showToast('学号或密码错误');
    }
}
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
const __VLS_template = () => {
    void {};
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(({ class: 'login-container' }));
    /** @type {__VLS_StyleScopedClasses['login-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(({ class: 'login-header' }));
    /** @type {__VLS_StyleScopedClasses['login-header']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.vanForm | typeof __VLS_components.VanForm | typeof __VLS_components['van-form'] | typeof __VLS_components.vanForm | typeof __VLS_components.VanForm | typeof __VLS_components['van-form']} */
    vanForm;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(({ 'onSubmit': {} })));
    const __VLS_2 = __VLS_1(({ 'onSubmit': {} }), ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    const __VLS_6 = {
        /** @type {typeof __VLS_5.submit} */
        onSubmit: (handleLogin),
    };
    void __VLS_6;
    var __VLS_3;
    var __VLS_4;
    const { default: __VLS_7 } = __VLS_nonNull(__VLS_3.slots);
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.vanCellGroup | typeof __VLS_components.VanCellGroup | typeof __VLS_components['van-cell-group'] | typeof __VLS_components.vanCellGroup | typeof __VLS_components.VanCellGroup | typeof __VLS_components['van-cell-group']} */
    vanCellGroup;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        // @ts-ignore
        inset: true,
    }));
    const __VLS_10 = __VLS_9({
        inset: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    var __VLS_11;
    const { default: __VLS_13 } = __VLS_nonNull(__VLS_11.slots);
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.vanField | typeof __VLS_components.VanField | typeof __VLS_components['van-field']} */
    vanField;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        // @ts-ignore
        modelValue: (__VLS_unwrap(studentId, {})), name: "studentId", label: "学号", placeholder: "请输入学号", rules: ([{ required: true, message: '请输入学号' }]),
    }));
    const __VLS_16 = __VLS_15({
        modelValue: (__VLS_unwrap(studentId, {})),
        name: "studentId",
        label: "学号",
        placeholder: "请输入学号",
        rules: ([{ required: true, message: '请输入学号' }]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.vanField | typeof __VLS_components.VanField | typeof __VLS_components['van-field']} */
    vanField;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        // @ts-ignore
        modelValue: (__VLS_unwrap(password, {})), type: "password", name: "password", label: "密码", placeholder: "请输入密码", rules: ([{ required: true, message: '请输入密码' }]),
    }));
    const __VLS_21 = __VLS_20({
        modelValue: (__VLS_unwrap(password, {})),
        type: "password",
        name: "password",
        label: "密码",
        placeholder: "请输入密码",
        rules: ([{ required: true, message: '请输入密码' }]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    // @ts-ignore
    [studentId, password,];
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(({ class: 'login-button' }));
    /** @type {__VLS_StyleScopedClasses['login-button']} */ ;
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.vanButton | typeof __VLS_components.VanButton | typeof __VLS_components['van-button'] | typeof __VLS_components.vanButton | typeof __VLS_components.VanButton | typeof __VLS_components['van-button']} */
    vanButton;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        // @ts-ignore
        round: true, block: true, type: "primary", nativeType: "submit", loading: (__VLS_unwrap(loading, {})),
    }));
    const __VLS_26 = __VLS_25({
        round: true,
        block: true,
        type: "primary",
        nativeType: "submit",
        loading: (__VLS_unwrap(loading, {})),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    var __VLS_27;
    const { default: __VLS_29 } = __VLS_nonNull(__VLS_27.slots);
    // @ts-ignore
    [loading,];
    // @ts-ignore
    [];
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(({ class: 'login-tip' }));
    /** @type {__VLS_StyleScopedClasses['login-tip']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    // @ts-ignore
    [];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
