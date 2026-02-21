import { ref as Q, readonly as Ae, openBlock as y, createElementBlock as O, createElementVNode as Z, defineComponent as he, inject as pe, computed as H, useTemplateRef as nt, resolveComponent as ee, normalizeClass as Nt, createVNode as G, withCtx as ue, unref as ce, toDisplayString as Mn, onBeforeUnmount as On, Fragment as Dn, createCommentVNode as kn, createBlock as oe, watch as Ee, nextTick as Re, onMounted as hs, renderList as fs, onUnmounted as gs, provide as ds } from "vue";
import { useDisplay as ms, useTheme as ks } from "vuetify";
const st = /* @__PURE__ */ Symbol("native-chat-config"), Ce = /* @__PURE__ */ Symbol("native-chat-state");
function bs(s) {
  if (s && typeof s == "object" && "statusCode" in s) {
    const e = s.statusCode;
    if (e === 429)
      return "You're sending messages too quickly. Please wait a moment and try again.";
    if (e === 503 || e === 504)
      return "The service is temporarily unavailable. Please try again in a moment.";
  }
  return "Something went wrong. You can try sending your message again.";
}
function _s(s, e) {
  const n = Q([]), r = Q(!1), t = Q(!1), i = Q(!1), l = Q(!1), c = Q(null), o = Q(null), u = Q(0), h = e.batchSize ?? 20;
  function d(v, L, q) {
    n.value = n.value.filter((F) => F.id !== q && !F.id.startsWith("error-"));
    const x = bs(v), Y = {
      id: `error-${Date.now()}`,
      conversationId: o.value ?? "",
      role: "assistant",
      content: x,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "failed"
    };
    if (n.value = [...n.value, Y], c.value = null, c.value = L, e.onError)
      try {
        Promise.resolve(
          e.onError({
            message: x,
            statusCode: v && typeof v == "object" && "statusCode" in v ? v.statusCode : void 0,
            originalError: v
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
          const q = await s.getConversations(0, 1);
          if (q.conversations.length > 0)
            o.value = q.conversations[0].id;
          else {
            const x = await s.createConversation();
            o.value = x.id;
          }
        }
        const v = await s.getMessages(o.value, 0, h), L = [...v.messages].reverse();
        n.value = L, l.value = v.has_more, u.value = L.length;
      } catch {
      } finally {
        t.value = !1, r.value = !0;
      }
    }
  }
  function T() {
    r.value = !1;
  }
  async function _(v) {
    if (!v.trim() || i.value) return;
    i.value = !0;
    const L = `temp-${Date.now()}`, q = {
      id: L,
      conversationId: o.value ?? "",
      role: "user",
      content: v,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sending"
    };
    if (n.value = [...n.value, q], !o.value)
      try {
        const x = await s.createConversation();
        o.value = x.id;
      } catch (x) {
        d(x, v, L), i.value = !1;
        return;
      }
    try {
      const x = await s.sendMessage(o.value, v), Y = {
        ...x.userMessage,
        status: "sent"
      }, F = {
        ...x.assistantMessage
      };
      n.value = [
        ...n.value.filter((it) => it.id !== L),
        Y,
        F
      ], c.value = null;
    } catch (x) {
      d(x, v, L);
    } finally {
      i.value = !1;
    }
  }
  async function W() {
    if (!(!l.value || t.value || !o.value)) {
      t.value = !0;
      try {
        const v = await s.getMessages(
          o.value,
          u.value,
          h
        ), L = [...v.messages].reverse();
        n.value = [...L, ...n.value], u.value += L.length, l.value = v.has_more;
      } catch {
      } finally {
        t.value = !1;
      }
    }
  }
  async function be() {
    if (!c.value) return;
    const v = c.value;
    c.value = null, await _(v);
  }
  return {
    messages: Ae(n),
    isOpen: Ae(r),
    isLoading: Ae(t),
    isSending: Ae(i),
    hasMore: Ae(l),
    failedMessageText: Ae(c),
    open: m,
    close: T,
    sendMessage: _,
    loadMore: W,
    retry: be
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
    "welcome-text": "#B0BCC0"
  },
  variables: {}
}, j = (s, e) => {
  const n = s.__vccOpts || s;
  for (const [r, t] of e)
    n[r] = t;
  return n;
}, xs = {}, ws = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Ts(s, e) {
  return y(), O("svg", ws, [...e[0] || (e[0] = [
    Z("path", { d: "M12 1c.4 0 .7.3.9.7l2.2 5.8 5.8 2.2c.4.2.7.5.7.9s-.3.7-.7.9l-5.8 2.2-2.2 5.8c-.2.4-.5.7-.9.7s-.7-.3-.9-.7l-2.2-5.8-5.8-2.2c-.4-.2-.7-.5-.7-.9s.3-.7.7-.9l5.8-2.2 2.2-5.8c.2-.4.5-.7.9-.7Z" }, null, -1)
  ])]);
}
const $t = /* @__PURE__ */ j(xs, [["render", Ts]]), ys = /* @__PURE__ */ he({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const n = pe(st), r = pe(Ce), t = H(() => r.isOpen.value), i = H(() => n?.position ?? "bottom-right"), l = H(
      () => `nc-floating-button-wrapper--${i.value === "bottom-left" ? "left" : "right"}`
    );
    function c() {
      r.isOpen.value ? r.close() : r.open();
    }
    const o = nt("triggerBtn");
    function u() {
      o.value?.$el?.focus();
    }
    return e({ focus: u }), (h, d) => {
      const m = ee("v-icon"), T = ee("v-btn");
      return y(), O("div", {
        class: Nt(["nc-floating-button-wrapper", l.value])
      }, [
        G(T, {
          ref_key: "triggerBtn",
          ref: o,
          icon: "",
          size: "56",
          color: "secondary",
          elevation: "4",
          "aria-label": t.value ? "Close chat" : "Open chat",
          "aria-expanded": t.value.toString(),
          onClick: c
        }, {
          default: ue(() => [
            G(m, {
              icon: $t,
              color: "white"
            })
          ]),
          _: 1
        }, 8, ["aria-label", "aria-expanded"])
      ], 2);
    };
  }
}), vs = /* @__PURE__ */ j(ys, [["__scopeId", "data-v-a57cf6f6"]]), Ss = {}, As = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Es(s, e) {
  return y(), O("svg", As, [...e[0] || (e[0] = [
    Z("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const Rs = /* @__PURE__ */ j(Ss, [["render", Es]]), Cs = { class: "nc-chat-header" }, Ls = { class: "nc-chat-header__left" }, Is = /* @__PURE__ */ he({
  __name: "ChatHeader",
  setup(s) {
    const e = pe(Ce);
    return (n, r) => {
      const t = ee("v-icon"), i = ee("v-btn");
      return y(), O("div", Cs, [
        Z("div", Ls, [
          G(t, {
            icon: $t,
            color: "secondary",
            size: "20"
          }),
          r[1] || (r[1] = Z("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
        ]),
        G(i, {
          icon: "",
          variant: "text",
          size: "small",
          "aria-label": "Close chat",
          onClick: r[0] || (r[0] = (l) => ce(e).close())
        }, {
          default: ue(() => [
            G(t, {
              icon: Rs,
              size: "18"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}), Ms = /* @__PURE__ */ j(Is, [["__scopeId", "data-v-f89f9f15"]]), Os = { class: "nc-welcome-state" }, Ds = { class: "nc-welcome-state__text" }, Ns = /* @__PURE__ */ he({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(s) {
    return (e, n) => (y(), O("div", Os, [
      Z("p", Ds, Mn(s.message ?? "Hello! How can I help you?"), 1)
    ]));
  }
}), $s = /* @__PURE__ */ j(Ns, [["__scopeId", "data-v-6d3eccea"]]);
function Pt() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ke = Pt();
function Nn(s) {
  ke = s;
}
var de = { exec: () => null };
function b(s, e = "") {
  let n = typeof s == "string" ? s : s.source, r = { replace: (t, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(P.caret, "$1"), n = n.replace(t, l), r;
  }, getRegex: () => new RegExp(n, e) };
  return r;
}
var Ps = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), P = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}>`) }, zs = /^(?:[ \t]*(?:\n|$))+/, Bs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Fs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ue = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Us = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, zt = / {0,3}(?:[*+-]|\d{1,9}[.)])/, $n = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Pn = b($n).replace(/bull/g, zt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Hs = b($n).replace(/bull/g, zt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Bt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Gs = /^[^\n]+/, Ft = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ws = b(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ft).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), qs = b(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, zt).getRegex(), rt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ut = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ys = b("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Ut).replace("tag", rt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), zn = b(Bt).replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), Zs = b(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", zn).getRegex(), Ht = { blockquote: Zs, code: Bs, def: Ws, fences: Fs, heading: Us, hr: Ue, html: Ys, lheading: Pn, list: qs, newline: zs, paragraph: zn, table: de, text: Gs }, bn = b("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), js = { ...Ht, lheading: Hs, table: bn, paragraph: b(Bt).replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", bn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex() }, Vs = { ...Ht, html: b(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Ut).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: de, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: b(Bt).replace("hr", Ue).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Pn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Xs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Qs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Bn = /^( {2,}|\\)\n(?!\s*$)/, Ks = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, at = /[\p{P}\p{S}]/u, Gt = /[\s\p{P}\p{S}]/u, Fn = /[^\s\p{P}\p{S}]/u, Js = b(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Gt).getRegex(), Un = /(?!~)[\p{P}\p{S}]/u, er = /(?!~)[\s\p{P}\p{S}]/u, tr = /(?:[^\s\p{P}\p{S}]|~)/u, Hn = /(?![*_])[\p{P}\p{S}]/u, nr = /(?![*_])[\s\p{P}\p{S}]/u, sr = /(?:[^\s\p{P}\p{S}]|[*_])/u, rr = b(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ps ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Gn = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ar = b(Gn, "u").replace(/punct/g, at).getRegex(), ir = b(Gn, "u").replace(/punct/g, Un).getRegex(), Wn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", lr = b(Wn, "gu").replace(/notPunctSpace/g, Fn).replace(/punctSpace/g, Gt).replace(/punct/g, at).getRegex(), or = b(Wn, "gu").replace(/notPunctSpace/g, tr).replace(/punctSpace/g, er).replace(/punct/g, Un).getRegex(), cr = b("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Fn).replace(/punctSpace/g, Gt).replace(/punct/g, at).getRegex(), ur = b(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Hn).getRegex(), pr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hr = b(pr, "gu").replace(/notPunctSpace/g, sr).replace(/punctSpace/g, nr).replace(/punct/g, Hn).getRegex(), fr = b(/\\(punct)/, "gu").replace(/punct/g, at).getRegex(), gr = b(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), dr = b(Ut).replace("(?:-->|$)", "-->").getRegex(), mr = b("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", dr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Je = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, kr = b(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Je).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), qn = b(/^!?\[(label)\]\[(ref)\]/).replace("label", Je).replace("ref", Ft).getRegex(), Yn = b(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ft).getRegex(), br = b("reflink|nolink(?!\\()", "g").replace("reflink", qn).replace("nolink", Yn).getRegex(), _n = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Wt = { _backpedal: de, anyPunctuation: fr, autolink: gr, blockSkip: rr, br: Bn, code: Qs, del: de, delLDelim: de, delRDelim: de, emStrongLDelim: ar, emStrongRDelimAst: lr, emStrongRDelimUnd: cr, escape: Xs, link: kr, nolink: Yn, punctuation: Js, reflink: qn, reflinkSearch: br, tag: mr, text: Ks, url: de }, _r = { ...Wt, link: b(/^!?\[(label)\]\((.*?)\)/).replace("label", Je).getRegex(), reflink: b(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Je).getRegex() }, Ct = { ...Wt, emStrongRDelimAst: or, emStrongLDelim: ir, delLDelim: ur, delRDelim: hr, url: b(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", _n).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: b(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", _n).getRegex() }, xr = { ...Ct, br: b(Bn).replace("{2,}", "*").getRegex(), text: b(Ct.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Ve = { normal: Ht, gfm: js, pedantic: Vs }, Oe = { normal: Wt, gfm: Ct, breaks: xr, pedantic: _r }, wr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, xn = (s) => wr[s];
function se(s, e) {
  if (e) {
    if (P.escapeTest.test(s)) return s.replace(P.escapeReplace, xn);
  } else if (P.escapeTestNoEncode.test(s)) return s.replace(P.escapeReplaceNoEncode, xn);
  return s;
}
function wn(s) {
  try {
    s = encodeURI(s).replace(P.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function Tn(s, e) {
  let n = s.replace(P.findPipe, (i, l, c) => {
    let o = !1, u = l;
    for (; --u >= 0 && c[u] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = n.split(P.splitPipe), t = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; t < r.length; t++) r[t] = r[t].trim().replace(P.slashPipe, "|");
  return r;
}
function De(s, e, n) {
  let r = s.length;
  if (r === 0) return "";
  let t = 0;
  for (; t < r && s.charAt(r - t - 1) === e; )
    t++;
  return s.slice(0, r - t);
}
function Tr(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let r = 0; r < s.length; r++) if (s[r] === "\\") r++;
  else if (s[r] === e[0]) n++;
  else if (s[r] === e[1] && (n--, n < 0)) return r;
  return n > 0 ? -2 : -1;
}
function yr(s, e = 0) {
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
function vr(s, e, n) {
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
    this.options = s || ke;
  }
  space(s) {
    let e = this.rules.block.newline.exec(s);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(s) {
    let e = this.rules.block.code.exec(s);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : De(n, `
`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let n = e[0], r = vr(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = De(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(s) {
    let e = this.rules.block.hr.exec(s);
    if (e) return { type: "hr", raw: De(e[0], `
`) };
  }
  blockquote(s) {
    let e = this.rules.block.blockquote.exec(s);
    if (e) {
      let n = De(e[0], `
`).split(`
`), r = "", t = "", i = [];
      for (; n.length > 0; ) {
        let l = !1, c = [], o;
        for (o = 0; o < n.length; o++) if (this.rules.other.blockquoteStart.test(n[o])) c.push(n[o]), l = !0;
        else if (!l) c.push(n[o]);
        else break;
        n = n.slice(o);
        let u = c.join(`
`), h = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${u}` : u, t = t ? `${t}
${h}` : h;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(h, i, !0), this.lexer.state.top = d, n.length === 0) break;
        let m = i.at(-1);
        if (m?.type === "code") break;
        if (m?.type === "blockquote") {
          let T = m, _ = T.raw + `
` + n.join(`
`), W = this.blockquote(_);
          i[i.length - 1] = W, r = r.substring(0, r.length - T.raw.length) + W.raw, t = t.substring(0, t.length - T.text.length) + W.text;
          break;
        } else if (m?.type === "list") {
          let T = m, _ = T.raw + `
` + n.join(`
`), W = this.list(_);
          i[i.length - 1] = W, r = r.substring(0, r.length - m.raw.length) + W.raw, t = t.substring(0, t.length - T.raw.length) + W.raw, n = _.substring(i.at(-1).raw.length).split(`
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
        let o = !1, u = "", h = "";
        if (!(e = i.exec(s)) || this.rules.block.hr.test(s)) break;
        u = e[0], s = s.substring(u.length);
        let d = yr(e[2].split(`
`, 1)[0], e[1].length), m = s.split(`
`, 1)[0], T = !d.trim(), _ = 0;
        if (this.options.pedantic ? (_ = 2, h = d.trimStart()) : T ? _ = e[1].length + 1 : (_ = d.search(this.rules.other.nonSpaceChar), _ = _ > 4 ? 1 : _, h = d.slice(_), _ += e[1].length), T && this.rules.other.blankLine.test(m) && (u += m + `
`, s = s.substring(m.length + 1), o = !0), !o) {
          let W = this.rules.other.nextBulletRegex(_), be = this.rules.other.hrRegex(_), v = this.rules.other.fencesBeginRegex(_), L = this.rules.other.headingBeginRegex(_), q = this.rules.other.htmlBeginRegex(_), x = this.rules.other.blockquoteBeginRegex(_);
          for (; s; ) {
            let Y = s.split(`
`, 1)[0], F;
            if (m = Y, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), F = m) : F = m.replace(this.rules.other.tabCharGlobal, "    "), v.test(m) || L.test(m) || q.test(m) || x.test(m) || W.test(m) || be.test(m)) break;
            if (F.search(this.rules.other.nonSpaceChar) >= _ || !m.trim()) h += `
` + F.slice(_);
            else {
              if (T || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || v.test(d) || L.test(d) || be.test(d)) break;
              h += `
` + m;
            }
            T = !m.trim(), u += Y + `
`, s = s.substring(Y.length + 1), d = F.slice(_);
          }
        }
        t.loose || (l ? t.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (l = !0)), t.items.push({ type: "list_item", raw: u, task: !!this.options.gfm && this.rules.other.listIsTask.test(h), loose: !1, text: h, tokens: [] }), t.raw += u;
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
          let u = this.rules.other.listTaskCheckbox.exec(o.raw);
          if (u) {
            let h = { type: "checkbox", raw: u[0] + " ", checked: u[0] !== "[ ]" };
            o.checked = h.checked, t.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = h.raw + o.tokens[0].raw, o.tokens[0].text = h.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(h)) : o.tokens.unshift({ type: "paragraph", raw: h.raw, text: h.raw, tokens: [h] }) : o.tokens.unshift(h);
          }
        }
        if (!t.loose) {
          let u = o.tokens.filter((d) => d.type === "space"), h = u.length > 0 && u.some((d) => this.rules.other.anyLine.test(d.raw));
          t.loose = h;
        }
      }
      if (t.loose) for (let o of t.items) {
        o.loose = !0;
        for (let u of o.tokens) u.type === "text" && (u.type = "paragraph");
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
    let n = Tn(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), t = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let l of r) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < n.length; l++) i.header.push({ text: n[l], tokens: this.lexer.inline(n[l]), header: !0, align: i.align[l] });
      for (let l of t) i.rows.push(Tn(l, i.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[o] })));
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
        let i = De(n.slice(0, -1), "\\");
        if ((n.length - i.length) % 2 === 0) return;
      } else {
        let i = Tr(e[2], "()");
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
      let t = [...r[0]].length - 1, i, l, c = t, o = 0, u = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, e = e.slice(-1 * s.length + t); (r = u.exec(e)) != null; ) {
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
        let h = [...r[0]][0].length, d = s.slice(0, t + r.index + h + l);
        if (Math.min(t, l) % 2) {
          let T = d.slice(1, -1);
          return { type: "em", raw: d, text: T, tokens: this.lexer.inlineTokens(T) };
        }
        let m = d.slice(2, -2);
        return { type: "strong", raw: d, text: m, tokens: this.lexer.inlineTokens(m) };
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
        let u = [...r[0]][0].length, h = s.slice(0, t + r.index + u + l), d = h.slice(t, -t);
        return { type: "del", raw: h, text: d, tokens: this.lexer.inlineTokens(d) };
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
}, K = class Lt {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ke, this.options.tokenizer = this.options.tokenizer || new et(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: P, block: Ve.normal, inline: Oe.normal };
    this.options.pedantic ? (n.block = Ve.pedantic, n.inline = Oe.pedantic) : this.options.gfm && (n.block = Ve.gfm, this.options.breaks ? n.inline = Oe.breaks : n.inline = Oe.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: Ve, inline: Oe };
  }
  static lex(e, n) {
    return new Lt(n).lex(e);
  }
  static lexInline(e, n) {
    return new Lt(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(P.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let r = this.inlineQueue[n];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], r = !1) {
    for (this.options.pedantic && (e = e.replace(P.tabCharGlobal, "    ").replace(P.spaceLine, "")); e; ) {
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
        this.options.extensions.startBlock.forEach((u) => {
          o = u.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (l = Math.min(l, o));
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
      let u = e;
      if (this.options.extensions?.startInline) {
        let h = 1 / 0, d = e.slice(1), m;
        this.options.extensions.startInline.forEach((T) => {
          m = T.call({ lexer: this }, d), typeof m == "number" && m >= 0 && (h = Math.min(h, m));
        }), h < 1 / 0 && h >= 0 && (u = e.substring(0, h + 1));
      }
      if (o = this.tokenizer.inlineText(u)) {
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
}, tt = class {
  options;
  parser;
  constructor(s) {
    this.options = s || ke;
  }
  space(s) {
    return "";
  }
  code({ text: s, lang: e, escaped: n }) {
    let r = (e || "").match(P.notSpaceStart)?.[0], t = s.replace(P.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + se(r) + '">' + (n ? t : se(t, !0)) + `</code></pre>
` : "<pre><code>" + (n ? t : se(t, !0)) + `</code></pre>
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
    return `<code>${se(s, !0)}</code>`;
  }
  br(s) {
    return "<br>";
  }
  del({ tokens: s }) {
    return `<del>${this.parser.parseInline(s)}</del>`;
  }
  link({ href: s, title: e, tokens: n }) {
    let r = this.parser.parseInline(n), t = wn(s);
    if (t === null) return r;
    s = t;
    let i = '<a href="' + s + '"';
    return e && (i += ' title="' + se(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: s, title: e, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let t = wn(s);
    if (t === null) return se(n);
    s = t;
    let i = `<img src="${s}" alt="${se(n)}"`;
    return e && (i += ` title="${se(e)}"`), i += ">", i;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : se(s.text);
  }
}, qt = class {
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
}, J = class It {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || ke, this.options.renderer = this.options.renderer || new tt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new qt();
  }
  static parse(e, n) {
    return new It(n).parse(e);
  }
  static parseInline(e, n) {
    return new It(n).parseInline(e);
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
    this.options = s || ke;
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
    return this.block ? K.lex : K.lexInline;
  }
  provideParser() {
    return this.block ? J.parse : J.parseInline;
  }
}, Sr = class {
  defaults = Pt();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = J;
  Renderer = tt;
  TextRenderer = qt;
  Lexer = K;
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
          t[l] = (...u) => {
            let h = c.apply(t, u);
            return h === !1 && (h = o.apply(t, u)), h || "";
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
          t[l] = (...u) => {
            let h = c.apply(t, u);
            return h === !1 && (h = o.apply(t, u)), h;
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
          Fe.passThroughHooks.has(i) ? t[l] = (u) => {
            if (this.defaults.async && Fe.passThroughHooksRespectAsync.has(i)) return (async () => {
              let d = await c.call(t, u);
              return o.call(t, d);
            })();
            let h = c.call(t, u);
            return o.call(t, h);
          } : t[l] = (...u) => {
            if (this.defaults.async) return (async () => {
              let d = await c.apply(t, u);
              return d === !1 && (d = await o.apply(t, u)), d;
            })();
            let h = c.apply(t, u);
            return h === !1 && (h = o.apply(t, u)), h;
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
    return K.lex(s, e ?? this.defaults);
  }
  parser(s, e) {
    return J.parse(s, e ?? this.defaults);
  }
  parseMarkdown(s) {
    return (e, n) => {
      let r = { ...n }, t = { ...this.defaults, ...r }, i = this.onError(!!t.silent, !!t.async);
      if (this.defaults.async === !0 && r.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (t.hooks && (t.hooks.options = t, t.hooks.block = s), t.async) return (async () => {
        let l = t.hooks ? await t.hooks.preprocess(e) : e, c = await (t.hooks ? await t.hooks.provideLexer() : s ? K.lex : K.lexInline)(l, t), o = t.hooks ? await t.hooks.processAllTokens(c) : c;
        t.walkTokens && await Promise.all(this.walkTokens(o, t.walkTokens));
        let u = await (t.hooks ? await t.hooks.provideParser() : s ? J.parse : J.parseInline)(o, t);
        return t.hooks ? await t.hooks.postprocess(u) : u;
      })().catch(i);
      try {
        t.hooks && (e = t.hooks.preprocess(e));
        let l = (t.hooks ? t.hooks.provideLexer() : s ? K.lex : K.lexInline)(e, t);
        t.hooks && (l = t.hooks.processAllTokens(l)), t.walkTokens && this.walkTokens(l, t.walkTokens);
        let c = (t.hooks ? t.hooks.provideParser() : s ? J.parse : J.parseInline)(l, t);
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
        let r = "<p>An error occurred:</p><pre>" + se(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, me = new Sr();
function w(s, e) {
  return me.parse(s, e);
}
w.options = w.setOptions = function(s) {
  return me.setOptions(s), w.defaults = me.defaults, Nn(w.defaults), w;
};
w.getDefaults = Pt;
w.defaults = ke;
w.use = function(...s) {
  return me.use(...s), w.defaults = me.defaults, Nn(w.defaults), w;
};
w.walkTokens = function(s, e) {
  return me.walkTokens(s, e);
};
w.parseInline = me.parseInline;
w.Parser = J;
w.parser = J.parse;
w.Renderer = tt;
w.TextRenderer = qt;
w.Lexer = K;
w.lexer = K.lex;
w.Tokenizer = et;
w.Hooks = Fe;
w.parse = w;
w.options;
w.setOptions;
w.use;
w.walkTokens;
w.parseInline;
J.parse;
K.lex;
const {
  entries: Zn,
  setPrototypeOf: vn,
  isFrozen: Ar,
  getPrototypeOf: Er,
  getOwnPropertyDescriptor: Rr
} = Object;
let {
  freeze: z,
  seal: V,
  create: Mt
} = Object, {
  apply: Ot,
  construct: Dt
} = typeof Reflect < "u" && Reflect;
z || (z = function(e) {
  return e;
});
V || (V = function(e) {
  return e;
});
Ot || (Ot = function(e, n) {
  for (var r = arguments.length, t = new Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
    t[i - 2] = arguments[i];
  return e.apply(n, t);
});
Dt || (Dt = function(e) {
  for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
    r[t - 1] = arguments[t];
  return new e(...r);
});
const Xe = B(Array.prototype.forEach), Cr = B(Array.prototype.lastIndexOf), Sn = B(Array.prototype.pop), Ne = B(Array.prototype.push), Lr = B(Array.prototype.splice), Ke = B(String.prototype.toLowerCase), yt = B(String.prototype.toString), vt = B(String.prototype.match), $e = B(String.prototype.replace), Ir = B(String.prototype.indexOf), Mr = B(String.prototype.trim), X = B(Object.prototype.hasOwnProperty), $ = B(RegExp.prototype.test), Pe = Or(TypeError);
function B(s) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), t = 1; t < n; t++)
      r[t - 1] = arguments[t];
    return Ot(s, e, r);
  };
}
function Or(s) {
  return function() {
    for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
      n[r] = arguments[r];
    return Dt(s, n);
  };
}
function k(s, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ke;
  vn && vn(s, null);
  let r = e.length;
  for (; r--; ) {
    let t = e[r];
    if (typeof t == "string") {
      const i = n(t);
      i !== t && (Ar(e) || (e[r] = i), t = i);
    }
    s[t] = !0;
  }
  return s;
}
function Dr(s) {
  for (let e = 0; e < s.length; e++)
    X(s, e) || (s[e] = null);
  return s;
}
function re(s) {
  const e = Mt(null);
  for (const [n, r] of Zn(s))
    X(s, n) && (Array.isArray(r) ? e[n] = Dr(r) : r && typeof r == "object" && r.constructor === Object ? e[n] = re(r) : e[n] = r);
  return e;
}
function ze(s, e) {
  for (; s !== null; ) {
    const r = Rr(s, e);
    if (r) {
      if (r.get)
        return B(r.get);
      if (typeof r.value == "function")
        return B(r.value);
    }
    s = Er(s);
  }
  function n() {
    return null;
  }
  return n;
}
const An = z(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), St = z(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), At = z(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Nr = z(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Et = z(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), $r = z(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), En = z(["#text"]), Rn = z(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Rt = z(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Cn = z(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Qe = z(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Pr = V(/\{\{[\w\W]*|[\w\W]*\}\}/gm), zr = V(/<%[\w\W]*|[\w\W]*%>/gm), Br = V(/\$\{[\w\W]*/gm), Fr = V(/^data-[\-\w.\u00B7-\uFFFF]+$/), Ur = V(/^aria-[\-\w]+$/), jn = V(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Hr = V(/^(?:\w+script|data):/i), Gr = V(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Vn = V(/^html$/i), Wr = V(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Ln = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Ur,
  ATTR_WHITESPACE: Gr,
  CUSTOM_ELEMENT: Wr,
  DATA_ATTR: Fr,
  DOCTYPE_NAME: Vn,
  ERB_EXPR: zr,
  IS_ALLOWED_URI: jn,
  IS_SCRIPT_OR_DATA: Hr,
  MUSTACHE_EXPR: Pr,
  TMPLIT_EXPR: Br
});
const Be = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, qr = function() {
  return typeof window > "u" ? null : window;
}, Yr = function(e, n) {
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
}, In = function() {
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
function Xn() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : qr();
  const e = (g) => Xn(g);
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
    NodeFilter: u,
    NamedNodeMap: h = s.NamedNodeMap || s.MozNamedAttrMap,
    HTMLFormElement: d,
    DOMParser: m,
    trustedTypes: T
  } = s, _ = o.prototype, W = ze(_, "cloneNode"), be = ze(_, "remove"), v = ze(_, "nextSibling"), L = ze(_, "childNodes"), q = ze(_, "parentNode");
  if (typeof l == "function") {
    const g = n.createElement("template");
    g.content && g.content.ownerDocument && (n = g.content.ownerDocument);
  }
  let x, Y = "";
  const {
    implementation: F,
    createNodeIterator: it,
    createDocumentFragment: Qn,
    getElementsByTagName: Kn
  } = n, {
    importNode: Jn
  } = r;
  let N = In();
  e.isSupported = typeof Zn == "function" && typeof q == "function" && F && F.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: lt,
    ERB_EXPR: ot,
    TMPLIT_EXPR: ct,
    DATA_ATTR: es,
    ARIA_ATTR: ts,
    IS_SCRIPT_OR_DATA: ns,
    ATTR_WHITESPACE: Yt,
    CUSTOM_ELEMENT: ss
  } = Ln;
  let {
    IS_ALLOWED_URI: Zt
  } = Ln, C = null;
  const jt = k({}, [...An, ...St, ...At, ...Et, ...En]);
  let I = null;
  const Vt = k({}, [...Rn, ...Rt, ...Cn, ...Qe]);
  let A = Object.seal(Mt(null, {
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
  const _e = Object.seal(Mt(null, {
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
  let Xt = !0, pt = !0, Qt = !1, Kt = !0, xe = !1, He = !0, fe = !1, ht = !1, ft = !1, we = !1, Ge = !1, We = !1, Jt = !0, en = !1;
  const rs = "user-content-";
  let gt = !0, Ie = !1, Te = {}, te = null;
  const dt = k({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let tn = null;
  const nn = k({}, ["audio", "video", "img", "source", "image", "track"]);
  let mt = null;
  const sn = k({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), qe = "http://www.w3.org/1998/Math/MathML", Ye = "http://www.w3.org/2000/svg", ae = "http://www.w3.org/1999/xhtml";
  let ye = ae, kt = !1, bt = null;
  const as = k({}, [qe, Ye, ae], yt);
  let Ze = k({}, ["mi", "mo", "mn", "ms", "mtext"]), je = k({}, ["annotation-xml"]);
  const is = k({}, ["title", "style", "font", "a", "script"]);
  let Me = null;
  const ls = ["application/xhtml+xml", "text/html"], os = "text/html";
  let R = null, ve = null;
  const cs = n.createElement("form"), rn = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, _t = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(ve && ve === a)) {
      if ((!a || typeof a != "object") && (a = {}), a = re(a), Me = // eslint-disable-next-line unicorn/prefer-includes
      ls.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? os : a.PARSER_MEDIA_TYPE, R = Me === "application/xhtml+xml" ? yt : Ke, C = X(a, "ALLOWED_TAGS") ? k({}, a.ALLOWED_TAGS, R) : jt, I = X(a, "ALLOWED_ATTR") ? k({}, a.ALLOWED_ATTR, R) : Vt, bt = X(a, "ALLOWED_NAMESPACES") ? k({}, a.ALLOWED_NAMESPACES, yt) : as, mt = X(a, "ADD_URI_SAFE_ATTR") ? k(re(sn), a.ADD_URI_SAFE_ATTR, R) : sn, tn = X(a, "ADD_DATA_URI_TAGS") ? k(re(nn), a.ADD_DATA_URI_TAGS, R) : nn, te = X(a, "FORBID_CONTENTS") ? k({}, a.FORBID_CONTENTS, R) : dt, Le = X(a, "FORBID_TAGS") ? k({}, a.FORBID_TAGS, R) : re({}), ut = X(a, "FORBID_ATTR") ? k({}, a.FORBID_ATTR, R) : re({}), Te = X(a, "USE_PROFILES") ? a.USE_PROFILES : !1, Xt = a.ALLOW_ARIA_ATTR !== !1, pt = a.ALLOW_DATA_ATTR !== !1, Qt = a.ALLOW_UNKNOWN_PROTOCOLS || !1, Kt = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, xe = a.SAFE_FOR_TEMPLATES || !1, He = a.SAFE_FOR_XML !== !1, fe = a.WHOLE_DOCUMENT || !1, we = a.RETURN_DOM || !1, Ge = a.RETURN_DOM_FRAGMENT || !1, We = a.RETURN_TRUSTED_TYPE || !1, ft = a.FORCE_BODY || !1, Jt = a.SANITIZE_DOM !== !1, en = a.SANITIZE_NAMED_PROPS || !1, gt = a.KEEP_CONTENT !== !1, Ie = a.IN_PLACE || !1, Zt = a.ALLOWED_URI_REGEXP || jn, ye = a.NAMESPACE || ae, Ze = a.MATHML_TEXT_INTEGRATION_POINTS || Ze, je = a.HTML_INTEGRATION_POINTS || je, A = a.CUSTOM_ELEMENT_HANDLING || {}, a.CUSTOM_ELEMENT_HANDLING && rn(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (A.tagNameCheck = a.CUSTOM_ELEMENT_HANDLING.tagNameCheck), a.CUSTOM_ELEMENT_HANDLING && rn(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (A.attributeNameCheck = a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), a.CUSTOM_ELEMENT_HANDLING && typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (A.allowCustomizedBuiltInElements = a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), xe && (pt = !1), Ge && (we = !0), Te && (C = k({}, En), I = [], Te.html === !0 && (k(C, An), k(I, Rn)), Te.svg === !0 && (k(C, St), k(I, Rt), k(I, Qe)), Te.svgFilters === !0 && (k(C, At), k(I, Rt), k(I, Qe)), Te.mathMl === !0 && (k(C, Et), k(I, Cn), k(I, Qe))), a.ADD_TAGS && (typeof a.ADD_TAGS == "function" ? _e.tagCheck = a.ADD_TAGS : (C === jt && (C = re(C)), k(C, a.ADD_TAGS, R))), a.ADD_ATTR && (typeof a.ADD_ATTR == "function" ? _e.attributeCheck = a.ADD_ATTR : (I === Vt && (I = re(I)), k(I, a.ADD_ATTR, R))), a.ADD_URI_SAFE_ATTR && k(mt, a.ADD_URI_SAFE_ATTR, R), a.FORBID_CONTENTS && (te === dt && (te = re(te)), k(te, a.FORBID_CONTENTS, R)), a.ADD_FORBID_CONTENTS && (te === dt && (te = re(te)), k(te, a.ADD_FORBID_CONTENTS, R)), gt && (C["#text"] = !0), fe && k(C, ["html", "head", "body"]), C.table && (k(C, ["tbody"]), delete Le.tbody), a.TRUSTED_TYPES_POLICY) {
        if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Pe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        x = a.TRUSTED_TYPES_POLICY, Y = x.createHTML("");
      } else
        x === void 0 && (x = Yr(T, t)), x !== null && typeof Y == "string" && (Y = x.createHTML(""));
      z && z(a), ve = a;
    }
  }, an = k({}, [...St, ...At, ...Nr]), ln = k({}, [...Et, ...$r]), us = function(a) {
    let p = q(a);
    (!p || !p.tagName) && (p = {
      namespaceURI: ye,
      tagName: "template"
    });
    const f = Ke(a.tagName), S = Ke(p.tagName);
    return bt[a.namespaceURI] ? a.namespaceURI === Ye ? p.namespaceURI === ae ? f === "svg" : p.namespaceURI === qe ? f === "svg" && (S === "annotation-xml" || Ze[S]) : !!an[f] : a.namespaceURI === qe ? p.namespaceURI === ae ? f === "math" : p.namespaceURI === Ye ? f === "math" && je[S] : !!ln[f] : a.namespaceURI === ae ? p.namespaceURI === Ye && !je[S] || p.namespaceURI === qe && !Ze[S] ? !1 : !ln[f] && (is[f] || !an[f]) : !!(Me === "application/xhtml+xml" && bt[a.namespaceURI]) : !1;
  }, ne = function(a) {
    Ne(e.removed, {
      element: a
    });
    try {
      q(a).removeChild(a);
    } catch {
      be(a);
    }
  }, ge = function(a, p) {
    try {
      Ne(e.removed, {
        attribute: p.getAttributeNode(a),
        from: p
      });
    } catch {
      Ne(e.removed, {
        attribute: null,
        from: p
      });
    }
    if (p.removeAttribute(a), a === "is")
      if (we || Ge)
        try {
          ne(p);
        } catch {
        }
      else
        try {
          p.setAttribute(a, "");
        } catch {
        }
  }, on = function(a) {
    let p = null, f = null;
    if (ft)
      a = "<remove></remove>" + a;
    else {
      const E = vt(a, /^[\r\n\t ]+/);
      f = E && E[0];
    }
    Me === "application/xhtml+xml" && ye === ae && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const S = x ? x.createHTML(a) : a;
    if (ye === ae)
      try {
        p = new m().parseFromString(S, Me);
      } catch {
      }
    if (!p || !p.documentElement) {
      p = F.createDocument(ye, "template", null);
      try {
        p.documentElement.innerHTML = kt ? Y : S;
      } catch {
      }
    }
    const D = p.body || p.documentElement;
    return a && f && D.insertBefore(n.createTextNode(f), D.childNodes[0] || null), ye === ae ? Kn.call(p, fe ? "html" : "body")[0] : fe ? p.documentElement : D;
  }, cn = function(a) {
    return it.call(
      a.ownerDocument || a,
      a,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, xt = function(a) {
    return a instanceof d && (typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || !(a.attributes instanceof h) || typeof a.removeAttribute != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function");
  }, un = function(a) {
    return typeof c == "function" && a instanceof c;
  };
  function ie(g, a, p) {
    Xe(g, (f) => {
      f.call(e, a, p, ve);
    });
  }
  const pn = function(a) {
    let p = null;
    if (ie(N.beforeSanitizeElements, a, null), xt(a))
      return ne(a), !0;
    const f = R(a.nodeName);
    if (ie(N.uponSanitizeElement, a, {
      tagName: f,
      allowedTags: C
    }), He && a.hasChildNodes() && !un(a.firstElementChild) && $(/<[/\w!]/g, a.innerHTML) && $(/<[/\w!]/g, a.textContent) || a.nodeType === Be.progressingInstruction || He && a.nodeType === Be.comment && $(/<[/\w]/g, a.data))
      return ne(a), !0;
    if (!(_e.tagCheck instanceof Function && _e.tagCheck(f)) && (!C[f] || Le[f])) {
      if (!Le[f] && fn(f) && (A.tagNameCheck instanceof RegExp && $(A.tagNameCheck, f) || A.tagNameCheck instanceof Function && A.tagNameCheck(f)))
        return !1;
      if (gt && !te[f]) {
        const S = q(a) || a.parentNode, D = L(a) || a.childNodes;
        if (D && S) {
          const E = D.length;
          for (let U = E - 1; U >= 0; --U) {
            const le = W(D[U], !0);
            le.__removalCount = (a.__removalCount || 0) + 1, S.insertBefore(le, v(a));
          }
        }
      }
      return ne(a), !0;
    }
    return a instanceof o && !us(a) || (f === "noscript" || f === "noembed" || f === "noframes") && $(/<\/no(script|embed|frames)/i, a.innerHTML) ? (ne(a), !0) : (xe && a.nodeType === Be.text && (p = a.textContent, Xe([lt, ot, ct], (S) => {
      p = $e(p, S, " ");
    }), a.textContent !== p && (Ne(e.removed, {
      element: a.cloneNode()
    }), a.textContent = p)), ie(N.afterSanitizeElements, a, null), !1);
  }, hn = function(a, p, f) {
    if (Jt && (p === "id" || p === "name") && (f in n || f in cs))
      return !1;
    if (!(pt && !ut[p] && $(es, p))) {
      if (!(Xt && $(ts, p))) {
        if (!(_e.attributeCheck instanceof Function && _e.attributeCheck(p, a))) {
          if (!I[p] || ut[p]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(fn(a) && (A.tagNameCheck instanceof RegExp && $(A.tagNameCheck, a) || A.tagNameCheck instanceof Function && A.tagNameCheck(a)) && (A.attributeNameCheck instanceof RegExp && $(A.attributeNameCheck, p) || A.attributeNameCheck instanceof Function && A.attributeNameCheck(p, a)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              p === "is" && A.allowCustomizedBuiltInElements && (A.tagNameCheck instanceof RegExp && $(A.tagNameCheck, f) || A.tagNameCheck instanceof Function && A.tagNameCheck(f)))
            ) return !1;
          } else if (!mt[p]) {
            if (!$(Zt, $e(f, Yt, ""))) {
              if (!((p === "src" || p === "xlink:href" || p === "href") && a !== "script" && Ir(f, "data:") === 0 && tn[a])) {
                if (!(Qt && !$(ns, $e(f, Yt, "")))) {
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
  }, fn = function(a) {
    return a !== "annotation-xml" && vt(a, ss);
  }, gn = function(a) {
    ie(N.beforeSanitizeAttributes, a, null);
    const {
      attributes: p
    } = a;
    if (!p || xt(a))
      return;
    const f = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: I,
      forceKeepAttr: void 0
    };
    let S = p.length;
    for (; S--; ) {
      const D = p[S], {
        name: E,
        namespaceURI: U,
        value: le
      } = D, Se = R(E), wt = le;
      let M = E === "value" ? wt : Mr(wt);
      if (f.attrName = Se, f.attrValue = M, f.keepAttr = !0, f.forceKeepAttr = void 0, ie(N.uponSanitizeAttribute, a, f), M = f.attrValue, en && (Se === "id" || Se === "name") && (ge(E, a), M = rs + M), He && $(/((--!?|])>)|<\/(style|title|textarea)/i, M)) {
        ge(E, a);
        continue;
      }
      if (Se === "attributename" && vt(M, "href")) {
        ge(E, a);
        continue;
      }
      if (f.forceKeepAttr)
        continue;
      if (!f.keepAttr) {
        ge(E, a);
        continue;
      }
      if (!Kt && $(/\/>/i, M)) {
        ge(E, a);
        continue;
      }
      xe && Xe([lt, ot, ct], (mn) => {
        M = $e(M, mn, " ");
      });
      const dn = R(a.nodeName);
      if (!hn(dn, Se, M)) {
        ge(E, a);
        continue;
      }
      if (x && typeof T == "object" && typeof T.getAttributeType == "function" && !U)
        switch (T.getAttributeType(dn, Se)) {
          case "TrustedHTML": {
            M = x.createHTML(M);
            break;
          }
          case "TrustedScriptURL": {
            M = x.createScriptURL(M);
            break;
          }
        }
      if (M !== wt)
        try {
          U ? a.setAttributeNS(U, E, M) : a.setAttribute(E, M), xt(a) ? ne(a) : Sn(e.removed);
        } catch {
          ge(E, a);
        }
    }
    ie(N.afterSanitizeAttributes, a, null);
  }, ps = function g(a) {
    let p = null;
    const f = cn(a);
    for (ie(N.beforeSanitizeShadowDOM, a, null); p = f.nextNode(); )
      ie(N.uponSanitizeShadowNode, p, null), pn(p), gn(p), p.content instanceof i && g(p.content);
    ie(N.afterSanitizeShadowDOM, a, null);
  };
  return e.sanitize = function(g) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, p = null, f = null, S = null, D = null;
    if (kt = !g, kt && (g = "<!-->"), typeof g != "string" && !un(g))
      if (typeof g.toString == "function") {
        if (g = g.toString(), typeof g != "string")
          throw Pe("dirty is not a string, aborting");
      } else
        throw Pe("toString is not a function");
    if (!e.isSupported)
      return g;
    if (ht || _t(a), e.removed = [], typeof g == "string" && (Ie = !1), Ie) {
      if (g.nodeName) {
        const le = R(g.nodeName);
        if (!C[le] || Le[le])
          throw Pe("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (g instanceof c)
      p = on("<!---->"), f = p.ownerDocument.importNode(g, !0), f.nodeType === Be.element && f.nodeName === "BODY" || f.nodeName === "HTML" ? p = f : p.appendChild(f);
    else {
      if (!we && !xe && !fe && // eslint-disable-next-line unicorn/prefer-includes
      g.indexOf("<") === -1)
        return x && We ? x.createHTML(g) : g;
      if (p = on(g), !p)
        return we ? null : We ? Y : "";
    }
    p && ft && ne(p.firstChild);
    const E = cn(Ie ? g : p);
    for (; S = E.nextNode(); )
      pn(S), gn(S), S.content instanceof i && ps(S.content);
    if (Ie)
      return g;
    if (we) {
      if (Ge)
        for (D = Qn.call(p.ownerDocument); p.firstChild; )
          D.appendChild(p.firstChild);
      else
        D = p;
      return (I.shadowroot || I.shadowrootmode) && (D = Jn.call(r, D, !0)), D;
    }
    let U = fe ? p.outerHTML : p.innerHTML;
    return fe && C["!doctype"] && p.ownerDocument && p.ownerDocument.doctype && p.ownerDocument.doctype.name && $(Vn, p.ownerDocument.doctype.name) && (U = "<!DOCTYPE " + p.ownerDocument.doctype.name + `>
` + U), xe && Xe([lt, ot, ct], (le) => {
      U = $e(U, le, " ");
    }), x && We ? x.createHTML(U) : U;
  }, e.setConfig = function() {
    let g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _t(g), ht = !0;
  }, e.clearConfig = function() {
    ve = null, ht = !1;
  }, e.isValidAttribute = function(g, a, p) {
    ve || _t({});
    const f = R(g), S = R(a);
    return hn(f, S, p);
  }, e.addHook = function(g, a) {
    typeof a == "function" && Ne(N[g], a);
  }, e.removeHook = function(g, a) {
    if (a !== void 0) {
      const p = Cr(N[g], a);
      return p === -1 ? void 0 : Lr(N[g], p, 1)[0];
    }
    return Sn(N[g]);
  }, e.removeHooks = function(g) {
    N[g] = [];
  }, e.removeAllHooks = function() {
    N = In();
  }, e;
}
var Zr = Xn();
const jr = {}, Vr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function Xr(s, e) {
  return y(), O("svg", Vr, [...e[0] || (e[0] = [
    Z("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }, null, -1)
  ])]);
}
const Qr = /* @__PURE__ */ j(jr, [["render", Xr]]), Kr = {}, Jr = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ea(s, e) {
  return y(), O("svg", Jr, [...e[0] || (e[0] = [
    Z("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }, null, -1)
  ])]);
}
const ta = /* @__PURE__ */ j(Kr, [["render", ea]]), na = ["aria-label"], sa = {
  key: 0,
  class: "nc-message-bubble__header"
}, ra = {
  key: 0,
  class: "nc-message-bubble__label"
}, aa = { class: "nc-message-bubble__bubble" }, ia = {
  key: 0,
  class: "nc-message-bubble__content"
}, la = ["innerHTML"], oa = ["aria-label"], ca = /* @__PURE__ */ he({
  __name: "MessageBubble",
  props: {
    message: {}
  },
  setup(s) {
    const e = s, n = H(() => e.message.role === "user"), r = H(
      () => e.message.status === "failed" || e.message.id.startsWith("error-")
    ), t = H(() => e.message.status === "sending"), i = H(() => e.message.role === "assistant" && !r.value), l = H(() => {
      if (e.message.role !== "assistant" || r.value) return null;
      const d = w.parse(e.message.content);
      return Zr.sanitize(d);
    }), c = H(() => r.value ? "Error message" : n.value ? "Message from you" : "Message from AI Assistant"), o = Q(!1);
    let u = null;
    async function h() {
      try {
        await navigator.clipboard.writeText(e.message.content), o.value = !0, u && clearTimeout(u), u = setTimeout(() => {
          o.value = !1;
        }, 1500);
      } catch {
      }
    }
    return On(() => {
      u && clearTimeout(u);
    }), (d, m) => (y(), O("li", {
      role: "listitem",
      "aria-label": c.value,
      class: Nt(["nc-message-bubble", {
        "nc-message-bubble--user": n.value,
        "nc-message-bubble--assistant": i.value,
        "nc-message-bubble--error": r.value,
        "nc-message-bubble--sending": t.value
      }])
    }, [
      r.value ? kn("", !0) : (y(), O("div", sa, [
        n.value ? (y(), O("span", ra, "You")) : (y(), O(Dn, { key: 1 }, [
          G($t, { class: "nc-message-bubble__star" }),
          m[0] || (m[0] = Z("span", { class: "nc-message-bubble__label" }, "AI Assistant", -1))
        ], 64))
      ])),
      Z("div", aa, [
        n.value || r.value ? (y(), O("div", ia, Mn(s.message.content), 1)) : (y(), O("div", {
          key: 1,
          class: "nc-message-bubble__content",
          innerHTML: l.value
        }, null, 8, la))
      ]),
      i.value ? (y(), O("button", {
        key: 1,
        class: "nc-message-bubble__copy",
        "aria-label": o.value ? "Message copied" : "Copy message",
        onClick: h
      }, [
        o.value ? (y(), oe(ta, { key: 0 })) : (y(), oe(Qr, { key: 1 }))
      ], 8, oa)) : kn("", !0)
    ], 10, na));
  }
}), ua = /* @__PURE__ */ j(ca, [["__scopeId", "data-v-53d7ea52"]]), pa = {
  role: "list",
  "aria-live": "polite",
  class: "nc-message-list"
}, ha = { class: "nc-message-list__loader" }, fa = 50, ga = /* @__PURE__ */ he({
  __name: "MessageList",
  setup(s) {
    const e = pe(Ce), n = nt("scrollContainer"), r = Q(!0);
    function t() {
      const o = n.value?.$el;
      return o instanceof HTMLElement ? o : null;
    }
    function i() {
      const o = t();
      if (!o) return;
      const { scrollTop: u, scrollHeight: h, clientHeight: d } = o;
      r.value = h - u - d <= fa;
    }
    function l() {
      const o = t();
      o && (o.scrollTop = o.scrollHeight);
    }
    Ee(
      () => e.messages.value,
      () => {
        r.value && Re(l);
      }
    ), hs(() => {
      e.messages.value.length > 0 && Re(l), t()?.addEventListener("scroll", i, { passive: !0 });
    }), On(() => {
      t()?.removeEventListener("scroll", i);
    });
    async function c({ done: o }) {
      const u = t(), h = u?.scrollHeight ?? 0;
      try {
        await e.loadMore(), o(e.hasMore.value ? "ok" : "empty");
      } catch {
        o("error");
      }
      if (await Re(), u) {
        const d = u.scrollHeight;
        u.scrollTop = u.scrollTop + (d - h);
      }
    }
    return (o, u) => {
      const h = ee("v-progress-circular"), d = ee("v-infinite-scroll");
      return y(), oe(d, {
        ref: "scrollContainer",
        side: "start",
        disabled: !ce(e).hasMore.value,
        class: "nc-message-list-scroll",
        onLoad: c
      }, {
        loading: ue(() => [
          Z("div", ha, [
            G(h, {
              indeterminate: "",
              size: "24",
              width: "2"
            })
          ])
        ]),
        empty: ue(() => [...u[0] || (u[0] = [])]),
        default: ue(() => [
          Z("ul", pa, [
            (y(!0), O(Dn, null, fs(ce(e).messages.value, (m) => (y(), oe(ua, {
              key: m.id,
              message: m
            }, null, 8, ["message"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["disabled"]);
    };
  }
}), da = /* @__PURE__ */ j(ga, [["__scopeId", "data-v-97a5ddc7"]]), ma = {}, ka = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ba(s, e) {
  return y(), O("svg", ka, [...e[0] || (e[0] = [
    Z("path", { d: "M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91Z" }, null, -1)
  ])]);
}
const _a = /* @__PURE__ */ j(ma, [["render", ba]]), xa = { class: "nc-chat-input" }, wa = /* @__PURE__ */ he({
  __name: "ChatInput",
  setup(s) {
    const e = pe(Ce), n = Q(""), r = nt("textareaRef"), t = H(() => n.value.trim().length > 0 && !e.isSending.value);
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
    return Ee(
      () => e.failedMessageText.value,
      (c) => {
        c && (n.value = c);
      }
    ), Ee(
      () => e.isOpen.value,
      (c) => {
        c && Re(() => {
          r.value?.focus();
        });
      }
    ), Ee(
      () => e.isSending.value,
      (c, o) => {
        o && !c && Re(() => {
          r.value?.focus();
        });
      }
    ), (c, o) => {
      const u = ee("v-textarea"), h = ee("v-btn");
      return y(), O("div", xa, [
        G(u, {
          ref_key: "textareaRef",
          ref: r,
          modelValue: n.value,
          "onUpdate:modelValue": o[0] || (o[0] = (d) => n.value = d),
          "auto-grow": "",
          rows: 1,
          "max-rows": 6,
          "no-resize": "",
          "hide-details": "",
          variant: "outlined",
          density: "compact",
          placeholder: "Type a message",
          "aria-label": "Type a message",
          disabled: ce(e).isSending.value,
          class: "nc-chat-input__textarea",
          onKeydown: l
        }, null, 8, ["modelValue", "disabled"]),
        G(h, {
          icon: "",
          variant: "flat",
          color: "secondary",
          size: "small",
          disabled: !t.value,
          "aria-label": "Send message",
          class: "nc-chat-input__send-btn",
          onClick: i
        }, {
          default: ue(() => [
            G(_a)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]);
    };
  }
}), Ta = /* @__PURE__ */ j(wa, [["__scopeId", "data-v-ca6398c4"]]), ya = { class: "nc-chat-panel__body" }, va = /* @__PURE__ */ he({
  __name: "ChatPanel",
  setup(s) {
    const e = pe(Ce), n = H({
      get: () => e.isOpen.value,
      set: () => {
      }
    }), r = pe(st), t = H(() => r?.welcomeMessage), i = ms(), l = H(() => i.width.value < 768), c = H(() => l.value ? "100%" : 400), o = (u) => {
      u.key === "Escape" && e.isOpen.value && e.close();
    };
    return Ee(
      () => e.isOpen.value,
      (u) => {
        u ? window.addEventListener("keydown", o) : window.removeEventListener("keydown", o);
      },
      { immediate: !0 }
    ), gs(() => {
      window.removeEventListener("keydown", o);
    }), (u, h) => {
      const d = ee("v-progress-circular"), m = ee("v-navigation-drawer");
      return y(), oe(m, {
        modelValue: n.value,
        "onUpdate:modelValue": h[0] || (h[0] = (T) => n.value = T),
        location: "right",
        temporary: "",
        scrim: !1,
        width: c.value,
        role: "complementary",
        "aria-label": "Chat with AI Assistant",
        class: Nt(["nc-chat-panel", { "nc-chat-panel--mobile": l.value }])
      }, {
        default: ue(() => [
          G(Ms),
          Z("div", ya, [
            ce(e).isLoading.value && ce(e).messages.value.length === 0 ? (y(), oe(d, {
              key: 0,
              indeterminate: "",
              size: "24",
              class: "nc-chat-panel__loader"
            })) : ce(e).messages.value.length === 0 && !ce(e).isSending.value ? (y(), oe($s, {
              key: 1,
              message: t.value
            }, null, 8, ["message"])) : (y(), oe(da, { key: 2 }))
          ]),
          G(Ta)
        ]),
        _: 1
      }, 8, ["modelValue", "width", "class"]);
    };
  }
}), Sa = /* @__PURE__ */ j(va, [["__scopeId", "data-v-c922c155"]]), Aa = /* @__PURE__ */ he({
  __name: "NativeChatWidget",
  setup(s) {
    const e = ks();
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
    const n = pe(st), r = _s(n.apiClient, n);
    ds(Ce, r);
    const t = nt("floatingButtonRef");
    return Ee(
      () => r.isOpen.value,
      (i) => {
        i || Re(() => {
          t.value?.focus();
        });
      }
    ), (i, l) => {
      const c = ee("v-theme-provider");
      return y(), oe(c, { theme: "nativeChat" }, {
        default: ue(() => [
          G(vs, {
            ref_key: "floatingButtonRef",
            ref: t
          }, null, 512),
          G(Sa)
        ]),
        _: 1
      });
    };
  }
}), Ea = /* @__PURE__ */ j(Aa, [["__scopeId", "data-v-492f08ed"]]), La = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(st, e), s.component("NativeChatWidget", Ea);
  }
};
function Ia(s) {
  const { baseUrl: e, getAccessToken: n } = s;
  async function r(t, i = {}) {
    const c = {
      Authorization: `Bearer ${await n()}`
    };
    i.body && (c["Content-Type"] = "application/json");
    const o = await fetch(t, { ...i, headers: c });
    if (!o.ok) {
      const u = new Error(`HTTP ${o.status}: ${o.statusText}`);
      throw u.statusCode = o.status, u;
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
  La as NativeChatPlugin,
  Ea as NativeChatWidget,
  Ia as createNativeChatApiClient,
  La as default
};
