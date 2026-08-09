import { QuickActionId } from "./lib/actions";
import { patchActionSheet } from "./patches/actionsheet";
import { SettingsComponent } from "./ui/Settings";
import type { QuickActionStorage } from "./types";

export default plugin<{ jsonStorage: QuickActionStorage }>({
    jsonStorage: {
        load: true,
        default: {
            actionConfigs: [
                {
                    title: "Reload App",
                    icon: "RetryIcon",
                    arrow: false,
                    action: QuickActionId.reloadApp,
                },
                {
                    title: "Revenge Support Channel",
                    icon: "CircleQuestionIcon",
                    arrow: true,
                    action: QuickActionId.goToSupportChannel,
                },
                {
                    title: "Plugins",
                    icon: "PuzzlePieceIcon",
                    arrow: true,
                    action: QuickActionId.goToPlugins,
                },
            ],
        },
    },
    start(api) {
        patchActionSheet(api);
    },
    SettingsComponent,
});
