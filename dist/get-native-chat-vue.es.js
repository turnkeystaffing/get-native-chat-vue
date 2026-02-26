import { ref as Q, readonly as Re, openBlock as v, createElementBlock as C, createElementVNode as P, defineComponent as fe, inject as pe, computed as H, useTemplateRef as rt, withDirectives as $n, normalizeClass as zt, createVNode as E, withCtx as B, Transition as Bt, vShow as Pn, unref as ne, toDisplayString as zn, onBeforeUnmount as Bn, Fragment as It, createCommentVNode as Lt, createBlock as le, watch as ke, nextTick as he, onMounted as ws, renderList as Ts, onUnmounted as vs, Teleport as ys, provide as Ss } from "vue";
import { useDisplay as As, useTheme as Es } from "vuetify";
import { VBtn as Ue } from "vuetify/components/VBtn";
import { VIcon as be } from "vuetify/components/VIcon";
import { VAvatar as Fn } from "vuetify/components/VAvatar";
import { VInfiniteScroll as Rs } from "vuetify/components/VInfiniteScroll";
import { VProgressCircular as Ft } from "vuetify/components/VProgressCircular";
import { VTextarea as Cs } from "vuetify/components/VTextarea";
import { VThemeProvider as Un } from "vuetify/components/VThemeProvider";
const He = /* @__PURE__ */ Symbol("native-chat-config"), Ce = /* @__PURE__ */ Symbol("native-chat-state");
function Hn(s) {
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
  const e = Hn(s);
  return e === 429 ? "You're sending messages too quickly. Please wait a moment and try again." : e === 503 || e === 504 ? "The service is temporarily unavailable. Please try again in a moment." : "Something went wrong. You can try sending your message again.";
}
function Ls(s, e) {
  const n = Q([]), r = Q(!1), t = Q(!1), l = Q(!1), i = Q(!1), c = Q(null), o = Q(null), h = Q(0), p = e.batchSize ?? 20;
  function m(x, M, j) {
    n.value = n.value.filter((Y) => Y.id !== j && !Y.id.startsWith("error-"));
    const T = Is(x), X = {
      id: `error-${Date.now()}`,
      conversationId: o.value ?? "",
      role: "assistant",
      content: T,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "failed"
    };
    if (n.value = [...n.value, X], c.value = null, c.value = M, e.onError)
      try {
        Promise.resolve(
          e.onError({
            message: T,
            statusCode: Hn(x),
            originalError: x
          })
        ).catch(() => {
        });
      } catch {
      }
  }
  async function g() {
    if (!(r.value || t.value)) {
      t.value = !0;
      try {
        if (e.conversationId)
          o.value = e.conversationId;
        else {
          const j = await s.getConversations(0, 1);
          if (j.conversations.length > 0)
            o.value = j.conversations[0].id;
          else {
            const T = await s.createConversation();
            o.value = T.id;
          }
        }
        const x = await s.getMessages(o.value, 0, p), M = [...x.messages].reverse();
        n.value = M, i.value = x.has_more, h.value = M.length;
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
    if (!x.trim() || l.value) return;
    l.value = !0;
    const M = `temp-${Date.now()}`, j = {
      id: M,
      conversationId: o.value ?? "",
      role: "user",
      content: x,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sending"
    };
    if (n.value = [...n.value, j], !o.value)
      try {
        const T = await s.createConversation();
        o.value = T.id;
      } catch (T) {
        m(T, x, M), l.value = !1;
        return;
      }
    try {
      const T = await s.sendMessage(o.value, x), X = {
        ...T.userMessage,
        status: "sent"
      }, Y = {
        ...T.assistantMessage
      };
      n.value = [
        ...n.value.filter((lt) => lt.id !== M),
        X,
        Y
      ], c.value = null;
    } catch (T) {
      m(T, x, M);
    } finally {
      l.value = !1;
    }
  }
  async function k() {
    if (!(!i.value || t.value || !o.value)) {
      t.value = !0;
      try {
        const x = await s.getMessages(
          o.value,
          h.value,
          p
        ), M = [...x.messages].reverse();
        n.value = [...M, ...n.value], h.value += M.length, i.value = x.has_more;
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
    isSending: Re(l),
    hasMore: Re(i),
    failedMessageText: Re(c),
    open: g,
    close: y,
    sendMessage: _,
    loadMore: k,
    retry: I
  };
}
const vt = {
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
  return v(), C("svg", Ds, [...e[0] || (e[0] = [
    P("path", { d: "M10.788 3.103c.495-1.004 1.926-1.004 2.421 0l2.358 4.777 5.273.766c1.107.161 1.549 1.522.748 2.303l-3.816 3.72.901 5.25c.19 1.103-.968 1.944-1.959 1.424l-4.716-2.48-4.715 2.48c-.99.52-2.148-.32-1.96-1.424l.901-5.25-3.815-3.72c-.801-.78-.359-2.142.748-2.303L8.43 7.88l2.358-4.777Zm1.21.936L9.74 8.615a1.35 1.35 0 0 1-1.016.738l-5.05.734 3.654 3.562c.318.31.463.757.388 1.195l-.862 5.03 4.516-2.375a1.35 1.35 0 0 1 1.257 0l4.516 2.374-.862-5.029a1.35 1.35 0 0 1 .388-1.195l3.654-3.562-5.05-.734a1.35 1.35 0 0 1-1.016-.738l-2.259-4.576Z" }, null, -1)
  ])]);
}
const Ut = /* @__PURE__ */ Z(Ms, [["render", Os]]), Ns = {}, $s = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ps(s, e) {
  return v(), C("svg", $s, [...e[0] || (e[0] = [
    P("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const Wn = /* @__PURE__ */ Z(Ns, [["render", Ps]]), zs = /* @__PURE__ */ fe({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const n = pe(He), r = pe(Ce), t = H(() => r.isOpen.value), l = H(() => t.value && (n?.hideToggleWhenOpen ?? !1)), i = H(() => n?.position ?? "bottom-right"), c = H(
      () => `nc-floating-button-wrapper--${i.value === "bottom-left" ? "left" : "right"}`
    );
    function o() {
      r.isOpen.value ? r.close() : r.open();
    }
    const h = rt("triggerBtn");
    function p() {
      h.value?.$el?.focus();
    }
    return e({ focus: p }), (m, g) => $n((v(), C("div", {
      class: zt(["nc-floating-button-wrapper", c.value])
    }, [
      E(Ue, {
        ref_key: "triggerBtn",
        ref: h,
        icon: "",
        size: "56",
        color: "secondary",
        elevation: "4",
        "aria-label": t.value ? "Close chat" : "Open chat",
        "aria-expanded": t.value.toString(),
        onClick: o
      }, {
        default: B(() => [
          E(Bt, {
            name: "nc-fab-icon",
            mode: "out-in"
          }, {
            default: B(() => [
              (v(), C("span", {
                key: t.value ? "close" : "star",
                class: "nc-floating-button__icon-wrap"
              }, [
                E(be, {
                  icon: t.value ? Wn : Ut,
                  color: "white"
                }, null, 8, ["icon"])
              ]))
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["aria-label", "aria-expanded"])
    ], 2)), [
      [Pn, !l.value]
    ]);
  }
}), Bs = /* @__PURE__ */ Z(zs, [["__scopeId", "data-v-ac00f54f"]]), Fs = { class: "nc-chat-header" }, Us = { class: "nc-chat-header__left" }, Hs = /* @__PURE__ */ fe({
  __name: "ChatHeader",
  setup(s) {
    const e = pe(Ce);
    return (n, r) => (v(), C("div", Fs, [
      P("div", Us, [
        E(Fn, {
          color: "secondary",
          size: "44"
        }, {
          default: B(() => [
            E(be, {
              icon: Ut,
              color: "white",
              size: "20"
            })
          ]),
          _: 1
        }),
        r[1] || (r[1] = P("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
      ]),
      E(Ue, {
        icon: "",
        variant: "text",
        size: "default",
        "aria-label": "Close chat",
        onClick: r[0] || (r[0] = (t) => ne(e).close())
      }, {
        default: B(() => [
          E(be, {
            icon: Wn,
            size: "22"
          })
        ]),
        _: 1
      })
    ]));
  }
}), Ws = /* @__PURE__ */ Z(Hs, [["__scopeId", "data-v-20f4b784"]]), Gs = { class: "nc-welcome-state" }, qs = { class: "nc-welcome-state__text" }, Zs = /* @__PURE__ */ fe({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(s) {
    return (e, n) => (v(), C("div", Gs, [
      P("p", qs, zn(s.message ?? "Hello! How can I help you?"), 1)
    ]));
  }
}), Ys = /* @__PURE__ */ Z(Zs, [["__scopeId", "data-v-6d3eccea"]]);
function Ht() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var xe = Ht();
function Gn(s) {
  xe = s;
}
var me = { exec: () => null };
function w(s, e = "") {
  let n = typeof s == "string" ? s : s.source, r = { replace: (t, l) => {
    let i = typeof l == "string" ? l : l.source;
    return i = i.replace(W.caret, "$1"), n = n.replace(t, i), r;
  }, getRegex: () => new RegExp(n, e) };
  return r;
}
var Vs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), W = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}>`) }, js = /^(?:[ \t]*(?:\n|$))+/, Xs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Qs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, We = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ks = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Wt = / {0,3}(?:[*+-]|\d{1,9}[.)])/, qn = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Zn = w(qn).replace(/bull/g, Wt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Js = w(qn).replace(/bull/g, Wt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Gt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, er = /^[^\n]+/, qt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, tr = w(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", qt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), nr = w(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Wt).getRegex(), at = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Zt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, sr = w("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Zt).replace("tag", at).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Yn = w(Gt).replace("hr", We).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", at).getRegex(), rr = w(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Yn).getRegex(), Yt = { blockquote: rr, code: Xs, def: tr, fences: Qs, heading: Ks, hr: We, html: sr, lheading: Zn, list: nr, newline: js, paragraph: Yn, table: me, text: er }, Tn = w("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", We).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", at).getRegex(), ar = { ...Yt, lheading: Js, table: Tn, paragraph: w(Gt).replace("hr", We).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Tn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", at).getRegex() }, ir = { ...Yt, html: w(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Zt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: me, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: w(Gt).replace("hr", We).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Zn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, lr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, or = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Vn = /^( {2,}|\\)\n(?!\s*$)/, cr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, it = /[\p{P}\p{S}]/u, Vt = /[\s\p{P}\p{S}]/u, jn = /[^\s\p{P}\p{S}]/u, ur = w(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Vt).getRegex(), Xn = /(?!~)[\p{P}\p{S}]/u, pr = /(?!~)[\s\p{P}\p{S}]/u, hr = /(?:[^\s\p{P}\p{S}]|~)/u, Qn = /(?![*_])[\p{P}\p{S}]/u, fr = /(?![*_])[\s\p{P}\p{S}]/u, dr = /(?:[^\s\p{P}\p{S}]|[*_])/u, gr = w(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Vs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Kn = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, mr = w(Kn, "u").replace(/punct/g, it).getRegex(), kr = w(Kn, "u").replace(/punct/g, Xn).getRegex(), Jn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", br = w(Jn, "gu").replace(/notPunctSpace/g, jn).replace(/punctSpace/g, Vt).replace(/punct/g, it).getRegex(), _r = w(Jn, "gu").replace(/notPunctSpace/g, hr).replace(/punctSpace/g, pr).replace(/punct/g, Xn).getRegex(), xr = w("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, jn).replace(/punctSpace/g, Vt).replace(/punct/g, it).getRegex(), wr = w(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Qn).getRegex(), Tr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", vr = w(Tr, "gu").replace(/notPunctSpace/g, dr).replace(/punctSpace/g, fr).replace(/punct/g, Qn).getRegex(), yr = w(/\\(punct)/, "gu").replace(/punct/g, it).getRegex(), Sr = w(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Ar = w(Zt).replace("(?:-->|$)", "-->").getRegex(), Er = w("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Ar).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), tt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, Rr = w(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", tt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), es = w(/^!?\[(label)\]\[(ref)\]/).replace("label", tt).replace("ref", qt).getRegex(), ts = w(/^!?\[(ref)\](?:\[\])?/).replace("ref", qt).getRegex(), Cr = w("reflink|nolink(?!\\()", "g").replace("reflink", es).replace("nolink", ts).getRegex(), vn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, jt = { _backpedal: me, anyPunctuation: yr, autolink: Sr, blockSkip: gr, br: Vn, code: or, del: me, delLDelim: me, delRDelim: me, emStrongLDelim: mr, emStrongRDelimAst: br, emStrongRDelimUnd: xr, escape: lr, link: Rr, nolink: ts, punctuation: ur, reflink: es, reflinkSearch: Cr, tag: Er, text: cr, url: me }, Ir = { ...jt, link: w(/^!?\[(label)\]\((.*?)\)/).replace("label", tt).getRegex(), reflink: w(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", tt).getRegex() }, Mt = { ...jt, emStrongRDelimAst: _r, emStrongLDelim: kr, delLDelim: wr, delRDelim: vr, url: w(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", vn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: w(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", vn).getRegex() }, Lr = { ...Mt, br: w(Vn).replace("{2,}", "*").getRegex(), text: w(Mt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Qe = { normal: Yt, gfm: ar, pedantic: ir }, De = { normal: jt, gfm: Mt, breaks: Lr, pedantic: Ir }, Mr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, yn = (s) => Mr[s];
function ae(s, e) {
  if (e) {
    if (W.escapeTest.test(s)) return s.replace(W.escapeReplace, yn);
  } else if (W.escapeTestNoEncode.test(s)) return s.replace(W.escapeReplaceNoEncode, yn);
  return s;
}
function Sn(s) {
  try {
    s = encodeURI(s).replace(W.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function An(s, e) {
  let n = s.replace(W.findPipe, (l, i, c) => {
    let o = !1, h = i;
    for (; --h >= 0 && c[h] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = n.split(W.splitPipe), t = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; t < r.length; t++) r[t] = r[t].trim().replace(W.slashPipe, "|");
  return r;
}
function Oe(s, e, n) {
  let r = s.length;
  if (r === 0) return "";
  let t = 0;
  for (; t < r && s.charAt(r - t - 1) === e; )
    t++;
  return s.slice(0, r - t);
}
function Dr(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < s.length; r++) if (s[r] === "\\") r++;
  else if (s[r] === e[0]) n++;
  else if (s[r] === e[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function Or(s, e = 0) {
  let n = e, r = "";
  for (let t of s) if (t === "	") {
    let l = 4 - n % 4;
    r += " ".repeat(l), n += l;
  } else r += t, n++;
  return r;
}
function En(s, e, n, r, t) {
  let l = e.href, i = e.title || null, c = s[1].replace(t.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let o = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: n, href: l, title: i, text: c, tokens: r.inlineTokens(c) };
  return r.state.inLink = !1, o;
}
function Nr(s, e, n) {
  let r = s.match(n.other.indentCodeCompensation);
  if (r === null) return e;
  let t = r[1];
  return e.split(`
`).map((l) => {
    let i = l.match(n.other.beginningSpace);
    if (i === null) return l;
    let [c] = i;
    return c.length >= t.length ? l.slice(t.length) : l;
  }).join(`
`);
}
var nt = class {
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
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : Oe(n, `
`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let n = e[0], r = Nr(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = Oe(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: Oe(e[0], `
`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let n = Oe(e[0], `
`).split(`
`), r = "", t = "", l = [];
      for (; n.length > 0; ) {
        let i = !1, c = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) c.push(n[o]), i = !0;
        else if (!i) c.push(n[o]);
        else break;
        n = n.slice(o);
        let h = c.join(`
`), p = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${h}` : h, t = t ? `${t}
${p}` : p;
        let m = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(p, l, !0), this.lexer.state.top = m, n.length === 0) break;
        let g = l.at(-1);
        if (g?.type === "code") break;
        if (g?.type === "blockquote") {
          let y = g, _ = y.raw + `
` + n.join(`
`), k = this.blockquote(_);
          l[l.length - 1] = k, r = r.substring(0, r.length - y.raw.length) + k.raw, t = t.substring(0, t.length - y.text.length) + k.text;
          break;
        } else if (g?.type === "list") {
          let y = g, _ = y.raw + `
` + n.join(`
`), k = this.list(_);
          l[l.length - 1] = k, r = r.substring(0, r.length - g.raw.length) + k.raw, t = t.substring(0, t.length - y.raw.length) + k.raw, n = _.substring(l.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: l, text: t };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let n = e[1].trim(), r = n.length > 1, t = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let l = this.rules.other.listItemRegex(n), i = !1;
      for (; s; ) {
        let o = !1, h = "", p = "";
        if (!(e = l.exec(s)) || this.rules.block.hr.test(s)) break;
        h = e[0], s = s.substring(h.length);
        let m = Or(e[2].split(`
`, 1)[0], e[1].length), g = s.split(`
`, 1)[0], y = !m.trim(), _ = 0;
        if (this.options.pedantic ? (_ = 2, p = m.trimStart()) : y ? _ = e[1].length + 1 : (_ = m.search(this.rules.other.nonSpaceChar), _ = _ > 4 ? 1 : _, p = m.slice(_), _ += e[1].length), y && this.rules.other.blankLine.test(g) && (h += g + `
`, s = s.substring(g.length + 1), o = !0), !o) {
          let k = this.rules.other.nextBulletRegex(_), I = this.rules.other.hrRegex(_), x = this.rules.other.fencesBeginRegex(_), M = this.rules.other.headingBeginRegex(_), j = this.rules.other.htmlBeginRegex(_), T = this.rules.other.blockquoteBeginRegex(_);
          for (; s; ) {
            let X = s.split(`
`, 1)[0], Y;
            if (g = X, this.options.pedantic ? (g = g.replace(this.rules.other.listReplaceNesting, "  "), Y = g) : Y = g.replace(this.rules.other.tabCharGlobal, "    "), x.test(g) || M.test(g) || j.test(g) || T.test(g) || k.test(g) || I.test(g)) break;
            if (Y.search(this.rules.other.nonSpaceChar) >= _ || !g.trim()) p += `
` + Y.slice(_);
            else {
              if (y || m.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || x.test(m) || M.test(m) || I.test(m)) break;
              p += `
` + g;
            }
            y = !g.trim(), h += X + `
`, s = s.substring(X.length + 1), m = Y.slice(_);
          }
        }
        t.loose || (i ? t.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (i = !0)), t.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(p), loose: !1, text: p, tokens: [] }), t.raw += h;
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
          let h = o.tokens.filter((m) => m.type === "space"), p = h.length > 0 && h.some((m) => this.rules.other.anyLine.test(m.raw));
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
    let n = An(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let i of r) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < n.length; i++) l.header.push({ text: n[i], tokens: this.lexer.inline(n[i]), header: !0, align: l.align[i] });
      for (let i of t) l.rows.push(An(i, l.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: l.align[o] })));
      return l;
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
        let l = Oe(n.slice(0, -1), "\\");
        if ((n.length - l.length) % 2 === 0) return;
      } else {
        let l = Dr(e[2], "()");
        if (l === -2) return;
        if (l > -1) {
          let i = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + l;
          e[2] = e[2].substring(0, l), e[0] = e[0].substring(0, i).trim(), e[3] = "";
        }
      }
      let r = e[2], t = "";
      if (this.options.pedantic) {
        let l = this.rules.other.pedanticHrefTitle.exec(r);
        l && (r = l[1], t = l[3]);
      } else t = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), En(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(s)) || (n = this.rules.inline.nolink.exec(s))) {
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), t = e[r.toLowerCase()];
      if (!t) {
        let l = n[0].charAt(0);
        return { type: "text", raw: l, text: l };
      }
      return En(n, t, n[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let t = [...r[0]].length - 1, l, i, c = t, o = 0, h = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = h.exec(e)) != null; ) {
        if (l = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !l) continue;
        if (i = [...l].length, r[3] || r[4]) {
          c += i;
          continue;
        } else if ((r[5] || r[6]) && t % 3 && !((t + i) % 3)) {
          o += i;
          continue;
        }
        if (c -= i, c > 0) continue;
        i = Math.min(i, i + c + o);
        let p = [...r[0]][0].length, m = s.slice(0, t + r.index + p + i);
        if (Math.min(t, i) % 2) {
          let y = m.slice(1, -1);
          return { type: "em", raw: m, text: y, tokens: this.lexer.inlineTokens(y) };
        }
        let g = m.slice(2, -2);
        return { type: "strong", raw: m, text: g, tokens: this.lexer.inlineTokens(g) };
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
      let t = [...r[0]].length - 1, l, i, c = t, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = o.exec(e)) != null; ) {
        if (l = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !l || (i = [...l].length, i !== t)) continue;
        if (r[3] || r[4]) {
          c += i;
          continue;
        }
        if (c -= i, c > 0) continue;
        i = Math.min(i, i + c);
        let h = [...r[0]][0].length, p = s.slice(0, t + r.index + h + i), m = p.slice(t, -t);
        return { type: "del", raw: p, text: m, tokens: this.lexer.inlineTokens(m) };
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
}, ee = class Dt {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || xe, this.options.tokenizer = this.options.tokenizer || new nt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: W, block: Qe.normal, inline: De.normal };
    this.options.pedantic ? (n.block = Qe.pedantic, n.inline = De.pedantic) : this.options.gfm && (n.block = Qe.gfm, this.options.breaks ? n.inline = De.breaks : n.inline = De.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Qe, inline: De };
  }
  static lex(e, n) {
    return new Dt(n).lex(e);
  }
  static lexInline(e, n) {
    return new Dt(n).inlineTokens(e);
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
      if (this.options.extensions?.block?.some((i) => (t = i.call({ lexer: this }, e, n)) ? (e = e.substring(t.raw.length), n.push(t), !0) : !1)) continue;
      if (t = this.tokenizer.space(e)) {
        e = e.substring(t.raw.length);
        let i = n.at(-1);
        t.raw.length === 1 && i !== void 0 ? i.raw += `
` : n.push(t);
        continue;
      }
      if (t = this.tokenizer.code(e)) {
        e = e.substring(t.raw.length);
        let i = n.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + t.raw, i.text += `
` + t.text, this.inlineQueue.at(-1).src = i.text) : n.push(t);
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
        let i = n.at(-1);
        i?.type === "paragraph" || i?.type === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + t.raw, i.text += `
` + t.raw, this.inlineQueue.at(-1).src = i.text) : this.tokens.links[t.tag] || (this.tokens.links[t.tag] = { href: t.href, title: t.title }, n.push(t));
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
      let l = e;
      if (this.options.extensions?.startBlock) {
        let i = 1 / 0, c = e.slice(1), o;
        this.options.extensions.startBlock.forEach((h) => {
          o = h.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (i = Math.min(i, o));
        }), i < 1 / 0 && i >= 0 && (l = e.substring(0, i + 1));
      }
      if (this.state.top && (t = this.tokenizer.paragraph(l))) {
        let i = n.at(-1);
        r && i?.type === "paragraph" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + t.raw, i.text += `
` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : n.push(t), r = l.length !== e.length, e = e.substring(t.raw.length);
        continue;
      }
      if (t = this.tokenizer.text(e)) {
        e = e.substring(t.raw.length);
        let i = n.at(-1);
        i?.type === "text" ? (i.raw += (i.raw.endsWith(`
`) ? "" : `
`) + t.raw, i.text += `
` + t.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = i.text) : n.push(t);
        continue;
      }
      if (e) {
        let i = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(i);
          break;
        } else throw new Error(i);
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
    let l;
    for (; (t = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; ) l = t[2] ? t[2].length : 0, r = r.slice(0, t.index + l) + "[" + "a".repeat(t[0].length - l - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let i = !1, c = "";
    for (; e; ) {
      i || (c = ""), i = !1;
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
        let p = 1 / 0, m = e.slice(1), g;
        this.options.extensions.startInline.forEach((y) => {
          g = y.call({ lexer: this }, m), typeof g == "number" && g >= 0 && (p = Math.min(p, g));
        }), p < 1 / 0 && p >= 0 && (h = e.substring(0, p + 1));
      }
      if (o = this.tokenizer.inlineText(h)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (c = o.raw.slice(-1)), i = !0;
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
}, st = class {
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
    for (let i = 0; i < s.items.length; i++) {
      let c = s.items[i];
      r += this.listitem(c);
    }
    let t = e ? "ol" : "ul", l = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + t + l + `>
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
      let l = s.rows[t];
      n = "";
      for (let i = 0; i < l.length; i++) n += this.tablecell(l[i]);
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
    let l = '<a href="' + s + '"';
    return e && (l += ' title="' + ae(e) + '"'), l += ">" + r + "</a>", l;
  }
  image({ href: s, title: e, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let t = Sn(s);
    if (t === null) return ae(n);
    s = t;
    let l = `<img src="${s}" alt="${ae(n)}"`;
    return e && (l += ` title="${ae(e)}"`), l += ">", l;
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
}, te = class Ot {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || xe, this.options.renderer = this.options.renderer || new st(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Xt();
  }
  static parse(e, n) {
    return new Ot(n).parse(e);
  }
  static parseInline(e, n) {
    return new Ot(n).parseInline(e);
  }
  parse(e) {
    let n = "";
    for (let r = 0; r < e.length; r++) {
      let t = e[r];
      if (this.options.extensions?.renderers?.[t.type]) {
        let i = t, c = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(i.type)) {
          n += c || "";
          continue;
        }
      }
      let l = t;
      switch (l.type) {
        case "space": {
          n += this.renderer.space(l);
          break;
        }
        case "hr": {
          n += this.renderer.hr(l);
          break;
        }
        case "heading": {
          n += this.renderer.heading(l);
          break;
        }
        case "code": {
          n += this.renderer.code(l);
          break;
        }
        case "table": {
          n += this.renderer.table(l);
          break;
        }
        case "blockquote": {
          n += this.renderer.blockquote(l);
          break;
        }
        case "list": {
          n += this.renderer.list(l);
          break;
        }
        case "checkbox": {
          n += this.renderer.checkbox(l);
          break;
        }
        case "html": {
          n += this.renderer.html(l);
          break;
        }
        case "def": {
          n += this.renderer.def(l);
          break;
        }
        case "paragraph": {
          n += this.renderer.paragraph(l);
          break;
        }
        case "text": {
          n += this.renderer.text(l);
          break;
        }
        default: {
          let i = 'Token with "' + l.type + '" type was not found.';
          if (this.options.silent) return console.error(i), "";
          throw new Error(i);
        }
      }
    }
    return n;
  }
  parseInline(e, n = this.renderer) {
    let r = "";
    for (let t = 0; t < e.length; t++) {
      let l = e[t];
      if (this.options.extensions?.renderers?.[l.type]) {
        let c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(l.type)) {
          r += c || "";
          continue;
        }
      }
      let i = l;
      switch (i.type) {
        case "escape": {
          r += n.text(i);
          break;
        }
        case "html": {
          r += n.html(i);
          break;
        }
        case "link": {
          r += n.link(i);
          break;
        }
        case "image": {
          r += n.image(i);
          break;
        }
        case "checkbox": {
          r += n.checkbox(i);
          break;
        }
        case "strong": {
          r += n.strong(i);
          break;
        }
        case "em": {
          r += n.em(i);
          break;
        }
        case "codespan": {
          r += n.codespan(i);
          break;
        }
        case "br": {
          r += n.br(i);
          break;
        }
        case "del": {
          r += n.del(i);
          break;
        }
        case "text": {
          r += n.text(i);
          break;
        }
        default: {
          let c = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return r;
  }
}, Fe = class {
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
}, $r = class {
  defaults = Ht();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = te;
  Renderer = st;
  TextRenderer = Xt;
  Lexer = ee;
  Tokenizer = nt;
  Hooks = Fe;
  constructor(...s) {
    this.use(...s);
  }
  walkTokens(s, e) {
    let n = [];
    for (let r of s) switch (n = n.concat(e.call(this, r)), r.type) {
      case "table": {
        let t = r;
        for (let l of t.header) n = n.concat(this.walkTokens(l.tokens, e));
        for (let l of t.rows) for (let i of l) n = n.concat(this.walkTokens(i.tokens, e));
        break;
      }
      case "list": {
        let t = r;
        n = n.concat(this.walkTokens(t.items, e));
        break;
      }
      default: {
        let t = r;
        this.defaults.extensions?.childTokens?.[t.type] ? this.defaults.extensions.childTokens[t.type].forEach((l) => {
          let i = t[l].flat(1 / 0);
          n = n.concat(this.walkTokens(i, e));
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
          let l = e.renderers[t.name];
          l ? e.renderers[t.name] = function(...i) {
            let c = t.renderer.apply(this, i);
            return c === !1 && (c = l.apply(this, i)), c;
          } : e.renderers[t.name] = t.renderer;
        }
        if ("tokenizer" in t) {
          if (!t.level || t.level !== "block" && t.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let l = e[t.level];
          l ? l.unshift(t.tokenizer) : e[t.level] = [t.tokenizer], t.start && (t.level === "block" ? e.startBlock ? e.startBlock.push(t.start) : e.startBlock = [t.start] : t.level === "inline" && (e.startInline ? e.startInline.push(t.start) : e.startInline = [t.start]));
        }
        "childTokens" in t && t.childTokens && (e.childTokens[t.name] = t.childTokens);
      }), r.extensions = e), n.renderer) {
        let t = this.defaults.renderer || new st(this.defaults);
        for (let l in n.renderer) {
          if (!(l in t)) throw new Error(`renderer '${l}' does not exist`);
          if (["options", "parser"].includes(l)) continue;
          let i = l, c = n.renderer[i], o = t[i];
          t[i] = (...h) => {
            let p = c.apply(t, h);
            return p === !1 && (p = o.apply(t, h)), p || "";
          };
        }
        r.renderer = t;
      }
      if (n.tokenizer) {
        let t = this.defaults.tokenizer || new nt(this.defaults);
        for (let l in n.tokenizer) {
          if (!(l in t)) throw new Error(`tokenizer '${l}' does not exist`);
          if (["options", "rules", "lexer"].includes(l)) continue;
          let i = l, c = n.tokenizer[i], o = t[i];
          t[i] = (...h) => {
            let p = c.apply(t, h);
            return p === !1 && (p = o.apply(t, h)), p;
          };
        }
        r.tokenizer = t;
      }
      if (n.hooks) {
        let t = this.defaults.hooks || new Fe();
        for (let l in n.hooks) {
          if (!(l in t)) throw new Error(`hook '${l}' does not exist`);
          if (["options", "block"].includes(l)) continue;
          let i = l, c = n.hooks[i], o = t[i];
          Fe.passThroughHooks.has(l) ? t[i] = (h) => {
            if (this.defaults.async && Fe.passThroughHooksRespectAsync.has(l)) return (async () => {
              let m = await c.call(t, h);
              return o.call(t, m);
            })();
            let p = c.call(t, h);
            return o.call(t, p);
          } : t[i] = (...h) => {
            if (this.defaults.async) return (async () => {
              let m = await c.apply(t, h);
              return m === !1 && (m = await o.apply(t, h)), m;
            })();
            let p = c.apply(t, h);
            return p === !1 && (p = o.apply(t, h)), p;
          };
        }
        r.hooks = t;
      }
      if (n.walkTokens) {
        let t = this.defaults.walkTokens, l = n.walkTokens;
        r.walkTokens = function(i) {
          let c = [];
          return c.push(l.call(this, i)), t && (c = c.concat(t.call(this, i))), c;
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
      let r = { ...n }, t = { ...this.defaults, ...r }, l = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && r.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let i = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : s ? ee.lex : ee.lexInline)(i, t), o = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(o, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? te.parse : te.parseInline)(o, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(l);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let i = (t.hooks ? t.hooks.provideLexer() : s ? ee.lex : ee.lexInline)(e, t);
        t.hooks && (i = t.hooks.processAllTokens(i)), t.walkTokens && this.walkTokens(i, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : s ? te.parse : te.parseInline)(i, t);
        return t.hooks && (c = t.hooks.postprocess(c)), c;
      } catch (i) {
        return l(i);
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
}, _e = new $r();
function S(s, e) {
  return _e.parse(s, e);
}
S.options = S.setOptions = function(s) {
  return _e.setOptions(s), S.defaults = _e.defaults, Gn(S.defaults), S;
};
S.getDefaults = Ht;
S.defaults = xe;
S.use = function(...s) {
  return _e.use(...s), S.defaults = _e.defaults, Gn(S.defaults), S;
};
S.walkTokens = function(s, e) {
  return _e.walkTokens(s, e);
};
S.parseInline = _e.parseInline;
S.Parser = te;
S.parser = te.parse;
S.Renderer = st;
S.TextRenderer = Xt;
S.Lexer = ee;
S.lexer = ee.lex;
S.Tokenizer = nt;
S.Hooks = Fe;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
te.parse;
ee.lex;
const {
  entries: ns,
  setPrototypeOf: Rn,
  isFrozen: Pr,
  getPrototypeOf: zr,
  getOwnPropertyDescriptor: Br
} = Object;
let {
  freeze: G,
  seal: K,
  create: Nt
} = Object, {
  apply: $t,
  construct: Pt
} = typeof Reflect < "u" && Reflect;
G || (G = function(e) {
  return e;
});
K || (K = function(e) {
  return e;
});
$t || ($t = function(e, n) {
  for (var r = arguments.length, t = new Array(r > 2 ? r - 2 : 0), l = 2; l < r; l++)
    t[l - 2] = arguments[l];
  return e.apply(n, t);
});
Pt || (Pt = function(e) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
    r[t - 1] = arguments[t];
  return new e(...r);
});
const Ke = q(Array.prototype.forEach), Fr = q(Array.prototype.lastIndexOf), Cn = q(Array.prototype.pop), Ne = q(Array.prototype.push), Ur = q(Array.prototype.splice), et = q(String.prototype.toLowerCase), yt = q(String.prototype.toString), St = q(String.prototype.match), $e = q(String.prototype.replace), Hr = q(String.prototype.indexOf), Wr = q(String.prototype.trim), J = q(Object.prototype.hasOwnProperty), U = q(RegExp.prototype.test), Pe = Gr(TypeError);
function q(s) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
      r[t - 1] = arguments[t];
    return $t(s, e, r);
  };
}
function Gr(s) {
  return function() {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    return Pt(s, n);
  };
}
function b(s, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : et;
  Rn && Rn(s, null);
  let r = e.length;
  for (; r--; ) {
    let t = e[r];
    if (typeof t == "string") {
      const l = n(t);
      l !== t && (Pr(e) || (e[r] = l), t = l);
    }
    s[t] = !0;
  }
  return s;
}
function qr(s) {
  for (let e = 0; e < s.length; e++)
    J(s, e) || (s[e] = null);
  return s;
}
function ie(s) {
  const e = Nt(null);
  for (const [n, r] of ns(s))
    J(s, n) && (Array.isArray(r) ? e[n] = qr(r) : r && typeof r == "object" && r.constructor === Object ? e[n] = ie(r) : e[n] = r);
  return e;
}
function ze(s, e) {
  for (; s !== null; ) {
    const r = Br(s, e);
    if (r) {
      if (r.get)
        return q(r.get);
      if (typeof r.value == "function")
        return q(r.value);
    }
    s = zr(s);
  }
  function n() {
    return null;
  }
  return n;
}
const In = G(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), At = G(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Et = G(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Zr = G(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Rt = G(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Yr = G(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Ln = G(["#text"]), Mn = G(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Ct = G(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Dn = G(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Je = G(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Vr = K(/\{\{[\w\W]*|[\w\W]*\}\}/gm), jr = K(/<%[\w\W]*|[\w\W]*%>/gm), Xr = K(/\$\{[\w\W]*/gm), Qr = K(/^data-[\-\w.\u00B7-\uFFFF]+$/), Kr = K(/^aria-[\-\w]+$/), ss = K(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Jr = K(/^(?:\w+script|data):/i), ea = K(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), rs = K(/^html$/i), ta = K(/^[a-z][.\w]*(-[.\w]+)+$/i);
var On = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Kr,
  ATTR_WHITESPACE: ea,
  CUSTOM_ELEMENT: ta,
  DATA_ATTR: Qr,
  DOCTYPE_NAME: rs,
  ERB_EXPR: jr,
  IS_ALLOWED_URI: ss,
  IS_SCRIPT_OR_DATA: Jr,
  MUSTACHE_EXPR: Vr,
  TMPLIT_EXPR: Xr
});
const Be = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, na = function() {
  return typeof window > "u" ? null : window;
}, sa = function(e, n) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let r = null;
  const t = "data-tt-policy-suffix";
  n && n.hasAttribute(t) && (r = n.getAttribute(t));
  const l = "dompurify" + (r ? "#" + r : "");
  try {
    return e.createPolicy(l, {
      createHTML(i) {
        return i;
      },
      createScriptURL(i) {
        return i;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + l + " could not be created."), null;
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
function as() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : na();
  const e = (d) => as(d);
  if (e.version = "3.3.1", e.removed = [], !s || !s.document || s.document.nodeType !== Be.document || !s.Element)
    return e.isSupported = !1, e;
  let {
    document: n
  } = s;
  const r = n, t = r.currentScript, {
    DocumentFragment: l,
    HTMLTemplateElement: i,
    Node: c,
    Element: o,
    NodeFilter: h,
    NamedNodeMap: p = s.NamedNodeMap || s.MozNamedAttrMap,
    HTMLFormElement: m,
    DOMParser: g,
    trustedTypes: y
  } = s, _ = o.prototype, k = ze(_, "cloneNode"), I = ze(_, "remove"), x = ze(_, "nextSibling"), M = ze(_, "childNodes"), j = ze(_, "parentNode");
  if (typeof i == "function") {
    const d = n.createElement("template");
    d.content && d.content.ownerDocument && (n = d.content.ownerDocument);
  }
  let T, X = "";
  const {
    implementation: Y,
    createNodeIterator: lt,
    createDocumentFragment: is,
    getElementsByTagName: ls
  } = n, {
    importNode: os
  } = r;
  let F = Nn();
  e.isSupported = typeof ns == "function" && typeof j == "function" && Y && Y.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: ot,
    ERB_EXPR: ct,
    TMPLIT_EXPR: ut,
    DATA_ATTR: cs,
    ARIA_ATTR: us,
    IS_SCRIPT_OR_DATA: ps,
    ATTR_WHITESPACE: Qt,
    CUSTOM_ELEMENT: hs
  } = On;
  let {
    IS_ALLOWED_URI: Kt
  } = On, O = null;
  const Jt = b({}, [...In, ...At, ...Et, ...Rt, ...Ln]);
  let N = null;
  const en = b({}, [...Mn, ...Ct, ...Dn, ...Je]);
  let R = Object.seal(Nt(null, {
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
  })), Ie = null, pt = null;
  const we = Object.seal(Nt(null, {
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
  let tn = !0, ht = !0, nn = !1, sn = !0, Te = !1, Ge = !0, de = !1, ft = !1, dt = !1, ve = !1, qe = !1, Ze = !1, rn = !0, an = !1;
  const fs = "user-content-";
  let gt = !0, Le = !1, ye = {}, se = null;
  const mt = b({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let ln = null;
  const on = b({}, ["audio", "video", "img", "source", "image", "track"]);
  let kt = null;
  const cn = b({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ye = "http://www.w3.org/1998/Math/MathML", Ve = "http://www.w3.org/2000/svg", oe = "http://www.w3.org/1999/xhtml";
  let Se = oe, bt = !1, _t = null;
  const ds = b({}, [Ye, Ve, oe], yt);
  let je = b({}, ["mi", "mo", "mn", "ms", "mtext"]), Xe = b({}, ["annotation-xml"]);
  const gs = b({}, ["title", "style", "font", "a", "script"]);
  let Me = null;
  const ms = ["application/xhtml+xml", "text/html"], ks = "text/html";
  let D = null, Ae = null;
  const bs = n.createElement("form"), un = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, xt = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(Ae && Ae === a)) {
      if ((!a || typeof a != "object") && (a = {}), a = ie(a), Me = // eslint-disable-next-line unicorn/prefer-includes
      ms.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? ks : a.PARSER_MEDIA_TYPE, D = Me === "application/xhtml+xml" ? yt : et, O = J(a, "ALLOWED_TAGS") ? b({}, a.ALLOWED_TAGS, D) : Jt, N = J(a, "ALLOWED_ATTR") ? b({}, a.ALLOWED_ATTR, D) : en, _t = J(a, "ALLOWED_NAMESPACES") ? b({}, a.ALLOWED_NAMESPACES, yt) : ds, kt = J(a, "ADD_URI_SAFE_ATTR") ? b(ie(cn), a.ADD_URI_SAFE_ATTR, D) : cn, ln = J(a, "ADD_DATA_URI_TAGS") ? b(ie(on), a.ADD_DATA_URI_TAGS, D) : on, se = J(a, "FORBID_CONTENTS") ? b({}, a.FORBID_CONTENTS, D) : mt, Ie = J(a, "FORBID_TAGS") ? b({}, a.FORBID_TAGS, D) : ie({}), pt = J(a, "FORBID_ATTR") ? b({}, a.FORBID_ATTR, D) : ie({}), ye = J(a, "USE_PROFILES") ? a.USE_PROFILES : !1, tn = a.ALLOW_ARIA_ATTR !== !1, ht = a.ALLOW_DATA_ATTR !== !1, nn = a.ALLOW_UNKNOWN_PROTOCOLS || !1, sn = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Te = a.SAFE_FOR_TEMPLATES || !1, Ge = a.SAFE_FOR_XML !== !1, de = a.WHOLE_DOCUMENT || !1, ve = a.RETURN_DOM || !1, qe = a.RETURN_DOM_FRAGMENT || !1, Ze = a.RETURN_TRUSTED_TYPE || !1, dt = a.FORCE_BODY || !1, rn = a.SANITIZE_DOM !== !1, an = a.SANITIZE_NAMED_PROPS || !1, gt = a.KEEP_CONTENT !== !1, Le = a.IN_PLACE || !1, Kt = a.ALLOWED_URI_REGEXP || ss, Se = a.NAMESPACE || oe, je = a.MATHML_TEXT_INTEGRATION_POINTS || je, Xe = a.HTML_INTEGRATION_POINTS || Xe, R = a.CUSTOM_ELEMENT_HANDLING || {}, a.CUSTOM_ELEMENT_HANDLING && un(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (R.tagNameCheck = a.CUSTOM_ELEMENT_HANDLING.tagNameCheck), a.CUSTOM_ELEMENT_HANDLING && un(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (R.attributeNameCheck = a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), a.CUSTOM_ELEMENT_HANDLING && typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (R.allowCustomizedBuiltInElements = a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Te && (ht = !1), qe && (ve = !0), ye && (O = b({}, Ln), N = [], ye.html === !0 && (b(O, In), b(N, Mn)), ye.svg === !0 && (b(O, At), b(N, Ct), b(N, Je)), ye.svgFilters === !0 && (b(O, Et), b(N, Ct), b(N, Je)), ye.mathMl === !0 && (b(O, Rt), b(N, Dn), b(N, Je))), a.ADD_TAGS && (typeof a.ADD_TAGS == "function" ? we.tagCheck = a.ADD_TAGS : (O === Jt && (O = ie(O)), b(O, a.ADD_TAGS, D))), a.ADD_ATTR && (typeof a.ADD_ATTR == "function" ? we.attributeCheck = a.ADD_ATTR : (N === en && (N = ie(N)), b(N, a.ADD_ATTR, D))), a.ADD_URI_SAFE_ATTR && b(kt, a.ADD_URI_SAFE_ATTR, D), a.FORBID_CONTENTS && (se === mt && (se = ie(se)), b(se, a.FORBID_CONTENTS, D)), a.ADD_FORBID_CONTENTS && (se === mt && (se = ie(se)), b(se, a.ADD_FORBID_CONTENTS, D)), gt && (O["#text"] = !0), de && b(O, ["html", "head", "body"]), O.table && (b(O, ["tbody"]), delete Ie.tbody), a.TRUSTED_TYPES_POLICY) {
        if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        T = a.TRUSTED_TYPES_POLICY, X = T.createHTML("");
      } else
        T === void 0 && (T = sa(y, t)), T !== null && typeof X == "string" && (X = T.createHTML(""));
      G && G(a), Ae = a;
    }
  }, pn = b({}, [...At, ...Et, ...Zr]), hn = b({}, [...Rt, ...Yr]), _s = function(a) {
    let u = j(a);
    (!u || !u.tagName) && (u = {
      namespaceURI: Se,
      tagName: "template"
    });
    const f = et(a.tagName), A = et(u.tagName);
    return _t[a.namespaceURI] ? a.namespaceURI === Ve ? u.namespaceURI === oe ? f === "svg" : u.namespaceURI === Ye ? f === "svg" && (A === "annotation-xml" || je[A]) : !!pn[f] : a.namespaceURI === Ye ? u.namespaceURI === oe ? f === "math" : u.namespaceURI === Ve ? f === "math" && Xe[A] : !!hn[f] : a.namespaceURI === oe ? u.namespaceURI === Ve && !Xe[A] || u.namespaceURI === Ye && !je[A] ? !1 : !hn[f] && (gs[f] || !pn[f]) : !!(Me === "application/xhtml+xml" && _t[a.namespaceURI]) : !1;
  }, re = function(a) {
    Ne(e.removed, {
      element: a
    });
    try {
      j(a).removeChild(a);
    } catch {
      I(a);
    }
  }, ge = function(a, u) {
    try {
      Ne(e.removed, {
        attribute: u.getAttributeNode(a),
        from: u
      });
    } catch {
      Ne(e.removed, {
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
  }, fn = function(a) {
    let u = null, f = null;
    if (dt)
      a = "<remove></remove>" + a;
    else {
      const L = St(a, /^[\r\n\t ]+/);
      f = L && L[0];
    }
    Me === "application/xhtml+xml" && Se === oe && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const A = T ? T.createHTML(a) : a;
    if (Se === oe)
      try {
        u = new g().parseFromString(A, Me);
      } catch {
      }
    if (!u || !u.documentElement) {
      u = Y.createDocument(Se, "template", null);
      try {
        u.documentElement.innerHTML = bt ? X : A;
      } catch {
      }
    }
    const z = u.body || u.documentElement;
    return a && f && z.insertBefore(n.createTextNode(f), z.childNodes[0] || null), Se === oe ? ls.call(u, de ? "html" : "body")[0] : de ? u.documentElement : z;
  }, dn = function(a) {
    return lt.call(
      a.ownerDocument || a,
      a,
      // eslint-disable-next-line no-bitwise
      h.SHOW_ELEMENT | h.SHOW_COMMENT | h.SHOW_TEXT | h.SHOW_PROCESSING_INSTRUCTION | h.SHOW_CDATA_SECTION,
      null
    );
  }, wt = function(a) {
    return a instanceof m && (typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || !(a.attributes instanceof p) || typeof a.removeAttribute != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function");
  }, gn = function(a) {
    return typeof c == "function" && a instanceof c;
  };
  function ce(d, a, u) {
    Ke(d, (f) => {
      f.call(e, a, u, Ae);
    });
  }
  const mn = function(a) {
    let u = null;
    if (ce(F.beforeSanitizeElements, a, null), wt(a))
      return re(a), !0;
    const f = D(a.nodeName);
    if (ce(F.uponSanitizeElement, a, {
      tagName: f,
      allowedTags: O
    }), Ge && a.hasChildNodes() && !gn(a.firstElementChild) && U(/<[/\w!]/g, a.innerHTML) && U(/<[/\w!]/g, a.textContent) || a.nodeType === Be.progressingInstruction || Ge && a.nodeType === Be.comment && U(/<[/\w]/g, a.data))
      return re(a), !0;
    if (!(we.tagCheck instanceof Function && we.tagCheck(f)) && (!O[f] || Ie[f])) {
      if (!Ie[f] && bn(f) && (R.tagNameCheck instanceof RegExp && U(R.tagNameCheck, f) || R.tagNameCheck instanceof Function && R.tagNameCheck(f)))
        return !1;
      if (gt && !se[f]) {
        const A = j(a) || a.parentNode, z = M(a) || a.childNodes;
        if (z && A) {
          const L = z.length;
          for (let V = L - 1; V >= 0; --V) {
            const ue = k(z[V], !0);
            ue.__removalCount = (a.__removalCount || 0) + 1, A.insertBefore(ue, x(a));
          }
        }
      }
      return re(a), !0;
    }
    return a instanceof o && !_s(a) || (f === "noscript" || f === "noembed" || f === "noframes") && U(/<\/no(script|embed|frames)/i, a.innerHTML) ? (re(a), !0) : (Te && a.nodeType === Be.text && (u = a.textContent, Ke([ot, ct, ut], (A) => {
      u = $e(u, A, " ");
    }), a.textContent !== u && (Ne(e.removed, {
      element: a.cloneNode()
    }), a.textContent = u)), ce(F.afterSanitizeElements, a, null), !1);
  }, kn = function(a, u, f) {
    if (rn && (u === "id" || u === "name") && (f in n || f in bs))
      return !1;
    if (!(ht && !pt[u] && U(cs, u))) {
      if (!(tn && U(us, u))) {
        if (!(we.attributeCheck instanceof Function && we.attributeCheck(u, a))) {
          if (!N[u] || pt[u]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(bn(a) && (R.tagNameCheck instanceof RegExp && U(R.tagNameCheck, a) || R.tagNameCheck instanceof Function && R.tagNameCheck(a)) && (R.attributeNameCheck instanceof RegExp && U(R.attributeNameCheck, u) || R.attributeNameCheck instanceof Function && R.attributeNameCheck(u, a)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              u === "is" && R.allowCustomizedBuiltInElements && (R.tagNameCheck instanceof RegExp && U(R.tagNameCheck, f) || R.tagNameCheck instanceof Function && R.tagNameCheck(f)))
            ) return !1;
          } else if (!kt[u]) {
            if (!U(Kt, $e(f, Qt, ""))) {
              if (!((u === "src" || u === "xlink:href" || u === "href") && a !== "script" && Hr(f, "data:") === 0 && ln[a])) {
                if (!(nn && !U(ps, $e(f, Qt, "")))) {
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
  }, bn = function(a) {
    return a !== "annotation-xml" && St(a, hs);
  }, _n = function(a) {
    ce(F.beforeSanitizeAttributes, a, null);
    const {
      attributes: u
    } = a;
    if (!u || wt(a))
      return;
    const f = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: N,
      forceKeepAttr: void 0
    };
    let A = u.length;
    for (; A--; ) {
      const z = u[A], {
        name: L,
        namespaceURI: V,
        value: ue
      } = z, Ee = D(L), Tt = ue;
      let $ = L === "value" ? Tt : Wr(Tt);
      if (f.attrName = Ee, f.attrValue = $, f.keepAttr = !0, f.forceKeepAttr = void 0, ce(F.uponSanitizeAttribute, a, f), $ = f.attrValue, an && (Ee === "id" || Ee === "name") && (ge(L, a), $ = fs + $), Ge && U(/((--!?|])>)|<\/(style|title|textarea)/i, $)) {
        ge(L, a);
        continue;
      }
      if (Ee === "attributename" && St($, "href")) {
        ge(L, a);
        continue;
      }
      if (f.forceKeepAttr)
        continue;
      if (!f.keepAttr) {
        ge(L, a);
        continue;
      }
      if (!sn && U(/\/>/i, $)) {
        ge(L, a);
        continue;
      }
      Te && Ke([ot, ct, ut], (wn) => {
        $ = $e($, wn, " ");
      });
      const xn = D(a.nodeName);
      if (!kn(xn, Ee, $)) {
        ge(L, a);
        continue;
      }
      if (T && typeof y == "object" && typeof y.getAttributeType == "function" && !V)
        switch (y.getAttributeType(xn, Ee)) {
          case "TrustedHTML": {
            $ = T.createHTML($);
            break;
          }
          case "TrustedScriptURL": {
            $ = T.createScriptURL($);
            break;
          }
        }
      if ($ !== Tt)
        try {
          V ? a.setAttributeNS(V, L, $) : a.setAttribute(L, $), wt(a) ? re(a) : Cn(e.removed);
        } catch {
          ge(L, a);
        }
    }
    ce(F.afterSanitizeAttributes, a, null);
  }, xs = function d(a) {
    let u = null;
    const f = dn(a);
    for (ce(F.beforeSanitizeShadowDOM, a, null); u = f.nextNode(); )
      ce(F.uponSanitizeShadowNode, u, null), mn(u), _n(u), u.content instanceof l && d(u.content);
    ce(F.afterSanitizeShadowDOM, a, null);
  };
  return e.sanitize = function(d) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, f = null, A = null, z = null;
    if (bt = !d, bt && (d = "<!-->"), typeof d != "string" && !gn(d))
      if (typeof d.toString == "function") {
        if (d = d.toString(), typeof d != "string")
          throw Pe("dirty is not a string, aborting");
      } else
        throw Pe("toString is not a function");
    if (!e.isSupported)
      return d;
    if (ft || xt(a), e.removed = [], typeof d == "string" && (Le = !1), Le) {
      if (d.nodeName) {
        const ue = D(d.nodeName);
        if (!O[ue] || Ie[ue])
          throw Pe("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (d instanceof c)
      u = fn("<!---->"), f = u.ownerDocument.importNode(d, !0), f.nodeType === Be.element && f.nodeName === "BODY" || f.nodeName === "HTML" ? u = f : u.appendChild(f);
    else {
      if (!ve && !Te && !de && // eslint-disable-next-line unicorn/prefer-includes
      d.indexOf("<") === -1)
        return T && Ze ? T.createHTML(d) : d;
      if (u = fn(d), !u)
        return ve ? null : Ze ? X : "";
    }
    u && dt && re(u.firstChild);
    const L = dn(Le ? d : u);
    for (; A = L.nextNode(); )
      mn(A), _n(A), A.content instanceof l && xs(A.content);
    if (Le)
      return d;
    if (ve) {
      if (qe)
        for (z = is.call(u.ownerDocument); u.firstChild; )
          z.appendChild(u.firstChild);
      else
        z = u;
      return (N.shadowroot || N.shadowrootmode) && (z = os.call(r, z, !0)), z;
    }
    let V = de ? u.outerHTML : u.innerHTML;
    return de && O["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && U(rs, u.ownerDocument.doctype.name) && (V = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + V), Te && Ke([ot, ct, ut], (ue) => {
      V = $e(V, ue, " ");
    }), T && Ze ? T.createHTML(V) : V;
  }, e.setConfig = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    xt(d), ft = !0;
  }, e.clearConfig = function() {
    Ae = null, ft = !1;
  }, e.isValidAttribute = function(d, a, u) {
    Ae || xt({});
    const f = D(d), A = D(a);
    return kn(f, A, u);
  }, e.addHook = function(d, a) {
    typeof a == "function" && Ne(F[d], a);
  }, e.removeHook = function(d, a) {
    if (a !== void 0) {
      const u = Fr(F[d], a);
      return u === -1 ? void 0 : Ur(F[d], u, 1)[0];
    }
    return Cn(F[d]);
  }, e.removeHooks = function(d) {
    F[d] = [];
  }, e.removeAllHooks = function() {
    F = Nn();
  }, e;
}
var ra = as();
const aa = {}, ia = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function la(s, e) {
  return v(), C("svg", ia, [...e[0] || (e[0] = [
    P("path", { d: "M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" }, null, -1)
  ])]);
}
const oa = /* @__PURE__ */ Z(aa, [["render", la]]), ca = {}, ua = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function pa(s, e) {
  return v(), C("svg", ua, [...e[0] || (e[0] = [
    P("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }, null, -1)
  ])]);
}
const ha = /* @__PURE__ */ Z(ca, [["render", pa]]), fa = {}, da = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ga(s, e) {
  return v(), C("svg", da, [...e[0] || (e[0] = [
    P("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }, null, -1)
  ])]);
}
const ma = /* @__PURE__ */ Z(fa, [["render", ga]]), ka = ["aria-label"], ba = {
  key: 0,
  class: "nc-message-bubble__header"
}, _a = {
  key: 0,
  class: "nc-message-bubble__label"
}, xa = { class: "nc-message-bubble__bubble" }, wa = {
  key: 0,
  class: "nc-message-bubble__content"
}, Ta = ["innerHTML"], va = /* @__PURE__ */ fe({
  __name: "MessageBubble",
  props: {
    message: {},
    animate: { type: Boolean, default: !1 }
  },
  setup(s) {
    const e = s, n = pe(He, void 0), r = H(() => n?.showBubbleHeaders ?? !0), t = H(() => n?.assistantBubbleFullWidth ?? !1), l = H(() => e.message.role === "user"), i = H(
      () => e.message.status === "failed" || e.message.id.startsWith("error-")
    ), c = H(() => e.message.status === "sending"), o = H(() => e.message.role === "assistant" && !i.value), h = H(() => {
      if (e.message.role !== "assistant" || i.value) return null;
      const _ = S.parse(e.message.content);
      return ra.sanitize(_);
    }), p = H(() => i.value ? "Error message" : l.value ? "Message from you" : "Message from AI Assistant"), m = Q(!1);
    let g = null;
    async function y() {
      try {
        await navigator.clipboard.writeText(e.message.content), m.value = !0, g && clearTimeout(g), g = setTimeout(() => {
          m.value = !1;
        }, 1500);
      } catch {
      }
    }
    return Bn(() => {
      g && clearTimeout(g);
    }), (_, k) => (v(), C("li", {
      role: "listitem",
      "aria-label": p.value,
      class: zt(["nc-message-bubble", {
        "nc-message-bubble--user": l.value,
        "nc-message-bubble--assistant": o.value,
        "nc-message-bubble--error": i.value,
        "nc-message-bubble--sending": c.value,
        "nc-message-bubble--flat": o.value && t.value,
        "nc-message-bubble--animate-in": e.animate
      }])
    }, [
      r.value ? (v(), C("div", ba, [
        l.value ? (v(), C("span", _a, "You")) : i.value ? (v(), C(It, { key: 1 }, [
          E(oa, { class: "nc-message-bubble__warning-icon" }),
          k[0] || (k[0] = P("span", { class: "nc-message-bubble__label" }, "Error", -1))
        ], 64)) : (v(), C(It, { key: 2 }, [
          E(Fn, {
            color: "secondary",
            size: "29"
          }, {
            default: B(() => [
              E(be, {
                icon: Ut,
                color: "white",
                size: "15"
              })
            ]),
            _: 1
          }),
          k[1] || (k[1] = P("span", { class: "nc-message-bubble__label" }, "AI Assistant", -1))
        ], 64))
      ])) : Lt("", !0),
      P("div", xa, [
        l.value || i.value ? (v(), C("div", wa, zn(s.message.content), 1)) : (v(), C("div", {
          key: 1,
          class: "nc-message-bubble__content",
          innerHTML: h.value
        }, null, 8, Ta))
      ]),
      o.value ? (v(), le(Ue, {
        key: 1,
        icon: "",
        variant: "text",
        density: "comfortable",
        size: "small",
        class: "mt-1",
        "aria-label": m.value ? "Message copied" : "Copy message",
        onClick: y
      }, {
        default: B(() => [
          E(be, {
            icon: m.value ? ma : ha,
            size: "small",
            color: m.value ? "success" : "title"
          }, null, 8, ["icon", "color"])
        ]),
        _: 1
      }, 8, ["aria-label"])) : Lt("", !0)
    ], 10, ka));
  }
}), ya = /* @__PURE__ */ Z(va, [["__scopeId", "data-v-8b3aa1a9"]]), Sa = {}, Aa = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ea(s, e) {
  return v(), C("svg", Aa, [...e[0] || (e[0] = [
    P("path", { d: "M19.79 13.267a.75.75 0 0 0-1.086-1.034l-5.954 6.251V3.75a.75.75 0 1 0-1.5 0v14.734l-5.955-6.251a.75.75 0 0 0-1.086 1.034l7.067 7.42c.16.168.366.268.58.3a.753.753 0 0 0 .29-.001.995.995 0 0 0 .578-.3l7.067-7.419Z" }, null, -1)
  ])]);
}
const Ra = /* @__PURE__ */ Z(Sa, [["render", Ea]]), Ca = { class: "nc-message-list-wrapper" }, Ia = {
  role: "list",
  "aria-live": "polite",
  class: "nc-message-list"
}, La = { class: "nc-message-list__loader" }, Ma = { class: "nc-scroll-fab" }, Da = 50, Oa = /* @__PURE__ */ fe({
  __name: "MessageList",
  setup(s) {
    const e = pe(Ce), n = rt("scrollContainer"), r = Q(!0), t = /* @__PURE__ */ new Set(), l = Q(/* @__PURE__ */ new Set());
    let i = !1, c = !1;
    ke(
      () => e.messages.value,
      (k) => {
        const I = /* @__PURE__ */ new Set();
        i && !c && k.forEach((x) => {
          t.has(x.id) || I.add(x.id);
        }), k.forEach((x) => t.add(x.id)), l.value = I;
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
      r.value = x - I - M <= Da;
    }
    function p() {
      const k = o();
      k && (k.scrollTop = k.scrollHeight);
    }
    let m = e.messages.value.length > 0 ? e.messages.value[e.messages.value.length - 1].id : null, g = !1, y = !1;
    ke(
      () => e.messages.value,
      (k) => {
        const I = k.length > 0 ? k[k.length - 1].id : null, x = I !== null && I !== m;
        m = I, x && (g ? y = !0 : he(p));
      }
    ), ws(() => {
      e.messages.value.forEach((I) => t.add(I.id)), he(() => {
        i = !0;
      }), e.messages.value.length > 0 && he(p), o()?.addEventListener("scroll", h, { passive: !0 });
    }), Bn(() => {
      o()?.removeEventListener("scroll", h);
    });
    async function _({ done: k }) {
      c = !0, g = !0;
      try {
        await e.loadMore(), k(e.hasMore.value ? "ok" : "empty");
      } catch {
        k("error");
      }
      await he(), c = !1, g = !1, y && (y = !1, he(p));
    }
    return (k, I) => (v(), C("div", Ca, [
      E(Rs, {
        ref: "scrollContainer",
        side: "start",
        disabled: !ne(e).hasMore.value,
        class: "nc-message-list-scroll",
        onLoad: _
      }, {
        loading: B(() => [
          P("div", La, [
            E(Ft, {
              indeterminate: "",
              size: "24",
              width: "2"
            })
          ])
        ]),
        empty: B(() => [...I[0] || (I[0] = [])]),
        default: B(() => [
          P("ul", Ia, [
            (v(!0), C(It, null, Ts(ne(e).messages.value, (x) => (v(), le(ya, {
              key: x.id,
              message: x,
              animate: l.value.has(x.id)
            }, null, 8, ["message", "animate"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["disabled"]),
      E(Bt, { name: "nc-scroll-fab" }, {
        default: B(() => [
          $n(P("div", Ma, [
            E(Ue, {
              icon: "",
              variant: "elevated",
              color: "surface",
              size: "small",
              "aria-label": "Scroll to latest messages",
              onClick: p
            }, {
              default: B(() => [
                E(be, { icon: Ra })
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
}), Na = /* @__PURE__ */ Z(Oa, [["__scopeId", "data-v-ace94df9"]]), $a = {}, Pa = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function za(s, e) {
  return v(), C("svg", Pa, [...e[0] || (e[0] = [
    P("path", { d: "m12.815 12.197-7.532 1.256a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.943l18-9a.75.75 0 0 0 0-1.342l-18-9c-.614-.307-1.283.304-1.035.943l2.598 6.957a.5.5 0 0 0 .386.319l7.532 1.255a.2.2 0 0 1 0 .394Z" }, null, -1)
  ])]);
}
const Ba = /* @__PURE__ */ Z($a, [["render", za]]), Fa = { class: "nc-chat-input" }, Ua = /* @__PURE__ */ fe({
  __name: "ChatInput",
  setup(s) {
    const e = pe(Ce), n = Q(""), r = rt("textareaRef"), t = H(() => n.value.trim().length > 0 && !e.isSending.value);
    async function l() {
      const c = n.value.trim();
      if (!(!c || e.isSending.value)) {
        n.value = "";
        try {
          await e.sendMessage(c);
        } catch {
        }
      }
    }
    function i(c) {
      c.key === "Enter" && !c.shiftKey && (c.preventDefault(), l());
    }
    return ke(
      () => e.failedMessageText.value,
      (c) => {
        c && (n.value = c);
      }
    ), ke(
      () => e.isOpen.value,
      (c) => {
        c && he(() => {
          r.value?.focus();
        });
      },
      { immediate: !0 }
    ), ke(
      () => e.isSending.value,
      (c, o) => {
        o && !c && he(() => {
          r.value?.focus();
        });
      }
    ), (c, o) => (v(), C("div", Fa, [
      E(Cs, {
        ref_key: "textareaRef",
        ref: r,
        modelValue: n.value,
        "onUpdate:modelValue": o[0] || (o[0] = (h) => n.value = h),
        "auto-grow": "",
        rows: 2,
        "max-rows": 10,
        "no-resize": "",
        "hide-details": "",
        variant: "solo",
        density: "compact",
        flat: "",
        placeholder: "How can I help you? Ask me anything...",
        "aria-label": "Type a message",
        disabled: ne(e).isSending.value,
        class: "nc-chat-input__textarea",
        onKeydown: i
      }, {
        "append-inner": B(() => [
          E(Ue, {
            icon: "",
            variant: "text",
            density: "comfortable",
            color: t.value || ne(e).isSending.value ? "primary" : void 0,
            disabled: !t.value,
            "aria-label": "Send message",
            onClick: l
          }, {
            default: B(() => [
              ne(e).isSending.value ? (v(), le(Ft, {
                key: 0,
                indeterminate: "",
                size: 16,
                width: 2,
                color: "primary"
              })) : (v(), le(be, {
                key: 1,
                icon: Ba,
                color: "secondary"
              }))
            ]),
            _: 1
          }, 8, ["color", "disabled"])
        ]),
        _: 1
      }, 8, ["modelValue", "disabled"])
    ]));
  }
}), Ha = /* @__PURE__ */ Z(Ua, [["__scopeId", "data-v-81fc160e"]]), Wa = { class: "nc-chat-panel__body" }, Ga = /* @__PURE__ */ fe({
  __name: "ChatPanel",
  setup(s) {
    const e = pe(Ce), n = pe(He), r = H(() => n?.welcomeMessage), t = As(), l = H(() => t.width.value < 768), i = (c) => {
      c.key === "Escape" && e.isOpen.value && e.close();
    };
    return ke(
      () => e.isOpen.value,
      (c) => {
        c ? window.addEventListener("keydown", i) : window.removeEventListener("keydown", i);
      },
      { immediate: !0 }
    ), vs(() => {
      window.removeEventListener("keydown", i);
    }), (c, o) => (v(), le(ys, { to: "body" }, [
      E(Bt, { name: "nc-panel" }, {
        default: B(() => [
          ne(e).isOpen.value ? (v(), le(Un, {
            key: 0,
            theme: "nativeChat",
            "with-background": "",
            class: zt(["nc-chat-panel border-md", { "nc-chat-panel--mobile": l.value }]),
            role: "complementary",
            "aria-label": "Chat with AI Assistant"
          }, {
            default: B(() => [
              E(Ws),
              P("div", Wa, [
                ne(e).isLoading.value && ne(e).messages.value.length === 0 ? (v(), le(Ft, {
                  key: 0,
                  indeterminate: "",
                  size: "24",
                  class: "nc-chat-panel__loader"
                })) : ne(e).messages.value.length === 0 && !ne(e).isSending.value ? (v(), le(Ys, {
                  key: 1,
                  message: r.value
                }, null, 8, ["message"])) : (v(), le(Na, { key: 2 }))
              ]),
              E(Ha)
            ]),
            _: 1
          }, 8, ["class"])) : Lt("", !0)
        ]),
        _: 1
      })
    ]));
  }
}), qa = /* @__PURE__ */ Z(Ga, [["__scopeId", "data-v-c00684a0"]]), Za = /* @__PURE__ */ fe({
  __name: "NativeChatWidget",
  setup(s) {
    const e = Es();
    if (!e.themes.value.nativeChat) {
      const l = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...l,
        ...vt,
        colors: {
          ...l.colors,
          ...vt.colors
        },
        variables: {
          ...l.variables,
          ...vt.variables
        }
      };
    }
    const n = pe(He), r = Ls(n.apiClient, n);
    Ss(Ce, r);
    const t = rt("floatingButtonRef");
    return ke(
      () => r.isOpen.value,
      (l) => {
        l || he(() => {
          t.value?.focus();
        });
      }
    ), (l, i) => (v(), le(Un, { theme: "nativeChat" }, {
      default: B(() => [
        E(Bs, {
          ref_key: "floatingButtonRef",
          ref: t
        }, null, 512),
        E(qa)
      ]),
      _: 1
    }));
  }
}), Ya = /* @__PURE__ */ Z(Za, [["__scopeId", "data-v-492f08ed"]]), si = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(He, e), s.component("NativeChatWidget", Ya);
  }
};
function ri(s) {
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
  si as NativeChatPlugin,
  Ya as NativeChatWidget,
  ri as createNativeChatApiClient,
  si as default
};
