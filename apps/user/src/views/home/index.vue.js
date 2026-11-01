import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
onMounted(() => {
    if (userStore.isLoggedIn() && !userStore.userInfo) {
        userStore.fetchUserInfo();
    }
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
const __VLS_template = () => {
    __VLS_withDotValue(userStore, {});
    void {};
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(({ class: 'home-container' }));
    /** @type {__VLS_StyleScopedClasses['home-container']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
    if (userStore.value.userInfo) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
        (userStore.value.userInfo.name);
    }
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.vanButton | typeof __VLS_components.VanButton | typeof __VLS_components['van-button'] | typeof __VLS_components.vanButton | typeof __VLS_components.VanButton | typeof __VLS_components['van-button']} */
    vanButton;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0(({
	'onClick': {},
	type: 'primary'
})));
    const __VLS_2 = __VLS_1(({
	'onClick': {},
	type: 'primary'
}), ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    const __VLS_6 = {
        /** @type {typeof __VLS_5.click} */
        onClick: (...[$event]) => {
            void $event;
            return (__VLS_ctx.$router.push('/login'));
            // @ts-ignore
            [userStore, userStore, $router,];
        },
    };
    void __VLS_6;
    var __VLS_3;
    var __VLS_4;
    const { default: __VLS_7 } = __VLS_nonNull(__VLS_3.slots);
    // @ts-ignore
    [];
    // @ts-ignore
    [];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
