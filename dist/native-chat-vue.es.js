import { ref as d, readonly as y, openBlock as f, createElementBlock as k, createElementVNode as b, defineComponent as x, inject as $, computed as g, resolveComponent as p, normalizeClass as P, createVNode as m, withCtx as E, unref as z, toDisplayString as V, watch as W, onUnmounted as j, createBlock as O, createCommentVNode as R, provide as Y, nextTick as q } from "vue";
import { useDisplay as K, useTheme as G } from "vuetify";
const T = /* @__PURE__ */ Symbol("native-chat-config"), A = /* @__PURE__ */ Symbol("native-chat-state");
function J(s) {
  if (s && typeof s == "object" && "statusCode" in s) {
    const e = s.statusCode;
    if (e === 429)
      return "You're sending messages too quickly. Please wait a moment and try again.";
    if (e === 503 || e === 504)
      return "The service is temporarily unavailable. Please try again in a moment.";
  }
  return "Something went wrong. You can try sending your message again.";
}
function Z(s, e) {
  const n = d([]), a = d(!1), t = d(!1), o = d(!1), i = d(!1), c = d(null), r = d(null), l = d(0), w = e.batchSize ?? 20;
  async function F() {
    if (!(a.value || t.value)) {
      t.value = !0;
      try {
        if (e.conversationId)
          r.value = e.conversationId;
        else {
          const I = await s.getConversations(0, 1);
          if (I.conversations.length > 0)
            r.value = I.conversations[0].id;
          else {
            const v = await s.createConversation();
            r.value = v.id;
          }
        }
        const u = await s.getMessages(r.value, 0, w), _ = [...u.messages].reverse();
        n.value = _, i.value = u.has_more, l.value = _.length;
      } catch {
      } finally {
        t.value = !1, a.value = !0;
      }
    }
  }
  function M() {
    a.value = !1;
  }
  async function C(u) {
    if (!u.trim() || o.value || !r.value) return;
    o.value = !0;
    const _ = `temp-${Date.now()}`, I = {
      id: _,
      conversationId: r.value,
      role: "user",
      content: u,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sending"
    };
    n.value = [...n.value, I];
    try {
      const v = await s.sendMessage(r.value, u), B = {
        ...v.userMessage,
        status: "sent"
      }, D = {
        ...v.assistantMessage
      };
      n.value = [
        ...n.value.filter((S) => S.id !== _ && !S.id.startsWith("error-")),
        B,
        D
      ], c.value = null;
    } catch (v) {
      n.value = n.value.filter(
        (S) => S.id !== _ && !S.id.startsWith("error-")
      );
      const B = J(v), D = {
        id: `error-${Date.now()}`,
        conversationId: r.value,
        role: "assistant",
        content: B,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      n.value = [...n.value, D], c.value = u, e.onError && e.onError({
        message: B,
        statusCode: v && typeof v == "object" && "statusCode" in v ? v.statusCode : void 0,
        originalError: v
      });
    } finally {
      o.value = !1;
    }
  }
  async function H() {
    if (!(!i.value || t.value || !r.value)) {
      t.value = !0;
      try {
        const u = await s.getMessages(
          r.value,
          l.value,
          w
        ), _ = [...u.messages].reverse();
        n.value = [..._, ...n.value], l.value += _.length, i.value = u.has_more;
      } catch {
      } finally {
        t.value = !1;
      }
    }
  }
  async function U() {
    if (!c.value) return;
    const u = c.value;
    c.value = null, await C(u);
  }
  return {
    messages: y(n),
    isOpen: y(a),
    isLoading: y(t),
    isSending: y(o),
    hasMore: y(i),
    failedMessageText: y(c),
    open: F,
    close: M,
    sendMessage: C,
    loadMore: H,
    retry: U
  };
}
const N = {
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
}, h = (s, e) => {
  const n = s.__vccOpts || s;
  for (const [a, t] of e)
    n[a] = t;
  return n;
}, Q = {}, X = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ee(s, e) {
  return f(), k("svg", X, [...e[0] || (e[0] = [
    b("path", { d: "M12 1c.4 0 .7.3.9.7l2.2 5.8 5.8 2.2c.4.2.7.5.7.9s-.3.7-.7.9l-5.8 2.2-2.2 5.8c-.2.4-.5.7-.9.7s-.7-.3-.9-.7l-2.2-5.8-5.8-2.2c-.4-.2-.7-.5-.7-.9s.3-.7.7-.9l5.8-2.2 2.2-5.8c.2-.4.5-.7.9-.7Z" }, null, -1)
  ])]);
}
const L = /* @__PURE__ */ h(Q, [["render", ee]]), te = /* @__PURE__ */ x({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const n = $(T), a = $(A), t = g(() => a.isOpen.value), o = g(() => n?.position ?? "bottom-right"), i = g(
      () => `nc-floating-button-wrapper--${o.value === "bottom-left" ? "left" : "right"}`
    );
    function c() {
      a.isOpen.value ? a.close() : a.open();
    }
    const r = d(null);
    function l() {
      r.value?.$el?.focus();
    }
    return e({ focus: l }), (w, F) => {
      const M = p("v-icon"), C = p("v-btn");
      return f(), k("div", {
        class: P(["nc-floating-button-wrapper", i.value])
      }, [
        m(C, {
          ref_key: "triggerBtn",
          ref: r,
          icon: "",
          size: "56",
          color: "secondary",
          elevation: "4",
          "aria-label": t.value ? "Close chat" : "Open chat",
          "aria-expanded": t.value.toString(),
          onClick: c
        }, {
          default: E(() => [
            m(M, {
              icon: L,
              color: "white"
            })
          ]),
          _: 1
        }, 8, ["aria-label", "aria-expanded"])
      ], 2);
    };
  }
}), ne = /* @__PURE__ */ h(te, [["__scopeId", "data-v-368d25bf"]]), se = {}, ae = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function oe(s, e) {
  return f(), k("svg", ae, [...e[0] || (e[0] = [
    b("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const re = /* @__PURE__ */ h(se, [["render", oe]]), ce = { class: "nc-chat-header" }, ie = { class: "nc-chat-header__left" }, le = /* @__PURE__ */ x({
  __name: "ChatHeader",
  setup(s) {
    const e = $(A);
    return (n, a) => {
      const t = p("v-icon"), o = p("v-btn");
      return f(), k("div", ce, [
        b("div", ie, [
          m(t, {
            icon: L,
            color: "secondary",
            size: "20"
          }),
          a[1] || (a[1] = b("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
        ]),
        m(o, {
          icon: "",
          variant: "text",
          size: "small",
          "aria-label": "Close chat",
          onClick: a[0] || (a[0] = (i) => z(e).close())
        }, {
          default: E(() => [
            m(t, {
              icon: re,
              size: "18"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}), ue = /* @__PURE__ */ h(le, [["__scopeId", "data-v-f89f9f15"]]), ve = { class: "nc-welcome-state" }, de = { class: "nc-welcome-state__text" }, _e = /* @__PURE__ */ x({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(s) {
    return (e, n) => (f(), k("div", ve, [
      b("p", de, V(s.message ?? "Hello! How can I help you?"), 1)
    ]));
  }
}), fe = /* @__PURE__ */ h(_e, [["__scopeId", "data-v-6d3eccea"]]), me = { class: "nc-chat-panel__body" }, ge = /* @__PURE__ */ x({
  __name: "ChatPanel",
  setup(s) {
    const e = $(A), n = g({
      get: () => e.isOpen.value,
      set: () => {
      }
    }), a = $(T), t = g(() => a?.welcomeMessage), o = K(), i = g(() => o.width.value < 768), c = g(() => i.value ? "100%" : 400), r = (l) => {
      l.key === "Escape" && e.isOpen.value && e.close();
    };
    return W(
      () => e.isOpen.value,
      (l) => {
        l ? window.addEventListener("keydown", r) : window.removeEventListener("keydown", r);
      },
      { immediate: !0 }
    ), j(() => {
      window.removeEventListener("keydown", r);
    }), (l, w) => {
      const F = p("v-progress-circular"), M = p("v-navigation-drawer");
      return f(), O(M, {
        modelValue: n.value,
        "onUpdate:modelValue": w[0] || (w[0] = (C) => n.value = C),
        location: "right",
        temporary: "",
        scrim: !1,
        width: c.value,
        role: "complementary",
        "aria-label": "Chat with AI Assistant",
        class: P(["nc-chat-panel", { "nc-chat-panel--mobile": i.value }])
      }, {
        default: E(() => [
          m(ue),
          b("div", me, [
            z(e).isLoading.value ? (f(), O(F, {
              key: 0,
              indeterminate: "",
              size: "24",
              class: "nc-chat-panel__loader"
            })) : z(e).messages.value.length === 0 ? (f(), O(fe, {
              key: 1,
              message: t.value
            }, null, 8, ["message"])) : R("", !0)
          ])
        ]),
        _: 1
      }, 8, ["modelValue", "width", "class"]);
    };
  }
}), pe = /* @__PURE__ */ h(ge, [["__scopeId", "data-v-49ca6f42"]]), he = /* @__PURE__ */ x({
  __name: "NativeChatWidget",
  setup(s) {
    const e = G();
    if (!e.themes.value.nativeChat) {
      const o = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...o,
        ...N,
        colors: {
          ...o.colors,
          ...N.colors
        },
        variables: {
          ...o.variables,
          ...N.variables
        }
      };
    }
    const n = $(T), a = Z(n.apiClient, n);
    Y(A, a);
    const t = d(null);
    return W(
      () => a.isOpen.value,
      (o) => {
        o || q(() => {
          t.value?.focus();
        });
      }
    ), (o, i) => {
      const c = p("v-theme-provider");
      return f(), O(c, { theme: "nativeChat" }, {
        default: E(() => [
          m(ne, {
            ref_key: "floatingButtonRef",
            ref: t
          }, null, 512),
          m(pe)
        ]),
        _: 1
      });
    };
  }
}), we = /* @__PURE__ */ h(he, [["__scopeId", "data-v-24f8c4a9"]]), be = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(T, e), s.component("NativeChatWidget", we);
  }
};
function $e(s) {
  const { baseUrl: e, getAccessToken: n } = s;
  async function a(t, o = {}) {
    const c = {
      Authorization: `Bearer ${await n()}`
    };
    o.body && (c["Content-Type"] = "application/json");
    const r = await fetch(t, { ...o, headers: c });
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
    getConversations(t, o) {
      return a(`${e}/conversations?offset=${t}&limit=${o}`);
    },
    getMessages(t, o, i) {
      return a(
        `${e}/conversations/${encodeURIComponent(t)}/messages?offset=${o}&limit=${i}`
      );
    },
    sendMessage(t, o) {
      return a(`${e}/conversations/${encodeURIComponent(t)}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: o })
      });
    }
  };
}
export {
  be as NativeChatPlugin,
  we as NativeChatWidget,
  $e as createNativeChatApiClient,
  be as default
};
