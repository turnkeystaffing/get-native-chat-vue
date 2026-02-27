import { ref as X, readonly as Re, openBlock as S, createElementBlock as C, createElementVNode as O, defineComponent as fe, inject as le, computed as $, useTemplateRef as at, withDirectives as $n, normalizeClass as Bt, createVNode as R, withCtx as F, Transition as Ft, vShow as Pn, unref as ne, onMounted as zn, onUnmounted as Bn, toDisplayString as Lt, createCommentVNode as tt, onBeforeUnmount as Fn, Fragment as Mt, createBlock as he, watch as ke, nextTick as pe, renderList as vs, Teleport as ys, provide as Ss } from "vue";
import { useDisplay as As, useTheme as Es } from "vuetify";
import { VBtn as He } from "vuetify/components/VBtn";
import { VIcon as be } from "vuetify/components/VIcon";
import { VAvatar as Un } from "vuetify/components/VAvatar";
import { VInfiniteScroll as Rs } from "vuetify/components/VInfiniteScroll";
import { VProgressCircular as Hn } from "vuetify/components/VProgressCircular";
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
  const n = X([]), r = X(!1), t = X(!1), a = X(!1), l = X(!1), c = X(null), o = X(null), p = X(0), h = e.batchSize ?? 20;
  function g(k, w, U) {
    n.value = n.value.filter((V) => V.id !== U && !V.id.startsWith("error-"));
    const v = Is(k), Q = {
      id: `error-${Date.now()}`,
      conversationId: o.value ?? "",
      role: "assistant",
      content: v,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "failed"
    };
    if (n.value = [...n.value, Q], c.value = null, c.value = w, e.onError)
      try {
        Promise.resolve(
          e.onError({
            message: v,
            statusCode: Gn(k),
            originalError: k
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
          const U = await s.getConversations(0, 1);
          if (U.conversations.length > 0)
            o.value = U.conversations[0].id;
          else {
            const v = await s.createConversation();
            o.value = v.id;
          }
        }
        const k = await s.getMessages(o.value, 0, h), w = [...k.messages].reverse();
        n.value = w, l.value = k.hasMore, p.value = w.length;
      } catch {
      } finally {
        t.value = !1, r.value = !0;
      }
    }
  }
  function y() {
    r.value = !1;
  }
  async function b(k) {
    if (!k.trim() || a.value) return;
    a.value = !0;
    const w = `temp-${Date.now()}`, U = {
      id: w,
      conversationId: o.value ?? "",
      role: "user",
      content: k,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sending"
    };
    if (n.value = [...n.value, U], !o.value)
      try {
        const v = await s.createConversation();
        o.value = v.id;
      } catch (v) {
        g(v, k, w), a.value = !1;
        return;
      }
    try {
      const v = await s.sendMessage(o.value, k), Q = {
        ...v.userMessage,
        status: "sent"
      }, V = {
        ...v.assistantMessage
      };
      n.value = [
        ...n.value.filter((ot) => ot.id !== w),
        Q,
        V
      ], c.value = null;
    } catch (v) {
      g(v, k, w);
    } finally {
      a.value = !1;
    }
  }
  async function L() {
    if (!(!l.value || t.value || !o.value)) {
      t.value = !0;
      try {
        const k = await s.getMessages(
          o.value,
          p.value,
          h
        ), w = [...k.messages].reverse();
        n.value = [...w, ...n.value], p.value += w.length, l.value = k.hasMore;
      } catch {
      } finally {
        t.value = !1;
      }
    }
  }
  async function T() {
    if (!c.value) return;
    const k = c.value;
    c.value = null, await b(k);
  }
  return {
    messages: Re(n),
    isOpen: Re(r),
    isLoading: Re(t),
    isSending: Re(a),
    hasMore: Re(l),
    failedMessageText: Re(c),
    open: m,
    close: y,
    sendMessage: b,
    loadMore: L,
    retry: T
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
}, Y = (s, e) => {
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
  return S(), C("svg", Ds, [...e[0] || (e[0] = [
    O("path", { d: "M10.788 3.103c.495-1.004 1.926-1.004 2.421 0l2.358 4.777 5.273.766c1.107.161 1.549 1.522.748 2.303l-3.816 3.72.901 5.25c.19 1.103-.968 1.944-1.959 1.424l-4.716-2.48-4.715 2.48c-.99.52-2.148-.32-1.96-1.424l.901-5.25-3.815-3.72c-.801-.78-.359-2.142.748-2.303L8.43 7.88l2.358-4.777Zm1.21.936L9.74 8.615a1.35 1.35 0 0 1-1.016.738l-5.05.734 3.654 3.562c.318.31.463.757.388 1.195l-.862 5.03 4.516-2.375a1.35 1.35 0 0 1 1.257 0l4.516 2.374-.862-5.029a1.35 1.35 0 0 1 .388-1.195l3.654-3.562-5.05-.734a1.35 1.35 0 0 1-1.016-.738l-2.259-4.576Z" }, null, -1)
  ])]);
}
const Ut = /* @__PURE__ */ Y(Ms, [["render", Os]]), Ns = {}, $s = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ps(s, e) {
  return S(), C("svg", $s, [...e[0] || (e[0] = [
    O("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const qn = /* @__PURE__ */ Y(Ns, [["render", Ps]]), zs = /* @__PURE__ */ fe({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const n = le(Ce), r = le(Ie), t = $(() => r.isOpen.value), a = $(() => r.isLoading.value), l = $(() => t.value && (n?.hideToggleWhenOpen ?? !1)), c = $(() => n?.position ?? "bottom-right"), o = $(
      () => `nc-floating-button-wrapper--${c.value === "bottom-left" ? "left" : "right"}`
    );
    function p() {
      r.isOpen.value ? r.close() : r.open();
    }
    const h = at("triggerBtn");
    function g() {
      h.value?.$el?.focus();
    }
    return e({ focus: g }), (m, y) => $n((S(), C("div", {
      class: Bt(["nc-floating-button-wrapper", o.value])
    }, [
      R(He, {
        ref_key: "triggerBtn",
        ref: h,
        icon: "",
        size: "56",
        color: "secondary",
        elevation: "4",
        loading: a.value,
        "aria-label": a.value ? "Loading chat" : t.value ? "Close chat" : "Open chat",
        "aria-expanded": t.value.toString(),
        onClick: p
      }, {
        default: F(() => [
          R(Ft, {
            name: "nc-fab-icon",
            mode: "out-in"
          }, {
            default: F(() => [
              (S(), C("span", {
                key: t.value ? "close" : "star",
                class: "nc-floating-button__icon-wrap"
              }, [
                R(be, {
                  icon: t.value ? qn : Ut,
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
      [Pn, !l.value]
    ]);
  }
}), Bs = /* @__PURE__ */ Y(zs, [["__scopeId", "data-v-22c20194"]]), Fs = { class: "nc-chat-header" }, Us = { class: "nc-chat-header__left" }, Hs = /* @__PURE__ */ fe({
  __name: "ChatHeader",
  setup(s) {
    const e = le(Ie);
    return (n, r) => (S(), C("div", Fs, [
      O("div", Us, [
        R(Un, {
          color: "secondary",
          size: "44"
        }, {
          default: F(() => [
            R(be, {
              icon: Ut,
              color: "white",
              size: "20"
            })
          ]),
          _: 1
        }),
        r[1] || (r[1] = O("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
      ]),
      R(He, {
        icon: "",
        variant: "text",
        size: "default",
        "aria-label": "Close chat",
        onClick: r[0] || (r[0] = (t) => ne(e).close())
      }, {
        default: F(() => [
          R(be, {
            icon: qn,
            size: "22"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Ws = /* @__PURE__ */ Y(Hs, [["__scopeId", "data-v-3269c11e"]]), Gs = { class: "nc-welcome-state" }, qs = {
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
    const e = s, n = $(() => e.message ?? "What can I help you with today?"), r = X(""), t = X(!0);
    let a = null;
    return zn(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        r.value = n.value, t.value = !1;
        return;
      }
      let c = 0;
      a = setInterval(() => {
        c++, r.value = n.value.slice(0, c), c >= n.value.length && (clearInterval(a), a = null, t.value = !1);
      }, 70);
    }), Bn(() => {
      a !== null && (clearInterval(a), a = null);
    }), (l, c) => (S(), C("div", Gs, [
      O("span", qs, Lt(n.value), 1),
      O("div", Zs, [
        O("span", Ys, Lt(r.value), 1),
        t.value ? (S(), C("span", Vs)) : tt("", !0)
      ])
    ]));
  }
}), Xs = /* @__PURE__ */ Y(js, [["__scopeId", "data-v-252e5cec"]]);
function Ht() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var xe = Ht();
function Zn(s) {
  xe = s;
}
var me = { exec: () => null };
function x(s, e = "") {
  let n = typeof s == "string" ? s : s.source, r = { replace: (t, a) => {
    let l = typeof a == "string" ? a : a.source;
    return l = l.replace(G.caret, "$1"), n = n.replace(t, l), r;
  }, getRegex: () => new RegExp(n, e) };
  return r;
}
var Qs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), G = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}>`) }, Ks = /^(?:[ \t]*(?:\n|$))+/, Js = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, er = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, We = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, tr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Wt = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Yn = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Vn = x(Yn).replace(/bull/g, Wt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), nr = x(Yn).replace(/bull/g, Wt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Gt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, sr = /^[^\n]+/, qt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, rr = x(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", qt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ar = x(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Wt).getRegex(), it = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Zt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ir = x("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Zt).replace("tag", it).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), jn = x(Gt).replace("hr", We).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", it).getRegex(), lr = x(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", jn).getRegex(), Yt = { blockquote: lr, code: Js, def: rr, fences: er, heading: tr, hr: We, html: ir, lheading: Vn, list: ar, newline: Ks, paragraph: jn, table: me, text: sr }, Tn = x("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", We).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", it).getRegex(), or = { ...Yt, lheading: nr, table: Tn, paragraph: x(Gt).replace("hr", We).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Tn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", it).getRegex() }, cr = { ...Yt, html: x(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Zt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: me, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: x(Gt).replace("hr", We).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Vn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, ur = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, pr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Xn = /^( {2,}|\\)\n(?!\s*$)/, hr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, lt = /[\p{P}\p{S}]/u, Vt = /[\s\p{P}\p{S}]/u, Qn = /[^\s\p{P}\p{S}]/u, fr = x(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Vt).getRegex(), Kn = /(?!~)[\p{P}\p{S}]/u, dr = /(?!~)[\s\p{P}\p{S}]/u, gr = /(?:[^\s\p{P}\p{S}]|~)/u, Jn = /(?![*_])[\p{P}\p{S}]/u, mr = /(?![*_])[\s\p{P}\p{S}]/u, kr = /(?:[^\s\p{P}\p{S}]|[*_])/u, br = x(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Qs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), es = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, _r = x(es, "u").replace(/punct/g, lt).getRegex(), xr = x(es, "u").replace(/punct/g, Kn).getRegex(), ts = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", wr = x(ts, "gu").replace(/notPunctSpace/g, Qn).replace(/punctSpace/g, Vt).replace(/punct/g, lt).getRegex(), Tr = x(ts, "gu").replace(/notPunctSpace/g, gr).replace(/punctSpace/g, dr).replace(/punct/g, Kn).getRegex(), vr = x("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Qn).replace(/punctSpace/g, Vt).replace(/punct/g, lt).getRegex(), yr = x(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Jn).getRegex(), Sr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Ar = x(Sr, "gu").replace(/notPunctSpace/g, kr).replace(/punctSpace/g, mr).replace(/punct/g, Jn).getRegex(), Er = x(/\\(punct)/, "gu").replace(/punct/g, lt).getRegex(), Rr = x(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Cr = x(Zt).replace("(?:-->|$)", "-->").getRegex(), Ir = x("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Cr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), nt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Lr = x(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", nt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ns = x(/^!?\[(label)\]\[(ref)\]/).replace("label", nt).replace("ref", qt).getRegex(), ss = x(/^!?\[(ref)\](?:\[\])?/).replace("ref", qt).getRegex(), Mr = x("reflink|nolink(?!\\()", "g").replace("reflink", ns).replace("nolink", ss).getRegex(), vn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, jt = { _backpedal: me, anyPunctuation: Er, autolink: Rr, blockSkip: br, br: Xn, code: pr, del: me, delLDelim: me, delRDelim: me, emStrongLDelim: _r, emStrongRDelimAst: wr, emStrongRDelimUnd: vr, escape: ur, link: Lr, nolink: ss, punctuation: fr, reflink: ns, reflinkSearch: Mr, tag: Ir, text: hr, url: me }, Dr = { ...jt, link: x(/^!?\[(label)\]\((.*?)\)/).replace("label", nt).getRegex(), reflink: x(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", nt).getRegex() }, Dt = { ...jt, emStrongRDelimAst: Tr, emStrongLDelim: xr, delLDelim: yr, delRDelim: Ar, url: x(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", vn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: x(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", vn).getRegex() }, Or = { ...Dt, br: x(Xn).replace("{2,}", "*").getRegex(), text: x(Dt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Qe = { normal: Yt, gfm: or, pedantic: cr }, Oe = { normal: jt, gfm: Dt, breaks: Or, pedantic: Dr }, Nr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, yn = (s) => Nr[s];
function ae(s, e) {
  if (e) {
    if (G.escapeTest.test(s)) return s.replace(G.escapeReplace, yn);
  } else if (G.escapeTestNoEncode.test(s)) return s.replace(G.escapeReplaceNoEncode, yn);
  return s;
}
function Sn(s) {
  try {
    s = encodeURI(s).replace(G.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function An(s, e) {
  let n = s.replace(G.findPipe, (a, l, c) => {
    let o = !1, p = l;
    for (; --p >= 0 && c[p] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = n.split(G.splitPipe), t = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; t < r.length; t++) r[t] = r[t].trim().replace(G.slashPipe, "|");
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
    let a = 4 - n % 4;
    r += " ".repeat(a), n += a;
  } else r += t, n++;
  return r;
}
function En(s, e, n, r, t) {
  let a = e.href, l = e.title || null, c = s[1].replace(t.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let o = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: n, href: a, title: l, text: c, tokens: r.inlineTokens(c) };
  return r.state.inLink = !1, o;
}
function zr(s, e, n) {
  let r = s.match(n.other.indentCodeCompensation);
  if (r === null) return e;
  let t = r[1];
  return e.split(`
`).map((a) => {
    let l = a.match(n.other.beginningSpace);
    if (l === null) return a;
    let [c] = l;
    return c.length >= t.length ? a.slice(t.length) : a;
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
`), r = "", t = "", a = [];
      for (; n.length > 0; ) {
        let l = !1, c = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) c.push(n[o]), l = !0;
        else if (!l) c.push(n[o]);
        else break;
        n = n.slice(o);
        let p = c.join(`
`), h = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${p}` : p, t = t ? `${t}
${h}` : h;
        let g = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(h, a, !0), this.lexer.state.top = g, n.length === 0) break;
        let m = a.at(-1);
        if (m?.type === "code") break;
        if (m?.type === "blockquote") {
          let y = m, b = y.raw + `
` + n.join(`
`), L = this.blockquote(b);
          a[a.length - 1] = L, r = r.substring(0, r.length - y.raw.length) + L.raw, t = t.substring(0, t.length - y.text.length) + L.text;
          break;
        } else if (m?.type === "list") {
          let y = m, b = y.raw + `
` + n.join(`
`), L = this.list(b);
          a[a.length - 1] = L, r = r.substring(0, r.length - m.raw.length) + L.raw, t = t.substring(0, t.length - y.raw.length) + L.raw, n = b.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: a, text: t };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let n = e[1].trim(), r = n.length > 1, t = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let a = this.rules.other.listItemRegex(n), l = !1;
      for (; s; ) {
        let o = !1, p = "", h = "";
        if (!(e = a.exec(s)) || this.rules.block.hr.test(s)) break;
        p = e[0], s = s.substring(p.length);
        let g = Pr(e[2].split(`
`, 1)[0], e[1].length), m = s.split(`
`, 1)[0], y = !g.trim(), b = 0;
        if (this.options.pedantic ? (b = 2, h = g.trimStart()) : y ? b = e[1].length + 1 : (b = g.search(this.rules.other.nonSpaceChar), b = b > 4 ? 1 : b, h = g.slice(b), b += e[1].length), y && this.rules.other.blankLine.test(m) && (p += m + `
`, s = s.substring(m.length + 1), o = !0), !o) {
          let L = this.rules.other.nextBulletRegex(b), T = this.rules.other.hrRegex(b), k = this.rules.other.fencesBeginRegex(b), w = this.rules.other.headingBeginRegex(b), U = this.rules.other.htmlBeginRegex(b), v = this.rules.other.blockquoteBeginRegex(b);
          for (; s; ) {
            let Q = s.split(`
`, 1)[0], V;
            if (m = Q, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), V = m) : V = m.replace(this.rules.other.tabCharGlobal, "    "), k.test(m) || w.test(m) || U.test(m) || v.test(m) || L.test(m) || T.test(m)) break;
            if (V.search(this.rules.other.nonSpaceChar) >= b || !m.trim()) h += `
` + V.slice(b);
            else {
              if (y || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || k.test(g) || w.test(g) || T.test(g)) break;
              h += `
` + m;
            }
            y = !m.trim(), p += Q + `
`, s = s.substring(Q.length + 1), g = V.slice(b);
          }
        }
        t.loose || (l ? t.loose = !0 : this.rules.other.doubleBlankLine.test(p) && (l = !0)), t.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(h), loose: !1, text: h, tokens: [] }), t.raw += p;
      }
      let c = t.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      t.raw = t.raw.trimEnd();
      for (let o of t.items) {
        if (this.lexer.state.top = !1, o.tokens = this.lexer.blockTokens(o.text, []), o.task) {
          if (o.text = o.text.replace(this.rules.other.listReplaceTask, ""), o.tokens[0]?.type === "text" || o.tokens[0]?.type === "paragraph") {
            o.tokens[0].raw = o.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), o.tokens[0].text = o.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let h = this.lexer.inlineQueue.length - 1; h >= 0; h--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[h].src)) {
              this.lexer.inlineQueue[h].src = this.lexer.inlineQueue[h].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let p = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (p) {
            let h = { type: "checkbox", raw: p[0] + " ", checked: p[0] !== "[ ]" };
            o.checked = h.checked, t.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = h.raw + o.tokens[0].raw, o.tokens[0].text = h.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(h)) : o.tokens.unshift({ type: "paragraph", raw: h.raw, text: h.raw, tokens: [h] }) : o.tokens.unshift(h);
          }
        }
        if (!t.loose) {
          let p = o.tokens.filter((g) => g.type === "space"), h = p.length > 0 && p.some((g) => this.rules.other.anyLine.test(g.raw));
          t.loose = h;
        }
      }
      if (t.loose) for (let o of t.items) {
        o.loose = !0;
        for (let p of o.tokens) p.type === "text" && (p.type = "paragraph");
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
    let n = An(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let l of r) this.rules.other.tableAlignRight.test(l) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? a.align.push("left") : a.align.push(null);
      for (let l = 0; l < n.length; l++) a.header.push({ text: n[l], tokens: this.lexer.inline(n[l]), header: !0, align: a.align[l] });
      for (let l of t) a.rows.push(An(l, a.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: a.align[o] })));
      return a;
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
        let a = Ne(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0) return;
      } else {
        let a = $r(e[2], "()");
        if (a === -2) return;
        if (a > -1) {
          let l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + a;
          e[2] = e[2].substring(0, a), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let r = e[2], t = "";
      if (this.options.pedantic) {
        let a = this.rules.other.pedanticHrefTitle.exec(r);
        a && (r = a[1], t = a[3]);
      } else t = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), En(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(s)) || (n = this.rules.inline.nolink.exec(s))) {
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[r.toLowerCase()];
      if (!t) {
        let a = n[0].charAt(0);
        return { type: "text", raw: a, text: a };
      }
      return En(n, t, n[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let t = [...r[0]].length - 1, a, l, c = t, o = 0, p = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = p.exec(e)) != null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
        if (l = [...a].length, r[3] || r[4]) {
          c += l;
          continue;
        } else if ((r[5] || r[6]) && t % 3 && !((t + l) % 3)) {
          o += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c + o);
        let h = [...r[0]][0].length, g = s.slice(0, t + r.index + h + l);
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
      let t = [...r[0]].length - 1, a, l, c = t, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = o.exec(e)) != null; ) {
        if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a || (l = [...a].length, l !== t)) continue;
        if (r[3] || r[4]) {
          c += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c);
        let p = [...r[0]][0].length, h = s.slice(0, t + r.index + p + l), g = h.slice(t, -t);
        return { type: "del", raw: h, text: g, tokens: this.lexer.inlineTokens(g) };
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
    let n = { other: G, block: Qe.normal, inline: Oe.normal };
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
    e = e.replace(G.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let r = this.inlineQueue[n];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], r = !1) {
    for (this.options.pedantic && (e = e.replace(G.tabCharGlobal, "    ").replace(G.spaceLine, "")); e; ) {
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
      let a = e;
      if (this.options.extensions?.startBlock) {
        let l = 1 / 0, c = e.slice(1), o;
        this.options.extensions.startBlock.forEach((p) => {
          o = p.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (l = Math.min(l, o));
        }), l < 1 / 0 && l >= 0 && (a = e.substring(0, l + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(a))) {
        let l = n.at(-1);
        r && l?.type === "paragraph" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + t.raw, l.text += `
` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : n.push(t), r = a.length !== e.length, e = e.substring(t.raw.length);
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
    let a;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; ) a = t[2] ? t[2].length : 0, r = r.slice(0, t.index + a) + "[" + "a".repeat(t[0].length - a - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
      let o;
      if (this.options.extensions?.inline?.some((h) => (o = h.call({ lexer: this }, e, n)) ? (e = e.substring(o.raw.length), n.push(o), !0) : !1)) continue;
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
        let h = n.at(-1);
        o.type === "text" && h?.type === "text" ? (h.raw += o.raw, h.text += o.text) : n.push(o);
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
      let p = e;
      if (this.options.extensions?.startInline) {
        let h = 1 / 0, g = e.slice(1), m;
        this.options.extensions.startInline.forEach((y) => {
          m = y.call({ lexer: this }, g), typeof m == "number" && m >= 0 && (h = Math.min(h, m));
        }), h < 1 / 0 && h >= 0 && (p = e.substring(0, h + 1));
      }
      if (o = this.tokenizer.inlineText(p)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (c = o.raw.slice(-1)), l = !0;
        let h = n.at(-1);
        h?.type === "text" ? (h.raw += o.raw, h.text += o.text) : n.push(o);
        continue;
      }
      if (e) {
        let h = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else throw new Error(h);
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
    let r = (e || "").match(G.notSpaceStart)?.[0], t = s.replace(G.endingNewline, "") + `
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
    let t = e ? "ol" : "ul", a = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + t + a + `>
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
      let a = s.rows[t];
      n = "";
      for (let l = 0; l < a.length; l++) n += this.tablecell(a[l]);
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
    let r = this.parser.parseInline(n), t = Sn(s);
    if (t === null) return r;
    s = t;
    let a = '<a href="' + s + '"';
    return e && (a += ' title="' + ae(e) + '"'), a += ">" + r + "</a>", a;
  }
  image({ href: s, title: e, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let t = Sn(s);
    if (t === null) return ae(n);
    s = t;
    let a = `<img src="${s}" alt="${ae(n)}"`;
    return e && (a += ` title="${ae(e)}"`), a += ">", a;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : ae(s.text);
  }
}, Xt = class {
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
    this.options = e || xe, this.options.renderer = this.options.renderer || new rt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Xt();
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
      let a = t;
      switch (a.type) {
        case "space": {
          n += this.renderer.space(a);
          break;
        }
        case "hr": {
          n += this.renderer.hr(a);
          break;
        }
        case "heading": {
          n += this.renderer.heading(a);
          break;
        }
        case "code": {
          n += this.renderer.code(a);
          break;
        }
        case "table": {
          n += this.renderer.table(a);
          break;
        }
        case "blockquote": {
          n += this.renderer.blockquote(a);
          break;
        }
        case "list": {
          n += this.renderer.list(a);
          break;
        }
        case "checkbox": {
          n += this.renderer.checkbox(a);
          break;
        }
        case "html": {
          n += this.renderer.html(a);
          break;
        }
        case "def": {
          n += this.renderer.def(a);
          break;
        }
        case "paragraph": {
          n += this.renderer.paragraph(a);
          break;
        }
        case "text": {
          n += this.renderer.text(a);
          break;
        }
        default: {
          let l = 'Token with "' + a.type + '" type was not found.';
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
      let a = e[t];
      if (this.options.extensions?.renderers?.[a.type]) {
        let c = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(a.type)) {
          r += c || "";
          continue;
        }
      }
      let l = a;
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
  defaults = Ht();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = te;
  Renderer = rt;
  TextRenderer = Xt;
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
        for (let a of t.header) n = n.concat(this.walkTokens(a.tokens, e));
        for (let a of t.rows) for (let l of a) n = n.concat(this.walkTokens(l.tokens, e));
        break;
      }
      case "list": {
        let t = r;
        n = n.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = r;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((a) => {
          let l = t[a].flat(1 / 0);
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
          let a = e.renderers[t.name];
          a ? e.renderers[t.name] = function(...l) {
            let c = t.renderer.apply(this, l);
            return c === !1 && (c = a.apply(this, l)), c;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = e[t.level];
          a ? a.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), r.extensions = e), n.renderer) {
        let t = this.defaults.renderer || new rt(this.defaults);
        for (let a in n.renderer) {
          if (!(a in t)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let l = a, c = n.renderer[l], o = t[l];
          t[l] = (...p) => {
            let h = c.apply(t, p);
            return h === !1 && (h = o.apply(t, p)), h || "";
          };
        }
        r.renderer = t;
      }
      if (n.tokenizer) {
        let t = this.defaults.tokenizer || new st(this.defaults);
        for (let a in n.tokenizer) {
          if (!(a in t)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let l = a, c = n.tokenizer[l], o = t[l];
          t[l] = (...p) => {
            let h = c.apply(t, p);
            return h === !1 && (h = o.apply(t, p)), h;
          };
        }
        r.tokenizer = t;
      }
      if (n.hooks) {
        let t = this.defaults.hooks || new Ue();
        for (let a in n.hooks) {
          if (!(a in t)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let l = a, c = n.hooks[l], o = t[l];
          Ue.passThroughHooks.has(a) ? t[l] = (p) => {
            if (this.defaults.async && Ue.passThroughHooksRespectAsync.has(a)) return (async () => {
              let g = await c.call(t, p);
              return o.call(t, g);
            })();
            let h = c.call(t, p);
            return o.call(t, h);
          } : t[l] = (...p) => {
            if (this.defaults.async) return (async () => {
              let g = await c.apply(t, p);
              return g === !1 && (g = await o.apply(t, p)), g;
            })();
            let h = c.apply(t, p);
            return h === !1 && (h = o.apply(t, p)), h;
          };
        }
        r.hooks = t;
      }
      if (n.walkTokens) {
        let t = this.defaults.walkTokens, a = n.walkTokens;
        r.walkTokens = function(l) {
          let c = [];
          return c.push(a.call(this, l)), t && (c = c.concat(t.call(this, l))), c;
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
      let r = { ...n }, t = { ...this.defaults, ...r }, a = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && r.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let l = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : s ? ee.lex : ee.lexInline)(l, t), o = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(o, t.walkTokens));
        let p = await (t.hooks ? await t.hooks.provideParser() : s ? te.parse : te.parseInline)(o, t);
        return t.hooks ? await t.hooks.postprocess(p) : p;
      })().catch(a);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let l = (t.hooks ? t.hooks.provideLexer() : s ? ee.lex : ee.lexInline)(e, t);
        t.hooks && (l = t.hooks.processAllTokens(l)), t.walkTokens && this.walkTokens(l, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : s ? te.parse : te.parseInline)(l, t);
        return t.hooks && (c = t.hooks.postprocess(c)), c;
      } catch (l) {
        return a(l);
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
function A(s, e) {
  return _e.parse(s, e);
}
A.options = A.setOptions = function(s) {
  return _e.setOptions(s), A.defaults = _e.defaults, Zn(A.defaults), A;
};
A.getDefaults = Ht;
A.defaults = xe;
A.use = function(...s) {
  return _e.use(...s), A.defaults = _e.defaults, Zn(A.defaults), A;
};
A.walkTokens = function(s, e) {
  return _e.walkTokens(s, e);
};
A.parseInline = _e.parseInline;
A.Parser = te;
A.parser = te.parse;
A.Renderer = rt;
A.TextRenderer = Xt;
A.Lexer = ee;
A.lexer = ee.lex;
A.Tokenizer = st;
A.Hooks = Ue;
A.parse = A;
A.options;
A.setOptions;
A.use;
A.walkTokens;
A.parseInline;
te.parse;
ee.lex;
const {
  entries: rs,
  setPrototypeOf: Rn,
  isFrozen: Fr,
  getPrototypeOf: Ur,
  getOwnPropertyDescriptor: Hr
} = Object;
let {
  freeze: q,
  seal: K,
  create: $t
} = Object, {
  apply: Pt,
  construct: zt
} = typeof Reflect < "u" && Reflect;
q || (q = function(e) {
  return e;
});
K || (K = function(e) {
  return e;
});
Pt || (Pt = function(e, n) {
  for (var r = arguments.length, t = new Array(r > 2 ? r - 2 : 0), a = 2; a < r; a++)
    t[a - 2] = arguments[a];
  return e.apply(n, t);
});
zt || (zt = function(e) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
    r[t - 1] = arguments[t];
  return new e(...r);
});
const Ke = Z(Array.prototype.forEach), Wr = Z(Array.prototype.lastIndexOf), Cn = Z(Array.prototype.pop), $e = Z(Array.prototype.push), Gr = Z(Array.prototype.splice), et = Z(String.prototype.toLowerCase), St = Z(String.prototype.toString), At = Z(String.prototype.match), Pe = Z(String.prototype.replace), qr = Z(String.prototype.indexOf), Zr = Z(String.prototype.trim), J = Z(Object.prototype.hasOwnProperty), W = Z(RegExp.prototype.test), ze = Yr(TypeError);
function Z(s) {
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
function _(s, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : et;
  Rn && Rn(s, null);
  let r = e.length;
  for (; r--; ) {
    let t = e[r];
    if (typeof t == "string") {
      const a = n(t);
      a !== t && (Fr(e) || (e[r] = a), t = a);
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
        return Z(r.get);
      if (typeof r.value == "function")
        return Z(r.value);
    }
    s = Ur(s);
  }
  function n() {
    return null;
  }
  return n;
}
const In = q(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Et = q(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Rt = q(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), jr = q(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Ct = q(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Xr = q(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Ln = q(["#text"]), Mn = q(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), It = q(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Dn = q(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Je = q(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Qr = K(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Kr = K(/<%[\w\W]*|[\w\W]*%>/gm), Jr = K(/\$\{[\w\W]*/gm), ea = K(/^data-[\-\w.\u00B7-\uFFFF]+$/), ta = K(/^aria-[\-\w]+$/), as = K(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), na = K(/^(?:\w+script|data):/i), sa = K(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), is = K(/^html$/i), ra = K(/^[a-z][.\w]*(-[.\w]+)+$/i);
var On = /* @__PURE__ */ Object.freeze({
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
  const a = "dompurify" + (r ? "#" + r : "");
  try {
    return e.createPolicy(a, {
      createHTML(l) {
        return l;
      },
      createScriptURL(l) {
        return l;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + a + " could not be created."), null;
  }
}, Nn = function() {
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
    DocumentFragment: a,
    HTMLTemplateElement: l,
    Node: c,
    Element: o,
    NodeFilter: p,
    NamedNodeMap: h = s.NamedNodeMap || s.MozNamedAttrMap,
    HTMLFormElement: g,
    DOMParser: m,
    trustedTypes: y
  } = s, b = o.prototype, L = Be(b, "cloneNode"), T = Be(b, "remove"), k = Be(b, "nextSibling"), w = Be(b, "childNodes"), U = Be(b, "parentNode");
  if (typeof l == "function") {
    const d = n.createElement("template");
    d.content && d.content.ownerDocument && (n = d.content.ownerDocument);
  }
  let v, Q = "";
  const {
    implementation: V,
    createNodeIterator: ot,
    createDocumentFragment: os,
    getElementsByTagName: cs
  } = n, {
    importNode: us
  } = r;
  let H = Nn();
  e.isSupported = typeof rs == "function" && typeof U == "function" && V && V.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: ct,
    ERB_EXPR: ut,
    TMPLIT_EXPR: pt,
    DATA_ATTR: ps,
    ARIA_ATTR: hs,
    IS_SCRIPT_OR_DATA: fs,
    ATTR_WHITESPACE: Qt,
    CUSTOM_ELEMENT: ds
  } = On;
  let {
    IS_ALLOWED_URI: Kt
  } = On, N = null;
  const Jt = _({}, [...In, ...Et, ...Rt, ...Ct, ...Ln]);
  let P = null;
  const en = _({}, [...Mn, ...It, ...Dn, ...Je]);
  let I = Object.seal($t(null, {
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
  let tn = !0, ft = !0, nn = !1, sn = !0, Te = !1, Ge = !0, de = !1, dt = !1, gt = !1, ve = !1, qe = !1, Ze = !1, rn = !0, an = !1;
  const gs = "user-content-";
  let mt = !0, Me = !1, ye = {}, se = null;
  const kt = _({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let ln = null;
  const on = _({}, ["audio", "video", "img", "source", "image", "track"]);
  let bt = null;
  const cn = _({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ye = "http://www.w3.org/1998/Math/MathML", Ve = "http://www.w3.org/2000/svg", oe = "http://www.w3.org/1999/xhtml";
  let Se = oe, _t = !1, xt = null;
  const ms = _({}, [Ye, Ve, oe], St);
  let je = _({}, ["mi", "mo", "mn", "ms", "mtext"]), Xe = _({}, ["annotation-xml"]);
  const ks = _({}, ["title", "style", "font", "a", "script"]);
  let De = null;
  const bs = ["application/xhtml+xml", "text/html"], _s = "text/html";
  let D = null, Ae = null;
  const xs = n.createElement("form"), un = function(i) {
    return i instanceof RegExp || i instanceof Function;
  }, wt = function() {
    let i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(Ae && Ae === i)) {
      if ((!i || typeof i != "object") && (i = {}), i = ie(i), De = // eslint-disable-next-line unicorn/prefer-includes
      bs.indexOf(i.PARSER_MEDIA_TYPE) === -1 ? _s : i.PARSER_MEDIA_TYPE, D = De === "application/xhtml+xml" ? St : et, N = J(i, "ALLOWED_TAGS") ? _({}, i.ALLOWED_TAGS, D) : Jt, P = J(i, "ALLOWED_ATTR") ? _({}, i.ALLOWED_ATTR, D) : en, xt = J(i, "ALLOWED_NAMESPACES") ? _({}, i.ALLOWED_NAMESPACES, St) : ms, bt = J(i, "ADD_URI_SAFE_ATTR") ? _(ie(cn), i.ADD_URI_SAFE_ATTR, D) : cn, ln = J(i, "ADD_DATA_URI_TAGS") ? _(ie(on), i.ADD_DATA_URI_TAGS, D) : on, se = J(i, "FORBID_CONTENTS") ? _({}, i.FORBID_CONTENTS, D) : kt, Le = J(i, "FORBID_TAGS") ? _({}, i.FORBID_TAGS, D) : ie({}), ht = J(i, "FORBID_ATTR") ? _({}, i.FORBID_ATTR, D) : ie({}), ye = J(i, "USE_PROFILES") ? i.USE_PROFILES : !1, tn = i.ALLOW_ARIA_ATTR !== !1, ft = i.ALLOW_DATA_ATTR !== !1, nn = i.ALLOW_UNKNOWN_PROTOCOLS || !1, sn = i.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Te = i.SAFE_FOR_TEMPLATES || !1, Ge = i.SAFE_FOR_XML !== !1, de = i.WHOLE_DOCUMENT || !1, ve = i.RETURN_DOM || !1, qe = i.RETURN_DOM_FRAGMENT || !1, Ze = i.RETURN_TRUSTED_TYPE || !1, gt = i.FORCE_BODY || !1, rn = i.SANITIZE_DOM !== !1, an = i.SANITIZE_NAMED_PROPS || !1, mt = i.KEEP_CONTENT !== !1, Me = i.IN_PLACE || !1, Kt = i.ALLOWED_URI_REGEXP || as, Se = i.NAMESPACE || oe, je = i.MATHML_TEXT_INTEGRATION_POINTS || je, Xe = i.HTML_INTEGRATION_POINTS || Xe, I = i.CUSTOM_ELEMENT_HANDLING || {}, i.CUSTOM_ELEMENT_HANDLING && un(i.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (I.tagNameCheck = i.CUSTOM_ELEMENT_HANDLING.tagNameCheck), i.CUSTOM_ELEMENT_HANDLING && un(i.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (I.attributeNameCheck = i.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), i.CUSTOM_ELEMENT_HANDLING && typeof i.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (I.allowCustomizedBuiltInElements = i.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Te && (ft = !1), qe && (ve = !0), ye && (N = _({}, Ln), P = [], ye.html === !0 && (_(N, In), _(P, Mn)), ye.svg === !0 && (_(N, Et), _(P, It), _(P, Je)), ye.svgFilters === !0 && (_(N, Rt), _(P, It), _(P, Je)), ye.mathMl === !0 && (_(N, Ct), _(P, Dn), _(P, Je))), i.ADD_TAGS && (typeof i.ADD_TAGS == "function" ? we.tagCheck = i.ADD_TAGS : (N === Jt && (N = ie(N)), _(N, i.ADD_TAGS, D))), i.ADD_ATTR && (typeof i.ADD_ATTR == "function" ? we.attributeCheck = i.ADD_ATTR : (P === en && (P = ie(P)), _(P, i.ADD_ATTR, D))), i.ADD_URI_SAFE_ATTR && _(bt, i.ADD_URI_SAFE_ATTR, D), i.FORBID_CONTENTS && (se === kt && (se = ie(se)), _(se, i.FORBID_CONTENTS, D)), i.ADD_FORBID_CONTENTS && (se === kt && (se = ie(se)), _(se, i.ADD_FORBID_CONTENTS, D)), mt && (N["#text"] = !0), de && _(N, ["html", "head", "body"]), N.table && (_(N, ["tbody"]), delete Le.tbody), i.TRUSTED_TYPES_POLICY) {
        if (typeof i.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw ze('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof i.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw ze('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        v = i.TRUSTED_TYPES_POLICY, Q = v.createHTML("");
      } else
        v === void 0 && (v = ia(y, t)), v !== null && typeof Q == "string" && (Q = v.createHTML(""));
      q && q(i), Ae = i;
    }
  }, pn = _({}, [...Et, ...Rt, ...jr]), hn = _({}, [...Ct, ...Xr]), ws = function(i) {
    let u = U(i);
    (!u || !u.tagName) && (u = {
      namespaceURI: Se,
      tagName: "template"
    });
    const f = et(i.tagName), E = et(u.tagName);
    return xt[i.namespaceURI] ? i.namespaceURI === Ve ? u.namespaceURI === oe ? f === "svg" : u.namespaceURI === Ye ? f === "svg" && (E === "annotation-xml" || je[E]) : !!pn[f] : i.namespaceURI === Ye ? u.namespaceURI === oe ? f === "math" : u.namespaceURI === Ve ? f === "math" && Xe[E] : !!hn[f] : i.namespaceURI === oe ? u.namespaceURI === Ve && !Xe[E] || u.namespaceURI === Ye && !je[E] ? !1 : !hn[f] && (ks[f] || !pn[f]) : !!(De === "application/xhtml+xml" && xt[i.namespaceURI]) : !1;
  }, re = function(i) {
    $e(e.removed, {
      element: i
    });
    try {
      U(i).removeChild(i);
    } catch {
      T(i);
    }
  }, ge = function(i, u) {
    try {
      $e(e.removed, {
        attribute: u.getAttributeNode(i),
        from: u
      });
    } catch {
      $e(e.removed, {
        attribute: null,
        from: u
      });
    }
    if (u.removeAttribute(i), i === "is")
      if (ve || qe)
        try {
          re(u);
        } catch {
        }
      else
        try {
          u.setAttribute(i, "");
        } catch {
        }
  }, fn = function(i) {
    let u = null, f = null;
    if (gt)
      i = "<remove></remove>" + i;
    else {
      const M = At(i, /^[\r\n\t ]+/);
      f = M && M[0];
    }
    De === "application/xhtml+xml" && Se === oe && (i = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + i + "</body></html>");
    const E = v ? v.createHTML(i) : i;
    if (Se === oe)
      try {
        u = new m().parseFromString(E, De);
      } catch {
      }
    if (!u || !u.documentElement) {
      u = V.createDocument(Se, "template", null);
      try {
        u.documentElement.innerHTML = _t ? Q : E;
      } catch {
      }
    }
    const B = u.body || u.documentElement;
    return i && f && B.insertBefore(n.createTextNode(f), B.childNodes[0] || null), Se === oe ? cs.call(u, de ? "html" : "body")[0] : de ? u.documentElement : B;
  }, dn = function(i) {
    return ot.call(
      i.ownerDocument || i,
      i,
      // eslint-disable-next-line no-bitwise
      p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION,
      null
    );
  }, Tt = function(i) {
    return i instanceof g && (typeof i.nodeName != "string" || typeof i.textContent != "string" || typeof i.removeChild != "function" || !(i.attributes instanceof h) || typeof i.removeAttribute != "function" || typeof i.setAttribute != "function" || typeof i.namespaceURI != "string" || typeof i.insertBefore != "function" || typeof i.hasChildNodes != "function");
  }, gn = function(i) {
    return typeof c == "function" && i instanceof c;
  };
  function ce(d, i, u) {
    Ke(d, (f) => {
      f.call(e, i, u, Ae);
    });
  }
  const mn = function(i) {
    let u = null;
    if (ce(H.beforeSanitizeElements, i, null), Tt(i))
      return re(i), !0;
    const f = D(i.nodeName);
    if (ce(H.uponSanitizeElement, i, {
      tagName: f,
      allowedTags: N
    }), Ge && i.hasChildNodes() && !gn(i.firstElementChild) && W(/<[/\w!]/g, i.innerHTML) && W(/<[/\w!]/g, i.textContent) || i.nodeType === Fe.progressingInstruction || Ge && i.nodeType === Fe.comment && W(/<[/\w]/g, i.data))
      return re(i), !0;
    if (!(we.tagCheck instanceof Function && we.tagCheck(f)) && (!N[f] || Le[f])) {
      if (!Le[f] && bn(f) && (I.tagNameCheck instanceof RegExp && W(I.tagNameCheck, f) || I.tagNameCheck instanceof Function && I.tagNameCheck(f)))
        return !1;
      if (mt && !se[f]) {
        const E = U(i) || i.parentNode, B = w(i) || i.childNodes;
        if (B && E) {
          const M = B.length;
          for (let j = M - 1; j >= 0; --j) {
            const ue = L(B[j], !0);
            ue.__removalCount = (i.__removalCount || 0) + 1, E.insertBefore(ue, k(i));
          }
        }
      }
      return re(i), !0;
    }
    return i instanceof o && !ws(i) || (f === "noscript" || f === "noembed" || f === "noframes") && W(/<\/no(script|embed|frames)/i, i.innerHTML) ? (re(i), !0) : (Te && i.nodeType === Fe.text && (u = i.textContent, Ke([ct, ut, pt], (E) => {
      u = Pe(u, E, " ");
    }), i.textContent !== u && ($e(e.removed, {
      element: i.cloneNode()
    }), i.textContent = u)), ce(H.afterSanitizeElements, i, null), !1);
  }, kn = function(i, u, f) {
    if (rn && (u === "id" || u === "name") && (f in n || f in xs))
      return !1;
    if (!(ft && !ht[u] && W(ps, u))) {
      if (!(tn && W(hs, u))) {
        if (!(we.attributeCheck instanceof Function && we.attributeCheck(u, i))) {
          if (!P[u] || ht[u]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(bn(i) && (I.tagNameCheck instanceof RegExp && W(I.tagNameCheck, i) || I.tagNameCheck instanceof Function && I.tagNameCheck(i)) && (I.attributeNameCheck instanceof RegExp && W(I.attributeNameCheck, u) || I.attributeNameCheck instanceof Function && I.attributeNameCheck(u, i)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              u === "is" && I.allowCustomizedBuiltInElements && (I.tagNameCheck instanceof RegExp && W(I.tagNameCheck, f) || I.tagNameCheck instanceof Function && I.tagNameCheck(f)))
            ) return !1;
          } else if (!bt[u]) {
            if (!W(Kt, Pe(f, Qt, ""))) {
              if (!((u === "src" || u === "xlink:href" || u === "href") && i !== "script" && qr(f, "data:") === 0 && ln[i])) {
                if (!(nn && !W(fs, Pe(f, Qt, "")))) {
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
  }, bn = function(i) {
    return i !== "annotation-xml" && At(i, ds);
  }, _n = function(i) {
    ce(H.beforeSanitizeAttributes, i, null);
    const {
      attributes: u
    } = i;
    if (!u || Tt(i))
      return;
    const f = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: P,
      forceKeepAttr: void 0
    };
    let E = u.length;
    for (; E--; ) {
      const B = u[E], {
        name: M,
        namespaceURI: j,
        value: ue
      } = B, Ee = D(M), vt = ue;
      let z = M === "value" ? vt : Zr(vt);
      if (f.attrName = Ee, f.attrValue = z, f.keepAttr = !0, f.forceKeepAttr = void 0, ce(H.uponSanitizeAttribute, i, f), z = f.attrValue, an && (Ee === "id" || Ee === "name") && (ge(M, i), z = gs + z), Ge && W(/((--!?|])>)|<\/(style|title|textarea)/i, z)) {
        ge(M, i);
        continue;
      }
      if (Ee === "attributename" && At(z, "href")) {
        ge(M, i);
        continue;
      }
      if (f.forceKeepAttr)
        continue;
      if (!f.keepAttr) {
        ge(M, i);
        continue;
      }
      if (!sn && W(/\/>/i, z)) {
        ge(M, i);
        continue;
      }
      Te && Ke([ct, ut, pt], (wn) => {
        z = Pe(z, wn, " ");
      });
      const xn = D(i.nodeName);
      if (!kn(xn, Ee, z)) {
        ge(M, i);
        continue;
      }
      if (v && typeof y == "object" && typeof y.getAttributeType == "function" && !j)
        switch (y.getAttributeType(xn, Ee)) {
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
          j ? i.setAttributeNS(j, M, z) : i.setAttribute(M, z), Tt(i) ? re(i) : Cn(e.removed);
        } catch {
          ge(M, i);
        }
    }
    ce(H.afterSanitizeAttributes, i, null);
  }, Ts = function d(i) {
    let u = null;
    const f = dn(i);
    for (ce(H.beforeSanitizeShadowDOM, i, null); u = f.nextNode(); )
      ce(H.uponSanitizeShadowNode, u, null), mn(u), _n(u), u.content instanceof a && d(u.content);
    ce(H.afterSanitizeShadowDOM, i, null);
  };
  return e.sanitize = function(d) {
    let i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, f = null, E = null, B = null;
    if (_t = !d, _t && (d = "<!-->"), typeof d != "string" && !gn(d))
      if (typeof d.toString == "function") {
        if (d = d.toString(), typeof d != "string")
          throw ze("dirty is not a string, aborting");
      } else
        throw ze("toString is not a function");
    if (!e.isSupported)
      return d;
    if (dt || wt(i), e.removed = [], typeof d == "string" && (Me = !1), Me) {
      if (d.nodeName) {
        const ue = D(d.nodeName);
        if (!N[ue] || Le[ue])
          throw ze("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (d instanceof c)
      u = fn("<!---->"), f = u.ownerDocument.importNode(d, !0), f.nodeType === Fe.element && f.nodeName === "BODY" || f.nodeName === "HTML" ? u = f : u.appendChild(f);
    else {
      if (!ve && !Te && !de && // eslint-disable-next-line unicorn/prefer-includes
      d.indexOf("<") === -1)
        return v && Ze ? v.createHTML(d) : d;
      if (u = fn(d), !u)
        return ve ? null : Ze ? Q : "";
    }
    u && gt && re(u.firstChild);
    const M = dn(Me ? d : u);
    for (; E = M.nextNode(); )
      mn(E), _n(E), E.content instanceof a && Ts(E.content);
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
    let j = de ? u.outerHTML : u.innerHTML;
    return de && N["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && W(is, u.ownerDocument.doctype.name) && (j = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + j), Te && Ke([ct, ut, pt], (ue) => {
      j = Pe(j, ue, " ");
    }), v && Ze ? v.createHTML(j) : j;
  }, e.setConfig = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    wt(d), dt = !0;
  }, e.clearConfig = function() {
    Ae = null, dt = !1;
  }, e.isValidAttribute = function(d, i, u) {
    Ae || wt({});
    const f = D(d), E = D(i);
    return kn(f, E, u);
  }, e.addHook = function(d, i) {
    typeof i == "function" && $e(H[d], i);
  }, e.removeHook = function(d, i) {
    if (i !== void 0) {
      const u = Wr(H[d], i);
      return u === -1 ? void 0 : Gr(H[d], u, 1)[0];
    }
    return Cn(H[d]);
  }, e.removeHooks = function(d) {
    H[d] = [];
  }, e.removeAllHooks = function() {
    H = Nn();
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
  return S(), C("svg", ca, [...e[0] || (e[0] = [
    O("path", { d: "M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" }, null, -1)
  ])]);
}
const pa = /* @__PURE__ */ Y(oa, [["render", ua]]), ha = {}, fa = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function da(s, e) {
  return S(), C("svg", fa, [...e[0] || (e[0] = [
    O("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }, null, -1)
  ])]);
}
const ga = /* @__PURE__ */ Y(ha, [["render", da]]), ma = {}, ka = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ba(s, e) {
  return S(), C("svg", ka, [...e[0] || (e[0] = [
    O("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }, null, -1)
  ])]);
}
const _a = /* @__PURE__ */ Y(ma, [["render", ba]]), xa = ["aria-label"], wa = {
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
    const e = s, n = le(Ce, void 0), r = $(() => n?.showBubbleHeaders ?? !0), t = $(() => n?.assistantBubbleFullWidth ?? !1), a = $(() => e.message.role === "user"), l = $(
      () => e.message.status === "failed" || e.message.id.startsWith("error-")
    ), c = $(() => e.message.status === "sending"), o = $(() => e.message.role === "assistant" && !l.value), p = $(() => {
      if (e.message.role !== "assistant" || l.value) return null;
      const b = A.parse(e.message.content);
      return la.sanitize(b);
    }), h = $(() => l.value ? "Error message" : a.value ? "Message from you" : "Message from AI Assistant"), g = X(!1);
    let m = null;
    async function y() {
      try {
        await navigator.clipboard.writeText(e.message.content), g.value = !0, m && clearTimeout(m), m = setTimeout(() => {
          g.value = !1;
        }, 1500);
      } catch {
      }
    }
    return Fn(() => {
      m && clearTimeout(m);
    }), (b, L) => (S(), C("li", {
      role: "listitem",
      "aria-label": h.value,
      class: Bt(["nc-message-bubble", {
        "nc-message-bubble--user": a.value,
        "nc-message-bubble--assistant": o.value,
        "nc-message-bubble--error": l.value,
        "nc-message-bubble--sending": c.value,
        "nc-message-bubble--flat": o.value && t.value,
        "nc-message-bubble--animate-in": e.animate
      }])
    }, [
      r.value ? (S(), C("div", wa, [
        a.value ? (S(), C("span", Ta, "You")) : l.value ? (S(), C(Mt, { key: 1 }, [
          R(pa, { class: "nc-message-bubble__warning-icon" }),
          L[0] || (L[0] = O("span", { class: "nc-message-bubble__label" }, "Error", -1))
        ], 64)) : (S(), C(Mt, { key: 2 }, [
          R(Un, {
            color: "secondary",
            size: "29"
          }, {
            default: F(() => [
              R(be, {
                icon: Ut,
                color: "white",
                size: "15"
              })
            ]),
            _: 1
          }),
          L[1] || (L[1] = O("span", { class: "nc-message-bubble__label" }, "AI Assistant", -1))
        ], 64))
      ])) : tt("", !0),
      O("div", va, [
        a.value || l.value ? (S(), C("div", ya, Lt(s.message.content), 1)) : (S(), C("div", {
          key: 1,
          class: "nc-message-bubble__content",
          innerHTML: p.value
        }, null, 8, Sa))
      ]),
      o.value ? (S(), he(He, {
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
          R(be, {
            icon: g.value ? _a : ga,
            size: "small",
            color: g.value ? "success" : "title"
          }, null, 8, ["icon", "color"])
        ]),
        _: 1
      }, 8, ["aria-label"])) : tt("", !0)
    ], 10, xa));
  }
}), Ea = /* @__PURE__ */ Y(Aa, [["__scopeId", "data-v-8550489a"]]), Ra = {}, Ca = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ia(s, e) {
  return S(), C("svg", Ca, [...e[0] || (e[0] = [
    O("path", { d: "M19.79 13.267a.75.75 0 0 0-1.086-1.034l-5.954 6.251V3.75a.75.75 0 1 0-1.5 0v14.734l-5.955-6.251a.75.75 0 0 0-1.086 1.034l7.067 7.42c.16.168.366.268.58.3a.753.753 0 0 0 .29-.001.995.995 0 0 0 .578-.3l7.067-7.419Z" }, null, -1)
  ])]);
}
const La = /* @__PURE__ */ Y(Ra, [["render", Ia]]), Ma = { class: "nc-message-list-wrapper" }, Da = {
  role: "list",
  "aria-live": "polite",
  class: "nc-message-list"
}, Oa = { class: "nc-message-list__loader" }, Na = { class: "nc-scroll-fab" }, $a = 50, Pa = /* @__PURE__ */ fe({
  __name: "MessageList",
  setup(s) {
    const e = le(Ie), n = at("scrollContainer"), r = X(!0), t = /* @__PURE__ */ new Set(), a = X(/* @__PURE__ */ new Set());
    let l = !1, c = !1, o = !1;
    ke(
      () => e.messages.value,
      (T) => {
        const k = /* @__PURE__ */ new Set();
        l && !c && T.forEach((w) => {
          t.has(w.id) || k.add(w.id);
        }), T.forEach((w) => t.add(w.id)), a.value = k;
      }
    );
    function p() {
      const T = n.value?.$el;
      return T instanceof HTMLElement ? T : null;
    }
    function h() {
      const T = p();
      if (!T) return;
      const { scrollTop: k, scrollHeight: w, clientHeight: U } = T;
      r.value = w - k - U <= $a;
    }
    function g() {
      const T = p();
      T && (T.scrollTop = T.scrollHeight);
    }
    let m = e.messages.value.length > 0 ? e.messages.value[e.messages.value.length - 1].id : null, y = !1, b = !1;
    ke(
      () => e.messages.value,
      (T) => {
        const k = T.length > 0 ? T[T.length - 1].id : null, w = k !== null && k !== m;
        m = k, w && (y ? b = !0 : pe(g));
      }
    ), zn(() => {
      e.messages.value.forEach((k) => t.add(k.id)), pe(() => {
        l = !0;
      }), e.messages.value.length > 0 ? pe(() => {
        g(), pe(() => {
          o = !0;
        });
      }) : o = !0, p()?.addEventListener("scroll", h, { passive: !0 });
    }), Fn(() => {
      p()?.removeEventListener("scroll", h);
    });
    async function L({ done: T }) {
      if (!o) {
        T("ok");
        return;
      }
      const k = p(), w = k != null && k.scrollHeight > k.clientHeight;
      if (r.value && w) {
        T("ok");
        return;
      }
      c = !0, y = !0;
      try {
        await e.loadMore(), T(e.hasMore.value ? "ok" : "empty");
      } catch {
        T("error");
      }
      await pe(), c = !1, y = !1, b && (b = !1, pe(g));
    }
    return (T, k) => (S(), C("div", Ma, [
      R(Rs, {
        ref: "scrollContainer",
        side: "start",
        class: "nc-message-list-scroll",
        onLoad: L
      }, {
        loading: F(() => [
          O("div", Oa, [
            R(Hn, {
              indeterminate: "",
              size: "24",
              width: "2"
            })
          ])
        ]),
        empty: F(() => [...k[0] || (k[0] = [])]),
        default: F(() => [
          O("ul", Da, [
            (S(!0), C(Mt, null, vs(ne(e).messages.value, (w) => (S(), he(Ea, {
              key: w.id,
              message: w,
              animate: a.value.has(w.id)
            }, null, 8, ["message", "animate"]))), 128))
          ])
        ]),
        _: 1
      }, 512),
      R(Ft, { name: "nc-scroll-fab" }, {
        default: F(() => [
          $n(O("div", Na, [
            R(He, {
              icon: "",
              variant: "elevated",
              color: "surface",
              size: "small",
              "aria-label": "Scroll to latest messages",
              onClick: g
            }, {
              default: F(() => [
                R(be, { icon: La })
              ]),
              _: 1
            })
          ], 512), [
            [Pn, !r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}), za = /* @__PURE__ */ Y(Pa, [["__scopeId", "data-v-9c7458b2"]]), Ba = {}, Fa = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ua(s, e) {
  return S(), C("svg", Fa, [...e[0] || (e[0] = [
    O("path", { d: "m12.815 12.197-7.532 1.256a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.943l18-9a.75.75 0 0 0 0-1.342l-18-9c-.614-.307-1.283.304-1.035.943l2.598 6.957a.5.5 0 0 0 .386.319l7.532 1.255a.2.2 0 0 1 0 .394Z" }, null, -1)
  ])]);
}
const Ha = /* @__PURE__ */ Y(Ba, [["render", Ua]]), Wa = { class: "nc-chat-input" }, Ga = /* @__PURE__ */ fe({
  __name: "ChatInput",
  setup(s) {
    const e = le(Ie), n = le(Ce), r = $(() => n?.placeholder ?? "Type your message..."), t = X(""), a = at("textareaRef"), l = $(() => t.value.trim().length > 0);
    async function c() {
      const p = t.value.trim();
      if (!(!p || e.isSending.value)) {
        t.value = "";
        try {
          await e.sendMessage(p);
        } catch {
        }
      }
    }
    function o(p) {
      p.key === "Enter" && !p.shiftKey && (p.preventDefault(), c());
    }
    return ke(
      () => e.failedMessageText.value,
      (p) => {
        p && (t.value = p);
      }
    ), ke(
      () => e.isOpen.value,
      (p) => {
        p && pe(() => {
          a.value?.focus();
        });
      },
      { immediate: !0 }
    ), ke(
      () => e.isSending.value,
      (p, h) => {
        h && !p && pe(() => {
          a.value?.focus();
        });
      }
    ), (p, h) => (S(), C("div", Wa, [
      R(Cs, {
        ref_key: "textareaRef",
        ref: a,
        modelValue: t.value,
        "onUpdate:modelValue": h[0] || (h[0] = (g) => t.value = g),
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
          R(He, {
            icon: "",
            variant: "text",
            density: "comfortable",
            color: l.value || ne(e).isSending.value ? "primary" : void 0,
            disabled: !l.value && !ne(e).isSending.value,
            loading: ne(e).isSending.value,
            "aria-label": "Send message",
            onClick: c
          }, {
            default: F(() => [
              R(be, {
                icon: Ha,
                color: "secondary"
              })
            ]),
            _: 1
          }, 8, ["color", "disabled", "loading"])
        ]),
        _: 1
      }, 8, ["modelValue", "placeholder", "disabled"])
    ]));
  }
}), qa = /* @__PURE__ */ Y(Ga, [["__scopeId", "data-v-2783eac4"]]), Za = { class: "nc-chat-panel__body" }, Ya = /* @__PURE__ */ fe({
  __name: "ChatPanel",
  setup(s) {
    const e = le(Ie), n = le(Ce), r = $(() => n?.welcomeMessage), t = As(), a = $(() => t.width.value < 768), l = (c) => {
      c.key === "Escape" && e.isOpen.value && e.close();
    };
    return ke(
      () => e.isOpen.value,
      (c) => {
        c ? window.addEventListener("keydown", l) : window.removeEventListener("keydown", l);
      },
      { immediate: !0 }
    ), Bn(() => {
      window.removeEventListener("keydown", l);
    }), (c, o) => (S(), he(ys, { to: "body" }, [
      R(Ft, { name: "nc-panel" }, {
        default: F(() => [
          ne(e).isOpen.value ? (S(), he(Wn, {
            key: 0,
            theme: "nativeChat",
            "with-background": "",
            class: Bt(["nc-chat-panel border-md", { "nc-chat-panel--mobile": a.value }]),
            role: "complementary",
            "aria-label": "Chat with AI Assistant"
          }, {
            default: F(() => [
              R(Ws),
              O("div", Za, [
                ne(e).isLoading.value && ne(e).messages.value.length === 0 ? (S(), he(Hn, {
                  key: 0,
                  indeterminate: "",
                  size: "24",
                  class: "nc-chat-panel__loader"
                })) : ne(e).messages.value.length === 0 && !ne(e).isSending.value ? (S(), he(Xs, {
                  key: 1,
                  message: r.value
                }, null, 8, ["message"])) : (S(), he(za, { key: 2 }))
              ]),
              R(qa)
            ]),
            _: 1
          }, 8, ["class"])) : tt("", !0)
        ]),
        _: 1
      })
    ]));
  }
}), Va = /* @__PURE__ */ Y(Ya, [["__scopeId", "data-v-39979cf7"]]), ja = /* @__PURE__ */ fe({
  __name: "NativeChatWidget",
  setup(s) {
    const e = Es();
    if (!e.themes.value.nativeChat) {
      const a = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...a,
        ...yt,
        colors: {
          ...a.colors,
          ...yt.colors
        },
        variables: {
          ...a.variables,
          ...yt.variables
        }
      };
    }
    const n = le(Ce), r = Ls(n.apiClient, n);
    Ss(Ie, r);
    const t = at("floatingButtonRef");
    return ke(
      () => r.isOpen.value,
      (a) => {
        a || pe(() => {
          t.value?.focus();
        });
      }
    ), (a, l) => (S(), he(Wn, { theme: "nativeChat" }, {
      default: F(() => [
        R(Bs, {
          ref_key: "floatingButtonRef",
          ref: t
        }, null, 512),
        R(Va)
      ]),
      _: 1
    }));
  }
}), Xa = /* @__PURE__ */ Y(ja, [["__scopeId", "data-v-492f08ed"]]), ii = {
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
      const r = (await e.post("/api/v1/conversations", {})).data;
      return {
        id: r.conversation_id,
        createdAt: r.created_at
      };
    },
    async getConversations(n, r) {
      const a = (await e.get("/api/v1/conversations", {
        params: { offset: n, limit: r }
      })).data;
      return {
        conversations: a.items.map((l) => ({
          id: l.conversation_id,
          createdAt: l.created_at
        })),
        hasMore: a.pagination?.has_more ?? !1
      };
    },
    async getMessages(n, r, t) {
      const l = (await e.get(
        `/api/v1/conversations/${encodeURIComponent(n)}/messages`,
        { params: { offset: r, limit: t } }
      )).data;
      return {
        messages: l.items.map((c) => ({
          id: c.message_id,
          conversationId: n,
          role: c.sender,
          content: c.content,
          createdAt: c.created_at
        })),
        hasMore: l.pagination?.has_more ?? !1
      };
    },
    async sendMessage(n, r) {
      const a = (await e.post(
        `/api/v1/conversations/${encodeURIComponent(n)}/messages`,
        { message: r }
      )).data;
      return {
        userMessage: {
          id: a.user_message_id,
          conversationId: a.conversation_id,
          role: "user",
          content: a.user_message,
          createdAt: a.timestamp
        },
        assistantMessage: {
          id: a.assistant_message_id,
          conversationId: a.conversation_id,
          role: "assistant",
          content: a.assistant_response,
          createdAt: a.timestamp
        }
      };
    }
  };
}
export {
  ii as NativeChatPlugin,
  Xa as NativeChatWidget,
  li as createNativeChatApiClient,
  ii as default
};
