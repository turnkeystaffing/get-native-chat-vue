import { openBlock as d, createElementBlock as l } from "vue";
const f = /* @__PURE__ */ Symbol("native-chat-config"), g = (n, t) => {
  const i = n.__vccOpts || n;
  for (const [s, e] of t)
    i[s] = e;
  return i;
}, v = {}, h = { class: "nc-widget" };
function p(n, t) {
  return d(), l("div", h, "NativeChatWidget placeholder");
}
const C = /* @__PURE__ */ g(v, [["render", p]]), _ = {
  install(n, t) {
    if (!t?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    n.provide(f, t), n.component("NativeChatWidget", C);
  }
};
function $(n) {
  const { baseUrl: t, getAccessToken: i } = n;
  async function s(e, o = {}) {
    const c = {
      Authorization: `Bearer ${await i()}`
    };
    o.body && (c["Content-Type"] = "application/json");
    const r = await fetch(e, { ...o, headers: c });
    if (!r.ok) {
      const u = new Error(`HTTP ${r.status}: ${r.statusText}`);
      throw u.statusCode = r.status, u;
    }
    return r.json();
  }
  return {
    createConversation() {
      return s(`${t}/conversations`, { method: "POST" });
    },
    getConversations(e, o) {
      return s(`${t}/conversations?offset=${e}&limit=${o}`);
    },
    getMessages(e, o, a) {
      return s(
        `${t}/conversations/${encodeURIComponent(e)}/messages?offset=${o}&limit=${a}`
      );
    },
    sendMessage(e, o) {
      return s(
        `${t}/conversations/${encodeURIComponent(e)}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ message: o })
        }
      );
    }
  };
}
export {
  _ as NativeChatPlugin,
  C as NativeChatWidget,
  $ as createNativeChatApiClient,
  _ as default
};
