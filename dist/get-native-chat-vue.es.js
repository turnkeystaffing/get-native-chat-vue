import { ref as j, readonly as Re, openBlock as T, createElementBlock as R, createElementVNode as O, defineComponent as fe, inject as oe, computed as $, useTemplateRef as at, withDirectives as Pn, normalizeClass as Bt, createVNode as E, withCtx as F, Transition as Ft, vShow as zn, unref as ne, onMounted as Bn, onUnmounted as Fn, toDisplayString as Lt, createCommentVNode as tt, onBeforeUnmount as Un, Fragment as Mt, createBlock as le, watch as ke, nextTick as he, renderList as vs, Teleport as ys, provide as Ss } from "vue";
import { useDisplay as As, useTheme as Es } from "vuetify";
import { VBtn as He } from "vuetify/components/VBtn";
import { VIcon as be } from "vuetify/components/VIcon";
import { VAvatar as Hn } from "vuetify/components/VAvatar";
import { VInfiniteScroll as Rs } from "vuetify/components/VInfiniteScroll";
import { VProgressCircular as Ut } from "vuetify/components/VProgressCircular";
import { VTextarea as Cs } from "vuetify/components/VTextarea";
import { VThemeProvider as Wn } from "vuetify/components/VThemeProvider";
const Ce = /* @__PURE__ */ Symbol("native-chat-config"), Ie = /* @__PURE__ */ Symbol("native-chat-state");
function Gn(s) {
  if (s && typeof s == "object") {
    if ("response" in s && s.response && typeof s.response == "object" && "status" in s.response) {
      const e = s.response.status;
      if (typeof e == "number") return e;
    }
    if ("statusCode" in s) {
      const e = s.statusCode;
      if (typeof e == "number") return e;
    }
  }
}
function Is(s) {
  const e = Gn(s);
  return e === 429 ? "You're sending messages too quickly. Please wait a moment and try again." : e === 503 || e === 504 ? "The service is temporarily unavailable. Please try again in a moment." : "Something went wrong. You can try sending your message again.";
}
function Ls(s, e) {
  const n = j([]), r = j(!1), t = j(!1), i = j(!1), l = j(!1), c = j(null), o = j(null), h = j(0), p = e.batchSize ?? 20;
  function g(x, M, X) {
    n.value = n.value.filter((Y) => Y.id !== X && !Y.id.startsWith("error-"));
    const v = Is(x), Q = {
      id: `error-${Date.now()}`,
      conversationId: o.value ?? "",
      role: "assistant",
      content: v,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "failed"
    };
    if (n.value = [...n.value, Q], c.value = null, c.value = M, e.onError)
      try {
        Promise.resolve(
          e.onError({
            message: v,
            statusCode: Gn(x),
            originalError: x
          })
        ).catch(() => {
        });
      } catch {
      }
  }
  async function m() {
    if (!(r.value || t.value)) {
      t.value = !0;
      try {
        if (e.conversationId)
          o.value = e.conversationId;
        else {
          const X = await s.getConversations(0, 1);
          if (X.conversations.length > 0)
            o.value = X.conversations[0].id;
          else {
            const v = await s.createConversation();
            o.value = v.id;
          }
        }
        const x = await s.getMessages(o.value, 0, p), M = [...x.messages].reverse();
        n.value = M, l.value = x.has_more, h.value = M.length;
      } catch {
      } finally {
        t.value = !1, r.value = !0;
      }
    }
  }
  function y() {
    r.value = !1;
  }
  async function _(x) {
    if (!x.trim() || i.value) return;
    i.value = !0;
    const M = `temp-${Date.now()}`, X = {
      id: M,
      conversationId: o.value ?? "",
      role: "user",
      content: x,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sending"
    };
    if (n.value = [...n.value, X], !o.value)
      try {
        const v = await s.createConversation();
        o.value = v.id;
      } catch (v) {
        g(v, x, M), i.value = !1;
        return;
      }
    try {
      const v = await s.sendMessage(o.value, x), Q = {
        ...v.userMessage,
        status: "sent"
      }, Y = {
        ...v.assistantMessage
      };
      n.value = [
        ...n.value.filter((ot) => ot.id !== M),
        Q,
        Y
      ], c.value = null;
    } catch (v) {
      g(v, x, M);
    } finally {
      i.value = !1;
    }
  }
  async function k() {
    if (!(!l.value || t.value || !o.value)) {
      t.value = !0;
      try {
        const x = await s.getMessages(
          o.value,
          h.value,
          p
        ), M = [...x.messages].reverse();
        n.value = [...M, ...n.value], h.value += M.length, l.value = x.has_more;
      } catch {
      } finally {
        t.value = !1;
      }
    }
  }
  async function I() {
    if (!c.value) return;
    const x = c.value;
    c.value = null, await _(x);
  }
  return {
    messages: Re(n),
    isOpen: Re(r),
    isLoading: Re(t),
    isSending: Re(i),
    hasMore: Re(l),
    failedMessageText: Re(c),
    open: m,
    close: y,
    sendMessage: _,
    loadMore: k,
    retry: I
  };
}
const yt = {
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
    "welcome-text": "#B0BCC0",
    "chat-background": "#EBEBED",
    title: "#9E9E9E",
    "input-text": "#727272"
  },
  variables: {
    "theme-overlay-multiplier": 1
  }
}, Z = (s, e) => {
  const n = s.__vccOpts || s;
  for (const [r, t] of e)
    n[r] = t;
  return n;
}, Ms = {}, Ds = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Os(s, e) {
  return T(), R("svg", Ds, [...e[0] || (e[0] = [
    O("path", { d: "M10.788 3.103c.495-1.004 1.926-1.004 2.421 0l2.358 4.777 5.273.766c1.107.161 1.549 1.522.748 2.303l-3.816 3.72.901 5.25c.19 1.103-.968 1.944-1.959 1.424l-4.716-2.48-4.715 2.48c-.99.52-2.148-.32-1.96-1.424l.901-5.25-3.815-3.72c-.801-.78-.359-2.142.748-2.303L8.43 7.88l2.358-4.777Zm1.21.936L9.74 8.615a1.35 1.35 0 0 1-1.016.738l-5.05.734 3.654 3.562c.318.31.463.757.388 1.195l-.862 5.03 4.516-2.375a1.35 1.35 0 0 1 1.257 0l4.516 2.374-.862-5.029a1.35 1.35 0 0 1 .388-1.195l3.654-3.562-5.05-.734a1.35 1.35 0 0 1-1.016-.738l-2.259-4.576Z" }, null, -1)
  ])]);
}
const Ht = /* @__PURE__ */ Z(Ms, [["render", Os]]), Ns = {}, $s = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ps(s, e) {
  return T(), R("svg", $s, [...e[0] || (e[0] = [
    O("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const qn = /* @__PURE__ */ Z(Ns, [["render", Ps]]), zs = /* @__PURE__ */ fe({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const n = oe(Ce), r = oe(Ie), t = $(() => r.isOpen.value), i = $(() => r.isLoading.value), l = $(() => t.value && (n?.hideToggleWhenOpen ?? !1)), c = $(() => n?.position ?? "bottom-right"), o = $(
      () => `nc-floating-button-wrapper--${c.value === "bottom-left" ? "left" : "right"}`
    );
    function h() {
      r.isOpen.value ? r.close() : r.open();
    }
    const p = at("triggerBtn");
    function g() {
      p.value?.$el?.focus();
    }
    return e({ focus: g }), (m, y) => Pn((T(), R("div", {
      class: Bt(["nc-floating-button-wrapper", o.value])
    }, [
      E(He, {
        ref_key: "triggerBtn",
        ref: p,
        icon: "",
        size: "56",
        color: "secondary",
        elevation: "4",
        loading: i.value,
        "aria-label": i.value ? "Loading chat" : t.value ? "Close chat" : "Open chat",
        "aria-expanded": t.value.toString(),
        onClick: h
      }, {
        default: F(() => [
          E(Ft, {
            name: "nc-fab-icon",
            mode: "out-in"
          }, {
            default: F(() => [
              (T(), R("span", {
                key: t.value ? "close" : "star",
                class: "nc-floating-button__icon-wrap"
              }, [
                E(be, {
                  icon: t.value ? qn : Ht,
                  color: "white"
                }, null, 8, ["icon"])
              ]))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["loading", "aria-label", "aria-expanded"])
    ], 2)), [
      [zn, !l.value]
    ]);
  }
}), Bs = /* @__PURE__ */ Z(zs, [["__scopeId", "data-v-22c20194"]]), Fs = { class: "nc-chat-header" }, Us = { class: "nc-chat-header__left" }, Hs = /* @__PURE__ */ fe({
  __name: "ChatHeader",
  setup(s) {
    const e = oe(Ie);
    return (n, r) => (T(), R("div", Fs, [
      O("div", Us, [
        E(Hn, {
          color: "secondary",
          size: "44"
        }, {
          default: F(() => [
            E(be, {
              icon: Ht,
              color: "white",
              size: "20"
            })
          ]),
          _: 1
        }),
        r[1] || (r[1] = O("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
      ]),
      E(He, {
        icon: "",
        variant: "text",
        size: "default",
        "aria-label": "Close chat",
        onClick: r[0] || (r[0] = (t) => ne(e).close())
      }, {
        default: F(() => [
          E(be, {
            icon: qn,
            size: "22"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Ws = /* @__PURE__ */ Z(Hs, [["__scopeId", "data-v-3269c11e"]]), Gs = { class: "nc-welcome-state" }, qs = {
  class: "nc-welcome-state__sr-only",
  role: "status",
  "aria-live": "polite"
}, Zs = {
  class: "nc-welcome-state__content",
  "aria-hidden": "true"
}, Ys = { class: "nc-welcome-state__text" }, Vs = {
  key: 0,
  class: "nc-welcome-state__cursor"
}, js = /* @__PURE__ */ fe({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(s) {
    const e = s, n = $(() => e.message ?? "What can I help you with today?"), r = j(""), t = j(!0);
    let i = null;
    return Bn(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        r.value = n.value, t.value = !1;
        return;
      }
      let c = 0;
      i = setInterval(() => {
        c++, r.value = n.value.slice(0, c), c >= n.value.length && (clearInterval(i), i = null, t.value = !1);
      }, 70);
    }), Fn(() => {
      i !== null && (clearInterval(i), i = null);
    }), (l, c) => (T(), R("div", Gs, [
      O("span", qs, Lt(n.value), 1),
      O("div", Zs, [
        O("span", Ys, Lt(r.value), 1),
        t.value ? (T(), R("span", Vs)) : tt("", !0)
      ])
    ]));
  }
}), Xs = /* @__PURE__ */ Z(js, [["__scopeId", "data-v-252e5cec"]]);
function Wt() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var xe = Wt();
function Zn(s) {
  xe = s;
}
var me = { exec: () => null };
function w(s, e = "") {
  let n = typeof s == "string" ? s : s.source, r = { replace: (t, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(W.caret, "$1"), n = n.replace(t, l), r;
  }, getRegex: () => new RegExp(n, e) };
  return r;
}
var Qs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), W = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}>`) }, Ks = /^(?:[ \t]*(?:\n|$))+/, Js = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, er = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, We = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, tr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Gt = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Yn = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Vn = w(Yn).replace(/bull/g, Gt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), nr = w(Yn).replace(/bull/g, Gt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), qt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, sr = /^[^\n]+/, Zt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, rr = w(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Zt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ar = w(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Gt).getRegex(), it = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Yt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ir = w("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Yt).replace("tag", it).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), jn = w(qt).replace("hr", We).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", it).getRegex(), lr = w(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", jn).getRegex(), Vt = { blockquote: lr, code: Js, def: rr, fences: er, heading: tr, hr: We, html: ir, lheading: Vn, list: ar, newline: Ks, paragraph: jn, table: me, text: sr }, vn = w("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", We).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", it).getRegex(), or = { ...Vt, lheading: nr, table: vn, paragraph: w(qt).replace("hr", We).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", vn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", it).getRegex() }, cr = { ...Vt, html: w(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Yt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: me, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: w(qt).replace("hr", We).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Vn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, ur = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, pr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Xn = /^( {2,}|\\)\n(?!\s*$)/, hr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, lt = /[\p{P}\p{S}]/u, jt = /[\s\p{P}\p{S}]/u, Qn = /[^\s\p{P}\p{S}]/u, fr = w(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, jt).getRegex(), Kn = /(?!~)[\p{P}\p{S}]/u, dr = /(?!~)[\s\p{P}\p{S}]/u, gr = /(?:[^\s\p{P}\p{S}]|~)/u, Jn = /(?![*_])[\p{P}\p{S}]/u, mr = /(?![*_])[\s\p{P}\p{S}]/u, kr = /(?:[^\s\p{P}\p{S}]|[*_])/u, br = w(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Qs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), es = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, _r = w(es, "u").replace(/punct/g, lt).getRegex(), xr = w(es, "u").replace(/punct/g, Kn).getRegex(), ts = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", wr = w(ts, "gu").replace(/notPunctSpace/g, Qn).replace(/punctSpace/g, jt).replace(/punct/g, lt).getRegex(), Tr = w(ts, "gu").replace(/notPunctSpace/g, gr).replace(/punctSpace/g, dr).replace(/punct/g, Kn).getRegex(), vr = w("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Qn).replace(/punctSpace/g, jt).replace(/punct/g, lt).getRegex(), yr = w(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Jn).getRegex(), Sr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Ar = w(Sr, "gu").replace(/notPunctSpace/g, kr).replace(/punctSpace/g, mr).replace(/punct/g, Jn).getRegex(), Er = w(/\\(punct)/, "gu").replace(/punct/g, lt).getRegex(), Rr = w(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Cr = w(Yt).replace("(?:-->|$)", "-->").getRegex(), Ir = w("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Cr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), nt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Lr = w(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", nt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ns = w(/^!?\[(label)\]\[(ref)\]/).replace("label", nt).replace("ref", Zt).getRegex(), ss = w(/^!?\[(ref)\](?:\[\])?/).replace("ref", Zt).getRegex(), Mr = w("reflink|nolink(?!\\()", "g").replace("reflink", ns).replace("nolink", ss).getRegex(), yn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Xt = { _backpedal: me, anyPunctuation: Er, autolink: Rr, blockSkip: br, br: Xn, code: pr, del: me, delLDelim: me, delRDelim: me, emStrongLDelim: _r, emStrongRDelimAst: wr, emStrongRDelimUnd: vr, escape: ur, link: Lr, nolink: ss, punctuation: fr, reflink: ns, reflinkSearch: Mr, tag: Ir, text: hr, url: me }, Dr = { ...Xt, link: w(/^!?\[(label)\]\((.*?)\)/).replace("label", nt).getRegex(), reflink: w(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", nt).getRegex() }, Dt = { ...Xt, emStrongRDelimAst: Tr, emStrongLDelim: xr, delLDelim: yr, delRDelim: Ar, url: w(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", yn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: w(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", yn).getRegex() }, Or = { ...Dt, br: w(Xn).replace("{2,}", "*").getRegex(), text: w(Dt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Qe = { normal: Vt, gfm: or, pedantic: cr }, Oe = { normal: Xt, gfm: Dt, breaks: Or, pedantic: Dr }, Nr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Sn = (s) => Nr[s];
function ae(s, e) {
  if (e) {
    if (W.escapeTest.test(s)) return s.replace(W.escapeReplace, Sn);
  } else if (W.escapeTestNoEncode.test(s)) return s.replace(W.escapeReplaceNoEncode, Sn);
  return s;
}
function An(s) {
  try {
    s = encodeURI(s).replace(W.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function En(s, e) {
  let n = s.replace(W.findPipe, (i, l, c) => {
    let o = !1, h = l;
    for (; --h >= 0 && c[h] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = n.split(W.splitPipe), t = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; t < r.length; t++) r[t] = r[t].trim().replace(W.slashPipe, "|");
  return r;
}
function Ne(s, e, n) {
  let r = s.length;
  if (r === 0) return "";
  let t = 0;
  for (; t < r && s.charAt(r - t - 1) === e; )
    t++;
  return s.slice(0, r - t);
}
function $r(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < s.length; r++) if (s[r] === "\\") r++;
  else if (s[r] === e[0]) n++;
  else if (s[r] === e[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function Pr(s, e = 0) {
  let n = e, r = "";
  for (let t of s) if (t === "	") {
    let i = 4 - n % 4;
    r += " ".repeat(i), n += i;
  } else r += t, n++;
  return r;
}
function Rn(s, e, n, r, t) {
  let i = e.href, l = e.title || null, c = s[1].replace(t.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let o = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: l, text: c, tokens: r.inlineTokens(c) };
  return r.state.inLink = !1, o;
}
function zr(s, e, n) {
  let r = s.match(n.other.indentCodeCompensation);
  if (r === null) return e;
  let t = r[1];
  return e.split(`
`).map((i) => {
    let l = i.match(n.other.beginningSpace);
    if (l === null) return i;
    let [c] = l;
    return c.length >= t.length ? i.slice(t.length) : i;
  }).join(`
`);
}
var st = class {
  options;
  rules;
  lexer;
  constructor(s) {
    this.options = s || xe;
  }
  space(s) {
    let e = this.rules.block.newline.exec(s);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(s) {
    let e = this.rules.block.code.exec(s);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : Ne(n, `
`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let n = e[0], r = zr(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = Ne(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: Ne(e[0], `
`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let n = Ne(e[0], `
`).split(`
`), r = "", t = "", i = [];
      for (; n.length > 0; ) {
        let l = !1, c = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) c.push(n[o]), l = !0;
        else if (!l) c.push(n[o]);
        else break;
        n = n.slice(o);
        let h = c.join(`
`), p = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${h}` : h, t = t ? `${t}
${p}` : p;
        let g = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(p, i, !0), this.lexer.state.top = g, n.length === 0) break;
        let m = i.at(-1);
        if (m?.type === "code") break;
        if (m?.type === "blockquote") {
          let y = m, _ = y.raw + `
` + n.join(`
`), k = this.blockquote(_);
          i[i.length - 1] = k, r = r.substring(0, r.length - y.raw.length) + k.raw, t = t.substring(0, t.length - y.text.length) + k.text;
          break;
        } else if (m?.type === "list") {
          let y = m, _ = y.raw + `
` + n.join(`
`), k = this.list(_);
          i[i.length - 1] = k, r = r.substring(0, r.length - m.raw.length) + k.raw, t = t.substring(0, t.length - y.raw.length) + k.raw, n = _.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: i, text: t };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let n = e[1].trim(), r = n.length > 1, t = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let i = this.rules.other.listItemRegex(n), l = !1;
      for (; s; ) {
        let o = !1, h = "", p = "";
        if (!(e = i.exec(s)) || this.rules.block.hr.test(s)) break;
        h = e[0], s = s.substring(h.length);
        let g = Pr(e[2].split(`
`, 1)[0], e[1].length), m = s.split(`
`, 1)[0], y = !g.trim(), _ = 0;
        if (this.options.pedantic ? (_ = 2, p = g.trimStart()) : y ? _ = e[1].length + 1 : (_ = g.search(this.rules.other.nonSpaceChar), _ = _ > 4 ? 1 : _, p = g.slice(_), _ += e[1].length), y && this.rules.other.blankLine.test(m) && (h += m + `
`, s = s.substring(m.length + 1), o = !0), !o) {
          let k = this.rules.other.nextBulletRegex(_), I = this.rules.other.hrRegex(_), x = this.rules.other.fencesBeginRegex(_), M = this.rules.other.headingBeginRegex(_), X = this.rules.other.htmlBeginRegex(_), v = this.rules.other.blockquoteBeginRegex(_);
          for (; s; ) {
            let Q = s.split(`
`, 1)[0], Y;
            if (m = Q, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), Y = m) : Y = m.replace(this.rules.other.tabCharGlobal, "    "), x.test(m) || M.test(m) || X.test(m) || v.test(m) || k.test(m) || I.test(m)) break;
            if (Y.search(this.rules.other.nonSpaceChar) >= _ || !m.trim()) p += `
` + Y.slice(_);
            else {
              if (y || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || x.test(g) || M.test(g) || I.test(g)) break;
              p += `
` + m;
            }
            y = !m.trim(), h += Q + `
`, s = s.substring(Q.length + 1), g = Y.slice(_);
          }
        }
        t.loose || (l ? t.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (l = !0)), t.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(p), loose: !1, text: p, tokens: [] }), t.raw += h;
      }
      let c = t.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      t.raw = t.raw.trimEnd();
      for (let o of t.items) {
        if (this.lexer.state.top = !1, o.tokens = this.lexer.blockTokens(o.text, []), o.task) {
          if (o.text = o.text.replace(this.rules.other.listReplaceTask, ""), o.tokens[0]?.type === "text" || o.tokens[0]?.type === "paragraph") {
            o.tokens[0].raw = o.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), o.tokens[0].text = o.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let p = this.lexer.inlineQueue.length - 1; p >= 0; p--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[p].src)) {
              this.lexer.inlineQueue[p].src = this.lexer.inlineQueue[p].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let h = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (h) {
            let p = { type: "checkbox", raw: h[0] + " ", checked: h[0] !== "[ ]" };
            o.checked = p.checked, t.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = p.raw + o.tokens[0].raw, o.tokens[0].text = p.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(p)) : o.tokens.unshift({ type: "paragraph", raw: p.raw, text: p.raw, tokens: [p] }) : o.tokens.unshift(p);
          }
        }
        if (!t.loose) {
          let h = o.tokens.filter((g) => g.type === "space"), p = h.length > 0 && h.some((g) => this.rules.other.anyLine.test(g.raw));
          t.loose = p;
        }
      }
      if (t.loose) for (let o of t.items) {
        o.loose = !0;
        for (let h of o.tokens) h.type === "text" && (h.type = "paragraph");
      }
      return t;
    }
  }
  html(s) {
    let e = this.rules.block.html.exec(s);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(s) {
    let e = this.rules.block.def.exec(s);
    if (e) {
      let n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", t = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: n, raw: e[0], href: r, title: t };
    }
  }
  table(s) {
    let e = this.rules.block.table.exec(s);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let n = En(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let l of r) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < n.length; l++) i.header.push({ text: n[l], tokens: this.lexer.inline(n[l]), header: !0, align: i.align[l] });
      for (let l of t) i.rows.push(En(l, i.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[o] })));
      return i;
    }
  }
  lheading(s) {
    let e = this.rules.block.lheading.exec(s);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(s) {
    let e = this.rules.block.paragraph.exec(s);
    if (e) {
      let n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(s) {
    let e = this.rules.block.text.exec(s);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(s) {
    let e = this.rules.inline.escape.exec(s);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(s) {
    let e = this.rules.inline.tag.exec(s);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(s) {
    let e = this.rules.inline.link.exec(s);
    if (e) {
      let n = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let i = Ne(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = $r(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let r = e[2], t = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(r);
        i && (r = i[1], t = i[3]);
      } else t = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), Rn(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(s)) || (n = this.rules.inline.nolink.exec(s))) {
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[r.toLowerCase()];
      if (!t) {
        let i = n[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return Rn(n, t, n[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let t = [...r[0]].length - 1, i, l, c = t, o = 0, h = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = h.exec(e)) != null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
        if (l = [...i].length, r[3] || r[4]) {
          c += l;
          continue;
        } else if ((r[5] || r[6]) && t % 3 && !((t + l) % 3)) {
          o += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c + o);
        let p = [...r[0]][0].length, g = s.slice(0, t + r.index + p + l);
        if (Math.min(t, l) % 2) {
          let y = g.slice(1, -1);
          return { type: "em", raw: g, text: y, tokens: this.lexer.inlineTokens(y) };
        }
        let m = g.slice(2, -2);
        return { type: "strong", raw: g, text: m, tokens: this.lexer.inlineTokens(m) };
      }
    }
  }
  codespan(s) {
    let e = this.rules.inline.code.exec(s);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), t = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return r && t && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: e[0], text: n };
    }
  }
  br(s) {
    let e = this.rules.inline.br.exec(s);
    if (e) return { type: "br", raw: e[0] };
  }
  del(s, e, n = "") {
    let r = this.rules.inline.delLDelim.exec(s);
    if (r && (!r[1] || !n || this.rules.inline.punctuation.exec(n))) {
      let t = [...r[0]].length - 1, i, l, c = t, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = o.exec(e)) != null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (l = [...i].length, l !== t)) continue;
        if (r[3] || r[4]) {
          c += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c);
        let h = [...r[0]][0].length, p = s.slice(0, t + r.index + h + l), g = p.slice(t, -t);
        return { type: "del", raw: p, text: g, tokens: this.lexer.inlineTokens(g) };
      }
    }
  }
  autolink(s) {
    let e = this.rules.inline.autolink.exec(s);
    if (e) {
      let n, r;
      return e[2] === "@" ? (n = e[1], r = "mailto:" + n) : (n = e[1], r = n), { type: "link", raw: e[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(s) {
    let e;
    if (e = this.rules.inline.url.exec(s)) {
      let n, r;
      if (e[2] === "@") n = e[0], r = "mailto:" + n;
      else {
        let t;
        do
          t = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (t !== e[0]);
        n = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(s) {
    let e = this.rules.inline.text.exec(s);
    if (e) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: n };
    }
  }
}, ee = class Ot {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || xe, this.options.tokenizer = this.options.tokenizer || new st(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: W, block: Qe.normal, inline: Oe.normal };
    this.options.pedantic ? (n.block = Qe.pedantic, n.inline = Oe.pedantic) : this.options.gfm && (n.block = Qe.gfm, this.options.breaks ? n.inline = Oe.breaks : n.inline = Oe.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Qe, inline: Oe };
  }
  static lex(e, n) {
    return new Ot(n).lex(e);
  }
  static lexInline(e, n) {
    return new Ot(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(W.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let r = this.inlineQueue[n];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], r = !1) {
    for (this.options.pedantic && (e = e.replace(W.tabCharGlobal, "    ").replace(W.spaceLine, "")); e; ) {
      let t;
      if (this.options.extensions?.block?.some((l) => (t = l.call({ lexer: this }, e, n)) ? (e = e.substring(t.raw.length), n.push(t), !0) : !1)) continue;
      if (t = this.tokenizer.space(e)) {
        e = e.substring(t.raw.length);
        let l = n.at(-1);
        t.raw.length === 1 && l !== void 0 ? l.raw += `
` : n.push(t);
        continue;
      }
      if (t = this.tokenizer.code(e)) {
        e = e.substring(t.raw.length);
        let l = n.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + t.raw, l.text += `
` + t.text, this.inlineQueue.at(-1).src = l.text) : n.push(t);
        continue;
      }
      if (t = this.tokenizer.fences(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.heading(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.hr(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.blockquote(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.list(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.html(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.def(e)) {
        e = e.substring(t.raw.length);
        let l = n.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + t.raw, l.text += `
` + t.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[t.tag] || (this.tokens.links[t.tag] = { href: t.href, title: t.title }, n.push(t));
        continue;
      }
      if (t = this.tokenizer.table(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      if (t = this.tokenizer.lheading(e)) {
        e = e.substring(t.raw.length), n.push(t);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let l = 1 / 0, c = e.slice(1), o;
        this.options.extensions.startBlock.forEach((h) => {
          o = h.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (l = Math.min(l, o));
        }), l < 1 / 0 && l >= 0 && (i = e.substring(0, l + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(i))) {
        let l = n.at(-1);
        r && l?.type === "paragraph" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + t.raw, l.text += `
` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : n.push(t), r = i.length !== e.length, e = e.substring(t.raw.length);
        continue;
      }
      if (t = this.tokenizer.text(e)) {
        e = e.substring(t.raw.length);
        let l = n.at(-1);
        l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + t.raw, l.text += `
` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : n.push(t);
        continue;
      }
      if (e) {
        let l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else throw new Error(l);
      }
    }
    return this.state.top = !0, n;
  }
  inline(e, n = []) {
    return this.inlineQueue.push({ src: e, tokens: n }), n;
  }
  inlineTokens(e, n = []) {
    let r = e, t = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (t = this.tokenizer.rules.inline.reflinkSearch.exec(r)) != null; ) o.includes(t[0].slice(t[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, t.index) + "[" + "a".repeat(t[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (t = this.tokenizer.rules.inline.anyPunctuation.exec(r)) != null; ) r = r.slice(0, t.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; ) i = t[2] ? t[2].length : 0, r = r.slice(0, t.index + i) + "[" + "a".repeat(t[0].length - i - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
      let o;
      if (this.options.extensions?.inline?.some((p) => (o = p.call({ lexer: this }, e, n)) ? (e = e.substring(o.raw.length), n.push(o), !0) : !1)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let p = n.at(-1);
        o.type === "text" && p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : n.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, r, c)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e, r, c)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), n.push(o);
        continue;
      }
      let h = e;
      if (this.options.extensions?.startInline) {
        let p = 1 / 0, g = e.slice(1), m;
        this.options.extensions.startInline.forEach((y) => {
          m = y.call({ lexer: this }, g), typeof m == "number" && m >= 0 && (p = Math.min(p, m));
        }), p < 1 / 0 && p >= 0 && (h = e.substring(0, p + 1));
      }
      if (o = this.tokenizer.inlineText(h)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (c = o.raw.slice(-1)), l = !0;
        let p = n.at(-1);
        p?.type === "text" ? (p.raw += o.raw, p.text += o.text) : n.push(o);
        continue;
      }
      if (e) {
        let p = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(p);
          break;
        } else throw new Error(p);
      }
    }
    return n;
  }
}, rt = class {
  options;
  parser;
  constructor(s) {
    this.options = s || xe;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: n }) {
    let r = (e || "").match(W.notSpaceStart)?.[0], t = s.replace(W.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + ae(r) + '">' + (n ? t : ae(t, !0)) + `</code></pre>
` : "<pre><code>" + (n ? t : ae(t, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: s }) {
    return `<blockquote>
${this.parser.parse(s)}</blockquote>
`;
  }
  html({ text: s }) {
    return s;
  }
  def(s) {
    return "";
  }
  heading({ tokens: s, depth: e }) {
    return `<h${e}>${this.parser.parseInline(s)}</h${e}>
`;
  }
  hr(s) {
    return `<hr>
`;
  }
  list(s) {
    let e = s.ordered, n = s.start, r = "";
    for (let l = 0; l < s.items.length; l++) {
      let c = s.items[l];
      r += this.listitem(c);
    }
    let t = e ? "ol" : "ul", i = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + t + i + `>
` + r + "</" + t + `>
`;
  }
  listitem(s) {
    return `<li>${this.parser.parse(s.tokens)}</li>
`;
  }
  checkbox({ checked: s }) {
    return "<input " + (s ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: s }) {
    return `<p>${this.parser.parseInline(s)}</p>
`;
  }
  table(s) {
    let e = "", n = "";
    for (let t = 0; t < s.header.length; t++) n += this.tablecell(s.header[t]);
    e += this.tablerow({ text: n });
    let r = "";
    for (let t = 0; t < s.rows.length; t++) {
      let i = s.rows[t];
      n = "";
      for (let l = 0; l < i.length; l++) n += this.tablecell(i[l]);
      r += this.tablerow({ text: n });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: s }) {
    return `<tr>
${s}</tr>
`;
  }
  tablecell(s) {
    let e = this.parser.parseInline(s.tokens), n = s.header ? "th" : "td";
    return (s.align ? `<${n} align="${s.align}">` : `<${n}>`) + e + `</${n}>
`;
  }
  strong({ tokens: s }) {
    return `<strong>${this.parser.parseInline(s)}</strong>`;
  }
  em({ tokens: s }) {
    return `<em>${this.parser.parseInline(s)}</em>`;
  }
  codespan({ text: s }) {
    return `<code>${ae(s, !0)}</code>`;
  }
  br(s) {
    return "<br>";
  }
  del({ tokens: s }) {
    return `<del>${this.parser.parseInline(s)}</del>`;
  }
  link({ href: s, title: e, tokens: n }) {
    let r = this.parser.parseInline(n), t = An(s);
    if (t === null) return r;
    s = t;
    let i = '<a href="' + s + '"';
    return e && (i += ' title="' + ae(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: s, title: e, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let t = An(s);
    if (t === null) return ae(n);
    s = t;
    let i = `<img src="${s}" alt="${ae(n)}"`;
    return e && (i += ` title="${ae(e)}"`), i += ">", i;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : ae(s.text);
  }
}, Qt = class {
  strong({ text: s }) {
    return s;
  }
  em({ text: s }) {
    return s;
  }
  codespan({ text: s }) {
    return s;
  }
  del({ text: s }) {
    return s;
  }
  html({ text: s }) {
    return s;
  }
  text({ text: s }) {
    return s;
  }
  link({ text: s }) {
    return "" + s;
  }
  image({ text: s }) {
    return "" + s;
  }
  br() {
    return "";
  }
  checkbox({ raw: s }) {
    return s;
  }
}, te = class Nt {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || xe, this.options.renderer = this.options.renderer || new rt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Qt();
  }
  static parse(e, n) {
    return new Nt(n).parse(e);
  }
  static parseInline(e, n) {
    return new Nt(n).parseInline(e);
  }
  parse(e) {
    let n = "";
    for (let r = 0; r < e.length; r++) {
      let t = e[r];
      if (this.options.extensions?.renderers?.[t.type]) {
        let l = t, c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(l.type)) {
          n += c || "";
          continue;
        }
      }
      let i = t;
      switch (i.type) {
        case "space": {
          n += this.renderer.space(i);
          break;
        }
        case "hr": {
          n += this.renderer.hr(i);
          break;
        }
        case "heading": {
          n += this.renderer.heading(i);
          break;
        }
        case "code": {
          n += this.renderer.code(i);
          break;
        }
        case "table": {
          n += this.renderer.table(i);
          break;
        }
        case "blockquote": {
          n += this.renderer.blockquote(i);
          break;
        }
        case "list": {
          n += this.renderer.list(i);
          break;
        }
        case "checkbox": {
          n += this.renderer.checkbox(i);
          break;
        }
        case "html": {
          n += this.renderer.html(i);
          break;
        }
        case "def": {
          n += this.renderer.def(i);
          break;
        }
        case "paragraph": {
          n += this.renderer.paragraph(i);
          break;
        }
        case "text": {
          n += this.renderer.text(i);
          break;
        }
        default: {
          let l = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return n;
  }
  parseInline(e, n = this.renderer) {
    let r = "";
    for (let t = 0; t < e.length; t++) {
      let i = e[t];
      if (this.options.extensions?.renderers?.[i.type]) {
        let c = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          r += c || "";
          continue;
        }
      }
      let l = i;
      switch (l.type) {
        case "escape": {
          r += n.text(l);
          break;
        }
        case "html": {
          r += n.html(l);
          break;
        }
        case "link": {
          r += n.link(l);
          break;
        }
        case "image": {
          r += n.image(l);
          break;
        }
        case "checkbox": {
          r += n.checkbox(l);
          break;
        }
        case "strong": {
          r += n.strong(l);
          break;
        }
        case "em": {
          r += n.em(l);
          break;
        }
        case "codespan": {
          r += n.codespan(l);
          break;
        }
        case "br": {
          r += n.br(l);
          break;
        }
        case "del": {
          r += n.del(l);
          break;
        }
        case "text": {
          r += n.text(l);
          break;
        }
        default: {
          let c = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return r;
  }
}, Ue = class {
  options;
  block;
  constructor(s) {
    this.options = s || xe;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(s) {
    return s;
  }
  postprocess(s) {
    return s;
  }
  processAllTokens(s) {
    return s;
  }
  emStrongMask(s) {
    return s;
  }
  provideLexer() {
    return this.block ? ee.lex : ee.lexInline;
  }
  provideParser() {
    return this.block ? te.parse : te.parseInline;
  }
}, Br = class {
  defaults = Wt();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = te;
  Renderer = rt;
  TextRenderer = Qt;
  Lexer = ee;
  Tokenizer = st;
  Hooks = Ue;
  constructor(...s) {
    this.use(...s);
  }
  walkTokens(s, e) {
    let n = [];
    for (let r of s) switch (n = n.concat(e.call(this, r)), r.type) {
      case "table": {
        let t = r;
        for (let i of t.header) n = n.concat(this.walkTokens(i.tokens, e));
        for (let i of t.rows) for (let l of i) n = n.concat(this.walkTokens(l.tokens, e));
        break;
      }
      case "list": {
        let t = r;
        n = n.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = r;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((i) => {
          let l = t[i].flat(1 / 0);
          n = n.concat(this.walkTokens(l, e));
        }) : t.tokens && (n = n.concat(this.walkTokens(t.tokens, e)));
      }
    }
    return n;
  }
  use(...s) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return s.forEach((n) => {
      let r = { ...n };
      if (r.async = this.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach((t) => {
        if (!t.name) throw new Error("extension name required");
        if ("renderer" in t) {
          let i = e.renderers[t.name];
          i ? e.renderers[t.name] = function(...l) {
            let c = t.renderer.apply(this, l);
            return c === !1 && (c = i.apply(this, l)), c;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[t.level];
          i ? i.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), r.extensions = e), n.renderer) {
        let t = this.defaults.renderer || new rt(this.defaults);
        for (let i in n.renderer) {
          if (!(i in t)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let l = i, c = n.renderer[l], o = t[l];
          t[l] = (...h) => {
            let p = c.apply(t, h);
            return p === !1 && (p = o.apply(t, h)), p || "";
          };
        }
        r.renderer = t;
      }
      if (n.tokenizer) {
        let t = this.defaults.tokenizer || new st(this.defaults);
        for (let i in n.tokenizer) {
          if (!(i in t)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let l = i, c = n.tokenizer[l], o = t[l];
          t[l] = (...h) => {
            let p = c.apply(t, h);
            return p === !1 && (p = o.apply(t, h)), p;
          };
        }
        r.tokenizer = t;
      }
      if (n.hooks) {
        let t = this.defaults.hooks || new Ue();
        for (let i in n.hooks) {
          if (!(i in t)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let l = i, c = n.hooks[l], o = t[l];
          Ue.passThroughHooks.has(i) ? t[l] = (h) => {
            if (this.defaults.async && Ue.passThroughHooksRespectAsync.has(i)) return (async () => {
              let g = await c.call(t, h);
              return o.call(t, g);
            })();
            let p = c.call(t, h);
            return o.call(t, p);
          } : t[l] = (...h) => {
            if (this.defaults.async) return (async () => {
              let g = await c.apply(t, h);
              return g === !1 && (g = await o.apply(t, h)), g;
            })();
            let p = c.apply(t, h);
            return p === !1 && (p = o.apply(t, h)), p;
          };
        }
        r.hooks = t;
      }
      if (n.walkTokens) {
        let t = this.defaults.walkTokens, i = n.walkTokens;
        r.walkTokens = function(l) {
          let c = [];
          return c.push(i.call(this, l)), t && (c = c.concat(t.call(this, l))), c;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(s) {
    return this.defaults = { ...this.defaults, ...s }, this;
  }
  lexer(s, e) {
    return ee.lex(s, e ?? this.defaults);
  }
  parser(s, e) {
    return te.parse(s, e ?? this.defaults);
  }
  parseMarkdown(s) {
    return (e, n) => {
      let r = { ...n }, t = { ...this.defaults, ...r }, i = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && r.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let l = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : s ? ee.lex : ee.lexInline)(l, t), o = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(o, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? te.parse : te.parseInline)(o, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(i);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let l = (t.hooks ? t.hooks.provideLexer() : s ? ee.lex : ee.lexInline)(e, t);
        t.hooks && (l = t.hooks.processAllTokens(l)), t.walkTokens && this.walkTokens(l, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : s ? te.parse : te.parseInline)(l, t);
        return t.hooks && (c = t.hooks.postprocess(c)), c;
      } catch (l) {
        return i(l);
      }
    };
  }
  onError(s, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, s) {
        let r = "<p>An error occurred:</p><pre>" + ae(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, _e = new Br();
function S(s, e) {
  return _e.parse(s, e);
}
S.options = S.setOptions = function(s) {
  return _e.setOptions(s), S.defaults = _e.defaults, Zn(S.defaults), S;
};
S.getDefaults = Wt;
S.defaults = xe;
S.use = function(...s) {
  return _e.use(...s), S.defaults = _e.defaults, Zn(S.defaults), S;
};
S.walkTokens = function(s, e) {
  return _e.walkTokens(s, e);
};
S.parseInline = _e.parseInline;
S.Parser = te;
S.parser = te.parse;
S.Renderer = rt;
S.TextRenderer = Qt;
S.Lexer = ee;
S.lexer = ee.lex;
S.Tokenizer = st;
S.Hooks = Ue;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
te.parse;
ee.lex;
const {
  entries: rs,
  setPrototypeOf: Cn,
  isFrozen: Fr,
  getPrototypeOf: Ur,
  getOwnPropertyDescriptor: Hr
} = Object;
let {
  freeze: G,
  seal: K,
  create: $t
} = Object, {
  apply: Pt,
  construct: zt
} = typeof Reflect < "u" && Reflect;
G || (G = function(e) {
  return e;
});
K || (K = function(e) {
  return e;
});
Pt || (Pt = function(e, n) {
  for (var r = arguments.length, t = new Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
    t[i - 2] = arguments[i];
  return e.apply(n, t);
});
zt || (zt = function(e) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
    r[t - 1] = arguments[t];
  return new e(...r);
});
const Ke = q(Array.prototype.forEach), Wr = q(Array.prototype.lastIndexOf), In = q(Array.prototype.pop), $e = q(Array.prototype.push), Gr = q(Array.prototype.splice), et = q(String.prototype.toLowerCase), St = q(String.prototype.toString), At = q(String.prototype.match), Pe = q(String.prototype.replace), qr = q(String.prototype.indexOf), Zr = q(String.prototype.trim), J = q(Object.prototype.hasOwnProperty), H = q(RegExp.prototype.test), ze = Yr(TypeError);
function q(s) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
      r[t - 1] = arguments[t];
    return Pt(s, e, r);
  };
}
function Yr(s) {
  return function() {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    return zt(s, n);
  };
}
function b(s, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : et;
  Cn && Cn(s, null);
  let r = e.length;
  for (; r--; ) {
    let t = e[r];
    if (typeof t == "string") {
      const i = n(t);
      i !== t && (Fr(e) || (e[r] = i), t = i);
    }
    s[t] = !0;
  }
  return s;
}
function Vr(s) {
  for (let e = 0; e < s.length; e++)
    J(s, e) || (s[e] = null);
  return s;
}
function ie(s) {
  const e = $t(null);
  for (const [n, r] of rs(s))
    J(s, n) && (Array.isArray(r) ? e[n] = Vr(r) : r && typeof r == "object" && r.constructor === Object ? e[n] = ie(r) : e[n] = r);
  return e;
}
function Be(s, e) {
  for (; s !== null; ) {
    const r = Hr(s, e);
    if (r) {
      if (r.get)
        return q(r.get);
      if (typeof r.value == "function")
        return q(r.value);
    }
    s = Ur(s);
  }
  function n() {
    return null;
  }
  return n;
}
const Ln = G(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Et = G(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Rt = G(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), jr = G(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Ct = G(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Xr = G(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Mn = G(["#text"]), Dn = G(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), It = G(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), On = G(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Je = G(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Qr = K(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Kr = K(/<%[\w\W]*|[\w\W]*%>/gm), Jr = K(/\$\{[\w\W]*/gm), ea = K(/^data-[\-\w.\u00B7-\uFFFF]+$/), ta = K(/^aria-[\-\w]+$/), as = K(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), na = K(/^(?:\w+script|data):/i), sa = K(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), is = K(/^html$/i), ra = K(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Nn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: ta,
  ATTR_WHITESPACE: sa,
  CUSTOM_ELEMENT: ra,
  DATA_ATTR: ea,
  DOCTYPE_NAME: is,
  ERB_EXPR: Kr,
  IS_ALLOWED_URI: as,
  IS_SCRIPT_OR_DATA: na,
  MUSTACHE_EXPR: Qr,
  TMPLIT_EXPR: Jr
});
const Fe = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, aa = function() {
  return typeof window > "u" ? null : window;
}, ia = function(e, n) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let r = null;
  const t = "data-tt-policy-suffix";
  n && n.hasAttribute(t) && (r = n.getAttribute(t));
  const i = "dompurify" + (r ? "#" + r : "");
  try {
    return e.createPolicy(i, {
      createHTML(l) {
        return l;
      },
      createScriptURL(l) {
        return l;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + i + " could not be created."), null;
  }
}, $n = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function ls() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : aa();
  const e = (d) => ls(d);
  if (e.version = "3.3.1", e.removed = [], !s || !s.document || s.document.nodeType !== Fe.document || !s.Element)
    return e.isSupported = !1, e;
  let {
    document: n
  } = s;
  const r = n, t = r.currentScript, {
    DocumentFragment: i,
    HTMLTemplateElement: l,
    Node: c,
    Element: o,
    NodeFilter: h,
    NamedNodeMap: p = s.NamedNodeMap || s.MozNamedAttrMap,
    HTMLFormElement: g,
    DOMParser: m,
    trustedTypes: y
  } = s, _ = o.prototype, k = Be(_, "cloneNode"), I = Be(_, "remove"), x = Be(_, "nextSibling"), M = Be(_, "childNodes"), X = Be(_, "parentNode");
  if (typeof l == "function") {
    const d = n.createElement("template");
    d.content && d.content.ownerDocument && (n = d.content.ownerDocument);
  }
  let v, Q = "";
  const {
    implementation: Y,
    createNodeIterator: ot,
    createDocumentFragment: os,
    getElementsByTagName: cs
  } = n, {
    importNode: us
  } = r;
  let U = $n();
  e.isSupported = typeof rs == "function" && typeof X == "function" && Y && Y.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: ct,
    ERB_EXPR: ut,
    TMPLIT_EXPR: pt,
    DATA_ATTR: ps,
    ARIA_ATTR: hs,
    IS_SCRIPT_OR_DATA: fs,
    ATTR_WHITESPACE: Kt,
    CUSTOM_ELEMENT: ds
  } = Nn;
  let {
    IS_ALLOWED_URI: Jt
  } = Nn, N = null;
  const en = b({}, [...Ln, ...Et, ...Rt, ...Ct, ...Mn]);
  let P = null;
  const tn = b({}, [...Dn, ...It, ...On, ...Je]);
  let C = Object.seal($t(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), Le = null, ht = null;
  const we = Object.seal($t(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let nn = !0, ft = !0, sn = !1, rn = !0, Te = !1, Ge = !0, de = !1, dt = !1, gt = !1, ve = !1, qe = !1, Ze = !1, an = !0, ln = !1;
  const gs = "user-content-";
  let mt = !0, Me = !1, ye = {}, se = null;
  const kt = b({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let on = null;
  const cn = b({}, ["audio", "video", "img", "source", "image", "track"]);
  let bt = null;
  const un = b({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ye = "http://www.w3.org/1998/Math/MathML", Ve = "http://www.w3.org/2000/svg", ce = "http://www.w3.org/1999/xhtml";
  let Se = ce, _t = !1, xt = null;
  const ms = b({}, [Ye, Ve, ce], St);
  let je = b({}, ["mi", "mo", "mn", "ms", "mtext"]), Xe = b({}, ["annotation-xml"]);
  const ks = b({}, ["title", "style", "font", "a", "script"]);
  let De = null;
  const bs = ["application/xhtml+xml", "text/html"], _s = "text/html";
  let D = null, Ae = null;
  const xs = n.createElement("form"), pn = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, wt = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(Ae && Ae === a)) {
      if ((!a || typeof a != "object") && (a = {}), a = ie(a), De = // eslint-disable-next-line unicorn/prefer-includes
      bs.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? _s : a.PARSER_MEDIA_TYPE, D = De === "application/xhtml+xml" ? St : et, N = J(a, "ALLOWED_TAGS") ? b({}, a.ALLOWED_TAGS, D) : en, P = J(a, "ALLOWED_ATTR") ? b({}, a.ALLOWED_ATTR, D) : tn, xt = J(a, "ALLOWED_NAMESPACES") ? b({}, a.ALLOWED_NAMESPACES, St) : ms, bt = J(a, "ADD_URI_SAFE_ATTR") ? b(ie(un), a.ADD_URI_SAFE_ATTR, D) : un, on = J(a, "ADD_DATA_URI_TAGS") ? b(ie(cn), a.ADD_DATA_URI_TAGS, D) : cn, se = J(a, "FORBID_CONTENTS") ? b({}, a.FORBID_CONTENTS, D) : kt, Le = J(a, "FORBID_TAGS") ? b({}, a.FORBID_TAGS, D) : ie({}), ht = J(a, "FORBID_ATTR") ? b({}, a.FORBID_ATTR, D) : ie({}), ye = J(a, "USE_PROFILES") ? a.USE_PROFILES : !1, nn = a.ALLOW_ARIA_ATTR !== !1, ft = a.ALLOW_DATA_ATTR !== !1, sn = a.ALLOW_UNKNOWN_PROTOCOLS || !1, rn = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Te = a.SAFE_FOR_TEMPLATES || !1, Ge = a.SAFE_FOR_XML !== !1, de = a.WHOLE_DOCUMENT || !1, ve = a.RETURN_DOM || !1, qe = a.RETURN_DOM_FRAGMENT || !1, Ze = a.RETURN_TRUSTED_TYPE || !1, gt = a.FORCE_BODY || !1, an = a.SANITIZE_DOM !== !1, ln = a.SANITIZE_NAMED_PROPS || !1, mt = a.KEEP_CONTENT !== !1, Me = a.IN_PLACE || !1, Jt = a.ALLOWED_URI_REGEXP || as, Se = a.NAMESPACE || ce, je = a.MATHML_TEXT_INTEGRATION_POINTS || je, Xe = a.HTML_INTEGRATION_POINTS || Xe, C = a.CUSTOM_ELEMENT_HANDLING || {}, a.CUSTOM_ELEMENT_HANDLING && pn(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (C.tagNameCheck = a.CUSTOM_ELEMENT_HANDLING.tagNameCheck), a.CUSTOM_ELEMENT_HANDLING && pn(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (C.attributeNameCheck = a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), a.CUSTOM_ELEMENT_HANDLING && typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (C.allowCustomizedBuiltInElements = a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Te && (ft = !1), qe && (ve = !0), ye && (N = b({}, Mn), P = [], ye.html === !0 && (b(N, Ln), b(P, Dn)), ye.svg === !0 && (b(N, Et), b(P, It), b(P, Je)), ye.svgFilters === !0 && (b(N, Rt), b(P, It), b(P, Je)), ye.mathMl === !0 && (b(N, Ct), b(P, On), b(P, Je))), a.ADD_TAGS && (typeof a.ADD_TAGS == "function" ? we.tagCheck = a.ADD_TAGS : (N === en && (N = ie(N)), b(N, a.ADD_TAGS, D))), a.ADD_ATTR && (typeof a.ADD_ATTR == "function" ? we.attributeCheck = a.ADD_ATTR : (P === tn && (P = ie(P)), b(P, a.ADD_ATTR, D))), a.ADD_URI_SAFE_ATTR && b(bt, a.ADD_URI_SAFE_ATTR, D), a.FORBID_CONTENTS && (se === kt && (se = ie(se)), b(se, a.FORBID_CONTENTS, D)), a.ADD_FORBID_CONTENTS && (se === kt && (se = ie(se)), b(se, a.ADD_FORBID_CONTENTS, D)), mt && (N["#text"] = !0), de && b(N, ["html", "head", "body"]), N.table && (b(N, ["tbody"]), delete Le.tbody), a.TRUSTED_TYPES_POLICY) {
        if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw ze('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw ze('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        v = a.TRUSTED_TYPES_POLICY, Q = v.createHTML("");
      } else
        v === void 0 && (v = ia(y, t)), v !== null && typeof Q == "string" && (Q = v.createHTML(""));
      G && G(a), Ae = a;
    }
  }, hn = b({}, [...Et, ...Rt, ...jr]), fn = b({}, [...Ct, ...Xr]), ws = function(a) {
    let u = X(a);
    (!u || !u.tagName) && (u = {
      namespaceURI: Se,
      tagName: "template"
    });
    const f = et(a.tagName), A = et(u.tagName);
    return xt[a.namespaceURI] ? a.namespaceURI === Ve ? u.namespaceURI === ce ? f === "svg" : u.namespaceURI === Ye ? f === "svg" && (A === "annotation-xml" || je[A]) : !!hn[f] : a.namespaceURI === Ye ? u.namespaceURI === ce ? f === "math" : u.namespaceURI === Ve ? f === "math" && Xe[A] : !!fn[f] : a.namespaceURI === ce ? u.namespaceURI === Ve && !Xe[A] || u.namespaceURI === Ye && !je[A] ? !1 : !fn[f] && (ks[f] || !hn[f]) : !!(De === "application/xhtml+xml" && xt[a.namespaceURI]) : !1;
  }, re = function(a) {
    $e(e.removed, {
      element: a
    });
    try {
      X(a).removeChild(a);
    } catch {
      I(a);
    }
  }, ge = function(a, u) {
    try {
      $e(e.removed, {
        attribute: u.getAttributeNode(a),
        from: u
      });
    } catch {
      $e(e.removed, {
        attribute: null,
        from: u
      });
    }
    if (u.removeAttribute(a), a === "is")
      if (ve || qe)
        try {
          re(u);
        } catch {
        }
      else
        try {
          u.setAttribute(a, "");
        } catch {
        }
  }, dn = function(a) {
    let u = null, f = null;
    if (gt)
      a = "<remove></remove>" + a;
    else {
      const L = At(a, /^[\r\n\t ]+/);
      f = L && L[0];
    }
    De === "application/xhtml+xml" && Se === ce && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const A = v ? v.createHTML(a) : a;
    if (Se === ce)
      try {
        u = new m().parseFromString(A, De);
      } catch {
      }
    if (!u || !u.documentElement) {
      u = Y.createDocument(Se, "template", null);
      try {
        u.documentElement.innerHTML = _t ? Q : A;
      } catch {
      }
    }
    const B = u.body || u.documentElement;
    return a && f && B.insertBefore(n.createTextNode(f), B.childNodes[0] || null), Se === ce ? cs.call(u, de ? "html" : "body")[0] : de ? u.documentElement : B;
  }, gn = function(a) {
    return ot.call(
      a.ownerDocument || a,
      a,
      // eslint-disable-next-line no-bitwise
      h.SHOW_ELEMENT | h.SHOW_COMMENT | h.SHOW_TEXT | h.SHOW_PROCESSING_INSTRUCTION | h.SHOW_CDATA_SECTION,
      null
    );
  }, Tt = function(a) {
    return a instanceof g && (typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || !(a.attributes instanceof p) || typeof a.removeAttribute != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function");
  }, mn = function(a) {
    return typeof c == "function" && a instanceof c;
  };
  function ue(d, a, u) {
    Ke(d, (f) => {
      f.call(e, a, u, Ae);
    });
  }
  const kn = function(a) {
    let u = null;
    if (ue(U.beforeSanitizeElements, a, null), Tt(a))
      return re(a), !0;
    const f = D(a.nodeName);
    if (ue(U.uponSanitizeElement, a, {
      tagName: f,
      allowedTags: N
    }), Ge && a.hasChildNodes() && !mn(a.firstElementChild) && H(/<[/\w!]/g, a.innerHTML) && H(/<[/\w!]/g, a.textContent) || a.nodeType === Fe.progressingInstruction || Ge && a.nodeType === Fe.comment && H(/<[/\w]/g, a.data))
      return re(a), !0;
    if (!(we.tagCheck instanceof Function && we.tagCheck(f)) && (!N[f] || Le[f])) {
      if (!Le[f] && _n(f) && (C.tagNameCheck instanceof RegExp && H(C.tagNameCheck, f) || C.tagNameCheck instanceof Function && C.tagNameCheck(f)))
        return !1;
      if (mt && !se[f]) {
        const A = X(a) || a.parentNode, B = M(a) || a.childNodes;
        if (B && A) {
          const L = B.length;
          for (let V = L - 1; V >= 0; --V) {
            const pe = k(B[V], !0);
            pe.__removalCount = (a.__removalCount || 0) + 1, A.insertBefore(pe, x(a));
          }
        }
      }
      return re(a), !0;
    }
    return a instanceof o && !ws(a) || (f === "noscript" || f === "noembed" || f === "noframes") && H(/<\/no(script|embed|frames)/i, a.innerHTML) ? (re(a), !0) : (Te && a.nodeType === Fe.text && (u = a.textContent, Ke([ct, ut, pt], (A) => {
      u = Pe(u, A, " ");
    }), a.textContent !== u && ($e(e.removed, {
      element: a.cloneNode()
    }), a.textContent = u)), ue(U.afterSanitizeElements, a, null), !1);
  }, bn = function(a, u, f) {
    if (an && (u === "id" || u === "name") && (f in n || f in xs))
      return !1;
    if (!(ft && !ht[u] && H(ps, u))) {
      if (!(nn && H(hs, u))) {
        if (!(we.attributeCheck instanceof Function && we.attributeCheck(u, a))) {
          if (!P[u] || ht[u]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(_n(a) && (C.tagNameCheck instanceof RegExp && H(C.tagNameCheck, a) || C.tagNameCheck instanceof Function && C.tagNameCheck(a)) && (C.attributeNameCheck instanceof RegExp && H(C.attributeNameCheck, u) || C.attributeNameCheck instanceof Function && C.attributeNameCheck(u, a)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              u === "is" && C.allowCustomizedBuiltInElements && (C.tagNameCheck instanceof RegExp && H(C.tagNameCheck, f) || C.tagNameCheck instanceof Function && C.tagNameCheck(f)))
            ) return !1;
          } else if (!bt[u]) {
            if (!H(Jt, Pe(f, Kt, ""))) {
              if (!((u === "src" || u === "xlink:href" || u === "href") && a !== "script" && qr(f, "data:") === 0 && on[a])) {
                if (!(sn && !H(fs, Pe(f, Kt, "")))) {
                  if (f)
                    return !1;
                }
              }
            }
          }
        }
      }
    }
    return !0;
  }, _n = function(a) {
    return a !== "annotation-xml" && At(a, ds);
  }, xn = function(a) {
    ue(U.beforeSanitizeAttributes, a, null);
    const {
      attributes: u
    } = a;
    if (!u || Tt(a))
      return;
    const f = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: P,
      forceKeepAttr: void 0
    };
    let A = u.length;
    for (; A--; ) {
      const B = u[A], {
        name: L,
        namespaceURI: V,
        value: pe
      } = B, Ee = D(L), vt = pe;
      let z = L === "value" ? vt : Zr(vt);
      if (f.attrName = Ee, f.attrValue = z, f.keepAttr = !0, f.forceKeepAttr = void 0, ue(U.uponSanitizeAttribute, a, f), z = f.attrValue, ln && (Ee === "id" || Ee === "name") && (ge(L, a), z = gs + z), Ge && H(/((--!?|])>)|<\/(style|title|textarea)/i, z)) {
        ge(L, a);
        continue;
      }
      if (Ee === "attributename" && At(z, "href")) {
        ge(L, a);
        continue;
      }
      if (f.forceKeepAttr)
        continue;
      if (!f.keepAttr) {
        ge(L, a);
        continue;
      }
      if (!rn && H(/\/>/i, z)) {
        ge(L, a);
        continue;
      }
      Te && Ke([ct, ut, pt], (Tn) => {
        z = Pe(z, Tn, " ");
      });
      const wn = D(a.nodeName);
      if (!bn(wn, Ee, z)) {
        ge(L, a);
        continue;
      }
      if (v && typeof y == "object" && typeof y.getAttributeType == "function" && !V)
        switch (y.getAttributeType(wn, Ee)) {
          case "TrustedHTML": {
            z = v.createHTML(z);
            break;
          }
          case "TrustedScriptURL": {
            z = v.createScriptURL(z);
            break;
          }
        }
      if (z !== vt)
        try {
          V ? a.setAttributeNS(V, L, z) : a.setAttribute(L, z), Tt(a) ? re(a) : In(e.removed);
        } catch {
          ge(L, a);
        }
    }
    ue(U.afterSanitizeAttributes, a, null);
  }, Ts = function d(a) {
    let u = null;
    const f = gn(a);
    for (ue(U.beforeSanitizeShadowDOM, a, null); u = f.nextNode(); )
      ue(U.uponSanitizeShadowNode, u, null), kn(u), xn(u), u.content instanceof i && d(u.content);
    ue(U.afterSanitizeShadowDOM, a, null);
  };
  return e.sanitize = function(d) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, f = null, A = null, B = null;
    if (_t = !d, _t && (d = "<!-->"), typeof d != "string" && !mn(d))
      if (typeof d.toString == "function") {
        if (d = d.toString(), typeof d != "string")
          throw ze("dirty is not a string, aborting");
      } else
        throw ze("toString is not a function");
    if (!e.isSupported)
      return d;
    if (dt || wt(a), e.removed = [], typeof d == "string" && (Me = !1), Me) {
      if (d.nodeName) {
        const pe = D(d.nodeName);
        if (!N[pe] || Le[pe])
          throw ze("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (d instanceof c)
      u = dn("<!---->"), f = u.ownerDocument.importNode(d, !0), f.nodeType === Fe.element && f.nodeName === "BODY" || f.nodeName === "HTML" ? u = f : u.appendChild(f);
    else {
      if (!ve && !Te && !de && // eslint-disable-next-line unicorn/prefer-includes
      d.indexOf("<") === -1)
        return v && Ze ? v.createHTML(d) : d;
      if (u = dn(d), !u)
        return ve ? null : Ze ? Q : "";
    }
    u && gt && re(u.firstChild);
    const L = gn(Me ? d : u);
    for (; A = L.nextNode(); )
      kn(A), xn(A), A.content instanceof i && Ts(A.content);
    if (Me)
      return d;
    if (ve) {
      if (qe)
        for (B = os.call(u.ownerDocument); u.firstChild; )
          B.appendChild(u.firstChild);
      else
        B = u;
      return (P.shadowroot || P.shadowrootmode) && (B = us.call(r, B, !0)), B;
    }
    let V = de ? u.outerHTML : u.innerHTML;
    return de && N["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && H(is, u.ownerDocument.doctype.name) && (V = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + V), Te && Ke([ct, ut, pt], (pe) => {
      V = Pe(V, pe, " ");
    }), v && Ze ? v.createHTML(V) : V;
  }, e.setConfig = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    wt(d), dt = !0;
  }, e.clearConfig = function() {
    Ae = null, dt = !1;
  }, e.isValidAttribute = function(d, a, u) {
    Ae || wt({});
    const f = D(d), A = D(a);
    return bn(f, A, u);
  }, e.addHook = function(d, a) {
    typeof a == "function" && $e(U[d], a);
  }, e.removeHook = function(d, a) {
    if (a !== void 0) {
      const u = Wr(U[d], a);
      return u === -1 ? void 0 : Gr(U[d], u, 1)[0];
    }
    return In(U[d]);
  }, e.removeHooks = function(d) {
    U[d] = [];
  }, e.removeAllHooks = function() {
    U = $n();
  }, e;
}
var la = ls();
const oa = {}, ca = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ua(s, e) {
  return T(), R("svg", ca, [...e[0] || (e[0] = [
    O("path", { d: "M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" }, null, -1)
  ])]);
}
const pa = /* @__PURE__ */ Z(oa, [["render", ua]]), ha = {}, fa = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function da(s, e) {
  return T(), R("svg", fa, [...e[0] || (e[0] = [
    O("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }, null, -1)
  ])]);
}
const ga = /* @__PURE__ */ Z(ha, [["render", da]]), ma = {}, ka = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ba(s, e) {
  return T(), R("svg", ka, [...e[0] || (e[0] = [
    O("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }, null, -1)
  ])]);
}
const _a = /* @__PURE__ */ Z(ma, [["render", ba]]), xa = ["aria-label"], wa = {
  key: 0,
  class: "nc-message-bubble__header"
}, Ta = {
  key: 0,
  class: "nc-message-bubble__label"
}, va = { class: "nc-message-bubble__bubble" }, ya = {
  key: 0,
  class: "nc-message-bubble__content"
}, Sa = ["innerHTML"], Aa = /* @__PURE__ */ fe({
  __name: "MessageBubble",
  props: {
    message: {},
    animate: { type: Boolean, default: !1 }
  },
  setup(s) {
    const e = s, n = oe(Ce, void 0), r = $(() => n?.showBubbleHeaders ?? !0), t = $(() => n?.assistantBubbleFullWidth ?? !1), i = $(() => e.message.role === "user"), l = $(
      () => e.message.status === "failed" || e.message.id.startsWith("error-")
    ), c = $(() => e.message.status === "sending"), o = $(() => e.message.role === "assistant" && !l.value), h = $(() => {
      if (e.message.role !== "assistant" || l.value) return null;
      const _ = S.parse(e.message.content);
      return la.sanitize(_);
    }), p = $(() => l.value ? "Error message" : i.value ? "Message from you" : "Message from AI Assistant"), g = j(!1);
    let m = null;
    async function y() {
      try {
        await navigator.clipboard.writeText(e.message.content), g.value = !0, m && clearTimeout(m), m = setTimeout(() => {
          g.value = !1;
        }, 1500);
      } catch {
      }
    }
    return Un(() => {
      m && clearTimeout(m);
    }), (_, k) => (T(), R("li", {
      role: "listitem",
      "aria-label": p.value,
      class: Bt(["nc-message-bubble", {
        "nc-message-bubble--user": i.value,
        "nc-message-bubble--assistant": o.value,
        "nc-message-bubble--error": l.value,
        "nc-message-bubble--sending": c.value,
        "nc-message-bubble--flat": o.value && t.value,
        "nc-message-bubble--animate-in": e.animate
      }])
    }, [
      r.value ? (T(), R("div", wa, [
        i.value ? (T(), R("span", Ta, "You")) : l.value ? (T(), R(Mt, { key: 1 }, [
          E(pa, { class: "nc-message-bubble__warning-icon" }),
          k[0] || (k[0] = O("span", { class: "nc-message-bubble__label" }, "Error", -1))
        ], 64)) : (T(), R(Mt, { key: 2 }, [
          E(Hn, {
            color: "secondary",
            size: "29"
          }, {
            default: F(() => [
              E(be, {
                icon: Ht,
                color: "white",
                size: "15"
              })
            ]),
            _: 1
          }),
          k[1] || (k[1] = O("span", { class: "nc-message-bubble__label" }, "AI Assistant", -1))
        ], 64))
      ])) : tt("", !0),
      O("div", va, [
        i.value || l.value ? (T(), R("div", ya, Lt(s.message.content), 1)) : (T(), R("div", {
          key: 1,
          class: "nc-message-bubble__content",
          innerHTML: h.value
        }, null, 8, Sa))
      ]),
      o.value ? (T(), le(He, {
        key: 1,
        icon: "",
        variant: "text",
        density: "comfortable",
        size: "small",
        class: "mt-1",
        "aria-label": g.value ? "Message copied" : "Copy message",
        onClick: y
      }, {
        default: F(() => [
          E(be, {
            icon: g.value ? _a : ga,
            size: "small",
            color: g.value ? "success" : "title"
          }, null, 8, ["icon", "color"])
        ]),
        _: 1
      }, 8, ["aria-label"])) : tt("", !0)
    ], 10, xa));
  }
}), Ea = /* @__PURE__ */ Z(Aa, [["__scopeId", "data-v-8550489a"]]), Ra = {}, Ca = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ia(s, e) {
  return T(), R("svg", Ca, [...e[0] || (e[0] = [
    O("path", { d: "M19.79 13.267a.75.75 0 0 0-1.086-1.034l-5.954 6.251V3.75a.75.75 0 1 0-1.5 0v14.734l-5.955-6.251a.75.75 0 0 0-1.086 1.034l7.067 7.42c.16.168.366.268.58.3a.753.753 0 0 0 .29-.001.995.995 0 0 0 .578-.3l7.067-7.419Z" }, null, -1)
  ])]);
}
const La = /* @__PURE__ */ Z(Ra, [["render", Ia]]), Ma = { class: "nc-message-list-wrapper" }, Da = {
  role: "list",
  "aria-live": "polite",
  class: "nc-message-list"
}, Oa = { class: "nc-message-list__loader" }, Na = { class: "nc-scroll-fab" }, $a = 50, Pa = /* @__PURE__ */ fe({
  __name: "MessageList",
  setup(s) {
    const e = oe(Ie), n = at("scrollContainer"), r = j(!0), t = /* @__PURE__ */ new Set(), i = j(/* @__PURE__ */ new Set());
    let l = !1, c = !1;
    ke(
      () => e.messages.value,
      (k) => {
        const I = /* @__PURE__ */ new Set();
        l && !c && k.forEach((x) => {
          t.has(x.id) || I.add(x.id);
        }), k.forEach((x) => t.add(x.id)), i.value = I;
      }
    );
    function o() {
      const k = n.value?.$el;
      return k instanceof HTMLElement ? k : null;
    }
    function h() {
      const k = o();
      if (!k) return;
      const { scrollTop: I, scrollHeight: x, clientHeight: M } = k;
      r.value = x - I - M <= $a;
    }
    function p() {
      const k = o();
      k && (k.scrollTop = k.scrollHeight);
    }
    let g = e.messages.value.length > 0 ? e.messages.value[e.messages.value.length - 1].id : null, m = !1, y = !1;
    ke(
      () => e.messages.value,
      (k) => {
        const I = k.length > 0 ? k[k.length - 1].id : null, x = I !== null && I !== g;
        g = I, x && (m ? y = !0 : he(p));
      }
    ), Bn(() => {
      e.messages.value.forEach((I) => t.add(I.id)), he(() => {
        l = !0;
      }), e.messages.value.length > 0 && he(p), o()?.addEventListener("scroll", h, { passive: !0 });
    }), Un(() => {
      o()?.removeEventListener("scroll", h);
    });
    async function _({ done: k }) {
      c = !0, m = !0;
      try {
        await e.loadMore(), k(e.hasMore.value ? "ok" : "empty");
      } catch {
        k("error");
      }
      await he(), c = !1, m = !1, y && (y = !1, he(p));
    }
    return (k, I) => (T(), R("div", Ma, [
      E(Rs, {
        ref: "scrollContainer",
        side: "start",
        disabled: !ne(e).hasMore.value,
        class: "nc-message-list-scroll",
        onLoad: _
      }, {
        loading: F(() => [
          O("div", Oa, [
            E(Ut, {
              indeterminate: "",
              size: "24",
              width: "2"
            })
          ])
        ]),
        empty: F(() => [...I[0] || (I[0] = [])]),
        default: F(() => [
          O("ul", Da, [
            (T(!0), R(Mt, null, vs(ne(e).messages.value, (x) => (T(), le(Ea, {
              key: x.id,
              message: x,
              animate: i.value.has(x.id)
            }, null, 8, ["message", "animate"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["disabled"]),
      E(Ft, { name: "nc-scroll-fab" }, {
        default: F(() => [
          Pn(O("div", Na, [
            E(He, {
              icon: "",
              variant: "elevated",
              color: "surface",
              size: "small",
              "aria-label": "Scroll to latest messages",
              onClick: p
            }, {
              default: F(() => [
                E(be, { icon: La })
              ]),
              _: 1
            })
          ], 512), [
            [zn, !r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}), za = /* @__PURE__ */ Z(Pa, [["__scopeId", "data-v-097a2440"]]), Ba = {}, Fa = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ua(s, e) {
  return T(), R("svg", Fa, [...e[0] || (e[0] = [
    O("path", { d: "m12.815 12.197-7.532 1.256a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.943l18-9a.75.75 0 0 0 0-1.342l-18-9c-.614-.307-1.283.304-1.035.943l2.598 6.957a.5.5 0 0 0 .386.319l7.532 1.255a.2.2 0 0 1 0 .394Z" }, null, -1)
  ])]);
}
const Ha = /* @__PURE__ */ Z(Ba, [["render", Ua]]), Wa = { class: "nc-chat-input" }, Ga = /* @__PURE__ */ fe({
  __name: "ChatInput",
  setup(s) {
    const e = oe(Ie), n = oe(Ce), r = $(() => n?.placeholder ?? "Type your message..."), t = j(""), i = at("textareaRef"), l = $(() => t.value.trim().length > 0 && !e.isSending.value);
    async function c() {
      const h = t.value.trim();
      if (!(!h || e.isSending.value)) {
        t.value = "";
        try {
          await e.sendMessage(h);
        } catch {
        }
      }
    }
    function o(h) {
      h.key === "Enter" && !h.shiftKey && (h.preventDefault(), c());
    }
    return ke(
      () => e.failedMessageText.value,
      (h) => {
        h && (t.value = h);
      }
    ), ke(
      () => e.isOpen.value,
      (h) => {
        h && he(() => {
          i.value?.focus();
        });
      },
      { immediate: !0 }
    ), ke(
      () => e.isSending.value,
      (h, p) => {
        p && !h && he(() => {
          i.value?.focus();
        });
      }
    ), (h, p) => (T(), R("div", Wa, [
      E(Cs, {
        ref_key: "textareaRef",
        ref: i,
        modelValue: t.value,
        "onUpdate:modelValue": p[0] || (p[0] = (g) => t.value = g),
        "auto-grow": "",
        rows: 2,
        "max-rows": 10,
        "no-resize": "",
        "hide-details": "",
        variant: "solo",
        density: "compact",
        flat: "",
        placeholder: r.value,
        "aria-label": "Type a message",
        disabled: ne(e).isSending.value,
        class: "nc-chat-input__textarea",
        onKeydown: o
      }, {
        "append-inner": F(() => [
          E(He, {
            icon: "",
            variant: "text",
            density: "comfortable",
            color: l.value || ne(e).isSending.value ? "primary" : void 0,
            disabled: !l.value,
            "aria-label": "Send message",
            onClick: c
          }, {
            default: F(() => [
              ne(e).isSending.value ? (T(), le(Ut, {
                key: 0,
                indeterminate: "",
                size: 16,
                width: 2,
                color: "primary"
              })) : (T(), le(be, {
                key: 1,
                icon: Ha,
                color: "secondary"
              }))
            ]),
            _: 1
          }, 8, ["color", "disabled"])
        ]),
        _: 1
      }, 8, ["modelValue", "placeholder", "disabled"])
    ]));
  }
}), qa = /* @__PURE__ */ Z(Ga, [["__scopeId", "data-v-1f6d9226"]]), Za = { class: "nc-chat-panel__body" }, Ya = /* @__PURE__ */ fe({
  __name: "ChatPanel",
  setup(s) {
    const e = oe(Ie), n = oe(Ce), r = $(() => n?.welcomeMessage), t = As(), i = $(() => t.width.value < 768), l = (c) => {
      c.key === "Escape" && e.isOpen.value && e.close();
    };
    return ke(
      () => e.isOpen.value,
      (c) => {
        c ? window.addEventListener("keydown", l) : window.removeEventListener("keydown", l);
      },
      { immediate: !0 }
    ), Fn(() => {
      window.removeEventListener("keydown", l);
    }), (c, o) => (T(), le(ys, { to: "body" }, [
      E(Ft, { name: "nc-panel" }, {
        default: F(() => [
          ne(e).isOpen.value ? (T(), le(Wn, {
            key: 0,
            theme: "nativeChat",
            "with-background": "",
            class: Bt(["nc-chat-panel border-md", { "nc-chat-panel--mobile": i.value }]),
            role: "complementary",
            "aria-label": "Chat with AI Assistant"
          }, {
            default: F(() => [
              E(Ws),
              O("div", Za, [
                ne(e).isLoading.value && ne(e).messages.value.length === 0 ? (T(), le(Ut, {
                  key: 0,
                  indeterminate: "",
                  size: "24",
                  class: "nc-chat-panel__loader"
                })) : ne(e).messages.value.length === 0 && !ne(e).isSending.value ? (T(), le(Xs, {
                  key: 1,
                  message: r.value
                }, null, 8, ["message"])) : (T(), le(za, { key: 2 }))
              ]),
              E(qa)
            ]),
            _: 1
          }, 8, ["class"])) : tt("", !0)
        ]),
        _: 1
      })
    ]));
  }
}), Va = /* @__PURE__ */ Z(Ya, [["__scopeId", "data-v-39979cf7"]]), ja = /* @__PURE__ */ fe({
  __name: "NativeChatWidget",
  setup(s) {
    const e = Es();
    if (!e.themes.value.nativeChat) {
      const i = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...i,
        ...yt,
        colors: {
          ...i.colors,
          ...yt.colors
        },
        variables: {
          ...i.variables,
          ...yt.variables
        }
      };
    }
    const n = oe(Ce), r = Ls(n.apiClient, n);
    Ss(Ie, r);
    const t = at("floatingButtonRef");
    return ke(
      () => r.isOpen.value,
      (i) => {
        i || he(() => {
          t.value?.focus();
        });
      }
    ), (i, l) => (T(), le(Wn, { theme: "nativeChat" }, {
      default: F(() => [
        E(Bs, {
          ref_key: "floatingButtonRef",
          ref: t
        }, null, 512),
        E(Va)
      ]),
      _: 1
    }));
  }
}), Xa = /* @__PURE__ */ Z(ja, [["__scopeId", "data-v-492f08ed"]]), ii = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(Ce, e), s.component("NativeChatWidget", Xa);
  }
};
function li(s) {
  if (!s?.axiosInstance)
    throw new Error("[get-native-chat-vue] createNativeChatApiClient requires an axiosInstance");
  const { axiosInstance: e } = s;
  return {
    async createConversation() {
      return (await e.post("/conversations", {})).data;
    },
    async getConversations(n, r) {
      return (await e.get("/conversations", {
        params: { offset: n, limit: r }
      })).data;
    },
    async getMessages(n, r, t) {
      return (await e.get(
        `/conversations/${encodeURIComponent(n)}/messages`,
        { params: { offset: r, limit: t } }
      )).data;
    },
    async sendMessage(n, r) {
      return (await e.post(
        `/conversations/${encodeURIComponent(n)}/messages`,
        { message: r }
      )).data;
    }
  };
}
export {
  ii as NativeChatPlugin,
  Xa as NativeChatWidget,
  li as createNativeChatApiClient,
  ii as default
};
