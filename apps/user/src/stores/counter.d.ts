export declare const useCounterStore: import("pinia").SetupStoreDefinition<"counter", {
    count: import("vue").Ref<number, number>;
    doubleCount: import("vue").ComputedRef<number>;
    increment: () => void;
}>;
