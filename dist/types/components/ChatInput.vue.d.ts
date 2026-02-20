import { nextTick } from 'vue';
declare const _default: import('vue').DefineComponent<{}, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {
    textareaRef: import('vue').CreateComponentPublicInstanceWithMixins<{
        style: string | false | import('vue').StyleValue[] | import('vue').CSSProperties | null;
        focused: boolean;
        errorMessages: string | readonly string[] | null;
        maxErrors: string | number;
        readonly: boolean | null;
        rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
        density: import('vuetify/lib/composables/density.mjs').Density;
        tile: boolean;
        hideSpinButtons: boolean;
        persistentHint: boolean;
        messages: string | readonly string[];
        clearable: boolean;
        clearIcon: import('vuetify/lib/composables/icons.mjs').IconValue;
        active: boolean;
        dirty: boolean;
        disabled: boolean;
        glow: boolean;
        error: boolean;
        flat: boolean;
        persistentClear: boolean;
        reverse: boolean;
        singleLine: boolean;
        variant: "filled" | "outlined" | "plain" | "solo" | "solo-filled" | "solo-inverted" | "underlined";
        autoGrow: boolean;
        autofocus: boolean;
        persistentPlaceholder: boolean;
        persistentCounter: boolean;
        noResize: boolean;
        rows: string | number;
    } & {
        theme?: string | undefined;
        class?: any;
        "onUpdate:focused"?: ((args_0: boolean) => void) | undefined;
        name?: string | undefined;
        modelValue?: any;
        validateOn?: ("blur eager" | "blur lazy" | "eager" | "eager blur" | "eager input" | "eager invalid-input" | "eager submit" | "input eager" | "input lazy" | "invalid-input eager" | "invalid-input lazy" | "lazy" | "lazy blur" | "lazy input" | "lazy invalid-input" | "lazy submit" | "submit eager" | "submit lazy" | ("blur" | "input" | "invalid-input" | "submit")) | undefined;
        validationValue?: any;
        rounded?: string | number | boolean | undefined;
        maxWidth?: string | number | undefined;
        minWidth?: string | number | undefined;
        width?: string | number | undefined;
        loading?: string | boolean | undefined;
        id?: string | undefined;
        appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        hideDetails?: "auto" | boolean | undefined;
        hint?: string | undefined;
        "onClick:prepend"?: ((args_0: MouseEvent) => void) | undefined;
        "onClick:append"?: ((args_0: MouseEvent) => void) | undefined;
        appendInnerIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        bgColor?: string | undefined;
        centerAffix?: boolean | undefined;
        color?: string | undefined;
        baseColor?: string | undefined;
        iconColor?: string | boolean | undefined;
        label?: string | undefined;
        prependInnerIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        "onClick:clear"?: ((args_0: MouseEvent) => void) | undefined;
        "onClick:appendInner"?: ((args_0: MouseEvent) => void) | undefined;
        "onClick:prependInner"?: ((args_0: MouseEvent) => void) | undefined;
        autocomplete?: string | undefined;
        counter?: string | number | true | undefined;
        counterValue?: ((value: any) => number) | undefined;
        prefix?: string | undefined;
        placeholder?: string | undefined;
        maxHeight?: string | number | undefined;
        maxRows?: string | number | undefined;
        suffix?: string | undefined;
        modelModifiers?: Record<string, boolean> | undefined;
    } & {
        $children?: {
            prepend?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            append?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            details?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            message?: ((arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNodeChild) | undefined;
            clear?: ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
                props: Record<string, any>;
            }) => import('vue').VNodeChild) | undefined;
            "prepend-inner"?: ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
            "append-inner"?: ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
            label?: ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
                label: string | undefined;
                props: Record<string, any>;
            }) => import('vue').VNodeChild) | undefined;
            loader?: ((arg: import('vuetify/lib/composables/loader.mjs').LoaderSlotProps) => import('vue').VNodeChild) | undefined;
            counter?: ((arg: import('vuetify/lib/components/VCounter/VCounter.mjs').VCounterSlot) => import('vue').VNodeChild) | undefined;
        } | {
            $stable?: boolean | undefined;
        } | {} | import('vue').VNodeChild;
        "v-slots"?: {
            prepend?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            append?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            details?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            message?: false | ((arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNodeChild) | undefined;
            clear?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
                props: Record<string, any>;
            }) => import('vue').VNodeChild) | undefined;
            "prepend-inner"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
            "append-inner"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
            label?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
                label: string | undefined;
                props: Record<string, any>;
            }) => import('vue').VNodeChild) | undefined;
            loader?: false | ((arg: import('vuetify/lib/composables/loader.mjs').LoaderSlotProps) => import('vue').VNodeChild) | undefined;
            counter?: false | ((arg: import('vuetify/lib/components/VCounter/VCounter.mjs').VCounterSlot) => import('vue').VNodeChild) | undefined;
        } | undefined;
    } & {
        "v-slot:append"?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:append-inner"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:clear"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
            props: Record<string, any>;
        }) => import('vue').VNodeChild) | undefined;
        "v-slot:counter"?: false | ((arg: import('vuetify/lib/components/VCounter/VCounter.mjs').VCounterSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:details"?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:label"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
            label: string | undefined;
            props: Record<string, any>;
        }) => import('vue').VNodeChild) | undefined;
        "v-slot:loader"?: false | ((arg: import('vuetify/lib/composables/loader.mjs').LoaderSlotProps) => import('vue').VNodeChild) | undefined;
        "v-slot:message"?: false | ((arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:prepend"?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:prepend-inner"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
    } & {
        "onClick:control"?: ((e: MouseEvent) => any) | undefined;
        "onMousedown:control"?: ((e: MouseEvent) => any) | undefined;
        "onUpdate:focused"?: ((focused: boolean) => any) | undefined;
        "onUpdate:modelValue"?: ((val: string) => any) | undefined;
        "onUpdate:rows"?: ((rows: number) => any) | undefined;
    }, HTMLTextAreaElement & Omit<Omit<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            style: import('vue').StyleValue;
            focused: boolean;
            disabled: boolean | null;
            error: boolean;
            errorMessages: string | readonly string[] | null;
            maxErrors: string | number;
            readonly: boolean | null;
            rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
            density: import('vuetify/lib/composables/density.mjs').Density;
            centerAffix: boolean;
            glow: boolean;
            hideSpinButtons: boolean;
            persistentHint: boolean;
            messages: string | readonly string[];
            direction: "horizontal" | "vertical";
        }> & Omit<{
            theme?: string | undefined;
            class?: any;
            style: string | false | import('vue').StyleValue[] | import('vue').CSSProperties | null;
            focused: boolean;
            "onUpdate:focused"?: ((args_0: boolean) => void) | undefined;
            disabled: boolean | null;
            error: boolean;
            errorMessages: string | readonly string[] | null;
            maxErrors: string | number;
            name?: string | undefined;
            label?: string | undefined;
            readonly: boolean | null;
            rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
            validateOn?: ("blur eager" | "blur lazy" | "eager" | "eager blur" | "eager input" | "eager invalid-input" | "eager submit" | "input eager" | "input lazy" | "invalid-input eager" | "invalid-input lazy" | "lazy" | "lazy blur" | "lazy input" | "lazy invalid-input" | "lazy submit" | "submit eager" | "submit lazy" | ("blur" | "input" | "invalid-input" | "submit")) | undefined;
            validationValue?: any;
            density: import('vuetify/lib/composables/density.mjs').Density;
            maxWidth?: string | number | undefined;
            minWidth?: string | number | undefined;
            width?: string | number | undefined;
            id?: string | undefined;
            appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
            baseColor?: string | undefined;
            centerAffix: boolean;
            color?: string | undefined;
            glow: boolean;
            iconColor?: string | boolean | undefined;
            prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
            hideDetails?: "auto" | boolean | undefined;
            hideSpinButtons: boolean;
            hint?: string | undefined;
            persistentHint: boolean;
            messages: string | readonly string[];
            direction: "horizontal" | "vertical";
            "onClick:prepend"?: ((args_0: MouseEvent) => void) | undefined;
            "onClick:append"?: ((args_0: MouseEvent) => void) | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, "centerAffix" | "density" | "direction" | "disabled" | "error" | "errorMessages" | "focused" | "glow" | "hideSpinButtons" | "maxErrors" | "messages" | "persistentHint" | "readonly" | "rules" | "style">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            default?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            prepend?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            append?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            details?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            message?: ((arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null;
        $parent: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null;
        $host: Element | null;
        $emit: (event: string, ...args: any[]) => void;
        $el: any;
        $options: import('vue').ComponentOptionsBase<{
            style: string | false | import('vue').StyleValue[] | import('vue').CSSProperties | null;
            focused: boolean;
            disabled: boolean | null;
            error: boolean;
            errorMessages: string | readonly string[] | null;
            maxErrors: string | number;
            readonly: boolean | null;
            rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
            density: import('vuetify/lib/composables/density.mjs').Density;
            centerAffix: boolean;
            glow: boolean;
            hideSpinButtons: boolean;
            persistentHint: boolean;
            messages: string | readonly string[];
            direction: "horizontal" | "vertical";
        } & {
            theme?: string | undefined;
            class?: any;
            "onUpdate:focused"?: ((args_0: boolean) => void) | undefined;
            name?: string | undefined;
            label?: string | undefined;
            validateOn?: ("blur eager" | "blur lazy" | "eager" | "eager blur" | "eager input" | "eager invalid-input" | "eager submit" | "input eager" | "input lazy" | "invalid-input eager" | "invalid-input lazy" | "lazy" | "lazy blur" | "lazy input" | "lazy invalid-input" | "lazy submit" | "submit eager" | "submit lazy" | ("blur" | "input" | "invalid-input" | "submit")) | undefined;
            validationValue?: any;
            maxWidth?: string | number | undefined;
            minWidth?: string | number | undefined;
            width?: string | number | undefined;
            id?: string | undefined;
            appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
            baseColor?: string | undefined;
            color?: string | undefined;
            iconColor?: string | boolean | undefined;
            prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
            hideDetails?: "auto" | boolean | undefined;
            hint?: string | undefined;
            "onClick:prepend"?: ((args_0: MouseEvent) => void) | undefined;
            "onClick:append"?: ((args_0: MouseEvent) => void) | undefined;
        } & {}, {
            reset: () => Promise<void>;
            resetValidation: () => Promise<void>;
            validate: (silent?: boolean) => Promise<string[]>;
            isValid: import('vue').ComputedRef<boolean | null>;
            errorMessages: import('vue').ComputedRef<string[]>;
        }, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, Omit<{
            "update:modelValue": (value: any) => true;
        }, "$children" | "modelValue" | "update:modelValue" | "v-slot:append" | "v-slot:default" | "v-slot:details" | "v-slot:message" | "v-slot:prepend" | "v-slots">, string, {
            style: import('vue').StyleValue;
            focused: boolean;
            disabled: boolean | null;
            error: boolean;
            errorMessages: string | readonly string[] | null;
            maxErrors: string | number;
            readonly: boolean | null;
            rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
            density: import('vuetify/lib/composables/density.mjs').Density;
            centerAffix: boolean;
            glow: boolean;
            hideSpinButtons: boolean;
            persistentHint: boolean;
            messages: string | readonly string[];
            direction: "horizontal" | "vertical";
        }, {}, string, import('vue').SlotsType<Partial<{
            default: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
            prepend: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
            append: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
            details: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
            message: (arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
        }>>, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: ((() => void)[] | (() => void)) | undefined;
            created?: ((() => void)[] | (() => void)) | undefined;
            beforeMount?: ((() => void)[] | (() => void)) | undefined;
            mounted?: ((() => void)[] | (() => void)) | undefined;
            beforeUpdate?: ((() => void)[] | (() => void)) | undefined;
            updated?: ((() => void)[] | (() => void)) | undefined;
            activated?: ((() => void)[] | (() => void)) | undefined;
            deactivated?: ((() => void)[] | (() => void)) | undefined;
            beforeDestroy?: ((() => void)[] | (() => void)) | undefined;
            beforeUnmount?: ((() => void)[] | (() => void)) | undefined;
            destroyed?: ((() => void)[] | (() => void)) | undefined;
            unmounted?: ((() => void)[] | (() => void)) | undefined;
            renderTracked?: (((e: import('vue').DebuggerEvent) => void)[] | ((e: import('vue').DebuggerEvent) => void)) | undefined;
            renderTriggered?: (((e: import('vue').DebuggerEvent) => void)[] | ((e: import('vue').DebuggerEvent) => void)) | undefined;
            errorCaptured?: (((err: unknown, instance: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null, info: string) => void | boolean)[] | ((err: unknown, instance: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null, info: string) => void | boolean)) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (args_0: R, args_1: R, args_2: import('@vue/reactivity').OnCleanup) => any : (args_0: any, args_1: any, args_2: import('@vue/reactivity').OnCleanup) => any, options?: import('vue').WatchOptions<boolean> | undefined): import('vue').WatchStopHandle;
    } & Readonly<{
        style: import('vue').StyleValue;
        focused: boolean;
        disabled: boolean | null;
        error: boolean;
        errorMessages: string | readonly string[] | null;
        maxErrors: string | number;
        readonly: boolean | null;
        rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
        density: import('vuetify/lib/composables/density.mjs').Density;
        centerAffix: boolean;
        glow: boolean;
        hideSpinButtons: boolean;
        persistentHint: boolean;
        messages: string | readonly string[];
        direction: "horizontal" | "vertical";
    }> & Omit<{
        style: string | false | import('vue').StyleValue[] | import('vue').CSSProperties | null;
        focused: boolean;
        disabled: boolean | null;
        error: boolean;
        errorMessages: string | readonly string[] | null;
        maxErrors: string | number;
        readonly: boolean | null;
        rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
        density: import('vuetify/lib/composables/density.mjs').Density;
        centerAffix: boolean;
        glow: boolean;
        hideSpinButtons: boolean;
        persistentHint: boolean;
        messages: string | readonly string[];
        direction: "horizontal" | "vertical";
    } & {
        theme?: string | undefined;
        class?: any;
        "onUpdate:focused"?: ((args_0: boolean) => void) | undefined;
        name?: string | undefined;
        label?: string | undefined;
        validateOn?: ("blur eager" | "blur lazy" | "eager" | "eager blur" | "eager input" | "eager invalid-input" | "eager submit" | "input eager" | "input lazy" | "invalid-input eager" | "invalid-input lazy" | "lazy" | "lazy blur" | "lazy input" | "lazy invalid-input" | "lazy submit" | "submit eager" | "submit lazy" | ("blur" | "input" | "invalid-input" | "submit")) | undefined;
        validationValue?: any;
        maxWidth?: string | number | undefined;
        minWidth?: string | number | undefined;
        width?: string | number | undefined;
        id?: string | undefined;
        appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        baseColor?: string | undefined;
        color?: string | undefined;
        iconColor?: string | boolean | undefined;
        prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        hideDetails?: "auto" | boolean | undefined;
        hint?: string | undefined;
        "onClick:prepend"?: ((args_0: MouseEvent) => void) | undefined;
        "onClick:append"?: ((args_0: MouseEvent) => void) | undefined;
    }, "error" | "style" | "density" | "disabled" | "readonly" | "reset" | "isValid" | "resetValidation" | "validate" | "centerAffix" | "direction" | "errorMessages" | "focused" | "glow" | "hideSpinButtons" | "maxErrors" | "messages" | "persistentHint" | "rules"> & import('vue').ShallowUnwrapRef<{
        reset: () => Promise<void>;
        resetValidation: () => Promise<void>;
        validate: (silent?: boolean) => Promise<string[]>;
        isValid: import('vue').ComputedRef<boolean | null>;
        errorMessages: import('vue').ComputedRef<string[]>;
    }> & import('vue').ComponentCustomProperties & import('vuetify/lib/util/defineComponent.mjs').GenericProps<{
        modelValue?: unknown;
        "onUpdate:modelValue"?: ((value: unknown) => void) | undefined;
    }, import('vuetify/lib/components/VInput/VInput.mjs').VInputSlots>, "id" | "name" | "error" | "label" | "style" | "width" | "theme" | "class" | "density" | "color" | "disabled" | "maxWidth" | "minWidth" | "baseColor" | "prependIcon" | "appendIcon" | "readonly" | "$children" | "v-slots" | "v-slot:append" | "v-slot:default" | "v-slot:prepend" | keyof import('vue').VNodeProps | "centerAffix" | "direction" | "errorMessages" | "focused" | "glow" | "hideSpinButtons" | "maxErrors" | "messages" | "persistentHint" | "rules" | "onUpdate:focused" | "validateOn" | "validationValue" | "iconColor" | "hideDetails" | "hint" | "onClick:prepend" | "onClick:append" | "modelValue" | "onUpdate:modelValue" | "v-slot:details" | "v-slot:message">, `$${any}`> & {
        _allExposed: {
            reset: () => Promise<void>;
            resetValidation: () => Promise<void>;
            validate: (silent?: boolean) => Promise<string[]>;
            isValid: import('vue').ComputedRef<boolean | null>;
            errorMessages: import('vue').ComputedRef<string[]>;
        } | {};
    }, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        "click:control": (e: MouseEvent) => true;
        "mousedown:control": (e: MouseEvent) => true;
        "update:focused": (focused: boolean) => true;
        "update:modelValue": (val: string) => true;
        "update:rows": (rows: number) => true;
    }, import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, {
        style: import('vue').StyleValue;
        focused: boolean;
        errorMessages: string | readonly string[] | null;
        maxErrors: string | number;
        readonly: boolean | null;
        rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
        density: import('vuetify/lib/composables/density.mjs').Density;
        rounded: string | number | boolean;
        tile: boolean;
        hideSpinButtons: boolean;
        persistentHint: boolean;
        messages: string | readonly string[];
        clearable: boolean;
        clearIcon: import('vuetify/lib/composables/icons.mjs').IconValue;
        active: boolean;
        centerAffix: boolean;
        dirty: boolean;
        disabled: boolean;
        glow: boolean;
        error: boolean;
        flat: boolean;
        persistentClear: boolean;
        reverse: boolean;
        singleLine: boolean;
        variant: "filled" | "outlined" | "plain" | "solo" | "solo-filled" | "solo-inverted" | "underlined";
        autoGrow: boolean;
        autofocus: boolean;
        persistentPlaceholder: boolean;
        persistentCounter: boolean;
        noResize: boolean;
        rows: string | number;
    }, true, {}, import('vue').SlotsType<Partial<{
        prepend: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        append: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        details: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        message: (arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        clear: (arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
            props: Record<string, any>;
        }) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        "prepend-inner": (arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        "append-inner": (arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        label: (arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
            label: string | undefined;
            props: Record<string, any>;
        }) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        loader: (arg: import('vuetify/lib/composables/loader.mjs').LoaderSlotProps) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
            [key: string]: any;
        }>[];
        counter: (arg: import('vuetify/lib/components/VCounter/VCounter.mjs').VCounterSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
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
        focused: boolean;
        errorMessages: string | readonly string[] | null;
        maxErrors: string | number;
        readonly: boolean | null;
        rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
        density: import('vuetify/lib/composables/density.mjs').Density;
        tile: boolean;
        hideSpinButtons: boolean;
        persistentHint: boolean;
        messages: string | readonly string[];
        clearable: boolean;
        clearIcon: import('vuetify/lib/composables/icons.mjs').IconValue;
        active: boolean;
        dirty: boolean;
        disabled: boolean;
        glow: boolean;
        error: boolean;
        flat: boolean;
        persistentClear: boolean;
        reverse: boolean;
        singleLine: boolean;
        variant: "filled" | "outlined" | "plain" | "solo" | "solo-filled" | "solo-inverted" | "underlined";
        autoGrow: boolean;
        autofocus: boolean;
        persistentPlaceholder: boolean;
        persistentCounter: boolean;
        noResize: boolean;
        rows: string | number;
    } & {
        theme?: string | undefined;
        class?: any;
        "onUpdate:focused"?: ((args_0: boolean) => void) | undefined;
        name?: string | undefined;
        modelValue?: any;
        validateOn?: ("blur eager" | "blur lazy" | "eager" | "eager blur" | "eager input" | "eager invalid-input" | "eager submit" | "input eager" | "input lazy" | "invalid-input eager" | "invalid-input lazy" | "lazy" | "lazy blur" | "lazy input" | "lazy invalid-input" | "lazy submit" | "submit eager" | "submit lazy" | ("blur" | "input" | "invalid-input" | "submit")) | undefined;
        validationValue?: any;
        rounded?: string | number | boolean | undefined;
        maxWidth?: string | number | undefined;
        minWidth?: string | number | undefined;
        width?: string | number | undefined;
        loading?: string | boolean | undefined;
        id?: string | undefined;
        appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        hideDetails?: "auto" | boolean | undefined;
        hint?: string | undefined;
        "onClick:prepend"?: ((args_0: MouseEvent) => void) | undefined;
        "onClick:append"?: ((args_0: MouseEvent) => void) | undefined;
        appendInnerIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        bgColor?: string | undefined;
        centerAffix?: boolean | undefined;
        color?: string | undefined;
        baseColor?: string | undefined;
        iconColor?: string | boolean | undefined;
        label?: string | undefined;
        prependInnerIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        "onClick:clear"?: ((args_0: MouseEvent) => void) | undefined;
        "onClick:appendInner"?: ((args_0: MouseEvent) => void) | undefined;
        "onClick:prependInner"?: ((args_0: MouseEvent) => void) | undefined;
        autocomplete?: string | undefined;
        counter?: string | number | true | undefined;
        counterValue?: ((value: any) => number) | undefined;
        prefix?: string | undefined;
        placeholder?: string | undefined;
        maxHeight?: string | number | undefined;
        maxRows?: string | number | undefined;
        suffix?: string | undefined;
        modelModifiers?: Record<string, boolean> | undefined;
    } & {
        $children?: {
            prepend?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            append?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            details?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            message?: ((arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNodeChild) | undefined;
            clear?: ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
                props: Record<string, any>;
            }) => import('vue').VNodeChild) | undefined;
            "prepend-inner"?: ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
            "append-inner"?: ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
            label?: ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
                label: string | undefined;
                props: Record<string, any>;
            }) => import('vue').VNodeChild) | undefined;
            loader?: ((arg: import('vuetify/lib/composables/loader.mjs').LoaderSlotProps) => import('vue').VNodeChild) | undefined;
            counter?: ((arg: import('vuetify/lib/components/VCounter/VCounter.mjs').VCounterSlot) => import('vue').VNodeChild) | undefined;
        } | {
            $stable?: boolean | undefined;
        } | {} | import('vue').VNodeChild;
        "v-slots"?: {
            prepend?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            append?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            details?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
            message?: false | ((arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNodeChild) | undefined;
            clear?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
                props: Record<string, any>;
            }) => import('vue').VNodeChild) | undefined;
            "prepend-inner"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
            "append-inner"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
            label?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
                label: string | undefined;
                props: Record<string, any>;
            }) => import('vue').VNodeChild) | undefined;
            loader?: false | ((arg: import('vuetify/lib/composables/loader.mjs').LoaderSlotProps) => import('vue').VNodeChild) | undefined;
            counter?: false | ((arg: import('vuetify/lib/components/VCounter/VCounter.mjs').VCounterSlot) => import('vue').VNodeChild) | undefined;
        } | undefined;
    } & {
        "v-slot:append"?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:append-inner"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:clear"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
            props: Record<string, any>;
        }) => import('vue').VNodeChild) | undefined;
        "v-slot:counter"?: false | ((arg: import('vuetify/lib/components/VCounter/VCounter.mjs').VCounterSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:details"?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:label"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot & {
            label: string | undefined;
            props: Record<string, any>;
        }) => import('vue').VNodeChild) | undefined;
        "v-slot:loader"?: false | ((arg: import('vuetify/lib/composables/loader.mjs').LoaderSlotProps) => import('vue').VNodeChild) | undefined;
        "v-slot:message"?: false | ((arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:prepend"?: false | ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNodeChild) | undefined;
        "v-slot:prepend-inner"?: false | ((arg: import('vuetify/lib/components/VField/VField.mjs').DefaultInputSlot) => import('vue').VNodeChild) | undefined;
    } & {
        "onClick:control"?: ((e: MouseEvent) => any) | undefined;
        "onMousedown:control"?: ((e: MouseEvent) => any) | undefined;
        "onUpdate:focused"?: ((focused: boolean) => any) | undefined;
        "onUpdate:modelValue"?: ((val: string) => any) | undefined;
        "onUpdate:rows"?: ((rows: number) => any) | undefined;
    }, HTMLTextAreaElement & Omit<Omit<{
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            style: import('vue').StyleValue;
            focused: boolean;
            disabled: boolean | null;
            error: boolean;
            errorMessages: string | readonly string[] | null;
            maxErrors: string | number;
            readonly: boolean | null;
            rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
            density: import('vuetify/lib/composables/density.mjs').Density;
            centerAffix: boolean;
            glow: boolean;
            hideSpinButtons: boolean;
            persistentHint: boolean;
            messages: string | readonly string[];
            direction: "horizontal" | "vertical";
        }> & Omit<{
            theme?: string | undefined;
            class?: any;
            style: string | false | import('vue').StyleValue[] | import('vue').CSSProperties | null;
            focused: boolean;
            "onUpdate:focused"?: ((args_0: boolean) => void) | undefined;
            disabled: boolean | null;
            error: boolean;
            errorMessages: string | readonly string[] | null;
            maxErrors: string | number;
            name?: string | undefined;
            label?: string | undefined;
            readonly: boolean | null;
            rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
            validateOn?: ("blur eager" | "blur lazy" | "eager" | "eager blur" | "eager input" | "eager invalid-input" | "eager submit" | "input eager" | "input lazy" | "invalid-input eager" | "invalid-input lazy" | "lazy" | "lazy blur" | "lazy input" | "lazy invalid-input" | "lazy submit" | "submit eager" | "submit lazy" | ("blur" | "input" | "invalid-input" | "submit")) | undefined;
            validationValue?: any;
            density: import('vuetify/lib/composables/density.mjs').Density;
            maxWidth?: string | number | undefined;
            minWidth?: string | number | undefined;
            width?: string | number | undefined;
            id?: string | undefined;
            appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
            baseColor?: string | undefined;
            centerAffix: boolean;
            color?: string | undefined;
            glow: boolean;
            iconColor?: string | boolean | undefined;
            prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
            hideDetails?: "auto" | boolean | undefined;
            hideSpinButtons: boolean;
            hint?: string | undefined;
            persistentHint: boolean;
            messages: string | readonly string[];
            direction: "horizontal" | "vertical";
            "onClick:prepend"?: ((args_0: MouseEvent) => void) | undefined;
            "onClick:append"?: ((args_0: MouseEvent) => void) | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, "centerAffix" | "density" | "direction" | "disabled" | "error" | "errorMessages" | "focused" | "glow" | "hideSpinButtons" | "maxErrors" | "messages" | "persistentHint" | "readonly" | "rules" | "style">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            default?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            prepend?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            append?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            details?: ((arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
            message?: ((arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[]) | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null;
        $parent: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null;
        $host: Element | null;
        $emit: (event: string, ...args: any[]) => void;
        $el: any;
        $options: import('vue').ComponentOptionsBase<{
            style: string | false | import('vue').StyleValue[] | import('vue').CSSProperties | null;
            focused: boolean;
            disabled: boolean | null;
            error: boolean;
            errorMessages: string | readonly string[] | null;
            maxErrors: string | number;
            readonly: boolean | null;
            rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
            density: import('vuetify/lib/composables/density.mjs').Density;
            centerAffix: boolean;
            glow: boolean;
            hideSpinButtons: boolean;
            persistentHint: boolean;
            messages: string | readonly string[];
            direction: "horizontal" | "vertical";
        } & {
            theme?: string | undefined;
            class?: any;
            "onUpdate:focused"?: ((args_0: boolean) => void) | undefined;
            name?: string | undefined;
            label?: string | undefined;
            validateOn?: ("blur eager" | "blur lazy" | "eager" | "eager blur" | "eager input" | "eager invalid-input" | "eager submit" | "input eager" | "input lazy" | "invalid-input eager" | "invalid-input lazy" | "lazy" | "lazy blur" | "lazy input" | "lazy invalid-input" | "lazy submit" | "submit eager" | "submit lazy" | ("blur" | "input" | "invalid-input" | "submit")) | undefined;
            validationValue?: any;
            maxWidth?: string | number | undefined;
            minWidth?: string | number | undefined;
            width?: string | number | undefined;
            id?: string | undefined;
            appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
            baseColor?: string | undefined;
            color?: string | undefined;
            iconColor?: string | boolean | undefined;
            prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
            hideDetails?: "auto" | boolean | undefined;
            hint?: string | undefined;
            "onClick:prepend"?: ((args_0: MouseEvent) => void) | undefined;
            "onClick:append"?: ((args_0: MouseEvent) => void) | undefined;
        } & {}, {
            reset: () => Promise<void>;
            resetValidation: () => Promise<void>;
            validate: (silent?: boolean) => Promise<string[]>;
            isValid: import('vue').ComputedRef<boolean | null>;
            errorMessages: import('vue').ComputedRef<string[]>;
        }, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, Omit<{
            "update:modelValue": (value: any) => true;
        }, "$children" | "modelValue" | "update:modelValue" | "v-slot:append" | "v-slot:default" | "v-slot:details" | "v-slot:message" | "v-slot:prepend" | "v-slots">, string, {
            style: import('vue').StyleValue;
            focused: boolean;
            disabled: boolean | null;
            error: boolean;
            errorMessages: string | readonly string[] | null;
            maxErrors: string | number;
            readonly: boolean | null;
            rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
            density: import('vuetify/lib/composables/density.mjs').Density;
            centerAffix: boolean;
            glow: boolean;
            hideSpinButtons: boolean;
            persistentHint: boolean;
            messages: string | readonly string[];
            direction: "horizontal" | "vertical";
        }, {}, string, import('vue').SlotsType<Partial<{
            default: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
            prepend: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
            append: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
            details: (arg: import('vuetify/lib/components/VInput/VInput.mjs').VInputSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
            message: (arg: import('vuetify/lib/components/VMessages/VMessages.mjs').VMessageSlot) => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                [key: string]: any;
            }>[];
        }>>, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: ((() => void)[] | (() => void)) | undefined;
            created?: ((() => void)[] | (() => void)) | undefined;
            beforeMount?: ((() => void)[] | (() => void)) | undefined;
            mounted?: ((() => void)[] | (() => void)) | undefined;
            beforeUpdate?: ((() => void)[] | (() => void)) | undefined;
            updated?: ((() => void)[] | (() => void)) | undefined;
            activated?: ((() => void)[] | (() => void)) | undefined;
            deactivated?: ((() => void)[] | (() => void)) | undefined;
            beforeDestroy?: ((() => void)[] | (() => void)) | undefined;
            beforeUnmount?: ((() => void)[] | (() => void)) | undefined;
            destroyed?: ((() => void)[] | (() => void)) | undefined;
            unmounted?: ((() => void)[] | (() => void)) | undefined;
            renderTracked?: (((e: import('vue').DebuggerEvent) => void)[] | ((e: import('vue').DebuggerEvent) => void)) | undefined;
            renderTriggered?: (((e: import('vue').DebuggerEvent) => void)[] | ((e: import('vue').DebuggerEvent) => void)) | undefined;
            errorCaptured?: (((err: unknown, instance: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null, info: string) => void | boolean)[] | ((err: unknown, instance: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null, info: string) => void | boolean)) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (args_0: R, args_1: R, args_2: import('@vue/reactivity').OnCleanup) => any : (args_0: any, args_1: any, args_2: import('@vue/reactivity').OnCleanup) => any, options?: import('vue').WatchOptions<boolean> | undefined): import('vue').WatchStopHandle;
    } & Readonly<{
        style: import('vue').StyleValue;
        focused: boolean;
        disabled: boolean | null;
        error: boolean;
        errorMessages: string | readonly string[] | null;
        maxErrors: string | number;
        readonly: boolean | null;
        rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
        density: import('vuetify/lib/composables/density.mjs').Density;
        centerAffix: boolean;
        glow: boolean;
        hideSpinButtons: boolean;
        persistentHint: boolean;
        messages: string | readonly string[];
        direction: "horizontal" | "vertical";
    }> & Omit<{
        style: string | false | import('vue').StyleValue[] | import('vue').CSSProperties | null;
        focused: boolean;
        disabled: boolean | null;
        error: boolean;
        errorMessages: string | readonly string[] | null;
        maxErrors: string | number;
        readonly: boolean | null;
        rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
        density: import('vuetify/lib/composables/density.mjs').Density;
        centerAffix: boolean;
        glow: boolean;
        hideSpinButtons: boolean;
        persistentHint: boolean;
        messages: string | readonly string[];
        direction: "horizontal" | "vertical";
    } & {
        theme?: string | undefined;
        class?: any;
        "onUpdate:focused"?: ((args_0: boolean) => void) | undefined;
        name?: string | undefined;
        label?: string | undefined;
        validateOn?: ("blur eager" | "blur lazy" | "eager" | "eager blur" | "eager input" | "eager invalid-input" | "eager submit" | "input eager" | "input lazy" | "invalid-input eager" | "invalid-input lazy" | "lazy" | "lazy blur" | "lazy input" | "lazy invalid-input" | "lazy submit" | "submit eager" | "submit lazy" | ("blur" | "input" | "invalid-input" | "submit")) | undefined;
        validationValue?: any;
        maxWidth?: string | number | undefined;
        minWidth?: string | number | undefined;
        width?: string | number | undefined;
        id?: string | undefined;
        appendIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        baseColor?: string | undefined;
        color?: string | undefined;
        iconColor?: string | boolean | undefined;
        prependIcon?: import('vuetify/lib/composables/icons.mjs').IconValue | undefined;
        hideDetails?: "auto" | boolean | undefined;
        hint?: string | undefined;
        "onClick:prepend"?: ((args_0: MouseEvent) => void) | undefined;
        "onClick:append"?: ((args_0: MouseEvent) => void) | undefined;
    }, "error" | "style" | "density" | "disabled" | "readonly" | "reset" | "isValid" | "resetValidation" | "validate" | "centerAffix" | "direction" | "errorMessages" | "focused" | "glow" | "hideSpinButtons" | "maxErrors" | "messages" | "persistentHint" | "rules"> & import('vue').ShallowUnwrapRef<{
        reset: () => Promise<void>;
        resetValidation: () => Promise<void>;
        validate: (silent?: boolean) => Promise<string[]>;
        isValid: import('vue').ComputedRef<boolean | null>;
        errorMessages: import('vue').ComputedRef<string[]>;
    }> & import('vue').ComponentCustomProperties & import('vuetify/lib/util/defineComponent.mjs').GenericProps<{
        modelValue?: unknown;
        "onUpdate:modelValue"?: ((value: unknown) => void) | undefined;
    }, import('vuetify/lib/components/VInput/VInput.mjs').VInputSlots>, "id" | "name" | "error" | "label" | "style" | "width" | "theme" | "class" | "density" | "color" | "disabled" | "maxWidth" | "minWidth" | "baseColor" | "prependIcon" | "appendIcon" | "readonly" | "$children" | "v-slots" | "v-slot:append" | "v-slot:default" | "v-slot:prepend" | keyof import('vue').VNodeProps | "centerAffix" | "direction" | "errorMessages" | "focused" | "glow" | "hideSpinButtons" | "maxErrors" | "messages" | "persistentHint" | "rules" | "onUpdate:focused" | "validateOn" | "validationValue" | "iconColor" | "hideDetails" | "hint" | "onClick:prepend" | "onClick:append" | "modelValue" | "onUpdate:modelValue" | "v-slot:details" | "v-slot:message">, `$${any}`> & {
        _allExposed: {
            reset: () => Promise<void>;
            resetValidation: () => Promise<void>;
            validate: (silent?: boolean) => Promise<string[]>;
            isValid: import('vue').ComputedRef<boolean | null>;
            errorMessages: import('vue').ComputedRef<string[]>;
        } | {};
    }, {}, {}, {}, {
        style: import('vue').StyleValue;
        focused: boolean;
        errorMessages: string | readonly string[] | null;
        maxErrors: string | number;
        readonly: boolean | null;
        rules: readonly (string | boolean | PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult> | ((value: any) => import('vuetify/lib/composables/validation.mjs').ValidationResult) | ((value: any) => PromiseLike<import('vuetify/lib/composables/validation.mjs').ValidationResult>) | [string, any, (string | undefined)?])[];
        density: import('vuetify/lib/composables/density.mjs').Density;
        rounded: string | number | boolean;
        tile: boolean;
        hideSpinButtons: boolean;
        persistentHint: boolean;
        messages: string | readonly string[];
        clearable: boolean;
        clearIcon: import('vuetify/lib/composables/icons.mjs').IconValue;
        active: boolean;
        centerAffix: boolean;
        dirty: boolean;
        disabled: boolean;
        glow: boolean;
        error: boolean;
        flat: boolean;
        persistentClear: boolean;
        reverse: boolean;
        singleLine: boolean;
        variant: "filled" | "outlined" | "plain" | "solo" | "solo-filled" | "solo-inverted" | "underlined";
        autoGrow: boolean;
        autofocus: boolean;
        persistentPlaceholder: boolean;
        persistentCounter: boolean;
        noResize: boolean;
        rows: string | number;
    }> | null;
}, HTMLDivElement>;
export default _default;
//# sourceMappingURL=ChatInput.vue.d.ts.map