import { InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js';
declare const _default: import('vue').DefineComponent<{}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    scrollContainer: import('vue').CreateComponentPublicInstanceWithMixins<{
        tag: string | import('vuetify/lib/types.mjs').JSXComponent;
        direction: "horizontal" | "vertical";
        side: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSide;
        mode: "intersect" | "manual";
        loadMoreText: string;
        emptyText: string;
    } & {
        height?: string | number | undefined;
        maxHeight?: string | number | undefined;
        maxWidth?: string | number | undefined;
        minHeight?: string | number | undefined;
        minWidth?: string | number | undefined;
        width?: string | number | undefined;
        color?: string | undefined;
        margin?: string | number | undefined;
    } & {
        $children?: {
            default?: (() => import('vue').VNodeChild) | undefined;
            loading?: ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            error?: ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            empty?: ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            "load-more"?: ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        } | {
            $stable?: boolean | undefined;
        } | (() => import('vue').VNodeChild) | import('vue').VNodeChild;
        "v-slots"?: {
            default?: false | (() => import('vue').VNodeChild) | undefined;
            loading?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            error?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            empty?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            "load-more"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        } | undefined;
    } & {
        "v-slot:default"?: false | (() => import('vue').VNodeChild) | undefined;
        "v-slot:empty"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:error"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:load-more"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:loading"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
    } & {
        onLoad?: ((options: {
            side: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSide;
            done: (status: InfiniteScrollStatus) => void;
        }) => any) | undefined;
    }, {
        reset: (side?: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSide | undefined) => void;
    }, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        load: (options: {
            side: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSide;
            done: (status: InfiniteScrollStatus) => void;
        }) => true;
    }, import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, {
        tag: string | import('vuetify/lib/types.mjs').JSXComponent;
        direction: "horizontal" | "vertical";
        side: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSide;
        mode: "intersect" | "manual";
        loadMoreText: string;
        emptyText: string;
    }, true, {}, import('vue').SlotsType<Partial<{
        default: () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        loading: (arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        error: (arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        empty: (arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        "load-more": (arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
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
        tag: string | import('vuetify/lib/types.mjs').JSXComponent;
        direction: "horizontal" | "vertical";
        side: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSide;
        mode: "intersect" | "manual";
        loadMoreText: string;
        emptyText: string;
    } & {
        height?: string | number | undefined;
        maxHeight?: string | number | undefined;
        maxWidth?: string | number | undefined;
        minHeight?: string | number | undefined;
        minWidth?: string | number | undefined;
        width?: string | number | undefined;
        color?: string | undefined;
        margin?: string | number | undefined;
    } & {
        $children?: {
            default?: (() => import('vue').VNodeChild) | undefined;
            loading?: ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            error?: ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            empty?: ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            "load-more"?: ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        } | {
            $stable?: boolean | undefined;
        } | (() => import('vue').VNodeChild) | import('vue').VNodeChild;
        "v-slots"?: {
            default?: false | (() => import('vue').VNodeChild) | undefined;
            loading?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            error?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            empty?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
            "load-more"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        } | undefined;
    } & {
        "v-slot:default"?: false | (() => import('vue').VNodeChild) | undefined;
        "v-slot:empty"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:error"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:load-more"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:loading"?: false | ((arg: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSlot) => import('vue').VNodeChild) | undefined;
    } & {
        onLoad?: ((options: {
            side: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSide;
            done: (status: InfiniteScrollStatus) => void;
        }) => any) | undefined;
    }, {
        reset: (side?: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSide | undefined) => void;
    }, {}, {}, {}, {
        tag: string | import('vuetify/lib/types.mjs').JSXComponent;
        direction: "horizontal" | "vertical";
        side: import('vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.js').InfiniteScrollSide;
        mode: "intersect" | "manual";
        loadMoreText: string;
        emptyText: string;
    }> | null;
}, HTMLDivElement>;
export default _default;
//# sourceMappingURL=MessageList.vue.d.ts.map