import { ref as K, readonly as Re, openBlock as y, createElementBlock as M, createElementVNode as N, defineComponent as de, inject as fe, computed as Q, useTemplateRef as nt, resolveComponent as O, withDirectives as Dn, normalizeClass as Nt, createVNode as E, withCtx as U, Transition as Pt, vShow as On, unref as se, toDisplayString as $n, onBeforeUnmount as Nn, Fragment as Ct, createBlock as oe, createCommentVNode as Pn, watch as _e, nextTick as he, onMounted as ms, renderList as ks, onUnmounted as _s, Teleport as bs, provide as xs } from "vue";
import { useDisplay as ws, useTheme as Ts } from "vuetify";
const st = /* @__PURE__ */ Symbol("native-chat-config"), Ce = /* @__PURE__ */ Symbol("native-chat-state");
function vs(s) {
  if (s && typeof s == "object" && "statusCode" in s) {
    const e = s.statusCode;
    if (e === 429)
      return "You're sending messages too quickly. Please wait a moment and try again.";
    if (e === 503 || e === 504)
      return "The service is temporarily unavailable. Please try again in a moment.";
  }
  return "Something went wrong. You can try sending your message again.";
}
function ys(s, e) {
  const n = K([]), r = K(!1), t = K(!1), i = K(!1), l = K(!1), c = K(null), o = K(null), h = K(0), p = e.batchSize ?? 20;
  function m(x, R, H) {
    n.value = n.value.filter((V) => V.id !== H && !V.id.startsWith("error-"));
    const v = vs(x), P = {
      id: `error-${Date.now()}`,
      conversationId: o.value ?? "",
      role: "assistant",
      content: v,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "failed"
    };
    if (n.value = [...n.value, P], c.value = null, c.value = R, e.onError)
      try {
        Promise.resolve(
          e.onError({
            message: v,
            statusCode: x && typeof x == "object" && "statusCode" in x ? x.statusCode : void 0,
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
            const v = await s.createConversation();
            o.value = v.id;
          }
        }
        const x = await s.getMessages(o.value, 0, p), R = [...x.messages].reverse();
        n.value = R, l.value = x.has_more, h.value = R.length;
      } catch {
      } finally {
        t.value = !1, r.value = !0;
      }
    }
  }
  function w() {
    r.value = !1;
  }
  async function b(x) {
    if (!x.trim() || i.value) return;
    i.value = !0;
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
        const v = await s.createConversation();
        o.value = v.id;
      } catch (v) {
        m(v, x, R), i.value = !1;
        return;
      }
    try {
      const v = await s.sendMessage(o.value, x), P = {
        ...v.userMessage,
        status: "sent"
      }, V = {
        ...v.assistantMessage
      };
      n.value = [
        ...n.value.filter((it) => it.id !== R),
        P,
        V
      ], c.value = null;
    } catch (v) {
      m(v, x, R);
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
        ), R = [...x.messages].reverse();
        n.value = [...R, ...n.value], h.value += R.length, l.value = x.has_more;
      } catch {
      } finally {
        t.value = !1;
      }
    }
  }
  async function L() {
    if (!c.value) return;
    const x = c.value;
    c.value = null, await b(x);
  }
  return {
    messages: Re(n),
    isOpen: Re(r),
    isLoading: Re(t),
    isSending: Re(i),
    hasMore: Re(l),
    failedMessageText: Re(c),
    open: g,
    close: w,
    sendMessage: b,
    loadMore: k,
    retry: L
  };
}
const Tt = {
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
    title: "#9E9E9E"
  },
  variables: {
    "theme-overlay-multiplier": 1
  }
}, j = (s, e) => {
  const n = s.__vccOpts || s;
  for (const [r, t] of e)
    n[r] = t;
  return n;
}, Ss = {}, As = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Es(s, e) {
  return y(), M("svg", As, [...e[0] || (e[0] = [
    N("path", { d: "M10.788 3.103c.495-1.004 1.926-1.004 2.421 0l2.358 4.777 5.273.766c1.107.161 1.549 1.522.748 2.303l-3.816 3.72.901 5.25c.19 1.103-.968 1.944-1.959 1.424l-4.716-2.48-4.715 2.48c-.99.52-2.148-.32-1.96-1.424l.901-5.25-3.815-3.72c-.801-.78-.359-2.142.748-2.303L8.43 7.88l2.358-4.777Zm1.21.936L9.74 8.615a1.35 1.35 0 0 1-1.016.738l-5.05.734 3.654 3.562c.318.31.463.757.388 1.195l-.862 5.03 4.516-2.375a1.35 1.35 0 0 1 1.257 0l4.516 2.374-.862-5.029a1.35 1.35 0 0 1 .388-1.195l3.654-3.562-5.05-.734a1.35 1.35 0 0 1-1.016-.738l-2.259-4.576Z" }, null, -1)
  ])]);
}
const zt = /* @__PURE__ */ j(Ss, [["render", Es]]), Rs = {}, Cs = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ls(s, e) {
  return y(), M("svg", Cs, [...e[0] || (e[0] = [
    N("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const zn = /* @__PURE__ */ j(Rs, [["render", Ls]]), Is = /* @__PURE__ */ de({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const n = fe(st), r = fe(Ce), t = Q(() => r.isOpen.value), i = Q(() => t.value && (n?.hideToggleWhenOpen ?? !1)), l = Q(() => n?.position ?? "bottom-right"), c = Q(
      () => `nc-floating-button-wrapper--${l.value === "bottom-left" ? "left" : "right"}`
    );
    function o() {
      r.isOpen.value ? r.close() : r.open();
    }
    const h = nt("triggerBtn");
    function p() {
      h.value?.$el?.focus();
    }
    return e({ focus: p }), (m, g) => {
      const w = O("v-icon"), b = O("v-btn");
      return Dn((y(), M("div", {
        class: Nt(["nc-floating-button-wrapper", c.value])
      }, [
        E(b, {
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
            E(Pt, {
              name: "nc-fab-icon",
              mode: "out-in"
            }, {
              default: U(() => [
                (y(), M("span", {
                  key: t.value ? "close" : "star",
                  class: "nc-floating-button__icon-wrap"
                }, [
                  E(w, {
                    icon: t.value ? zn : zt,
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
        [On, !i.value]
      ]);
    };
  }
}), Ms = /* @__PURE__ */ j(Is, [["__scopeId", "data-v-ac00f54f"]]), Ds = { class: "nc-chat-header" }, Os = { class: "nc-chat-header__left" }, $s = /* @__PURE__ */ de({
  __name: "ChatHeader",
  setup(s) {
    const e = fe(Ce);
    return (n, r) => {
      const t = O("v-icon"), i = O("v-avatar"), l = O("v-btn");
      return y(), M("div", Ds, [
        N("div", Os, [
          E(i, {
            color: "secondary",
            size: "44"
          }, {
            default: U(() => [
              E(t, {
                icon: zt,
                color: "white",
                size: "20"
              })
            ]),
            _: 1
          }),
          r[1] || (r[1] = N("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
        ]),
        E(l, {
          icon: "",
          variant: "plain",
          size: "default",
          "aria-label": "Close chat",
          onClick: r[0] || (r[0] = (c) => se(e).close())
        }, {
          default: U(() => [
            E(t, {
              icon: zn,
              size: "22"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}), Ns = /* @__PURE__ */ j($s, [["__scopeId", "data-v-95f5c2ad"]]), Ps = { class: "nc-welcome-state" }, zs = { class: "nc-welcome-state__text" }, Bs = /* @__PURE__ */ de({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(s) {
    return (e, n) => (y(), M("div", Ps, [
      N("p", zs, $n(s.message ?? "Hello! How can I help you?"), 1)
    ]));
  }
}), Fs = /* @__PURE__ */ j(Bs, [["__scopeId", "data-v-6d3eccea"]]);
function Bt() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var xe = Bt();
function Bn(s) {
  xe = s;
}
var ke = { exec: () => null };
function T(s, e = "") {
  let n = typeof s == "string" ? s : s.source, r = { replace: (t, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(q.caret, "$1"), n = n.replace(t, l), r;
  }, getRegex: () => new RegExp(n, e) };
  return r;
}
var Us = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), q = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}>`) }, Hs = /^(?:[ \t]*(?:\n|$))+/, Gs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Ws = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ue = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, qs = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Ft = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Fn = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Un = T(Fn).replace(/bull/g, Ft).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Zs = T(Fn).replace(/bull/g, Ft).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Ut = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Ys = /^[^\n]+/, Ht = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, js = T(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ht).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Vs = T(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Ft).getRegex(), rt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Gt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Xs = T("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Gt).replace("tag", rt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Hn = T(Ut).replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), Qs = T(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hn).getRegex(), Wt = { blockquote: Qs, code: Gs, def: js, fences: Ws, heading: qs, hr: Ue, html: Xs, lheading: Un, list: Vs, newline: Hs, paragraph: Hn, table: ke, text: Ys }, bn = T("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), Ks = { ...Wt, lheading: Zs, table: bn, paragraph: T(Ut).replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", bn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex() }, Js = { ...Wt, html: T(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Gt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ke, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: T(Ut).replace("hr", Ue).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Un).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, er = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, tr = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Gn = /^( {2,}|\\)\n(?!\s*$)/, nr = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, at = /[\p{P}\p{S}]/u, qt = /[\s\p{P}\p{S}]/u, Wn = /[^\s\p{P}\p{S}]/u, sr = T(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, qt).getRegex(), qn = /(?!~)[\p{P}\p{S}]/u, rr = /(?!~)[\s\p{P}\p{S}]/u, ar = /(?:[^\s\p{P}\p{S}]|~)/u, Zn = /(?![*_])[\p{P}\p{S}]/u, ir = /(?![*_])[\s\p{P}\p{S}]/u, lr = /(?:[^\s\p{P}\p{S}]|[*_])/u, or = T(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Us ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Yn = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, cr = T(Yn, "u").replace(/punct/g, at).getRegex(), ur = T(Yn, "u").replace(/punct/g, qn).getRegex(), jn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", pr = T(jn, "gu").replace(/notPunctSpace/g, Wn).replace(/punctSpace/g, qt).replace(/punct/g, at).getRegex(), hr = T(jn, "gu").replace(/notPunctSpace/g, ar).replace(/punctSpace/g, rr).replace(/punct/g, qn).getRegex(), fr = T("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Wn).replace(/punctSpace/g, qt).replace(/punct/g, at).getRegex(), dr = T(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Zn).getRegex(), gr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", mr = T(gr, "gu").replace(/notPunctSpace/g, lr).replace(/punctSpace/g, ir).replace(/punct/g, Zn).getRegex(), kr = T(/\\(punct)/, "gu").replace(/punct/g, at).getRegex(), _r = T(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), br = T(Gt).replace("(?:-->|$)", "-->").getRegex(), xr = T("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", br).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Je = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, wr = T(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Je).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Vn = T(/^!?\[(label)\]\[(ref)\]/).replace("label", Je).replace("ref", Ht).getRegex(), Xn = T(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ht).getRegex(), Tr = T("reflink|nolink(?!\\()", "g").replace("reflink", Vn).replace("nolink", Xn).getRegex(), xn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Zt = { _backpedal: ke, anyPunctuation: kr, autolink: _r, blockSkip: or, br: Gn, code: tr, del: ke, delLDelim: ke, delRDelim: ke, emStrongLDelim: cr, emStrongRDelimAst: pr, emStrongRDelimUnd: fr, escape: er, link: wr, nolink: Xn, punctuation: sr, reflink: Vn, reflinkSearch: Tr, tag: xr, text: nr, url: ke }, vr = { ...Zt, link: T(/^!?\[(label)\]\((.*?)\)/).replace("label", Je).getRegex(), reflink: T(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Je).getRegex() }, Lt = { ...Zt, emStrongRDelimAst: hr, emStrongLDelim: ur, delLDelim: dr, delRDelim: mr, url: T(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", xn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: T(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", xn).getRegex() }, yr = { ...Lt, br: T(Gn).replace("{2,}", "*").getRegex(), text: T(Lt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Ve = { normal: Wt, gfm: Ks, pedantic: Js }, De = { normal: Zt, gfm: Lt, breaks: yr, pedantic: vr }, Sr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, wn = (s) => Sr[s];
function ie(s, e) {
  if (e) {
    if (q.escapeTest.test(s)) return s.replace(q.escapeReplace, wn);
  } else if (q.escapeTestNoEncode.test(s)) return s.replace(q.escapeReplaceNoEncode, wn);
  return s;
}
function Tn(s) {
  try {
    s = encodeURI(s).replace(q.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function vn(s, e) {
  let n = s.replace(q.findPipe, (i, l, c) => {
    let o = !1, h = l;
    for (; --h >= 0 && c[h] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = n.split(q.splitPipe), t = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; t < r.length; t++) r[t] = r[t].trim().replace(q.slashPipe, "|");
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
function Ar(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < s.length; r++) if (s[r] === "\\") r++;
  else if (s[r] === e[0]) n++;
  else if (s[r] === e[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function Er(s, e = 0) {
  let n = e, r = "";
  for (let t of s) if (t === "	") {
    let i = 4 - n % 4;
    r += " ".repeat(i), n += i;
  } else r += t, n++;
  return r;
}
function yn(s, e, n, r, t) {
  let i = e.href, l = e.title || null, c = s[1].replace(t.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let o = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: n, href: i, title: l, text: c, tokens: r.inlineTokens(c) };
  return r.state.inLink = !1, o;
}
function Rr(s, e, n) {
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
var et = class {
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
      let n = e[0], r = Rr(n, e[3] || "", this.rules);
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
        let m = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(p, i, !0), this.lexer.state.top = m, n.length === 0) break;
        let g = i.at(-1);
        if (g?.type === "code") break;
        if (g?.type === "blockquote") {
          let w = g, b = w.raw + `
` + n.join(`
`), k = this.blockquote(b);
          i[i.length - 1] = k, r = r.substring(0, r.length - w.raw.length) + k.raw, t = t.substring(0, t.length - w.text.length) + k.text;
          break;
        } else if (g?.type === "list") {
          let w = g, b = w.raw + `
` + n.join(`
`), k = this.list(b);
          i[i.length - 1] = k, r = r.substring(0, r.length - g.raw.length) + k.raw, t = t.substring(0, t.length - w.raw.length) + k.raw, n = b.substring(i.at(-1).raw.length).split(`
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
        let m = Er(e[2].split(`
`, 1)[0], e[1].length), g = s.split(`
`, 1)[0], w = !m.trim(), b = 0;
        if (this.options.pedantic ? (b = 2, p = m.trimStart()) : w ? b = e[1].length + 1 : (b = m.search(this.rules.other.nonSpaceChar), b = b > 4 ? 1 : b, p = m.slice(b), b += e[1].length), w && this.rules.other.blankLine.test(g) && (h += g + `
`, s = s.substring(g.length + 1), o = !0), !o) {
          let k = this.rules.other.nextBulletRegex(b), L = this.rules.other.hrRegex(b), x = this.rules.other.fencesBeginRegex(b), R = this.rules.other.headingBeginRegex(b), H = this.rules.other.htmlBeginRegex(b), v = this.rules.other.blockquoteBeginRegex(b);
          for (; s; ) {
            let P = s.split(`
`, 1)[0], V;
            if (g = P, this.options.pedantic ? (g = g.replace(this.rules.other.listReplaceNesting, "  "), V = g) : V = g.replace(this.rules.other.tabCharGlobal, "    "), x.test(g) || R.test(g) || H.test(g) || v.test(g) || k.test(g) || L.test(g)) break;
            if (V.search(this.rules.other.nonSpaceChar) >= b || !g.trim()) p += `
` + V.slice(b);
            else {
              if (w || m.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || x.test(m) || R.test(m) || L.test(m)) break;
              p += `
` + g;
            }
            w = !g.trim(), h += P + `
`, s = s.substring(P.length + 1), m = V.slice(b);
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
    let n = vn(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let l of r) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < n.length; l++) i.header.push({ text: n[l], tokens: this.lexer.inline(n[l]), header: !0, align: i.align[l] });
      for (let l of t) i.rows.push(vn(l, i.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[o] })));
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
        let i = Oe(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = Ar(e[2], "()");
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
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), yn(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: t && t.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
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
      return yn(n, t, n[0], this.lexer, this.rules);
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
        let p = [...r[0]][0].length, m = s.slice(0, t + r.index + p + l);
        if (Math.min(t, l) % 2) {
          let w = m.slice(1, -1);
          return { type: "em", raw: m, text: w, tokens: this.lexer.inlineTokens(w) };
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
      let t = [...r[0]].length - 1, i, l, c = t, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = o.exec(e)) != null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (l = [...i].length, l !== t)) continue;
        if (r[3] || r[4]) {
          c += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c);
        let h = [...r[0]][0].length, p = s.slice(0, t + r.index + h + l), m = p.slice(t, -t);
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
}, te = class It {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || xe, this.options.tokenizer = this.options.tokenizer || new et(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: q, block: Ve.normal, inline: De.normal };
    this.options.pedantic ? (n.block = Ve.pedantic, n.inline = De.pedantic) : this.options.gfm && (n.block = Ve.gfm, this.options.breaks ? n.inline = De.breaks : n.inline = De.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Ve, inline: De };
  }
  static lex(e, n) {
    return new It(n).lex(e);
  }
  static lexInline(e, n) {
    return new It(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(q.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let r = this.inlineQueue[n];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], r = !1) {
    for (this.options.pedantic && (e = e.replace(q.tabCharGlobal, "    ").replace(q.spaceLine, "")); e; ) {
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
        let p = 1 / 0, m = e.slice(1), g;
        this.options.extensions.startInline.forEach((w) => {
          g = w.call({ lexer: this }, m), typeof g == "number" && g >= 0 && (p = Math.min(p, g));
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
}, tt = class {
  options;
  parser;
  constructor(s) {
    this.options = s || xe;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: n }) {
    let r = (e || "").match(q.notSpaceStart)?.[0], t = s.replace(q.endingNewline, "") + `
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
    let i = '<a href="' + s + '"';
    return e && (i += ' title="' + ie(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: s, title: e, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let t = Tn(s);
    if (t === null) return ie(n);
    s = t;
    let i = `<img src="${s}" alt="${ie(n)}"`;
    return e && (i += ` title="${ie(e)}"`), i += ">", i;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : ie(s.text);
  }
}, Yt = class {
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
}, ne = class Mt {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || xe, this.options.renderer = this.options.renderer || new tt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Yt();
  }
  static parse(e, n) {
    return new Mt(n).parse(e);
  }
  static parseInline(e, n) {
    return new Mt(n).parseInline(e);
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
}, Cr = class {
  defaults = Bt();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = ne;
  Renderer = tt;
  TextRenderer = Yt;
  Lexer = te;
  Tokenizer = et;
  Hooks = Fe;
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
        let t = this.defaults.renderer || new tt(this.defaults);
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
        let t = this.defaults.tokenizer || new et(this.defaults);
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
        let t = this.defaults.hooks || new Fe();
        for (let i in n.hooks) {
          if (!(i in t)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let l = i, c = n.hooks[l], o = t[l];
          Fe.passThroughHooks.has(i) ? t[l] = (h) => {
            if (this.defaults.async && Fe.passThroughHooksRespectAsync.has(i)) return (async () => {
              let m = await c.call(t, h);
              return o.call(t, m);
            })();
            let p = c.call(t, h);
            return o.call(t, p);
          } : t[l] = (...h) => {
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
    return te.lex(s, e ?? this.defaults);
  }
  parser(s, e) {
    return ne.parse(s, e ?? this.defaults);
  }
  parseMarkdown(s) {
    return (e, n) => {
      let r = { ...n }, t = { ...this.defaults, ...r }, i = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && r.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let l = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : s ? te.lex : te.lexInline)(l, t), o = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(o, t.walkTokens));
        let h = await (t.hooks ? await t.hooks.provideParser() : s ? ne.parse : ne.parseInline)(o, t);
        return t.hooks ? await t.hooks.postprocess(h) : h;
      })().catch(i);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let l = (t.hooks ? t.hooks.provideLexer() : s ? te.lex : te.lexInline)(e, t);
        t.hooks && (l = t.hooks.processAllTokens(l)), t.walkTokens && this.walkTokens(l, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : s ? ne.parse : ne.parseInline)(l, t);
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
        let r = "<p>An error occurred:</p><pre>" + ie(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, be = new Cr();
function S(s, e) {
  return be.parse(s, e);
}
S.options = S.setOptions = function(s) {
  return be.setOptions(s), S.defaults = be.defaults, Bn(S.defaults), S;
};
S.getDefaults = Bt;
S.defaults = xe;
S.use = function(...s) {
  return be.use(...s), S.defaults = be.defaults, Bn(S.defaults), S;
};
S.walkTokens = function(s, e) {
  return be.walkTokens(s, e);
};
S.parseInline = be.parseInline;
S.Parser = ne;
S.parser = ne.parse;
S.Renderer = tt;
S.TextRenderer = Yt;
S.Lexer = te;
S.lexer = te.lex;
S.Tokenizer = et;
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
  entries: Qn,
  setPrototypeOf: Sn,
  isFrozen: Lr,
  getPrototypeOf: Ir,
  getOwnPropertyDescriptor: Mr
} = Object;
let {
  freeze: Z,
  seal: J,
  create: Dt
} = Object, {
  apply: Ot,
  construct: $t
} = typeof Reflect < "u" && Reflect;
Z || (Z = function(e) {
  return e;
});
J || (J = function(e) {
  return e;
});
Ot || (Ot = function(e, n) {
  for (var r = arguments.length, t = new Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
    t[i - 2] = arguments[i];
  return e.apply(n, t);
});
$t || ($t = function(e) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
    r[t - 1] = arguments[t];
  return new e(...r);
});
const Xe = Y(Array.prototype.forEach), Dr = Y(Array.prototype.lastIndexOf), An = Y(Array.prototype.pop), $e = Y(Array.prototype.push), Or = Y(Array.prototype.splice), Ke = Y(String.prototype.toLowerCase), vt = Y(String.prototype.toString), yt = Y(String.prototype.match), Ne = Y(String.prototype.replace), $r = Y(String.prototype.indexOf), Nr = Y(String.prototype.trim), ee = Y(Object.prototype.hasOwnProperty), W = Y(RegExp.prototype.test), Pe = Pr(TypeError);
function Y(s) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
      r[t - 1] = arguments[t];
    return Ot(s, e, r);
  };
}
function Pr(s) {
  return function() {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    return $t(s, n);
  };
}
function _(s, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ke;
  Sn && Sn(s, null);
  let r = e.length;
  for (; r--; ) {
    let t = e[r];
    if (typeof t == "string") {
      const i = n(t);
      i !== t && (Lr(e) || (e[r] = i), t = i);
    }
    s[t] = !0;
  }
  return s;
}
function zr(s) {
  for (let e = 0; e < s.length; e++)
    ee(s, e) || (s[e] = null);
  return s;
}
function le(s) {
  const e = Dt(null);
  for (const [n, r] of Qn(s))
    ee(s, n) && (Array.isArray(r) ? e[n] = zr(r) : r && typeof r == "object" && r.constructor === Object ? e[n] = le(r) : e[n] = r);
  return e;
}
function ze(s, e) {
  for (; s !== null; ) {
    const r = Mr(s, e);
    if (r) {
      if (r.get)
        return Y(r.get);
      if (typeof r.value == "function")
        return Y(r.value);
    }
    s = Ir(s);
  }
  function n() {
    return null;
  }
  return n;
}
const En = Z(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), St = Z(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), At = Z(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Br = Z(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Et = Z(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Fr = Z(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Rn = Z(["#text"]), Cn = Z(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Rt = Z(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Ln = Z(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Qe = Z(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Ur = J(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Hr = J(/<%[\w\W]*|[\w\W]*%>/gm), Gr = J(/\$\{[\w\W]*/gm), Wr = J(/^data-[\-\w.\u00B7-\uFFFF]+$/), qr = J(/^aria-[\-\w]+$/), Kn = J(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Zr = J(/^(?:\w+script|data):/i), Yr = J(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Jn = J(/^html$/i), jr = J(/^[a-z][.\w]*(-[.\w]+)+$/i);
var In = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: qr,
  ATTR_WHITESPACE: Yr,
  CUSTOM_ELEMENT: jr,
  DATA_ATTR: Wr,
  DOCTYPE_NAME: Jn,
  ERB_EXPR: Hr,
  IS_ALLOWED_URI: Kn,
  IS_SCRIPT_OR_DATA: Zr,
  MUSTACHE_EXPR: Ur,
  TMPLIT_EXPR: Gr
});
const Be = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Vr = function() {
  return typeof window > "u" ? null : window;
}, Xr = function(e, n) {
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
}, Mn = function() {
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
function es() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Vr();
  const e = (d) => es(d);
  if (e.version = "3.3.1", e.removed = [], !s || !s.document || s.document.nodeType !== Be.document || !s.Element)
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
    HTMLFormElement: m,
    DOMParser: g,
    trustedTypes: w
  } = s, b = o.prototype, k = ze(b, "cloneNode"), L = ze(b, "remove"), x = ze(b, "nextSibling"), R = ze(b, "childNodes"), H = ze(b, "parentNode");
  if (typeof l == "function") {
    const d = n.createElement("template");
    d.content && d.content.ownerDocument && (n = d.content.ownerDocument);
  }
  let v, P = "";
  const {
    implementation: V,
    createNodeIterator: it,
    createDocumentFragment: ts,
    getElementsByTagName: ns
  } = n, {
    importNode: ss
  } = r;
  let G = Mn();
  e.isSupported = typeof Qn == "function" && typeof H == "function" && V && V.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: lt,
    ERB_EXPR: ot,
    TMPLIT_EXPR: ct,
    DATA_ATTR: rs,
    ARIA_ATTR: as,
    IS_SCRIPT_OR_DATA: is,
    ATTR_WHITESPACE: jt,
    CUSTOM_ELEMENT: ls
  } = In;
  let {
    IS_ALLOWED_URI: Vt
  } = In, $ = null;
  const Xt = _({}, [...En, ...St, ...At, ...Et, ...Rn]);
  let z = null;
  const Qt = _({}, [...Cn, ...Rt, ...Ln, ...Qe]);
  let C = Object.seal(Dt(null, {
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
  const we = Object.seal(Dt(null, {
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
  let Kt = !0, pt = !0, Jt = !1, en = !0, Te = !1, He = !0, ge = !1, ht = !1, ft = !1, ve = !1, Ge = !1, We = !1, tn = !0, nn = !1;
  const os = "user-content-";
  let dt = !0, Ie = !1, ye = {}, re = null;
  const gt = _({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let sn = null;
  const rn = _({}, ["audio", "video", "img", "source", "image", "track"]);
  let mt = null;
  const an = _({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), qe = "http://www.w3.org/1998/Math/MathML", Ze = "http://www.w3.org/2000/svg", ce = "http://www.w3.org/1999/xhtml";
  let Se = ce, kt = !1, _t = null;
  const cs = _({}, [qe, Ze, ce], vt);
  let Ye = _({}, ["mi", "mo", "mn", "ms", "mtext"]), je = _({}, ["annotation-xml"]);
  const us = _({}, ["title", "style", "font", "a", "script"]);
  let Me = null;
  const ps = ["application/xhtml+xml", "text/html"], hs = "text/html";
  let D = null, Ae = null;
  const fs = n.createElement("form"), ln = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, bt = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(Ae && Ae === a)) {
      if ((!a || typeof a != "object") && (a = {}), a = le(a), Me = // eslint-disable-next-line unicorn/prefer-includes
      ps.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? hs : a.PARSER_MEDIA_TYPE, D = Me === "application/xhtml+xml" ? vt : Ke, $ = ee(a, "ALLOWED_TAGS") ? _({}, a.ALLOWED_TAGS, D) : Xt, z = ee(a, "ALLOWED_ATTR") ? _({}, a.ALLOWED_ATTR, D) : Qt, _t = ee(a, "ALLOWED_NAMESPACES") ? _({}, a.ALLOWED_NAMESPACES, vt) : cs, mt = ee(a, "ADD_URI_SAFE_ATTR") ? _(le(an), a.ADD_URI_SAFE_ATTR, D) : an, sn = ee(a, "ADD_DATA_URI_TAGS") ? _(le(rn), a.ADD_DATA_URI_TAGS, D) : rn, re = ee(a, "FORBID_CONTENTS") ? _({}, a.FORBID_CONTENTS, D) : gt, Le = ee(a, "FORBID_TAGS") ? _({}, a.FORBID_TAGS, D) : le({}), ut = ee(a, "FORBID_ATTR") ? _({}, a.FORBID_ATTR, D) : le({}), ye = ee(a, "USE_PROFILES") ? a.USE_PROFILES : !1, Kt = a.ALLOW_ARIA_ATTR !== !1, pt = a.ALLOW_DATA_ATTR !== !1, Jt = a.ALLOW_UNKNOWN_PROTOCOLS || !1, en = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Te = a.SAFE_FOR_TEMPLATES || !1, He = a.SAFE_FOR_XML !== !1, ge = a.WHOLE_DOCUMENT || !1, ve = a.RETURN_DOM || !1, Ge = a.RETURN_DOM_FRAGMENT || !1, We = a.RETURN_TRUSTED_TYPE || !1, ft = a.FORCE_BODY || !1, tn = a.SANITIZE_DOM !== !1, nn = a.SANITIZE_NAMED_PROPS || !1, dt = a.KEEP_CONTENT !== !1, Ie = a.IN_PLACE || !1, Vt = a.ALLOWED_URI_REGEXP || Kn, Se = a.NAMESPACE || ce, Ye = a.MATHML_TEXT_INTEGRATION_POINTS || Ye, je = a.HTML_INTEGRATION_POINTS || je, C = a.CUSTOM_ELEMENT_HANDLING || {}, a.CUSTOM_ELEMENT_HANDLING && ln(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (C.tagNameCheck = a.CUSTOM_ELEMENT_HANDLING.tagNameCheck), a.CUSTOM_ELEMENT_HANDLING && ln(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (C.attributeNameCheck = a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), a.CUSTOM_ELEMENT_HANDLING && typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (C.allowCustomizedBuiltInElements = a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Te && (pt = !1), Ge && (ve = !0), ye && ($ = _({}, Rn), z = [], ye.html === !0 && (_($, En), _(z, Cn)), ye.svg === !0 && (_($, St), _(z, Rt), _(z, Qe)), ye.svgFilters === !0 && (_($, At), _(z, Rt), _(z, Qe)), ye.mathMl === !0 && (_($, Et), _(z, Ln), _(z, Qe))), a.ADD_TAGS && (typeof a.ADD_TAGS == "function" ? we.tagCheck = a.ADD_TAGS : ($ === Xt && ($ = le($)), _($, a.ADD_TAGS, D))), a.ADD_ATTR && (typeof a.ADD_ATTR == "function" ? we.attributeCheck = a.ADD_ATTR : (z === Qt && (z = le(z)), _(z, a.ADD_ATTR, D))), a.ADD_URI_SAFE_ATTR && _(mt, a.ADD_URI_SAFE_ATTR, D), a.FORBID_CONTENTS && (re === gt && (re = le(re)), _(re, a.FORBID_CONTENTS, D)), a.ADD_FORBID_CONTENTS && (re === gt && (re = le(re)), _(re, a.ADD_FORBID_CONTENTS, D)), dt && ($["#text"] = !0), ge && _($, ["html", "head", "body"]), $.table && (_($, ["tbody"]), delete Le.tbody), a.TRUSTED_TYPES_POLICY) {
        if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        v = a.TRUSTED_TYPES_POLICY, P = v.createHTML("");
      } else
        v === void 0 && (v = Xr(w, t)), v !== null && typeof P == "string" && (P = v.createHTML(""));
      Z && Z(a), Ae = a;
    }
  }, on = _({}, [...St, ...At, ...Br]), cn = _({}, [...Et, ...Fr]), ds = function(a) {
    let u = H(a);
    (!u || !u.tagName) && (u = {
      namespaceURI: Se,
      tagName: "template"
    });
    const f = Ke(a.tagName), A = Ke(u.tagName);
    return _t[a.namespaceURI] ? a.namespaceURI === Ze ? u.namespaceURI === ce ? f === "svg" : u.namespaceURI === qe ? f === "svg" && (A === "annotation-xml" || Ye[A]) : !!on[f] : a.namespaceURI === qe ? u.namespaceURI === ce ? f === "math" : u.namespaceURI === Ze ? f === "math" && je[A] : !!cn[f] : a.namespaceURI === ce ? u.namespaceURI === Ze && !je[A] || u.namespaceURI === qe && !Ye[A] ? !1 : !cn[f] && (us[f] || !on[f]) : !!(Me === "application/xhtml+xml" && _t[a.namespaceURI]) : !1;
  }, ae = function(a) {
    $e(e.removed, {
      element: a
    });
    try {
      H(a).removeChild(a);
    } catch {
      L(a);
    }
  }, me = function(a, u) {
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
      if (ve || Ge)
        try {
          ae(u);
        } catch {
        }
      else
        try {
          u.setAttribute(a, "");
        } catch {
        }
  }, un = function(a) {
    let u = null, f = null;
    if (ft)
      a = "<remove></remove>" + a;
    else {
      const I = yt(a, /^[\r\n\t ]+/);
      f = I && I[0];
    }
    Me === "application/xhtml+xml" && Se === ce && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const A = v ? v.createHTML(a) : a;
    if (Se === ce)
      try {
        u = new g().parseFromString(A, Me);
      } catch {
      }
    if (!u || !u.documentElement) {
      u = V.createDocument(Se, "template", null);
      try {
        u.documentElement.innerHTML = kt ? P : A;
      } catch {
      }
    }
    const F = u.body || u.documentElement;
    return a && f && F.insertBefore(n.createTextNode(f), F.childNodes[0] || null), Se === ce ? ns.call(u, ge ? "html" : "body")[0] : ge ? u.documentElement : F;
  }, pn = function(a) {
    return it.call(
      a.ownerDocument || a,
      a,
      // eslint-disable-next-line no-bitwise
      h.SHOW_ELEMENT | h.SHOW_COMMENT | h.SHOW_TEXT | h.SHOW_PROCESSING_INSTRUCTION | h.SHOW_CDATA_SECTION,
      null
    );
  }, xt = function(a) {
    return a instanceof m && (typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || !(a.attributes instanceof p) || typeof a.removeAttribute != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function");
  }, hn = function(a) {
    return typeof c == "function" && a instanceof c;
  };
  function ue(d, a, u) {
    Xe(d, (f) => {
      f.call(e, a, u, Ae);
    });
  }
  const fn = function(a) {
    let u = null;
    if (ue(G.beforeSanitizeElements, a, null), xt(a))
      return ae(a), !0;
    const f = D(a.nodeName);
    if (ue(G.uponSanitizeElement, a, {
      tagName: f,
      allowedTags: $
    }), He && a.hasChildNodes() && !hn(a.firstElementChild) && W(/<[/\w!]/g, a.innerHTML) && W(/<[/\w!]/g, a.textContent) || a.nodeType === Be.progressingInstruction || He && a.nodeType === Be.comment && W(/<[/\w]/g, a.data))
      return ae(a), !0;
    if (!(we.tagCheck instanceof Function && we.tagCheck(f)) && (!$[f] || Le[f])) {
      if (!Le[f] && gn(f) && (C.tagNameCheck instanceof RegExp && W(C.tagNameCheck, f) || C.tagNameCheck instanceof Function && C.tagNameCheck(f)))
        return !1;
      if (dt && !re[f]) {
        const A = H(a) || a.parentNode, F = R(a) || a.childNodes;
        if (F && A) {
          const I = F.length;
          for (let X = I - 1; X >= 0; --X) {
            const pe = k(F[X], !0);
            pe.__removalCount = (a.__removalCount || 0) + 1, A.insertBefore(pe, x(a));
          }
        }
      }
      return ae(a), !0;
    }
    return a instanceof o && !ds(a) || (f === "noscript" || f === "noembed" || f === "noframes") && W(/<\/no(script|embed|frames)/i, a.innerHTML) ? (ae(a), !0) : (Te && a.nodeType === Be.text && (u = a.textContent, Xe([lt, ot, ct], (A) => {
      u = Ne(u, A, " ");
    }), a.textContent !== u && ($e(e.removed, {
      element: a.cloneNode()
    }), a.textContent = u)), ue(G.afterSanitizeElements, a, null), !1);
  }, dn = function(a, u, f) {
    if (tn && (u === "id" || u === "name") && (f in n || f in fs))
      return !1;
    if (!(pt && !ut[u] && W(rs, u))) {
      if (!(Kt && W(as, u))) {
        if (!(we.attributeCheck instanceof Function && we.attributeCheck(u, a))) {
          if (!z[u] || ut[u]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(gn(a) && (C.tagNameCheck instanceof RegExp && W(C.tagNameCheck, a) || C.tagNameCheck instanceof Function && C.tagNameCheck(a)) && (C.attributeNameCheck instanceof RegExp && W(C.attributeNameCheck, u) || C.attributeNameCheck instanceof Function && C.attributeNameCheck(u, a)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              u === "is" && C.allowCustomizedBuiltInElements && (C.tagNameCheck instanceof RegExp && W(C.tagNameCheck, f) || C.tagNameCheck instanceof Function && C.tagNameCheck(f)))
            ) return !1;
          } else if (!mt[u]) {
            if (!W(Vt, Ne(f, jt, ""))) {
              if (!((u === "src" || u === "xlink:href" || u === "href") && a !== "script" && $r(f, "data:") === 0 && sn[a])) {
                if (!(Jt && !W(is, Ne(f, jt, "")))) {
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
  }, gn = function(a) {
    return a !== "annotation-xml" && yt(a, ls);
  }, mn = function(a) {
    ue(G.beforeSanitizeAttributes, a, null);
    const {
      attributes: u
    } = a;
    if (!u || xt(a))
      return;
    const f = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: z,
      forceKeepAttr: void 0
    };
    let A = u.length;
    for (; A--; ) {
      const F = u[A], {
        name: I,
        namespaceURI: X,
        value: pe
      } = F, Ee = D(I), wt = pe;
      let B = I === "value" ? wt : Nr(wt);
      if (f.attrName = Ee, f.attrValue = B, f.keepAttr = !0, f.forceKeepAttr = void 0, ue(G.uponSanitizeAttribute, a, f), B = f.attrValue, nn && (Ee === "id" || Ee === "name") && (me(I, a), B = os + B), He && W(/((--!?|])>)|<\/(style|title|textarea)/i, B)) {
        me(I, a);
        continue;
      }
      if (Ee === "attributename" && yt(B, "href")) {
        me(I, a);
        continue;
      }
      if (f.forceKeepAttr)
        continue;
      if (!f.keepAttr) {
        me(I, a);
        continue;
      }
      if (!en && W(/\/>/i, B)) {
        me(I, a);
        continue;
      }
      Te && Xe([lt, ot, ct], (_n) => {
        B = Ne(B, _n, " ");
      });
      const kn = D(a.nodeName);
      if (!dn(kn, Ee, B)) {
        me(I, a);
        continue;
      }
      if (v && typeof w == "object" && typeof w.getAttributeType == "function" && !X)
        switch (w.getAttributeType(kn, Ee)) {
          case "TrustedHTML": {
            B = v.createHTML(B);
            break;
          }
          case "TrustedScriptURL": {
            B = v.createScriptURL(B);
            break;
          }
        }
      if (B !== wt)
        try {
          X ? a.setAttributeNS(X, I, B) : a.setAttribute(I, B), xt(a) ? ae(a) : An(e.removed);
        } catch {
          me(I, a);
        }
    }
    ue(G.afterSanitizeAttributes, a, null);
  }, gs = function d(a) {
    let u = null;
    const f = pn(a);
    for (ue(G.beforeSanitizeShadowDOM, a, null); u = f.nextNode(); )
      ue(G.uponSanitizeShadowNode, u, null), fn(u), mn(u), u.content instanceof i && d(u.content);
    ue(G.afterSanitizeShadowDOM, a, null);
  };
  return e.sanitize = function(d) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, f = null, A = null, F = null;
    if (kt = !d, kt && (d = "<!-->"), typeof d != "string" && !hn(d))
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
        if (!$[pe] || Le[pe])
          throw Pe("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (d instanceof c)
      u = un("<!---->"), f = u.ownerDocument.importNode(d, !0), f.nodeType === Be.element && f.nodeName === "BODY" || f.nodeName === "HTML" ? u = f : u.appendChild(f);
    else {
      if (!ve && !Te && !ge && // eslint-disable-next-line unicorn/prefer-includes
      d.indexOf("<") === -1)
        return v && We ? v.createHTML(d) : d;
      if (u = un(d), !u)
        return ve ? null : We ? P : "";
    }
    u && ft && ae(u.firstChild);
    const I = pn(Ie ? d : u);
    for (; A = I.nextNode(); )
      fn(A), mn(A), A.content instanceof i && gs(A.content);
    if (Ie)
      return d;
    if (ve) {
      if (Ge)
        for (F = ts.call(u.ownerDocument); u.firstChild; )
          F.appendChild(u.firstChild);
      else
        F = u;
      return (z.shadowroot || z.shadowrootmode) && (F = ss.call(r, F, !0)), F;
    }
    let X = ge ? u.outerHTML : u.innerHTML;
    return ge && $["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && W(Jn, u.ownerDocument.doctype.name) && (X = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + X), Te && Xe([lt, ot, ct], (pe) => {
      X = Ne(X, pe, " ");
    }), v && We ? v.createHTML(X) : X;
  }, e.setConfig = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    bt(d), ht = !0;
  }, e.clearConfig = function() {
    Ae = null, ht = !1;
  }, e.isValidAttribute = function(d, a, u) {
    Ae || bt({});
    const f = D(d), A = D(a);
    return dn(f, A, u);
  }, e.addHook = function(d, a) {
    typeof a == "function" && $e(G[d], a);
  }, e.removeHook = function(d, a) {
    if (a !== void 0) {
      const u = Dr(G[d], a);
      return u === -1 ? void 0 : Or(G[d], u, 1)[0];
    }
    return An(G[d]);
  }, e.removeHooks = function(d) {
    G[d] = [];
  }, e.removeAllHooks = function() {
    G = Mn();
  }, e;
}
var Qr = es();
const Kr = {}, Jr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ea(s, e) {
  return y(), M("svg", Jr, [...e[0] || (e[0] = [
    N("path", { d: "M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" }, null, -1)
  ])]);
}
const ta = /* @__PURE__ */ j(Kr, [["render", ea]]), na = {}, sa = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ra(s, e) {
  return y(), M("svg", sa, [...e[0] || (e[0] = [
    N("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }, null, -1)
  ])]);
}
const aa = /* @__PURE__ */ j(na, [["render", ra]]), ia = {}, la = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function oa(s, e) {
  return y(), M("svg", la, [...e[0] || (e[0] = [
    N("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }, null, -1)
  ])]);
}
const ca = /* @__PURE__ */ j(ia, [["render", oa]]), ua = ["aria-label"], pa = { class: "nc-message-bubble__header" }, ha = {
  key: 0,
  class: "nc-message-bubble__label"
}, fa = { class: "nc-message-bubble__bubble" }, da = {
  key: 0,
  class: "nc-message-bubble__content"
}, ga = ["innerHTML"], ma = /* @__PURE__ */ de({
  __name: "MessageBubble",
  props: {
    message: {},
    animate: { type: Boolean, default: !1 }
  },
  setup(s) {
    const e = s, n = Q(() => e.message.role === "user"), r = Q(
      () => e.message.status === "failed" || e.message.id.startsWith("error-")
    ), t = Q(() => e.message.status === "sending"), i = Q(() => e.message.role === "assistant" && !r.value), l = Q(() => {
      if (e.message.role !== "assistant" || r.value) return null;
      const m = S.parse(e.message.content);
      return Qr.sanitize(m);
    }), c = Q(() => r.value ? "Error message" : n.value ? "Message from you" : "Message from AI Assistant"), o = K(!1);
    let h = null;
    async function p() {
      try {
        await navigator.clipboard.writeText(e.message.content), o.value = !0, h && clearTimeout(h), h = setTimeout(() => {
          o.value = !1;
        }, 1500);
      } catch {
      }
    }
    return Nn(() => {
      h && clearTimeout(h);
    }), (m, g) => {
      const w = O("v-icon"), b = O("v-avatar"), k = O("v-btn");
      return y(), M("li", {
        role: "listitem",
        "aria-label": c.value,
        class: Nt(["nc-message-bubble", {
          "nc-message-bubble--user": n.value,
          "nc-message-bubble--assistant": i.value,
          "nc-message-bubble--error": r.value,
          "nc-message-bubble--sending": t.value,
          "nc-message-bubble--animate-in": e.animate
        }])
      }, [
        N("div", pa, [
          n.value ? (y(), M("span", ha, "You")) : r.value ? (y(), M(Ct, { key: 1 }, [
            E(ta, { class: "nc-message-bubble__warning-icon" }),
            g[0] || (g[0] = N("span", { class: "nc-message-bubble__label" }, "Error", -1))
          ], 64)) : (y(), M(Ct, { key: 2 }, [
            E(b, {
              color: "secondary",
              size: "29"
            }, {
              default: U(() => [
                E(w, {
                  icon: zt,
                  color: "white",
                  size: "15"
                })
              ]),
              _: 1
            }),
            g[1] || (g[1] = N("span", { class: "nc-message-bubble__label" }, "AI Assistant", -1))
          ], 64))
        ]),
        N("div", fa, [
          n.value || r.value ? (y(), M("div", da, $n(s.message.content), 1)) : (y(), M("div", {
            key: 1,
            class: "nc-message-bubble__content",
            innerHTML: l.value
          }, null, 8, ga))
        ]),
        i.value ? (y(), oe(k, {
          key: 0,
          icon: "",
          variant: "text",
          density: "comfortable",
          size: "small",
          class: "mt-1",
          "aria-label": o.value ? "Message copied" : "Copy message",
          onClick: p
        }, {
          default: U(() => [
            E(w, {
              icon: o.value ? ca : aa,
              size: "small",
              color: o.value ? "success" : "title"
            }, null, 8, ["icon", "color"])
          ]),
          _: 1
        }, 8, ["aria-label"])) : Pn("", !0)
      ], 10, ua);
    };
  }
}), ka = /* @__PURE__ */ j(ma, [["__scopeId", "data-v-941202c1"]]), _a = {}, ba = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function xa(s, e) {
  return y(), M("svg", ba, [...e[0] || (e[0] = [
    N("path", { d: "M19.79 13.267a.75.75 0 0 0-1.086-1.034l-5.954 6.251V3.75a.75.75 0 1 0-1.5 0v14.734l-5.955-6.251a.75.75 0 0 0-1.086 1.034l7.067 7.42c.16.168.366.268.58.3a.753.753 0 0 0 .29-.001.995.995 0 0 0 .578-.3l7.067-7.419Z" }, null, -1)
  ])]);
}
const wa = /* @__PURE__ */ j(_a, [["render", xa]]), Ta = { class: "nc-message-list-wrapper" }, va = {
  role: "list",
  "aria-live": "polite",
  class: "nc-message-list"
}, ya = { class: "nc-message-list__loader" }, Sa = { class: "nc-scroll-fab" }, Aa = 50, Ea = /* @__PURE__ */ de({
  __name: "MessageList",
  setup(s) {
    const e = fe(Ce), n = nt("scrollContainer"), r = K(!0), t = /* @__PURE__ */ new Set(), i = K(/* @__PURE__ */ new Set());
    let l = !1, c = !1;
    _e(
      () => e.messages.value,
      (k) => {
        const L = /* @__PURE__ */ new Set();
        l && !c && k.forEach((x) => {
          t.has(x.id) || L.add(x.id);
        }), k.forEach((x) => t.add(x.id)), i.value = L;
      }
    );
    function o() {
      const k = n.value?.$el;
      return k instanceof HTMLElement ? k : null;
    }
    function h() {
      const k = o();
      if (!k) return;
      const { scrollTop: L, scrollHeight: x, clientHeight: R } = k;
      r.value = x - L - R <= Aa;
    }
    function p() {
      const k = o();
      k && (k.scrollTop = k.scrollHeight);
    }
    let m = e.messages.value.length > 0 ? e.messages.value[e.messages.value.length - 1].id : null, g = !1, w = !1;
    _e(
      () => e.messages.value,
      (k) => {
        const L = k.length > 0 ? k[k.length - 1].id : null, x = L !== null && L !== m;
        m = L, x && (g ? w = !0 : he(p));
      }
    ), ms(() => {
      e.messages.value.forEach((L) => t.add(L.id)), he(() => {
        l = !0;
      }), e.messages.value.length > 0 && he(p), o()?.addEventListener("scroll", h, { passive: !0 });
    }), Nn(() => {
      o()?.removeEventListener("scroll", h);
    });
    async function b({ done: k }) {
      c = !0, g = !0;
      try {
        await e.loadMore(), k(e.hasMore.value ? "ok" : "empty");
      } catch {
        k("error");
      }
      await he(), c = !1, g = !1, w && (w = !1, he(p));
    }
    return (k, L) => {
      const x = O("v-progress-circular"), R = O("v-infinite-scroll"), H = O("v-icon"), v = O("v-btn");
      return y(), M("div", Ta, [
        E(R, {
          ref: "scrollContainer",
          side: "start",
          disabled: !se(e).hasMore.value,
          class: "nc-message-list-scroll",
          onLoad: b
        }, {
          loading: U(() => [
            N("div", ya, [
              E(x, {
                indeterminate: "",
                size: "24",
                width: "2"
              })
            ])
          ]),
          empty: U(() => [...L[0] || (L[0] = [])]),
          default: U(() => [
            N("ul", va, [
              (y(!0), M(Ct, null, ks(se(e).messages.value, (P) => (y(), oe(ka, {
                key: P.id,
                message: P,
                animate: i.value.has(P.id)
              }, null, 8, ["message", "animate"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["disabled"]),
        E(Pt, { name: "nc-scroll-fab" }, {
          default: U(() => [
            Dn(N("div", Sa, [
              E(v, {
                icon: "",
                variant: "elevated",
                color: "surface",
                size: "small",
                "aria-label": "Scroll to latest messages",
                onClick: p
              }, {
                default: U(() => [
                  E(H, { icon: wa })
                ]),
                _: 1
              })
            ], 512), [
              [On, !r.value]
            ])
          ]),
          _: 1
        })
      ]);
    };
  }
}), Ra = /* @__PURE__ */ j(Ea, [["__scopeId", "data-v-bcc3dd4e"]]), Ca = {}, La = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ia(s, e) {
  return y(), M("svg", La, [...e[0] || (e[0] = [
    N("path", { d: "m12.815 12.197-7.532 1.256a.5.5 0 0 0-.386.318L2.3 20.728c-.248.64.421 1.25 1.035.943l18-9a.75.75 0 0 0 0-1.342l-18-9c-.614-.307-1.283.304-1.035.943l2.598 6.957a.5.5 0 0 0 .386.319l7.532 1.255a.2.2 0 0 1 0 .394Z" }, null, -1)
  ])]);
}
const Ma = /* @__PURE__ */ j(Ca, [["render", Ia]]), Da = { class: "nc-chat-input" }, Oa = /* @__PURE__ */ de({
  __name: "ChatInput",
  setup(s) {
    const e = fe(Ce), n = K(""), r = nt("textareaRef"), t = Q(() => n.value.trim().length > 0 && !e.isSending.value);
    async function i() {
      const c = n.value.trim();
      if (!(!c || e.isSending.value)) {
        n.value = "";
        try {
          await e.sendMessage(c);
        } catch {
        }
      }
    }
    function l(c) {
      c.key === "Enter" && !c.shiftKey && (c.preventDefault(), i());
    }
    return _e(
      () => e.failedMessageText.value,
      (c) => {
        c && (n.value = c);
      }
    ), _e(
      () => e.isOpen.value,
      (c) => {
        c && he(() => {
          r.value?.focus();
        });
      },
      { immediate: !0 }
    ), _e(
      () => e.isSending.value,
      (c, o) => {
        o && !c && he(() => {
          r.value?.focus();
        });
      }
    ), (c, o) => {
      const h = O("v-progress-circular"), p = O("v-icon"), m = O("v-btn"), g = O("v-textarea");
      return y(), M("div", Da, [
        E(g, {
          ref_key: "textareaRef",
          ref: r,
          modelValue: n.value,
          "onUpdate:modelValue": o[0] || (o[0] = (w) => n.value = w),
          "auto-grow": "",
          rows: 1,
          "max-rows": 10,
          "no-resize": "",
          "hide-details": "",
          variant: "solo",
          density: "compact",
          flat: "",
          rounded: "lg",
          placeholder: "How can I help you? Ask me anything...",
          "aria-label": "Type a message",
          disabled: se(e).isSending.value,
          class: "nc-chat-input__textarea",
          onKeydown: l
        }, {
          "append-inner": U(() => [
            E(m, {
              icon: "",
              variant: "text",
              density: "comfortable",
              color: t.value || se(e).isSending.value ? "primary" : void 0,
              disabled: !t.value,
              "aria-label": "Send message",
              onClick: i
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
                  icon: Ma,
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
}), $a = /* @__PURE__ */ j(Oa, [["__scopeId", "data-v-ed8be45c"]]), Na = { class: "nc-chat-panel__body" }, Pa = /* @__PURE__ */ de({
  __name: "ChatPanel",
  setup(s) {
    const e = fe(Ce), n = fe(st), r = Q(() => n?.welcomeMessage), t = ws(), i = Q(() => t.width.value < 768), l = (c) => {
      c.key === "Escape" && e.isOpen.value && e.close();
    };
    return _e(
      () => e.isOpen.value,
      (c) => {
        c ? window.addEventListener("keydown", l) : window.removeEventListener("keydown", l);
      },
      { immediate: !0 }
    ), _s(() => {
      window.removeEventListener("keydown", l);
    }), (c, o) => {
      const h = O("v-progress-circular"), p = O("v-theme-provider");
      return y(), oe(bs, { to: "body" }, [
        E(Pt, { name: "nc-panel" }, {
          default: U(() => [
            se(e).isOpen.value ? (y(), oe(p, {
              key: 0,
              theme: "nativeChat",
              "with-background": "",
              class: Nt(["nc-chat-panel border-md", { "nc-chat-panel--mobile": i.value }]),
              role: "complementary",
              "aria-label": "Chat with AI Assistant"
            }, {
              default: U(() => [
                E(Ns),
                N("div", Na, [
                  se(e).isLoading.value && se(e).messages.value.length === 0 ? (y(), oe(h, {
                    key: 0,
                    indeterminate: "",
                    size: "24",
                    class: "nc-chat-panel__loader"
                  })) : se(e).messages.value.length === 0 && !se(e).isSending.value ? (y(), oe(Fs, {
                    key: 1,
                    message: r.value
                  }, null, 8, ["message"])) : (y(), oe(Ra, { key: 2 }))
                ]),
                E($a)
              ]),
              _: 1
            }, 8, ["class"])) : Pn("", !0)
          ]),
          _: 1
        })
      ]);
    };
  }
}), za = /* @__PURE__ */ j(Pa, [["__scopeId", "data-v-0d2a4bb0"]]), Ba = /* @__PURE__ */ de({
  __name: "NativeChatWidget",
  setup(s) {
    const e = Ts();
    if (!e.themes.value.nativeChat) {
      const i = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...i,
        ...Tt,
        colors: {
          ...i.colors,
          ...Tt.colors
        },
        variables: {
          ...i.variables,
          ...Tt.variables
        }
      };
    }
    const n = fe(st), r = ys(n.apiClient, n);
    xs(Ce, r);
    const t = nt("floatingButtonRef");
    return _e(
      () => r.isOpen.value,
      (i) => {
        i || he(() => {
          t.value?.focus();
        });
      }
    ), (i, l) => {
      const c = O("v-theme-provider");
      return y(), oe(c, { theme: "nativeChat" }, {
        default: U(() => [
          E(Ms, {
            ref_key: "floatingButtonRef",
            ref: t
          }, null, 512),
          E(za)
        ]),
        _: 1
      });
    };
  }
}), Fa = /* @__PURE__ */ j(Ba, [["__scopeId", "data-v-492f08ed"]]), Ga = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(st, e), s.component("NativeChatWidget", Fa);
  }
};
function Wa(s) {
  const { baseUrl: e, getAccessToken: n } = s;
  async function r(t, i = {}) {
    const c = {
      Authorization: `Bearer ${await n()}`
    };
    i.body && (c["Content-Type"] = "application/json");
    const o = await fetch(t, { ...i, headers: c });
    if (!o.ok) {
      const h = new Error(`HTTP ${o.status}: ${o.statusText}`);
      throw h.statusCode = o.status, h;
    }
    return o.json();
  }
  return {
    createConversation() {
      return r(`${e}/conversations`, { method: "POST" });
    },
    getConversations(t, i) {
      return r(`${e}/conversations?offset=${t}&limit=${i}`);
    },
    getMessages(t, i, l) {
      return r(
        `${e}/conversations/${encodeURIComponent(t)}/messages?offset=${i}&limit=${l}`
      );
    },
    sendMessage(t, i) {
      return r(`${e}/conversations/${encodeURIComponent(t)}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: i })
      });
    }
  };
}
export {
  Ga as NativeChatPlugin,
  Fa as NativeChatWidget,
  Wa as createNativeChatApiClient,
  Ga as default
};
