import { openBlock as _, createElementBlock as f, createElementVNode as p, defineComponent as g, inject as m, computed as u, ref as F, resolveComponent as h, normalizeClass as B, createVNode as d, unref as N, withCtx as w, toDisplayString as S, watch as E, onUnmounted as T, createBlock as I, provide as A, readonly as M, nextTick as P } from "vue";
import { useDisplay as W, useTheme as z } from "vuetify";
const k = /* @__PURE__ */ Symbol("native-chat-config"), C = /* @__PURE__ */ Symbol("native-chat-state"), x = {
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
    "on-surface": "#002B38",
    "welcome-text": "#B0BCC0"
  },
  variables: {}
}, v = (a, e) => {
  const s = a.__vccOpts || a;
  for (const [t, n] of e)
    s[t] = n;
  return s;
}, D = {}, H = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function U(a, e) {
  return _(), f("svg", H, [...e[0] || (e[0] = [
    p("path", { d: "M12 1c.4 0 .7.3.9.7l2.2 5.8 5.8 2.2c.4.2.7.5.7.9s-.3.7-.7.9l-5.8 2.2-2.2 5.8c-.2.4-.5.7-.9.7s-.7-.3-.9-.7l-2.2-5.8-5.8-2.2c-.4-.2-.7-.5-.7-.9s.3-.7.7-.9l5.8-2.2 2.2-5.8c.2-.4.5-.7.9-.7Z" }, null, -1)
  ])]);
}
const O = /* @__PURE__ */ v(D, [["render", U]]), V = /* @__PURE__ */ g({
  __name: "FloatingButton",
  setup(a, { expose: e }) {
    const s = m(k), t = m(C);
    if (!t)
      throw new Error("[NativeChat] FloatingButton must be used inside NativeChatWidget");
    const n = u(() => t.isOpen.value), o = u(() => s?.position ?? "bottom-right"), l = u(
      () => `nc-floating-button-wrapper--${o.value === "bottom-left" ? "left" : "right"}`
    ), i = F(null);
    function c() {
      i.value?.$el?.focus();
    }
    return e({ focus: c }), (r, b) => {
      const y = h("v-icon"), $ = h("v-btn");
      return _(), f("div", {
        class: B(["nc-floating-button-wrapper", l.value])
      }, [
        d($, {
          ref_key: "triggerBtn",
          ref: i,
          icon: "",
          size: "56",
          color: "secondary",
          elevation: "4",
          "aria-label": n.value ? "Close chat" : "Open chat",
          "aria-expanded": n.value.toString(),
          onClick: N(t).toggle
        }, {
          default: w(() => [
            d(y, {
              icon: O,
              color: "white"
            })
          ]),
          _: 1
        }, 8, ["aria-label", "aria-expanded", "onClick"])
      ], 2);
    };
  }
}), L = /* @__PURE__ */ v(V, [["__scopeId", "data-v-aba5f6ae"]]), R = {}, j = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function K(a, e) {
  return _(), f("svg", j, [...e[0] || (e[0] = [
    p("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const q = /* @__PURE__ */ v(R, [["render", K]]), Y = { class: "nc-chat-header" }, G = { class: "nc-chat-header__left" }, J = /* @__PURE__ */ g({
  __name: "ChatHeader",
  setup(a) {
    const e = m(C);
    if (!e)
      throw new Error("[NativeChat] ChatHeader must be used inside NativeChatWidget");
    return (s, t) => {
      const n = h("v-icon"), o = h("v-btn");
      return _(), f("div", Y, [
        p("div", G, [
          d(n, {
            icon: O,
            color: "secondary",
            size: "20"
          }),
          t[1] || (t[1] = p("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
        ]),
        d(o, {
          icon: "",
          variant: "text",
          size: "small",
          "aria-label": "Close chat",
          onClick: t[0] || (t[0] = (l) => N(e).close())
        }, {
          default: w(() => [
            d(n, {
              icon: q,
              size: "18"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}), Z = /* @__PURE__ */ v(J, [["__scopeId", "data-v-22f61adb"]]), Q = { class: "nc-welcome-state" }, X = { class: "nc-welcome-state__text" }, ee = /* @__PURE__ */ g({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(a) {
    return (e, s) => (_(), f("div", Q, [
      p("p", X, S(a.message ?? "Hello! How can I help you?"), 1)
    ]));
  }
}), te = /* @__PURE__ */ v(ee, [["__scopeId", "data-v-6d3eccea"]]), ne = { class: "nc-chat-panel__body" }, oe = /* @__PURE__ */ g({
  __name: "ChatPanel",
  setup(a) {
    const e = m(C);
    if (!e)
      throw new Error("[NativeChat] ChatPanel must be used inside NativeChatWidget");
    const s = u({
      get: () => e.isOpen.value,
      set: (r) => {
        r && e.open();
      }
    }), t = m(k), n = u(() => t?.welcomeMessage), o = W(), l = u(() => o.width.value < 768), i = u(() => l.value ? "100%" : 400), c = (r) => {
      r.key === "Escape" && e.isOpen.value && e.close();
    };
    return E(
      () => e.isOpen.value,
      (r) => {
        r ? window.addEventListener("keydown", c) : window.removeEventListener("keydown", c);
      },
      { immediate: !0 }
    ), T(() => {
      window.removeEventListener("keydown", c);
    }), (r, b) => {
      const y = h("v-navigation-drawer");
      return _(), I(y, {
        modelValue: s.value,
        "onUpdate:modelValue": b[0] || (b[0] = ($) => s.value = $),
        location: "right",
        temporary: "",
        scrim: !1,
        width: i.value,
        role: "complementary",
        "aria-label": "Chat with AI Assistant",
        class: B(["nc-chat-panel", { "nc-chat-panel--mobile": l.value }])
      }, {
        default: w(() => [
          d(Z),
          p("div", ne, [
            d(te, { message: n.value }, null, 8, ["message"])
          ])
        ]),
        _: 1
      }, 8, ["modelValue", "width", "class"]);
    };
  }
}), ae = /* @__PURE__ */ v(oe, [["__scopeId", "data-v-8d485bcd"]]), se = /* @__PURE__ */ g({
  __name: "NativeChatWidget",
  setup(a) {
    const e = z();
    if (!e.themes.value.nativeChat) {
      const i = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...i,
        ...x,
        colors: {
          ...i.colors,
          ...x.colors
        },
        variables: {
          ...i.variables,
          ...x.variables
        }
      };
    }
    const s = F(null), t = F(!1), n = () => {
      t.value = !0;
    }, o = () => {
      t.value = !1;
    }, l = () => {
      t.value = !t.value;
    };
    return A(C, {
      isOpen: M(t),
      open: n,
      close: o,
      toggle: l
    }), E(t, (i) => {
      i || P(() => {
        s.value?.focus();
      });
    }), (i, c) => {
      const r = h("v-theme-provider");
      return _(), I(r, { theme: "nativeChat" }, {
        default: w(() => [
          d(L, {
            ref_key: "floatingButtonRef",
            ref: s
          }, null, 512),
          d(ae)
        ]),
        _: 1
      });
    };
  }
}), ie = /* @__PURE__ */ v(se, [["__scopeId", "data-v-773ecd68"]]), le = {
  install(a, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    a.provide(k, e), a.component("NativeChatWidget", ie);
  }
};
function de(a) {
  const { baseUrl: e, getAccessToken: s } = a;
  async function t(n, o = {}) {
    const i = {
      Authorization: `Bearer ${await s()}`
    };
    o.body && (i["Content-Type"] = "application/json");
    const c = await fetch(n, { ...o, headers: i });
    if (!c.ok) {
      const r = new Error(`HTTP ${c.status}: ${c.statusText}`);
      throw r.statusCode = c.status, r;
    }
    return c.json();
  }
  return {
    createConversation() {
      return t(`${e}/conversations`, { method: "POST" });
    },
    getConversations(n, o) {
      return t(`${e}/conversations?offset=${n}&limit=${o}`);
    },
    getMessages(n, o, l) {
      return t(
        `${e}/conversations/${encodeURIComponent(n)}/messages?offset=${o}&limit=${l}`
      );
    },
    sendMessage(n, o) {
      return t(`${e}/conversations/${encodeURIComponent(n)}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: o })
      });
    }
  };
}
export {
  le as NativeChatPlugin,
  ie as NativeChatWidget,
  de as createNativeChatApiClient,
  le as default
};
