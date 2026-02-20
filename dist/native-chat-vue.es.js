import { openBlock as h, createElementBlock as f, createElementVNode as w, defineComponent as g, inject as _, computed as u, resolveComponent as p, normalizeClass as $, createVNode as d, unref as y, withCtx as C, ref as k, provide as B, readonly as N, createBlock as T } from "vue";
import { useTheme as x } from "vuetify";
const F = /* @__PURE__ */ Symbol("native-chat-config"), b = /* @__PURE__ */ Symbol("native-chat-state"), v = {
  dark: !1,
  colors: {
    primary: "#002B38",
    secondary: "#C4105B",
    background: "#F8F8F8",
    surface: "#FFFFFF",
    error: "#DE3232",
    success: "#41A58D",
    info: "#002B38",
    "on-primary": "#FDFDFD",
    "on-secondary": "#FFFFFF",
    "on-surface": "#002B38"
  },
  variables: {}
}, m = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [a, o] of e)
    t[a] = o;
  return t;
}, O = {}, E = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function S(s, e) {
  return h(), f("svg", E, [...e[0] || (e[0] = [
    w("path", { d: "M12 1c.4 0 .7.3.9.7l2.2 5.8 5.8 2.2c.4.2.7.5.7.9s-.3.7-.7.9l-5.8 2.2-2.2 5.8c-.2.4-.5.7-.9.7s-.7-.3-.9-.7l-2.2-5.8-5.8-2.2c-.4-.2-.7-.5-.7-.9s.3-.7.7-.9l5.8-2.2 2.2-5.8c.2-.4.5-.7.9-.7Z" }, null, -1)
  ])]);
}
const A = /* @__PURE__ */ m(O, [["render", S]]), I = /* @__PURE__ */ g({
  __name: "FloatingButton",
  setup(s) {
    const e = _(F), t = _(b);
    if (!t)
      throw new Error("[NativeChat] FloatingButton must be used inside NativeChatWidget");
    const a = u(() => t.isOpen.value), o = u(() => e?.position ?? "bottom-right"), n = u(
      () => `nc-floating-button-wrapper--${o.value === "bottom-left" ? "left" : "right"}`
    );
    return (i, c) => {
      const r = p("v-icon"), l = p("v-btn");
      return h(), f("div", {
        class: $(["nc-floating-button-wrapper", n.value])
      }, [
        d(l, {
          icon: "",
          size: "56",
          color: "secondary",
          elevation: "4",
          "aria-label": a.value ? "Close chat" : "Open chat",
          "aria-expanded": a.value.toString(),
          onClick: y(t).toggle
        }, {
          default: C(() => [
            d(r, {
              icon: A,
              color: "white"
            })
          ]),
          _: 1
        }, 8, ["aria-label", "aria-expanded", "onClick"])
      ], 2);
    };
  }
}), P = /* @__PURE__ */ m(I, [["__scopeId", "data-v-c2a59ba0"]]), D = /* @__PURE__ */ g({
  __name: "NativeChatWidget",
  setup(s) {
    const e = x();
    if (!e.themes.value.nativeChat) {
      const i = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...i,
        ...v,
        colors: {
          ...i.colors,
          ...v.colors
        },
        variables: {
          ...i.variables,
          ...v.variables
        }
      };
    }
    const t = k(!1), a = () => {
      t.value = !0;
    }, o = () => {
      t.value = !1;
    }, n = () => {
      t.value = !t.value;
    };
    return B(b, {
      isOpen: N(t),
      open: a,
      close: o,
      toggle: n
    }), (i, c) => {
      const r = p("v-theme-provider");
      return h(), T(r, { theme: "nativeChat" }, {
        default: C(() => [
          d(P)
        ]),
        _: 1
      });
    };
  }
}), M = /* @__PURE__ */ m(D, [["__scopeId", "data-v-f04ae61c"]]), z = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(F, e), s.component("NativeChatWidget", M);
  }
};
function U(s) {
  const { baseUrl: e, getAccessToken: t } = s;
  async function a(o, n = {}) {
    const c = {
      Authorization: `Bearer ${await t()}`
    };
    n.body && (c["Content-Type"] = "application/json");
    const r = await fetch(o, { ...n, headers: c });
    if (!r.ok) {
      const l = new Error(`HTTP ${r.status}: ${r.statusText}`);
      throw l.statusCode = r.status, l;
    }
    return r.json();
  }
  return {
    createConversation() {
      return a(`${e}/conversations`, { method: "POST" });
    },
    getConversations(o, n) {
      return a(`${e}/conversations?offset=${o}&limit=${n}`);
    },
    getMessages(o, n, i) {
      return a(
        `${e}/conversations/${encodeURIComponent(o)}/messages?offset=${n}&limit=${i}`
      );
    },
    sendMessage(o, n) {
      return a(`${e}/conversations/${encodeURIComponent(o)}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: n })
      });
    }
  };
}
export {
  z as NativeChatPlugin,
  M as NativeChatWidget,
  U as createNativeChatApiClient,
  z as default
};
