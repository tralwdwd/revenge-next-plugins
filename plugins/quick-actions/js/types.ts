import type { quickActions } from "./lib/actions";

export type QuickAction = {
    name: string;
    icon: string;
    action(): void;
};

export type QuickActionConfig = {
    icon: string;
    title: string;
    arrow: boolean;
    action: keyof typeof quickActions;
};

export type QuickActionStorage = {
    actionConfigs: QuickActionConfig[];
};
