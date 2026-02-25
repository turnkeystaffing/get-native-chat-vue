import { ref as K, readonly as Re, openBlock as y, createElementBlock as I, createElementVNode as B, defineComponent as de, inject as he, computed as q, useTemplateRef as st, resolveComponent as O, withDirectives as On, normalizeClass as Pt, createVNode as C, withCtx as U, Transition as zt, vShow as Nn, unref as se, toDisplayString as $n, onBeforeUnmount as Pn, Fragment as Ct, createCommentVNode as Lt, createBlock as oe, watch as _e, nextTick as fe, onMounted as ks, renderList as _s, onUnmounted as bs, Teleport as xs, provide as ws } from "vue";
import { useDisplay as vs, useTheme as Ts } from "vuetify";
const Ue = /* @__PURE__ */ Symbol("native-chat-config"), Ce = /* @__PURE__ */ Symbol("native-chat-state");
function zn(s) {
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
function ys(s) {
  const e = zn(s);
  return e === 429 ? "You're sending messages too quickly. Please wait a moment and try again." : e === 503 || e === 504 ? "The service is temporarily unavailable. Please try again in a moment." : "Something went wrong. You can try sending your message again.";
}
function Ss(s, e) {
  const n = K([]), r = K(!1), t = K(!1), l = K(!1), i = K(!1), c = K(null), o = K(null), h = K(0), p = e.batchSize ?? 20;
  function m(x, R, H) {
    n.value = n.value.filter((X) => X.id !== H && !X.id.startsWith("error-"));
    const T = ys(x), $ = {
      id: `error-${Date.now()}`,
      conversationId: o.value ?? "",
      role: "assistant",
      content: T,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "failed"
    };
    if (n.value = [...n.value, $], c.value = null, c.value = R, e.onError)
      try {
        Promise.resolve(
          e.onError({
            message: T,
            statusCode: zn(x),
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
          const H = await s.getConversations(0, 1);
          if (H.conversations.length > 0)
            o.value = H.conversations[0].id;
          else {
            const T = await s.createConversation();
            o.value = T.id;
          }
        }
        const x = await s.getMessages(o.value, 0, p), R = [...x.messages].reverse();
        n.value = R, i.value = x.has_more, h.value = R.length;
      } catch {
      } finally {
        t.value = !1, r.value = !0;
      }
    }
  }
  function v() {
    r.value = !1;
  }
  async function _(x) {
    if (!x.trim() || l.value) return;
    l.value = !0;
    const R = `temp-${Date.now()}`, H = {
      id: R,
      conversationId: o.value ?? "",
      role: "user",
      content: x,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sending"
    };
    if (n.value = [...n.value, H], !o.value)
      try {
        const T = await s.createConversation();
        o.value = T.id;
      } catch (T) {
        m(T, x, R), l.value = !1;
        return;
      }
    try {
      const T = await s.sendMessage(o.value, x), $ = {
        ...T.userMessage,
        status: "sent"
      }, X = {
        ...T.assistantMessage
      };
      n.value = [
        ...n.value.filter((it) => it.id !== R),
        $,
        X
      ], c.value = null;
    } catch (T) {
      m(T, x, R);
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
        ), R = [...x.messages].reverse();
        n.value = [...R, ...n.value], h.value += R.length, i.value = x.has_more;
      } catch {
      } finally {
        t.value = !1;
      }
    }
  }
  async function E() {
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
    close: v,
    sendMessage: _,
    loadMore: k,
    retry: E
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
}, V = (s, e) => {
  const n = s.__vccOpts || s;
  for (const [r, t] of e)
    n[r] = t;
  return n;
}, As = {}, Es = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Rs(s, e) {
  return y(), I("svg", Es, [...e[0] || (e[0] = [
    B("path", { d: "M10.788 3.103c.495-1.004 1.926-1.004 2.421 0l2.358 4.777 5.273.766c1.107.161 1.549 1.522.748 2.303l-3.816 3.72.901 5.25c.19 1.103-.968 1.944-1.959 1.424l-4.716-2.48-4.715 2.48c-.99.52-2.148-.32-1.96-1.424l.901-5.25-3.815-3.72c-.801-.78-.359-2.142.748-2.303L8.43 7.88l2.358-4.777Zm1.21.936L9.74 8.615a1.35 1.35 0 0 1-1.016.738l-5.05.734 3.654 3.562c.318.31.463.757.388 1.195l-.862 5.03 4.516-2.375a1.35 1.35 0 0 1 1.257 0l4.516 2.374-.862-5.029a1.35 1.35 0 0 1 .388-1.195l3.654-3.562-5.05-.734a1.35 1.35 0 0 1-1.016-.738l-2.259-4.576Z" }, null, -1)
  ])]);
}
const Bt = /* @__PURE__ */ V(As, [["render", Rs]]), Cs = {}, Ls = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Is(s, e) {
  return y(), I("svg", Ls, [...e[0] || (e[0] = [
    B("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const Bn = /* @__PURE__ */ V(Cs, [["render", Is]]), Ms = /* @__PURE__ */ de({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const n = he(Ue), r = he(Ce), t = q(() => r.isOpen.value), l = q(() => t.value && (n?.hideToggleWhenOpen ?? !1)), i = q(() => n?.position ?? "bottom-right"), c = q(
      () => `nc-floating-button-wrapper--${i.value === "bottom-left" ? "left" : "right"}`
    );
    function o() {
      r.isOpen.value ? r.close() : r.open();
    }
    const h = st("triggerBtn");
    function p() {
      h.value?.$el?.focus();
    }
    return e({ focus: p }), (m, g) => {
      const v = O("v-icon"), _ = O("v-btn");
      return On((y(), I("div", {
        class: Pt(["nc-floating-button-wrapper", c.value])
      }, [
        C(_, {
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
          default: U(() => [
            C(zt, {
              name: "nc-fab-icon",
              mode: "out-in"
            }, {
              default: U(() => [
                (y(), I("span", {
                  key: t.value ? "close" : "star",
                  class: "nc-floating-button__icon-wrap"
                }, [
                  C(v, {
                    icon: t.value ? Bn : Bt,
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
        [Nn, !l.value]
      ]);
    };
  }
}), Ds = /* @__PURE__ */ V(Ms, [["__scopeId", "data-v-ac00f54f"]]), Os = { class: "nc-chat-header" }, Ns = { class: "nc-chat-header__left" }, $s = /* @__PURE__ */ de({
  __name: "ChatHeader",
  setup(s) {
    const e = he(Ce);
    return (n, r) => {
      const t = O("v-icon"), l = O("v-avatar"), i = O("v-btn");
      return y(), I("div", Os, [
        B("div", Ns, [
          C(l, {
            color: "secondary",
            size: "44"
          }, {
            default: U(() => [
              C(t, {
                icon: Bt,
                color: "white",
                size: "20"
              })
            ]),
            _: 1
          }),
          r[1] || (r[1] = B("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
        ]),
        C(i, {
          icon: "",
          variant: "text",
          size: "default",
          "aria-label": "Close chat",
          onClick: r[0] || (r[0] = (c) => se(e).close())
        }, {
          default: U(() => [
            C(t, {
              icon: Bn,
              size: "22"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}), Ps = /* @__PURE__ */ V($s, [["__scopeId", "data-v-20f4b784"]]), zs = { class: "nc-welcome-state" }, Bs = { class: "nc-welcome-state__text" }, Fs = /* @__PURE__ */ de({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(s) {
    return (e, n) => (y(), I("div", zs, [
      B("p", Bs, $n(s.message ?? "Hello! How can I help you?"), 1)
    ]));
  }
}), Us = /* @__PURE__ */ V(Fs, [["__scopeId", "data-v-6d3eccea"]]);
function Ft() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var xe = Ft();
function Fn(s) {
  xe = s;
}
var ke = { exec: () => null };
function w(s, e = "") {
  let n = typeof s == "string" ? s : s.source, r = { replace: (t, l) => {
    let i = typeof l == "string" ? l : l.source;
    return i = i.replace(Z.caret, "$1"), n = n.replace(t, i), r;
  }, getRegex: () => new RegExp(n, e) };
  return r;
}
var Hs = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), Z = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}>`) }, Ws = /^(?:[ \t]*(?:\n|$))+/, Gs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, qs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, He = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Zs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ut = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Un = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Hn = w(Un).replace(/bull/g, Ut).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Ys = w(Un).replace(/bull/g, Ut).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Ht = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, js = /^[^\n]+/, Wt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Vs = w(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Wt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Xs = w(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ut).getRegex(), rt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Gt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Qs = w("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Gt).replace("tag", rt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Wn = w(Ht).replace("hr", He).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), Ks = w(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Wn).getRegex(), qt = { blockquote: Ks, code: Gs, def: Vs, fences: qs, heading: Zs, hr: He, html: Qs, lheading: Hn, list: Xs, newline: Ws, paragraph: Wn, table: ke, text: js }, xn = w("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", He).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), Js = { ...qt, lheading: Ys, table: xn, paragraph: w(Ht).replace("hr", He).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", xn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex() }, er = { ...qt, html: w(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Gt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ke, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: w(Ht).replace("hr", He).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Hn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, tr = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, nr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Gn = /^( {2,}|\\)\n(?!\s*$)/, sr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, at = /[\p{P}\p{S}]/u, Zt = /[\s\p{P}\p{S}]/u, qn = /[^\s\p{P}\p{S}]/u, rr = w(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Zt).getRegex(), Zn = /(?!~)[\p{P}\p{S}]/u, ar = /(?!~)[\s\p{P}\p{S}]/u, ir = /(?:[^\s\p{P}\p{S}]|~)/u, Yn = /(?![*_])[\p{P}\p{S}]/u, lr = /(?![*_])[\s\p{P}\p{S}]/u, or = /(?:[^\s\p{P}\p{S}]|[*_])/u, cr = w(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Hs ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), jn = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ur = w(jn, "u").replace(/punct/g, at).getRegex(), pr = w(jn, "u").replace(/punct/g, Zn).getRegex(), Vn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", hr = w(Vn, "gu").replace(/notPunctSpace/g, qn).replace(/punctSpace/g, Zt).replace(/punct/g, at).getRegex(), fr = w(Vn, "gu").replace(/notPunctSpace/g, ir).replace(/punctSpace/g, ar).replace(/punct/g, Zn).getRegex(), dr = w("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, qn).replace(/punctSpace/g, Zt).replace(/punct/g, at).getRegex(), gr = w(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Yn).getRegex(), mr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", kr = w(mr, "gu").replace(/notPunctSpace/g, or).replace(/punctSpace/g, lr).replace(/punct/g, Yn).getRegex(), _r = w(/\\(punct)/, "gu").replace(/punct/g, at).getRegex(), br = w(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), xr = w(Gt).replace("(?:-->|$)", "-->").getRegex(), wr = w("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", xr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), et = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, vr = w(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", et).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Xn = w(/^!?\[(label)\]\[(ref)\]/).replace("label", et).replace("ref", Wt).getRegex(), Qn = w(/^!?\[(ref)\](?:\[\])?/).replace("ref", Wt).getRegex(), Tr = w("reflink|nolink(?!\\()", "g").replace("reflink", Xn).replace("nolink", Qn).getRegex(), wn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Yt = { _backpedal: ke, anyPunctuation: _r, autolink: br, blockSkip: cr, br: Gn, code: nr, del: ke, delLDelim: ke, delRDelim: ke, emStrongLDelim: ur, emStrongRDelimAst: hr, emStrongRDelimUnd: dr, escape: tr, link: vr, nolink: Qn, punctuation: rr, reflink: Xn, reflinkSearch: Tr, tag: wr, text: sr, url: ke }, yr = { ...Yt, link: w(/^!?\[(label)\]\((.*?)\)/).replace("label", et).getRegex(), reflink: w(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", et).getRegex() }, It = { ...Yt, emStrongRDelimAst: fr, emStrongLDelim: pr, delLDelim: gr, delRDelim: kr, url: w(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", wn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: w(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", wn).getRegex() }, Sr = { ...It, br: w(Gn).replace("{2,}", "*").getRegex(), text: w(It.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Xe = { normal: qt, gfm: Js, pedantic: er }, De = { normal: Yt, gfm: It, breaks: Sr, pedantic: yr }, Ar = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, vn = (s) => Ar[s];
function ie(s, e) {
  if (e) {
    if (Z.escapeTest.test(s)) return s.replace(Z.escapeReplace, vn);
  } else if (Z.escapeTestNoEncode.test(s)) return s.replace(Z.escapeReplaceNoEncode, vn);
  return s;
}
function Tn(s) {
  try {
    s = encodeURI(s).replace(Z.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function yn(s, e) {
  let n = s.replace(Z.findPipe, (l, i, c) => {
    let o = !1, h = i;
    for (; --h >= 0 && c[h] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = n.split(Z.splitPipe), t = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; t < r.length; t++) r[t] = r[t].trim().replace(Z.slashPipe, "|");
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
function Er(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < s.length; r++) if (s[r] === "\\") r++;
  else if (s[r] === e[0]) n++;
  else if (s[r] === e[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function Rr(s, e = 0) {
  let n = e, r = "";
  for (let t of s) if (t === "	") {
    let l = 4 - n % 4;
    r += " ".repeat(l), n += l;
  } else r += t, n++;
  return r;
}
function Sn(s, e, n, r, t) {
  let l = e.href, i = e.title || null, c = s[1].replace(t.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let o = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: n, href: l, title: i, text: c, tokens: r.inlineTokens(c) };
  return r.state.inLink = !1, o;
}
function Cr(s, e, n) {
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
var tt = class {
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
      let n = e[0], r = Cr(n, e[3] || "", this.rules);
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
          let v = g, _ = v.raw + `
` + n.join(`
`), k = this.blockquote(_);
          l[l.length - 1] = k, r = r.substring(0, r.length - v.raw.length) + k.raw, t = t.substring(0, t.length - v.text.length) + k.text;
          break;
        } else if (g?.type === "list") {
          let v = g, _ = v.raw + `
` + n.join(`
`), k = this.list(_);
          l[l.length - 1] = k, r = r.substring(0, r.length - g.raw.length) + k.raw, t = t.substring(0, t.length - v.raw.length) + k.raw, n = _.substring(l.at(-1).raw.length).split(`
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
        let m = Rr(e[2].split(`
`, 1)[0], e[1].length), g = s.split(`
`, 1)[0], v = !m.trim(), _ = 0;
        if (this.options.pedantic ? (_ = 2, p = m.trimStart()) : v ? _ = e[1].length + 1 : (_ = m.search(this.rules.other.nonSpaceChar), _ = _ > 4 ? 1 : _, p = m.slice(_), _ += e[1].length), v && this.rules.other.blankLine.test(g) && (h += g + `
`, s = s.substring(g.length + 1), o = !0), !o) {
          let k = this.rules.other.nextBulletRegex(_), E = this.rules.other.hrRegex(_), x = this.rules.other.fencesBeginRegex(_), R = this.rules.other.headingBeginRegex(_), H = this.rules.other.htmlBeginRegex(_), T = this.rules.other.blockquoteBeginRegex(_);
          for (; s; ) {
            let $ = s.split(`
`, 1)[0], X;
            if (g = $, this.options.pedantic ? (g = g.replace(this.rules.other.listReplaceNesting, "  "), X = g) : X = g.replace(this.rules.other.tabCharGlobal, "    "), x.test(g) || R.test(g) || H.test(g) || T.test(g) || k.test(g) || E.test(g)) break;
            if (X.search(this.rules.other.nonSpaceChar) >= _ || !g.trim()) p += `
` + X.slice(_);
            else {
              if (v || m.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || x.test(m) || R.test(m) || E.test(m)) break;
              p += `
` + g;
            }
            v = !g.trim(), h += $ + `
`, s = s.substring($.length + 1), m = X.slice(_);
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
    let n = yn(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], l = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let i of r) this.rules.other.tableAlignRight.test(i) ? l.align.push("right") : this.rules.other.tableAlignCenter.test(i) ? l.align.push("center") : this.rules.other.tableAlignLeft.test(i) ? l.align.push("left") : l.align.push(null);
      for (let i = 0; i < n.length; i++) l.header.push({ text: n[i], tokens: this.lexer.inline(n[i]), header: !0, align: l.align[i] });
      for (let i of t) l.rows.push(yn(i, l.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: l.align[o] })));
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
        let l = Er(e[2], "()");
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
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), Sn(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
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
      return Sn(n, t, n[0], this.lexer, this.rules);
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
          let v = m.slice(1, -1);
          return { type: "em", raw: m, text: v, tokens: this.lexer.inlineTokens(v) };
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
}, te = class Mt {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || xe, this.options.tokenizer = this.options.tokenizer || new tt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: Z, block: Xe.normal, inline: De.normal };
    this.options.pedantic ? (n.block = Xe.pedantic, n.inline = De.pedantic) : this.options.gfm && (n.block = Xe.gfm, this.options.breaks ? n.inline = De.breaks : n.inline = De.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Xe, inline: De };
  }
  static lex(e, n) {
    return new Mt(n).lex(e);
  }
  static lexInline(e, n) {
    return new Mt(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Z.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let r = this.inlineQueue[n];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], r = !1) {
    for (this.options.pedantic && (e = e.replace(Z.tabCharGlobal, "    ").replace(Z.spaceLine, "")); e; ) {
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
        this.options.extensions.startInline.forEach((v) => {
          g = v.call({ lexer: this }, m), typeof g == "number" && g >= 0 && (p = Math.min(p, g));
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
}, nt = class {
  options;
  parser;
  constructor(s) {
    this.options = s || xe;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: n }) {
    let r = (e || "").match(Z.notSpaceStart)?.[0], t = s.replace(Z.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + ie(r) + '">' + (n ? t : ie(t, !0)) + `</code></pre>
` : "<pre><code>" + (n ? t : ie(t, !0)) + `</code></pre>
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
    return `<code>${ie(s, !0)}</code>`;
  }
  br(s) {
    return "<br>";
  }
  del({ tokens: s }) {
    return `<del>${this.parser.parseInline(s)}</del>`;
  }
  link({ href: s, title: e, tokens: n }) {
    let r = this.parser.parseInline(n), t = Tn(s);
    if (t === null) return r;
    s = t;
    let l = '<a href="' + s + '"';
    return e && (l += ' title="' + ie(e) + '"'), l += ">" + r + "</a>", l;
  }
  image({ href: s, title: e, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let t = Tn(s);
    if (t === null) return ie(n);
    s = t;
    let l = `<img src="${s}" alt="${ie(n)}"`;
    return e && (l += ` title="${ie(e)}"`), l += ">", l;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : ie(s.text);
  }
}, jt = class {
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
}, ne = class Dt {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || xe, this.options.renderer = this.options.renderer || new nt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new jt();
  }
  static parse(e, n) {
    return new Dt(n).parse(e);
  }
  static parseInline(e, n) {
    return new Dt(n).parseInline(e);
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
    return this.block ? te.lex : te.lexInline;
  }
  provideParser() {
    return this.block ? ne.parse : ne.parseInline;
  }
}, Lr = class {
  defaults = Ft();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = ne;
  Renderer = nt;
  TextRenderer = jt;
  Lexer = te;
  Tokenizer = tt;
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
        let t = this.defaults.renderer || new nt(this.defaults);
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
        let t = this.defaults.tokenizer || new tt(this.defaults);
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
    return te.lex(s, e ?? this.defaults);
  }
  parser(s, e) {
    return ne.parse(s, e ?? this.defaults);
  }
  parseMarkdown(s) {
    return (e, n) => {
      let r = { ...n }, t = { ...this.defaults, ...r }, l = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && r.async === !1) return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let i = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : s ? te.lex : te.lexInline)(i, t), o = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(o, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? ne.parse : ne.parseInline)(o, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(l);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let i = (t.hooks ? t.hooks.provideLexer() : s ? te.lex : te.lexInline)(e, t);
        t.hooks && (i = t.hooks.processAllTokens(i)), t.walkTokens && this.walkTokens(i, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : s ? ne.parse : ne.parseInline)(i, t);
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
        let r = "<p>An error occurred:</p><pre>" + ie(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, be = new Lr();
function S(s, e) {
  return be.parse(s, e);
}
S.options = S.setOptions = function(s) {
  return be.setOptions(s), S.defaults = be.defaults, Fn(S.defaults), S;
};
S.getDefaults = Ft;
S.defaults = xe;
S.use = function(...s) {
  return be.use(...s), S.defaults = be.defaults, Fn(S.defaults), S;
};
S.walkTokens = function(s, e) {
  return be.walkTokens(s, e);
};
S.parseInline = be.parseInline;
S.Parser = ne;
S.parser = ne.parse;
S.Renderer = nt;
S.TextRenderer = jt;
S.Lexer = te;
S.lexer = te.lex;
S.Tokenizer = tt;
S.Hooks = Fe;
S.parse = S;
S.options;
S.setOptions;
S.use;
S.walkTokens;
S.parseInline;
ne.parse;
te.lex;
const {
  entries: Kn,
  setPrototypeOf: An,
  isFrozen: Ir,
  getPrototypeOf: Mr,
  getOwnPropertyDescriptor: Dr
} = Object;
let {
  freeze: Y,
  seal: J,
  create: Ot
} = Object, {
  apply: Nt,
  construct: $t
} = typeof Reflect < "u" && Reflect;
Y || (Y = function(e) {
  return e;
});
J || (J = function(e) {
  return e;
});
Nt || (Nt = function(e, n) {
  for (var r = arguments.length, t = new Array(r > 2 ? r - 2 : 0), l = 2; l < r; l++)
    t[l - 2] = arguments[l];
  return e.apply(n, t);
});
$t || ($t = function(e) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
    r[t - 1] = arguments[t];
  return new e(...r);
});
const Qe = j(Array.prototype.forEach), Or = j(Array.prototype.lastIndexOf), En = j(Array.prototype.pop), Ne = j(Array.prototype.push), Nr = j(Array.prototype.splice), Je = j(String.prototype.toLowerCase), Tt = j(String.prototype.toString), yt = j(String.prototype.match), $e = j(String.prototype.replace), $r = j(String.prototype.indexOf), Pr = j(String.prototype.trim), ee = j(Object.prototype.hasOwnProperty), G = j(RegExp.prototype.test), Pe = zr(TypeError);
function j(s) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
      r[t - 1] = arguments[t];
    return Nt(s, e, r);
  };
}
function zr(s) {
  return function() {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    return $t(s, n);
  };
}
function b(s, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Je;
  An && An(s, null);
  let r = e.length;
  for (; r--; ) {
    let t = e[r];
    if (typeof t == "string") {
      const l = n(t);
      l !== t && (Ir(e) || (e[r] = l), t = l);
    }
    s[t] = !0;
  }
  return s;
}
function Br(s) {
  for (let e = 0; e < s.length; e++)
    ee(s, e) || (s[e] = null);
  return s;
}
function le(s) {
  const e = Ot(null);
  for (const [n, r] of Kn(s))
    ee(s, n) && (Array.isArray(r) ? e[n] = Br(r) : r && typeof r == "object" && r.constructor === Object ? e[n] = le(r) : e[n] = r);
  return e;
}
function ze(s, e) {
  for (; s !== null; ) {
    const r = Dr(s, e);
    if (r) {
      if (r.get)
        return j(r.get);
      if (typeof r.value == "function")
        return j(r.value);
    }
    s = Mr(s);
  }
  function n() {
    return null;
  }
  return n;
}
const Rn = Y(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), St = Y(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), At = Y(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Fr = Y(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Et = Y(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Ur = Y(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Cn = Y(["#text"]), Ln = Y(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Rt = Y(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), In = Y(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Ke = Y(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Hr = J(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Wr = J(/<%[\w\W]*|[\w\W]*%>/gm), Gr = J(/\$\{[\w\W]*/gm), qr = J(/^data-[\-\w.\u00B7-\uFFFF]+$/), Zr = J(/^aria-[\-\w]+$/), Jn = J(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Yr = J(/^(?:\w+script|data):/i), jr = J(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), es = J(/^html$/i), Vr = J(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Mn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Zr,
  ATTR_WHITESPACE: jr,
  CUSTOM_ELEMENT: Vr,
  DATA_ATTR: qr,
  DOCTYPE_NAME: es,
  ERB_EXPR: Wr,
  IS_ALLOWED_URI: Jn,
  IS_SCRIPT_OR_DATA: Yr,
  MUSTACHE_EXPR: Hr,
  TMPLIT_EXPR: Gr
});
const Be = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Xr = function() {
  return typeof window > "u" ? null : window;
}, Qr = function(e, n) {
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
}, Dn = function() {
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
function ts() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Xr();
  const e = (d) => ts(d);
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
    trustedTypes: v
  } = s, _ = o.prototype, k = ze(_, "cloneNode"), E = ze(_, "remove"), x = ze(_, "nextSibling"), R = ze(_, "childNodes"), H = ze(_, "parentNode");
  if (typeof i == "function") {
    const d = n.createElement("template");
    d.content && d.content.ownerDocument && (n = d.content.ownerDocument);
  }
  let T, $ = "";
  const {
    implementation: X,
    createNodeIterator: it,
    createDocumentFragment: ns,
    getElementsByTagName: ss
  } = n, {
    importNode: rs
  } = r;
  let W = Dn();
  e.isSupported = typeof Kn == "function" && typeof H == "function" && X && X.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: lt,
    ERB_EXPR: ot,
    TMPLIT_EXPR: ct,
    DATA_ATTR: as,
    ARIA_ATTR: is,
    IS_SCRIPT_OR_DATA: ls,
    ATTR_WHITESPACE: Vt,
    CUSTOM_ELEMENT: os
  } = Mn;
  let {
    IS_ALLOWED_URI: Xt
  } = Mn, N = null;
  const Qt = b({}, [...Rn, ...St, ...At, ...Et, ...Cn]);
  let P = null;
  const Kt = b({}, [...Ln, ...Rt, ...In, ...Ke]);
  let L = Object.seal(Ot(null, {
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
  })), Le = null, ut = null;
  const we = Object.seal(Ot(null, {
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
  let Jt = !0, pt = !0, en = !1, tn = !0, ve = !1, We = !0, ge = !1, ht = !1, ft = !1, Te = !1, Ge = !1, qe = !1, nn = !0, sn = !1;
  const cs = "user-content-";
  let dt = !0, Ie = !1, ye = {}, re = null;
  const gt = b({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let rn = null;
  const an = b({}, ["audio", "video", "img", "source", "image", "track"]);
  let mt = null;
  const ln = b({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ze = "http://www.w3.org/1998/Math/MathML", Ye = "http://www.w3.org/2000/svg", ce = "http://www.w3.org/1999/xhtml";
  let Se = ce, kt = !1, _t = null;
  const us = b({}, [Ze, Ye, ce], Tt);
  let je = b({}, ["mi", "mo", "mn", "ms", "mtext"]), Ve = b({}, ["annotation-xml"]);
  const ps = b({}, ["title", "style", "font", "a", "script"]);
  let Me = null;
  const hs = ["application/xhtml+xml", "text/html"], fs = "text/html";
  let D = null, Ae = null;
  const ds = n.createElement("form"), on = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, bt = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(Ae && Ae === a)) {
      if ((!a || typeof a != "object") && (a = {}), a = le(a), Me = // eslint-disable-next-line unicorn/prefer-includes
      hs.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? fs : a.PARSER_MEDIA_TYPE, D = Me === "application/xhtml+xml" ? Tt : Je, N = ee(a, "ALLOWED_TAGS") ? b({}, a.ALLOWED_TAGS, D) : Qt, P = ee(a, "ALLOWED_ATTR") ? b({}, a.ALLOWED_ATTR, D) : Kt, _t = ee(a, "ALLOWED_NAMESPACES") ? b({}, a.ALLOWED_NAMESPACES, Tt) : us, mt = ee(a, "ADD_URI_SAFE_ATTR") ? b(le(ln), a.ADD_URI_SAFE_ATTR, D) : ln, rn = ee(a, "ADD_DATA_URI_TAGS") ? b(le(an), a.ADD_DATA_URI_TAGS, D) : an, re = ee(a, "FORBID_CONTENTS") ? b({}, a.FORBID_CONTENTS, D) : gt, Le = ee(a, "FORBID_TAGS") ? b({}, a.FORBID_TAGS, D) : le({}), ut = ee(a, "FORBID_ATTR") ? b({}, a.FORBID_ATTR, D) : le({}), ye = ee(a, "USE_PROFILES") ? a.USE_PROFILES : !1, Jt = a.ALLOW_ARIA_ATTR !== !1, pt = a.ALLOW_DATA_ATTR !== !1, en = a.ALLOW_UNKNOWN_PROTOCOLS || !1, tn = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, ve = a.SAFE_FOR_TEMPLATES || !1, We = a.SAFE_FOR_XML !== !1, ge = a.WHOLE_DOCUMENT || !1, Te = a.RETURN_DOM || !1, Ge = a.RETURN_DOM_FRAGMENT || !1, qe = a.RETURN_TRUSTED_TYPE || !1, ft = a.FORCE_BODY || !1, nn = a.SANITIZE_DOM !== !1, sn = a.SANITIZE_NAMED_PROPS || !1, dt = a.KEEP_CONTENT !== !1, Ie = a.IN_PLACE || !1, Xt = a.ALLOWED_URI_REGEXP || Jn, Se = a.NAMESPACE || ce, je = a.MATHML_TEXT_INTEGRATION_POINTS || je, Ve = a.HTML_INTEGRATION_POINTS || Ve, L = a.CUSTOM_ELEMENT_HANDLING || {}, a.CUSTOM_ELEMENT_HANDLING && on(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (L.tagNameCheck = a.CUSTOM_ELEMENT_HANDLING.tagNameCheck), a.CUSTOM_ELEMENT_HANDLING && on(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (L.attributeNameCheck = a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), a.CUSTOM_ELEMENT_HANDLING && typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (L.allowCustomizedBuiltInElements = a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), ve && (pt = !1), Ge && (Te = !0), ye && (N = b({}, Cn), P = [], ye.html === !0 && (b(N, Rn), b(P, Ln)), ye.svg === !0 && (b(N, St), b(P, Rt), b(P, Ke)), ye.svgFilters === !0 && (b(N, At), b(P, Rt), b(P, Ke)), ye.mathMl === !0 && (b(N, Et), b(P, In), b(P, Ke))), a.ADD_TAGS && (typeof a.ADD_TAGS == "function" ? we.tagCheck = a.ADD_TAGS : (N === Qt && (N = le(N)), b(N, a.ADD_TAGS, D))), a.ADD_ATTR && (typeof a.ADD_ATTR == "function" ? we.attributeCheck = a.ADD_ATTR : (P === Kt && (P = le(P)), b(P, a.ADD_ATTR, D))), a.ADD_URI_SAFE_ATTR && b(mt, a.ADD_URI_SAFE_ATTR, D), a.FORBID_CONTENTS && (re === gt && (re = le(re)), b(re, a.FORBID_CONTENTS, D)), a.ADD_FORBID_CONTENTS && (re === gt && (re = le(re)), b(re, a.ADD_FORBID_CONTENTS, D)), dt && (N["#text"] = !0), ge && b(N, ["html", "head", "body"]), N.table && (b(N, ["tbody"]), delete Le.tbody), a.TRUSTED_TYPES_POLICY) {
        if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        T = a.TRUSTED_TYPES_POLICY, $ = T.createHTML("");
      } else
        T === void 0 && (T = Qr(v, t)), T !== null && typeof $ == "string" && ($ = T.createHTML(""));
      Y && Y(a), Ae = a;
    }
  }, cn = b({}, [...St, ...At, ...Fr]), un = b({}, [...Et, ...Ur]), gs = function(a) {
    let u = H(a);
    (!u || !u.tagName) && (u = {
      namespaceURI: Se,
      tagName: "template"
    });
    const f = Je(a.tagName), A = Je(u.tagName);
    return _t[a.namespaceURI] ? a.namespaceURI === Ye ? u.namespaceURI === ce ? f === "svg" : u.namespaceURI === Ze ? f === "svg" && (A === "annotation-xml" || je[A]) : !!cn[f] : a.namespaceURI === Ze ? u.namespaceURI === ce ? f === "math" : u.namespaceURI === Ye ? f === "math" && Ve[A] : !!un[f] : a.namespaceURI === ce ? u.namespaceURI === Ye && !Ve[A] || u.namespaceURI === Ze && !je[A] ? !1 : !un[f] && (ps[f] || !cn[f]) : !!(Me === "application/xhtml+xml" && _t[a.namespaceURI]) : !1;
  }, ae = function(a) {
    Ne(e.removed, {
      element: a
    });
    try {
      H(a).removeChild(a);
    } catch {
      E(a);
    }
  }, me = function(a, u) {
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
      if (Te || Ge)
        try {
          ae(u);
        } catch {
        }
      else
        try {
          u.setAttribute(a, "");
        } catch {
        }
  }, pn = function(a) {
    let u = null, f = null;
    if (ft)
      a = "<remove></remove>" + a;
    else {
      const M = yt(a, /^[\r\n\t ]+/);
      f = M && M[0];
    }
    Me === "application/xhtml+xml" && Se === ce && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const A = T ? T.createHTML(a) : a;
    if (Se === ce)
      try {
        u = new g().parseFromString(A, Me);
      } catch {
      }
    if (!u || !u.documentElement) {
      u = X.createDocument(Se, "template", null);
      try {
        u.documentElement.innerHTML = kt ? $ : A;
      } catch {
      }
    }
    const F = u.body || u.documentElement;
    return a && f && F.insertBefore(n.createTextNode(f), F.childNodes[0] || null), Se === ce ? ss.call(u, ge ? "html" : "body")[0] : ge ? u.documentElement : F;
  }, hn = function(a) {
    return it.call(
      a.ownerDocument || a,
      a,
      // eslint-disable-next-line no-bitwise
      h.SHOW_ELEMENT | h.SHOW_COMMENT | h.SHOW_TEXT | h.SHOW_PROCESSING_INSTRUCTION | h.SHOW_CDATA_SECTION,
      null
    );
  }, xt = function(a) {
    return a instanceof m && (typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || !(a.attributes instanceof p) || typeof a.removeAttribute != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function");
  }, fn = function(a) {
    return typeof c == "function" && a instanceof c;
  };
  function ue(d, a, u) {
    Qe(d, (f) => {
      f.call(e, a, u, Ae);
    });
  }
  const dn = function(a) {
    let u = null;
    if (ue(W.beforeSanitizeElements, a, null), xt(a))
      return ae(a), !0;
    const f = D(a.nodeName);
    if (ue(W.uponSanitizeElement, a, {
      tagName: f,
      allowedTags: N
    }), We && a.hasChildNodes() && !fn(a.firstElementChild) && G(/<[/\w!]/g, a.innerHTML) && G(/<[/\w!]/g, a.textContent) || a.nodeType === Be.progressingInstruction || We && a.nodeType === Be.comment && G(/<[/\w]/g, a.data))
      return ae(a), !0;
    if (!(we.tagCheck instanceof Function && we.tagCheck(f)) && (!N[f] || Le[f])) {
      if (!Le[f] && mn(f) && (L.tagNameCheck instanceof RegExp && G(L.tagNameCheck, f) || L.tagNameCheck instanceof Function && L.tagNameCheck(f)))
        return !1;
      if (dt && !re[f]) {
        const A = H(a) || a.parentNode, F = R(a) || a.childNodes;
        if (F && A) {
          const M = F.length;
          for (let Q = M - 1; Q >= 0; --Q) {
            const pe = k(F[Q], !0);
            pe.__removalCount = (a.__removalCount || 0) + 1, A.insertBefore(pe, x(a));
          }
        }
      }
      return ae(a), !0;
    }
    return a instanceof o && !gs(a) || (f === "noscript" || f === "noembed" || f === "noframes") && G(/<\/no(script|embed|frames)/i, a.innerHTML) ? (ae(a), !0) : (ve && a.nodeType === Be.text && (u = a.textContent, Qe([lt, ot, ct], (A) => {
      u = $e(u, A, " ");
    }), a.textContent !== u && (Ne(e.removed, {
      element: a.cloneNode()
    }), a.textContent = u)), ue(W.afterSanitizeElements, a, null), !1);
  }, gn = function(a, u, f) {
    if (nn && (u === "id" || u === "name") && (f in n || f in ds))
      return !1;
    if (!(pt && !ut[u] && G(as, u))) {
      if (!(Jt && G(is, u))) {
        if (!(we.attributeCheck instanceof Function && we.attributeCheck(u, a))) {
          if (!P[u] || ut[u]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(mn(a) && (L.tagNameCheck instanceof RegExp && G(L.tagNameCheck, a) || L.tagNameCheck instanceof Function && L.tagNameCheck(a)) && (L.attributeNameCheck instanceof RegExp && G(L.attributeNameCheck, u) || L.attributeNameCheck instanceof Function && L.attributeNameCheck(u, a)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              u === "is" && L.allowCustomizedBuiltInElements && (L.tagNameCheck instanceof RegExp && G(L.tagNameCheck, f) || L.tagNameCheck instanceof Function && L.tagNameCheck(f)))
            ) return !1;
          } else if (!mt[u]) {
            if (!G(Xt, $e(f, Vt, ""))) {
              if (!((u === "src" || u === "xlink:href" || u === "href") && a !== "script" && $r(f, "data:") === 0 && rn[a])) {
                if (!(en && !G(ls, $e(f, Vt, "")))) {
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
  }, mn = function(a) {
    return a !== "annotation-xml" && yt(a, os);
  }, kn = function(a) {
    ue(W.beforeSanitizeAttributes, a, null);
    const {
      attributes: u
    } = a;
    if (!u || xt(a))
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
      const F = u[A], {
        name: M,
        namespaceURI: Q,
        value: pe
      } = F, Ee = D(M), wt = pe;
      let z = M === "value" ? wt : Pr(wt);
      if (f.attrName = Ee, f.attrValue = z, f.keepAttr = !0, f.forceKeepAttr = void 0, ue(W.uponSanitizeAttribute, a, f), z = f.attrValue, sn && (Ee === "id" || Ee === "name") && (me(M, a), z = cs + z), We && G(/((--!?|])>)|<\/(style|title|textarea)/i, z)) {
        me(M, a);
        continue;
      }
      if (Ee === "attributename" && yt(z, "href")) {
        me(M, a);
        continue;
      }
      if (f.forceKeepAttr)
        continue;
      if (!f.keepAttr) {
        me(M, a);
        continue;
      }
      if (!tn && G(/\/>/i, z)) {
        me(M, a);
        continue;
      }
      ve && Qe([lt, ot, ct], (bn) => {
        z = $e(z, bn, " ");
      });
      const _n = D(a.nodeName);
      if (!gn(_n, Ee, z)) {
        me(M, a);
        continue;
      }
      if (T && typeof v == "object" && typeof v.getAttributeType == "function" && !Q)
        switch (v.getAttributeType(_n, Ee)) {
          case "TrustedHTML": {
            z = T.createHTML(z);
            break;
          }
          case "TrustedScriptURL": {
            z = T.createScriptURL(z);
            break;
          }
        }
      if (z !== wt)
        try {
          Q ? a.setAttributeNS(Q, M, z) : a.setAttribute(M, z), xt(a) ? ae(a) : En(e.removed);
        } catch {
          me(M, a);
        }
    }
    ue(W.afterSanitizeAttributes, a, null);
  }, ms = function d(a) {
    let u = null;
    const f = hn(a);
    for (ue(W.beforeSanitizeShadowDOM, a, null); u = f.nextNode(); )
      ue(W.uponSanitizeShadowNode, u, null), dn(u), kn(u), u.content instanceof l && d(u.content);
    ue(W.afterSanitizeShadowDOM, a, null);
  };
  return e.sanitize = function(d) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, f = null, A = null, F = null;
    if (kt = !d, kt && (d = "<!-->"), typeof d != "string" && !fn(d))
      if (typeof d.toString == "function") {
        if (d = d.toString(), typeof d != "string")
          throw Pe("dirty is not a string, aborting");
      } else
        throw Pe("toString is not a function");
    if (!e.isSupported)
      return d;
    if (ht || bt(a), e.removed = [], typeof d == "string" && (Ie = !1), Ie) {
      if (d.nodeName) {
        const pe = D(d.nodeName);
        if (!N[pe] || Le[pe])
          throw Pe("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (d instanceof c)
      u = pn("<!---->"), f = u.ownerDocument.importNode(d, !0), f.nodeType === Be.element && f.nodeName === "BODY" || f.nodeName === "HTML" ? u = f : u.appendChild(f);
    else {
      if (!Te && !ve && !ge && // eslint-disable-next-line unicorn/prefer-includes
      d.indexOf("<") === -1)
        return T && qe ? T.createHTML(d) : d;
      if (u = pn(d), !u)
        return Te ? null : qe ? $ : "";
    }
    u && ft && ae(u.firstChild);
    const M = hn(Ie ? d : u);
    for (; A = M.nextNode(); )
      dn(A), kn(A), A.content instanceof l && ms(A.content);
    if (Ie)
      return d;
    if (Te) {
      if (Ge)
        for (F = ns.call(u.ownerDocument); u.firstChild; )
          F.appendChild(u.firstChild);
      else
        F = u;
      return (P.shadowroot || P.shadowrootmode) && (F = rs.call(r, F, !0)), F;
    }
    let Q = ge ? u.outerHTML : u.innerHTML;
    return ge && N["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && G(es, u.ownerDocument.doctype.name) && (Q = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + Q), ve && Qe([lt, ot, ct], (pe) => {
      Q = $e(Q, pe, " ");
    }), T && qe ? T.createHTML(Q) : Q;
  }, e.setConfig = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    bt(d), ht = !0;
  }, e.clearConfig = function() {
    Ae = null, ht = !1;
  }, e.isValidAttribute = function(d, a, u) {
    Ae || bt({});
    const f = D(d), A = D(a);
    return gn(f, A, u);
  }, e.addHook = function(d, a) {
    typeof a == "function" && Ne(W[d], a);
  }, e.removeHook = function(d, a) {
    if (a !== void 0) {
      const u = Or(W[d], a);
      return u === -1 ? void 0 : Nr(W[d], u, 1)[0];
    }
    return En(W[d]);
  }, e.removeHooks = function(d) {
    W[d] = [];
  }, e.removeAllHooks = function() {
    W = Dn();
  }, e;
}
var Kr = ts();
const Jr = {}, ea = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ta(s, e) {
  return y(), I("svg", ea, [...e[0] || (e[0] = [
    B("path", { d: "M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" }, null, -1)
  ])]);
}
const na = /* @__PURE__ */ V(Jr, [["render", ta]]), sa = {}, ra = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function aa(s, e) {
  return y(), I("svg", ra, [...e[0] || (e[0] = [
    B("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }, null, -1)
  ])]);
}
const ia = /* @__PURE__ */ V(sa, [["render", aa]]), la = {}, oa = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ca(s, e) {
  return y(), I("svg", oa, [...e[0] || (e[0] = [
    B("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }, null, -1)
  ])]);
}
const ua = /* @__PURE__ */ V(la, [["render", ca]]), pa = ["aria-label"], ha = {
  key: 0,
  class: "nc-message-bubble__header"
}, fa = {
  key: 0,
  class: "nc-message-bubble__label"
}, da = { class: "nc-message-bubble__bubble" }, ga = {
  key: 0,
  class: "nc-message-bubble__content"
}, ma = ["innerHTML"], ka = /* @__PURE__ */ de({
  __name: "MessageBubble",
  props: {
    message: {},
    animate: { type: Boolean, default: !1 }
  },
  setup(s) {
    const e = s, n = he(Ue, void 0), r = q(() => n?.showBubbleHeaders ?? !0), t = q(() => n?.assistantBubbleFullWidth ?? !1), l = q(() => e.message.role === "user"), i = q(
      () => e.message.status === "failed" || e.message.id.startsWith("error-")
    ), c = q(() => e.message.status === "sending"), o = q(() => e.message.role === "assistant" && !i.value), h = q(() => {
      if (e.message.role !== "assistant" || i.value) return null;
      const _ = S.parse(e.message.content);
      return Kr.sanitize(_);
    }), p = q(() => i.value ? "Error message" : l.value ? "Message from you" : "Message from AI Assistant"), m = K(!1);
    let g = null;
    async function v() {
      try {
        await navigator.clipboard.writeText(e.message.content), m.value = !0, g && clearTimeout(g), g = setTimeout(() => {
          m.value = !1;
        }, 1500);
      } catch {
      }
    }
    return Pn(() => {
      g && clearTimeout(g);
    }), (_, k) => {
      const E = O("v-icon"), x = O("v-avatar"), R = O("v-btn");
      return y(), I("li", {
        role: "listitem",
        "aria-label": p.value,
        class: Pt(["nc-message-bubble", {
          "nc-message-bubble--user": l.value,
          "nc-message-bubble--assistant": o.value,
          "nc-message-bubble--error": i.value,
          "nc-message-bubble--sending": c.value,
          "nc-message-bubble--flat": o.value && t.value,
          "nc-message-bubble--animate-in": e.animate
        }])
      }, [
        r.value ? (y(), I("div", ha, [
          l.value ? (y(), I("span", fa, "You")) : i.value ? (y(), I(Ct, { key: 1 }, [
            C(na, { class: "nc-message-bubble__warning-icon" }),
            k[0] || (k[0] = B("span", { class: "nc-message-bubble__label" }, "Error", -1))
          ], 64)) : (y(), I(Ct, { key: 2 }, [
            C(x, {
              color: "secondary",
              size: "29"
            }, {
              default: U(() => [
                C(E, {
                  icon: Bt,
                  color: "white",
                  size: "15"
                })
              ]),
              _: 1
            }),
            k[1] || (k[1] = B("span", { class: "nc-message-bubble__label" }, "AI Assistant", -1))
          ], 64))
        ])) : Lt("", !0),
        B("div", da, [
          l.value || i.value ? (y(), I("div", ga, $n(s.message.content), 1)) : (y(), I("div", {
            key: 1,
            class: "nc-message-bubble__content",
            innerHTML: h.value
          }, null, 8, ma))
        ]),
        o.value ? (y(), oe(R, {
          key: 1,
          icon: "",
          variant: "text",
          density: "comfortable",
          size: "small",
          class: "mt-1",
          "aria-label": m.value ? "Message copied" : "Copy message",
          onClick: v
        }, {
          default: U(() => [
            C(E, {
              icon: m.value ? ua : ia,
              size: "small",
              color: m.value ? "success" : "title"
            }, null, 8, ["icon", "color"])
          ]),
          _: 1
        }, 8, ["aria-label"])) : Lt("", !0)
      ], 10, pa);
    };
  }
}), _a = /* @__PURE__ */ V(ka, [["__scopeId", "data-v-8b3aa1a9"]]), ba = {}, xa = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function wa(s, e) {
  return y(), I("svg", xa, [...e[0] || (e[0] = [
    B("path", { d: "M19.79 13.267a.75.75 0 0 0-1.086-1.034l-5.954 6.251V3.75a.75.75 0 1 0-1.5 0v14.734l-5.955-6.251a.75.75 0 0 0-1.086 1.034l7.067 7.42c.16.168.366.268.58.3a.753.753 0 0 0 .29-.001.995.995 0 0 0 .578-.3l7.067-7.419Z" }, null, -1)
  ])]);
}
const va = /* @__PURE__ */ V(ba, [["render", wa]]), Ta = { class: "nc-message-list-wrapper" }, ya = {
  role: "list",
  "aria-live": "polite",
  class: "nc-message-list"
}, Sa = { class: "nc-message-list__loader" }, Aa = { class: "nc-scroll-fab" }, Ea = 50, Ra = /* @__PURE__ */ de({
  __name: "MessageList",
  setup(s) {
    const e = he(Ce), n = st("scrollContainer"), r = K(!0), t = /* @__PURE__ */ new Set(), l = K(/* @__PURE__ */ new Set());
    let i = !1, c = !1;
    _e(
      () => e.messages.value,
      (k) => {
        const E = /* @__PURE__ */ new Set();
        i && !c && k.forEach((x) => {
          t.has(x.id) || E.add(x.id);
        }), k.forEach((x) => t.add(x.id)), l.value = E;
      }
    );
    function o() {
      const k = n.value?.$el;
      return k instanceof HTMLElement ? k : null;
    }
    function h() {
      const k = o();
      if (!k) return;
      const { scrollTop: E, scrollHeight: x, clientHeight: R } = k;
      r.value = x - E - R <= Ea;
    }
    function p() {
      const k = o();
      k && (k.scrollTop = k.scrollHeight);
    }
    let m = e.messages.value.length > 0 ? e.messages.value[e.messages.value.length - 1].id : null, g = !1, v = !1;
    _e(
      () => e.messages.value,
      (k) => {
        const E = k.length > 0 ? k[k.length - 1].id : null, x = E !== null && E !== m;
        m = E, x && (g ? v = !0 : fe(p));
      }
    ), ks(() => {
      e.messages.value.forEach((E) => t.add(E.id)), fe(() => {
        i = !0;
      }), e.messages.value.length > 0 && fe(p), o()?.addEventListener("scroll", h, { passive: !0 });
    }), Pn(() => {
      o()?.removeEventListener("scroll", h);
    });
    async function _({ done: k }) {
      c = !0, g = !0;
      try {
        await e.loadMore(), k(e.hasMore.value ? "ok" : "empty");
      } catch {
        k("error");
      }
      await fe(), c = !1, g = !1, v && (v = !1, fe(p));
    }
    return (k, E) => {
      const x = O("v-progress-circular"), R = O("v-infinite-scroll"), H = O("v-icon"), T = O("v-btn");
      return y(), I("div", Ta, [
        C(R, {
          ref: "scrollContainer",
          side: "start",
          disabled: !se(e).hasMore.value,
          class: "nc-message-list-scroll",
          onLoad: _
        }, {
          loading: U(() => [
            B("div", Sa, [
              C(x, {
                indeterminate: "",
                size: "24",
                width: "2"
              })
            ])
          ]),
          empty: U(() => [...E[0] || (E[0] = [])]),
          default: U(() => [
            B("ul", ya, [
              (y(!0), I(Ct, null, _s(se(e).messages.value, ($) => (y(), oe(_a, {
                key: $.id,
                message: $,
                animate: l.value.has($.id)
              }, null, 8, ["message", "animate"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["disabled"]),
        C(zt, { name: "nc-scroll-fab" }, {
          default: U(() => [
            On(B("div", Aa, [
              C(T, {
                icon: "",
                variant: "elevated",
                color: "surface",
                size: "small",
                "aria-label": "Scroll to latest messages",
                onClick: p
              }, {
                default: U(() => [
                  C(H, { icon: va })
                ]),
                _: 1
              })
            ], 512), [
              [Nn, !r.value]
            ])
          ]),
          _: 1
        })
      ]);
    };
  }
}), Ca = /* @__PURE__ */ V(Ra, [["__scopeId", "data-v-ace94df9"]]), La = {}, Ia = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ma(s, e) {
  return y(), I("svg", Ia, [...e[0] || (e[0] = [
    B("path", { d: "m12.815 12.197-7.532 1.256a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.943l18-9a.75.75 0 0 0 0-1.342l-18-9c-.614-.307-1.283.304-1.035.943l2.598 6.957a.5.5 0 0 0 .386.319l7.532 1.255a.2.2 0 0 1 0 .394Z" }, null, -1)
  ])]);
}
const Da = /* @__PURE__ */ V(La, [["render", Ma]]), Oa = { class: "nc-chat-input" }, Na = /* @__PURE__ */ de({
  __name: "ChatInput",
  setup(s) {
    const e = he(Ce), n = K(""), r = st("textareaRef"), t = q(() => n.value.trim().length > 0 && !e.isSending.value);
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
    return _e(
      () => e.failedMessageText.value,
      (c) => {
        c && (n.value = c);
      }
    ), _e(
      () => e.isOpen.value,
      (c) => {
        c && fe(() => {
          r.value?.focus();
        });
      },
      { immediate: !0 }
    ), _e(
      () => e.isSending.value,
      (c, o) => {
        o && !c && fe(() => {
          r.value?.focus();
        });
      }
    ), (c, o) => {
      const h = O("v-progress-circular"), p = O("v-icon"), m = O("v-btn"), g = O("v-textarea");
      return y(), I("div", Oa, [
        C(g, {
          ref_key: "textareaRef",
          ref: r,
          modelValue: n.value,
          "onUpdate:modelValue": o[0] || (o[0] = (v) => n.value = v),
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
          disabled: se(e).isSending.value,
          class: "nc-chat-input__textarea",
          onKeydown: i
        }, {
          "append-inner": U(() => [
            C(m, {
              icon: "",
              variant: "text",
              density: "comfortable",
              color: t.value || se(e).isSending.value ? "primary" : void 0,
              disabled: !t.value,
              "aria-label": "Send message",
              onClick: l
            }, {
              default: U(() => [
                se(e).isSending.value ? (y(), oe(h, {
                  key: 0,
                  indeterminate: "",
                  size: 16,
                  width: 2,
                  color: "primary"
                })) : (y(), oe(p, {
                  key: 1,
                  icon: Da,
                  color: "secondary"
                }))
              ]),
              _: 1
            }, 8, ["color", "disabled"])
          ]),
          _: 1
        }, 8, ["modelValue", "disabled"])
      ]);
    };
  }
}), $a = /* @__PURE__ */ V(Na, [["__scopeId", "data-v-81fc160e"]]), Pa = { class: "nc-chat-panel__body" }, za = /* @__PURE__ */ de({
  __name: "ChatPanel",
  setup(s) {
    const e = he(Ce), n = he(Ue), r = q(() => n?.welcomeMessage), t = vs(), l = q(() => t.width.value < 768), i = (c) => {
      c.key === "Escape" && e.isOpen.value && e.close();
    };
    return _e(
      () => e.isOpen.value,
      (c) => {
        c ? window.addEventListener("keydown", i) : window.removeEventListener("keydown", i);
      },
      { immediate: !0 }
    ), bs(() => {
      window.removeEventListener("keydown", i);
    }), (c, o) => {
      const h = O("v-progress-circular"), p = O("v-theme-provider");
      return y(), oe(xs, { to: "body" }, [
        C(zt, { name: "nc-panel" }, {
          default: U(() => [
            se(e).isOpen.value ? (y(), oe(p, {
              key: 0,
              theme: "nativeChat",
              "with-background": "",
              class: Pt(["nc-chat-panel border-md", { "nc-chat-panel--mobile": l.value }]),
              role: "complementary",
              "aria-label": "Chat with AI Assistant"
            }, {
              default: U(() => [
                C(Ps),
                B("div", Pa, [
                  se(e).isLoading.value && se(e).messages.value.length === 0 ? (y(), oe(h, {
                    key: 0,
                    indeterminate: "",
                    size: "24",
                    class: "nc-chat-panel__loader"
                  })) : se(e).messages.value.length === 0 && !se(e).isSending.value ? (y(), oe(Us, {
                    key: 1,
                    message: r.value
                  }, null, 8, ["message"])) : (y(), oe(Ca, { key: 2 }))
                ]),
                C($a)
              ]),
              _: 1
            }, 8, ["class"])) : Lt("", !0)
          ]),
          _: 1
        })
      ]);
    };
  }
}), Ba = /* @__PURE__ */ V(za, [["__scopeId", "data-v-c00684a0"]]), Fa = /* @__PURE__ */ de({
  __name: "NativeChatWidget",
  setup(s) {
    const e = Ts();
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
    const n = he(Ue), r = Ss(n.apiClient, n);
    ws(Ce, r);
    const t = st("floatingButtonRef");
    return _e(
      () => r.isOpen.value,
      (l) => {
        l || fe(() => {
          t.value?.focus();
        });
      }
    ), (l, i) => {
      const c = O("v-theme-provider");
      return y(), oe(c, { theme: "nativeChat" }, {
        default: U(() => [
          C(Ds, {
            ref_key: "floatingButtonRef",
            ref: t
          }, null, 512),
          C(Ba)
        ]),
        _: 1
      });
    };
  }
}), Ua = /* @__PURE__ */ V(Fa, [["__scopeId", "data-v-492f08ed"]]), Ga = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(Ue, e), s.component("NativeChatWidget", Ua);
  }
};
function qa(s) {
  if (!s?.axiosInstance)
    throw new Error("[native-chat-vue] createNativeChatApiClient requires an axiosInstance");
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
  Ga as NativeChatPlugin,
  Ua as NativeChatWidget,
  qa as createNativeChatApiClient,
  Ga as default
};
