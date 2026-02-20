declare function focus(): void;
declare const _default: import('vue').DefineComponent<{}, {
    focus: typeof focus;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    triggerBtn: import('vue').CreateComponentPublicInstanceWithMixins<{
        style: string | false | import('vue').StyleValue[] | import('vue').CSSProperties | null;
        density: import('vuetify/lib/composables/density.mjs').Density;
        tile: boolean;
        tag: string | import('vuetify/lib/types.mjs').JSXComponent;
        variant: "elevated" | "flat" | "outlined" | "plain" | "text" | "tonal";
        disabled: boolean;
        size: string | number;
        replace: boolean;
        exact: boolean;
        symbol: any;
        flat: boolean;
        block: boolean;
        readonly: boolean;
        slim: boolean;
        stacked: boolean;
        ripple: boolean | {
            class?: string | undefined;
            keys?: string[] | undefined;
        };
    } & {
        theme?: string | undefined;
        class?: any;
        border?: string | number | boolean | undefined;
        elevation?: string | number | undefined;
        rounded?: string | number | boolean | undefined;
        color?: string | undefined;
        value?: any;
        selectedClass?: string | undefined;
        height?: string | number | undefined;
        maxHeight?: string | number | undefined;
        maxWidth?: string | number | undefined;
        minHeight?: string | number | undefined;
        minWidth?: string | number | undefined;
        width?: string | number | undefined;
        location?: import('vuetify/lib/types.mjs').Anchor | null | undefined;
        loading?: string | boolean | undefined;
        position?: "absolute" | "fixed" | "relative" | "static" | "sticky" | undefined;
        href?: string | undefined;
        to?: string | import('vue-router').RouteLocationAsPathGeneric | import('vue-router').RouteLocationAsRelativeGeneric | undefined;
        active?: boolean | undefined;
        activeColor?: string | undefined;
        baseColor?: string | undefined;
        icon?: boolean | import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        spaced?: "both" | "end" | "start" | undefined;
        text?: string | number | boolean | undefined;
    } & {
        $children?: {
            default?: (() => import('vue').VNodeChild) | undefined;
            prepend?: (() => import('vue').VNodeChild) | undefined;
            append?: (() => import('vue').VNodeChild) | undefined;
            loader?: (() => import('vue').VNodeChild) | undefined;
        } | {
            $stable?: boolean | undefined;
        } | (() => import('vue').VNodeChild) | import('vue').VNodeChild;
        "v-slots"?: {
            default?: false | (() => import('vue').VNodeChild) | undefined;
            prepend?: false | (() => import('vue').VNodeChild) | undefined;
            append?: false | (() => import('vue').VNodeChild) | undefined;
            loader?: false | (() => import('vue').VNodeChild) | undefined;
        } | undefined;
    } & {
        "v-slot:append"?: false | (() => import('vue').VNodeChild) | undefined;
        "v-slot:default"?: false | (() => import('vue').VNodeChild) | undefined;
        "v-slot:loader"?: false | (() => import('vue').VNodeChild) | undefined;
        "v-slot:prepend"?: false | (() => import('vue').VNodeChild) | undefined;
    } & {
        "onGroup:selected"?: ((val: {
            value: boolean;
        }) => any) | undefined;
    }, {
        group: import('vuetify/lib/composables/group.mjs').GroupItemProvide | null;
    }, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        "group:selected": (val: {
            value: boolean;
        }) => true;
    }, import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, {
        style: import('vue').StyleValue;
        density: import('vuetify/lib/composables/density.mjs').Density;
        rounded: string | number | boolean;
        tile: boolean;
        tag: string | import('vuetify/lib/types.mjs').JSXComponent;
        variant: "elevated" | "flat" | "outlined" | "plain" | "text" | "tonal";
        disabled: boolean;
        size: string | number;
        replace: boolean;
        exact: boolean;
        active: boolean;
        symbol: any;
        flat: boolean;
        block: boolean;
        readonly: boolean;
        slim: boolean;
        stacked: boolean;
        ripple: boolean | {
            class?: string | undefined;
            keys?: string[] | undefined;
        } | undefined;
        text: string | number | boolean;
    }, true, {}, import('vue').SlotsType<Partial<{
        default: () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        prepend: () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        append: () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        loader: () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
    }>>, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, {
        style: string | false | import('vue').StyleValue[] | import('vue').CSSProperties | null;
        density: import('vuetify/lib/composables/density.mjs').Density;
        tile: boolean;
        tag: string | import('vuetify/lib/types.mjs').JSXComponent;
        variant: "elevated" | "flat" | "outlined" | "plain" | "text" | "tonal";
        disabled: boolean;
        size: string | number;
        replace: boolean;
        exact: boolean;
        symbol: any;
        flat: boolean;
        block: boolean;
        readonly: boolean;
        slim: boolean;
        stacked: boolean;
        ripple: boolean | {
            class?: string | undefined;
            keys?: string[] | undefined;
        };
    } & {
        theme?: string | undefined;
        class?: any;
        border?: string | number | boolean | undefined;
        elevation?: string | number | undefined;
        rounded?: string | number | boolean | undefined;
        color?: string | undefined;
        value?: any;
        selectedClass?: string | undefined;
        height?: string | number | undefined;
        maxHeight?: string | number | undefined;
        maxWidth?: string | number | undefined;
        minHeight?: string | number | undefined;
        minWidth?: string | number | undefined;
        width?: string | number | undefined;
        location?: import('vuetify/lib/types.mjs').Anchor | null | undefined;
        loading?: string | boolean | undefined;
        position?: "absolute" | "fixed" | "relative" | "static" | "sticky" | undefined;
        href?: string | undefined;
        to?: string | import('vue-router').RouteLocationAsPathGeneric | import('vue-router').RouteLocationAsRelativeGeneric | undefined;
        active?: boolean | undefined;
        activeColor?: string | undefined;
        baseColor?: string | undefined;
        icon?: boolean | import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        spaced?: "both" | "end" | "start" | undefined;
        text?: string | number | boolean | undefined;
    } & {
        $children?: {
            default?: (() => import('vue').VNodeChild) | undefined;
            prepend?: (() => import('vue').VNodeChild) | undefined;
            append?: (() => import('vue').VNodeChild) | undefined;
            loader?: (() => import('vue').VNodeChild) | undefined;
        } | {
            $stable?: boolean | undefined;
        } | (() => import('vue').VNodeChild) | import('vue').VNodeChild;
        "v-slots"?: {
            default?: false | (() => import('vue').VNodeChild) | undefined;
            prepend?: false | (() => import('vue').VNodeChild) | undefined;
            append?: false | (() => import('vue').VNodeChild) | undefined;
            loader?: false | (() => import('vue').VNodeChild) | undefined;
        } | undefined;
    } & {
        "v-slot:append"?: false | (() => import('vue').VNodeChild) | undefined;
        "v-slot:default"?: false | (() => import('vue').VNodeChild) | undefined;
        "v-slot:loader"?: false | (() => import('vue').VNodeChild) | undefined;
        "v-slot:prepend"?: false | (() => import('vue').VNodeChild) | undefined;
    } & {
        "onGroup:selected"?: ((val: {
            value: boolean;
        }) => any) | undefined;
    }, {
        group: import('vuetify/lib/composables/group.mjs').GroupItemProvide | null;
    }, {}, {}, {}, {
        style: import('vue').StyleValue;
        density: import('vuetify/lib/composables/density.mjs').Density;
        rounded: string | number | boolean;
        tile: boolean;
        tag: string | import('vuetify/lib/types.mjs').JSXComponent;
        variant: "elevated" | "flat" | "outlined" | "plain" | "text" | "tonal";
        disabled: boolean;
        size: string | number;
        replace: boolean;
        exact: boolean;
        active: boolean;
        symbol: any;
        flat: boolean;
        block: boolean;
        readonly: boolean;
        slim: boolean;
        stacked: boolean;
        ripple: boolean | {
            class?: string | undefined;
            keys?: string[] | undefined;
        } | undefined;
        text: string | number | boolean;
    }> | null;
}, HTMLDivElement>;
export default _default;
//# sourceMappingURL=FloatingButton.vue.d.ts.map