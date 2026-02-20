import { ref as Q, readonly as Se, openBlock as y, createElementBlock as M, createElementVNode as j, defineComponent as pe, inject as ue, computed as W, useTemplateRef as nt, resolveComponent as oe, normalizeClass as Mt, createVNode as Y, withCtx as Fe, unref as de, toDisplayString as Ln, onBeforeUnmount as On, Fragment as Dn, createBlock as ce, createCommentVNode as hs, watch as Ae, nextTick as Be, onMounted as fs, renderList as gs, onUnmounted as ds, provide as ms } from "vue";
import { useDisplay as ks, useTheme as bs } from "vuetify";
const st = /* @__PURE__ */ Symbol("native-chat-config"), Ee = /* @__PURE__ */ Symbol("native-chat-state");
function mn(s) {
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
  const t = Q([]), r = Q(!1), n = Q(!1), i = Q(!1), l = Q(!1), c = Q(null), o = Q(null), p = Q(0), h = e.batchSize ?? 20;
  async function d() {
    if (!(r.value || n.value)) {
      n.value = !0;
      try {
        if (e.conversationId)
          o.value = e.conversationId;
        else {
          const re = await s.getConversations(0, 1);
          if (re.conversations.length > 0)
            o.value = re.conversations[0].id;
          else {
            const T = await s.createConversation();
            o.value = T.id;
          }
        }
        const C = await s.getMessages(o.value, 0, h), $ = [...C.messages].reverse();
        t.value = $, l.value = C.has_more, p.value = $.length;
      } catch {
      } finally {
        n.value = !1, r.value = !0;
      }
    }
  }
  function m() {
    r.value = !1;
  }
  async function w(C) {
    if (!C.trim() || i.value) return;
    i.value = !0;
    const $ = `temp-${Date.now()}`, re = {
      id: $,
      conversationId: o.value ?? "",
      role: "user",
      content: C,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sending"
    };
    if (t.value = [...t.value, re], !o.value)
      try {
        const T = await s.createConversation();
        o.value = T.id;
      } catch (T) {
        t.value = t.value.filter((I) => I.id !== $ && !I.id.startsWith("error-"));
        const v = mn(T), P = {
          id: `error-${Date.now()}`,
          conversationId: "",
          role: "assistant",
          content: v,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        t.value = [...t.value, P], c.value = C, i.value = !1, e.onError && e.onError({
          message: v,
          statusCode: T && typeof T == "object" && "statusCode" in T ? T.statusCode : void 0,
          originalError: T
        });
        return;
      }
    try {
      const T = await s.sendMessage(o.value, C), v = {
        ...T.userMessage,
        status: "sent"
      }, P = {
        ...T.assistantMessage
      };
      t.value = [
        ...t.value.filter((I) => I.id !== $ && !I.id.startsWith("error-")),
        v,
        P
      ], c.value = null;
    } catch (T) {
      t.value = t.value.filter((I) => I.id !== $ && !I.id.startsWith("error-"));
      const v = mn(T), P = {
        id: `error-${Date.now()}`,
        conversationId: o.value,
        role: "assistant",
        content: v,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      t.value = [...t.value, P], c.value = C, e.onError && e.onError({
        message: v,
        statusCode: T && typeof T == "object" && "statusCode" in T ? T.statusCode : void 0,
        originalError: T
      });
    } finally {
      i.value = !1;
    }
  }
  async function _() {
    if (!(!l.value || n.value || !o.value)) {
      n.value = !0;
      try {
        const C = await s.getMessages(
          o.value,
          p.value,
          h
        ), $ = [...C.messages].reverse();
        t.value = [...$, ...t.value], p.value += $.length, l.value = C.has_more;
      } catch {
      } finally {
        n.value = !1;
      }
    }
  }
  async function q() {
    if (!c.value) return;
    const C = c.value;
    c.value = null, await w(C);
  }
  return {
    messages: Se(t),
    isOpen: Se(r),
    isLoading: Se(n),
    isSending: Se(i),
    hasMore: Se(l),
    failedMessageText: Se(c),
    open: d,
    close: m,
    sendMessage: w,
    loadMore: _,
    retry: q
  };
}
const wt = {
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
}, Z = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [r, n] of e)
    t[r] = n;
  return t;
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
  return y(), M("svg", ws, [...e[0] || (e[0] = [
    j("path", { d: "M12 1c.4 0 .7.3.9.7l2.2 5.8 5.8 2.2c.4.2.7.5.7.9s-.3.7-.7.9l-5.8 2.2-2.2 5.8c-.2.4-.5.7-.9.7s-.7-.3-.9-.7l-2.2-5.8-5.8-2.2c-.4-.2-.7-.5-.7-.9s.3-.7.7-.9l5.8-2.2 2.2-5.8c.2-.4.5-.7.9-.7Z" }, null, -1)
  ])]);
}
const Nt = /* @__PURE__ */ Z(xs, [["render", Ts]]), vs = /* @__PURE__ */ pe({
  __name: "FloatingButton",
  setup(s, { expose: e }) {
    const t = ue(st), r = ue(Ee), n = W(() => r.isOpen.value), i = W(() => t?.position ?? "bottom-right"), l = W(
      () => `nc-floating-button-wrapper--${i.value === "bottom-left" ? "left" : "right"}`
    );
    function c() {
      r.isOpen.value ? r.close() : r.open();
    }
    const o = nt("triggerBtn");
    function p() {
      o.value?.$el?.focus();
    }
    return e({ focus: p }), (h, d) => {
      const m = oe("v-icon"), w = oe("v-btn");
      return y(), M("div", {
        class: Mt(["nc-floating-button-wrapper", l.value])
      }, [
        Y(w, {
          ref_key: "triggerBtn",
          ref: o,
          icon: "",
          size: "56",
          color: "secondary",
          elevation: "4",
          "aria-label": n.value ? "Close chat" : "Open chat",
          "aria-expanded": n.value.toString(),
          onClick: c
        }, {
          default: Fe(() => [
            Y(m, {
              icon: Nt,
              color: "white"
            })
          ]),
          _: 1
        }, 8, ["aria-label", "aria-expanded"])
      ], 2);
    };
  }
}), ys = /* @__PURE__ */ Z(vs, [["__scopeId", "data-v-a57cf6f6"]]), Ss = {}, As = {
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
    j("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, null, -1)
  ])]);
}
const Rs = /* @__PURE__ */ Z(Ss, [["render", Es]]), Cs = { class: "nc-chat-header" }, Is = { class: "nc-chat-header__left" }, Ls = /* @__PURE__ */ pe({
  __name: "ChatHeader",
  setup(s) {
    const e = ue(Ee);
    return (t, r) => {
      const n = oe("v-icon"), i = oe("v-btn");
      return y(), M("div", Cs, [
        j("div", Is, [
          Y(n, {
            icon: Nt,
            color: "secondary",
            size: "20"
          }),
          r[1] || (r[1] = j("span", { class: "nc-chat-header__title" }, "AI Assistant", -1))
        ]),
        Y(i, {
          icon: "",
          variant: "text",
          size: "small",
          "aria-label": "Close chat",
          onClick: r[0] || (r[0] = (l) => de(e).close())
        }, {
          default: Fe(() => [
            Y(n, {
              icon: Rs,
              size: "18"
            })
          ]),
          _: 1
        })
      ]);
    };
  }
}), Os = /* @__PURE__ */ Z(Ls, [["__scopeId", "data-v-f89f9f15"]]), Ds = { class: "nc-welcome-state" }, Ms = { class: "nc-welcome-state__text" }, Ns = /* @__PURE__ */ pe({
  __name: "WelcomeState",
  props: {
    message: {}
  },
  setup(s) {
    return (e, t) => (y(), M("div", Ds, [
      j("p", Ms, Ln(s.message ?? "Hello! How can I help you?"), 1)
    ]));
  }
}), $s = /* @__PURE__ */ Z(Ns, [["__scopeId", "data-v-6d3eccea"]]);
function $t() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var ke = $t();
function Mn(s) {
  ke = s;
}
var ge = { exec: () => null };
function b(s, e = "") {
  let t = typeof s == "string" ? s : s.source, r = { replace: (n, i) => {
    let l = typeof i == "string" ? i : i.source;
    return l = l.replace(F.caret, "$1"), t = t.replace(n, l), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var Ps = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), F = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (s) => new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}#`), htmlBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (s) => new RegExp(`^ {0,${Math.min(3, s - 1)}}>`) }, zs = /^(?:[ \t]*(?:\n|$))+/, Bs = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Fs = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ue = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Us = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Pt = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Nn = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, $n = b(Nn).replace(/bull/g, Pt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Hs = b(Nn).replace(/bull/g, Pt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), zt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Gs = /^[^\n]+/, Bt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ws = b(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Bt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), qs = b(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Pt).getRegex(), rt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ft = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Ys = b("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Ft).replace("tag", rt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Pn = b(zt).replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), Zs = b(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Pn).getRegex(), Ut = { blockquote: Zs, code: Bs, def: Ws, fences: Fs, heading: Us, hr: Ue, html: Ys, lheading: $n, list: qs, newline: zs, paragraph: Pn, table: ge, text: Gs }, kn = b("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex(), js = { ...Ut, lheading: Hs, table: kn, paragraph: b(zt).replace("hr", Ue).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", kn).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", rt).getRegex() }, Vs = { ...Ut, html: b(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Ft).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: ge, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: b(zt).replace("hr", Ue).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", $n).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Xs = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Qs = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, zn = /^( {2,}|\\)\n(?!\s*$)/, Ks = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, at = /[\p{P}\p{S}]/u, Ht = /[\s\p{P}\p{S}]/u, Bn = /[^\s\p{P}\p{S}]/u, Js = b(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ht).getRegex(), Fn = /(?!~)[\p{P}\p{S}]/u, er = /(?!~)[\s\p{P}\p{S}]/u, tr = /(?:[^\s\p{P}\p{S}]|~)/u, Un = /(?![*_])[\p{P}\p{S}]/u, nr = /(?![*_])[\s\p{P}\p{S}]/u, sr = /(?:[^\s\p{P}\p{S}]|[*_])/u, rr = b(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Ps ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Hn = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, ar = b(Hn, "u").replace(/punct/g, at).getRegex(), ir = b(Hn, "u").replace(/punct/g, Fn).getRegex(), Gn = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", lr = b(Gn, "gu").replace(/notPunctSpace/g, Bn).replace(/punctSpace/g, Ht).replace(/punct/g, at).getRegex(), or = b(Gn, "gu").replace(/notPunctSpace/g, tr).replace(/punctSpace/g, er).replace(/punct/g, Fn).getRegex(), cr = b("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Bn).replace(/punctSpace/g, Ht).replace(/punct/g, at).getRegex(), ur = b(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, Un).getRegex(), pr = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hr = b(pr, "gu").replace(/notPunctSpace/g, sr).replace(/punctSpace/g, nr).replace(/punct/g, Un).getRegex(), fr = b(/\\(punct)/, "gu").replace(/punct/g, at).getRegex(), gr = b(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), dr = b(Ft).replace("(?:-->|$)", "-->").getRegex(), mr = b("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", dr).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Je = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, kr = b(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", Je).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Wn = b(/^!?\[(label)\]\[(ref)\]/).replace("label", Je).replace("ref", Bt).getRegex(), qn = b(/^!?\[(ref)\](?:\[\])?/).replace("ref", Bt).getRegex(), br = b("reflink|nolink(?!\\()", "g").replace("reflink", Wn).replace("nolink", qn).getRegex(), bn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Gt = { _backpedal: ge, anyPunctuation: fr, autolink: gr, blockSkip: rr, br: zn, code: Qs, del: ge, delLDelim: ge, delRDelim: ge, emStrongLDelim: ar, emStrongRDelimAst: lr, emStrongRDelimUnd: cr, escape: Xs, link: kr, nolink: qn, punctuation: Js, reflink: Wn, reflinkSearch: br, tag: mr, text: Ks, url: ge }, _r = { ...Gt, link: b(/^!?\[(label)\]\((.*?)\)/).replace("label", Je).getRegex(), reflink: b(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Je).getRegex() }, Rt = { ...Gt, emStrongRDelimAst: or, emStrongLDelim: ir, delLDelim: ur, delRDelim: hr, url: b(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", bn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: b(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", bn).getRegex() }, xr = { ...Rt, br: b(zn).replace("{2,}", "*").getRegex(), text: b(Rt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Ve = { normal: Ut, gfm: js, pedantic: Vs }, Le = { normal: Gt, gfm: Rt, breaks: xr, pedantic: _r }, wr = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, _n = (s) => wr[s];
function ne(s, e) {
  if (e) {
    if (F.escapeTest.test(s)) return s.replace(F.escapeReplace, _n);
  } else if (F.escapeTestNoEncode.test(s)) return s.replace(F.escapeReplaceNoEncode, _n);
  return s;
}
function xn(s) {
  try {
    s = encodeURI(s).replace(F.percentDecode, "%");
  } catch {
    return null;
  }
  return s;
}
function wn(s, e) {
  let t = s.replace(F.findPipe, (i, l, c) => {
    let o = !1, p = l;
    for (; --p >= 0 && c[p] === "\\"; ) o = !o;
    return o ? "|" : " |";
  }), r = t.split(F.splitPipe), n = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; n < r.length; n++) r[n] = r[n].trim().replace(F.slashPipe, "|");
  return r;
}
function Oe(s, e, t) {
  let r = s.length;
  if (r === 0) return "";
  let n = 0;
  for (; n < r && s.charAt(r - n - 1) === e; )
    n++;
  return s.slice(0, r - n);
}
function Tr(s, e) {
  if (s.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let r = 0; r < s.length; r++) if (s[r] === "\\") r++;
  else if (s[r] === e[0]) t++;
  else if (s[r] === e[1] && (t--, t < 0)) return r;
  return t > 0 ? -2 : -1;
}
function vr(s, e = 0) {
  let t = e, r = "";
  for (let n of s) if (n === "	") {
    let i = 4 - t % 4;
    r += " ".repeat(i), t += i;
  } else r += n, t++;
  return r;
}
function Tn(s, e, t, r, n) {
  let i = e.href, l = e.title || null, c = s[1].replace(n.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let o = { type: s[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: l, text: c, tokens: r.inlineTokens(c) };
  return r.state.inLink = !1, o;
}
function yr(s, e, t) {
  let r = s.match(t.other.indentCodeCompensation);
  if (r === null) return e;
  let n = r[1];
  return e.split(`
`).map((i) => {
    let l = i.match(t.other.beginningSpace);
    if (l === null) return i;
    let [c] = l;
    return c.length >= n.length ? i.slice(n.length) : i;
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
      let t = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? t : Oe(t, `
`) };
    }
  }
  fences(s) {
    let e = this.rules.block.fences.exec(s);
    if (e) {
      let t = e[0], r = yr(t, e[3] || "", this.rules);
      return { type: "code", raw: t, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: r };
    }
  }
  heading(s) {
    let e = this.rules.block.heading.exec(s);
    if (e) {
      let t = e[2].trim();
      if (this.rules.other.endingHash.test(t)) {
        let r = Oe(t, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (t = r.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: t, tokens: this.lexer.inline(t) };
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
      let t = Oe(e[0], `
`).split(`
`), r = "", n = "", i = [];
      for (; t.length > 0; ) {
        let l = !1, c = [], o;
        for (o = 0; o < t.length; o++) if (this.rules.other.blockquoteStart.test(t[o])) c.push(t[o]), l = !0;
        else if (!l) c.push(t[o]);
        else break;
        t = t.slice(o);
        let p = c.join(`
`), h = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${p}` : p, n = n ? `${n}
${h}` : h;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(h, i, !0), this.lexer.state.top = d, t.length === 0) break;
        let m = i.at(-1);
        if (m?.type === "code") break;
        if (m?.type === "blockquote") {
          let w = m, _ = w.raw + `
` + t.join(`
`), q = this.blockquote(_);
          i[i.length - 1] = q, r = r.substring(0, r.length - w.raw.length) + q.raw, n = n.substring(0, n.length - w.text.length) + q.text;
          break;
        } else if (m?.type === "list") {
          let w = m, _ = w.raw + `
` + t.join(`
`), q = this.list(_);
          i[i.length - 1] = q, r = r.substring(0, r.length - m.raw.length) + q.raw, n = n.substring(0, n.length - w.raw.length) + q.raw, t = _.substring(i.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: i, text: n };
    }
  }
  list(s) {
    let e = this.rules.block.list.exec(s);
    if (e) {
      let t = e[1].trim(), r = t.length > 1, n = { type: "list", raw: "", ordered: r, start: r ? +t.slice(0, -1) : "", loose: !1, items: [] };
      t = r ? `\\d{1,9}\\${t.slice(-1)}` : `\\${t}`, this.options.pedantic && (t = r ? t : "[*+-]");
      let i = this.rules.other.listItemRegex(t), l = !1;
      for (; s; ) {
        let o = !1, p = "", h = "";
        if (!(e = i.exec(s)) || this.rules.block.hr.test(s)) break;
        p = e[0], s = s.substring(p.length);
        let d = vr(e[2].split(`
`, 1)[0], e[1].length), m = s.split(`
`, 1)[0], w = !d.trim(), _ = 0;
        if (this.options.pedantic ? (_ = 2, h = d.trimStart()) : w ? _ = e[1].length + 1 : (_ = d.search(this.rules.other.nonSpaceChar), _ = _ > 4 ? 1 : _, h = d.slice(_), _ += e[1].length), w && this.rules.other.blankLine.test(m) && (p += m + `
`, s = s.substring(m.length + 1), o = !0), !o) {
          let q = this.rules.other.nextBulletRegex(_), C = this.rules.other.hrRegex(_), $ = this.rules.other.fencesBeginRegex(_), re = this.rules.other.headingBeginRegex(_), T = this.rules.other.htmlBeginRegex(_), v = this.rules.other.blockquoteBeginRegex(_);
          for (; s; ) {
            let P = s.split(`
`, 1)[0], I;
            if (m = P, this.options.pedantic ? (m = m.replace(this.rules.other.listReplaceNesting, "  "), I = m) : I = m.replace(this.rules.other.tabCharGlobal, "    "), $.test(m) || re.test(m) || T.test(m) || v.test(m) || q.test(m) || C.test(m)) break;
            if (I.search(this.rules.other.nonSpaceChar) >= _ || !m.trim()) h += `
` + I.slice(_);
            else {
              if (w || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || $.test(d) || re.test(d) || C.test(d)) break;
              h += `
` + m;
            }
            w = !m.trim(), p += P + `
`, s = s.substring(P.length + 1), d = I.slice(_);
          }
        }
        n.loose || (l ? n.loose = !0 : this.rules.other.doubleBlankLine.test(p) && (l = !0)), n.items.push({ type: "list_item", raw: p, task: !!this.options.gfm && this.rules.other.listIsTask.test(h), loose: !1, text: h, tokens: [] }), n.raw += p;
      }
      let c = n.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      n.raw = n.raw.trimEnd();
      for (let o of n.items) {
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
            o.checked = h.checked, n.loose ? o.tokens[0] && ["paragraph", "text"].includes(o.tokens[0].type) && "tokens" in o.tokens[0] && o.tokens[0].tokens ? (o.tokens[0].raw = h.raw + o.tokens[0].raw, o.tokens[0].text = h.raw + o.tokens[0].text, o.tokens[0].tokens.unshift(h)) : o.tokens.unshift({ type: "paragraph", raw: h.raw, text: h.raw, tokens: [h] }) : o.tokens.unshift(h);
          }
        }
        if (!n.loose) {
          let p = o.tokens.filter((d) => d.type === "space"), h = p.length > 0 && p.some((d) => this.rules.other.anyLine.test(d.raw));
          n.loose = h;
        }
      }
      if (n.loose) for (let o of n.items) {
        o.loose = !0;
        for (let p of o.tokens) p.type === "text" && (p.type = "paragraph");
      }
      return n;
    }
  }
  html(s) {
    let e = this.rules.block.html.exec(s);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(s) {
    let e = this.rules.block.def.exec(s);
    if (e) {
      let t = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", n = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: t, raw: e[0], href: r, title: n };
    }
  }
  table(s) {
    let e = this.rules.block.table.exec(s);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let t = wn(e[1]), r = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), n = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], i = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (t.length === r.length) {
      for (let l of r) this.rules.other.tableAlignRight.test(l) ? i.align.push("right") : this.rules.other.tableAlignCenter.test(l) ? i.align.push("center") : this.rules.other.tableAlignLeft.test(l) ? i.align.push("left") : i.align.push(null);
      for (let l = 0; l < t.length; l++) i.header.push({ text: t[l], tokens: this.lexer.inline(t[l]), header: !0, align: i.align[l] });
      for (let l of n) i.rows.push(wn(l, i.header.length).map((c, o) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: i.align[o] })));
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
      let t = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: t, tokens: this.lexer.inline(t) };
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
      let t = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(t)) {
        if (!this.rules.other.endAngleBracket.test(t)) return;
        let i = Oe(t.slice(0, -1), "\\");
        if ((t.length - i.length) % 2 === 0) return;
      } else {
        let i = Tr(e[2], "()");
        if (i === -2) return;
        if (i > -1) {
          let l = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + i;
          e[2] = e[2].substring(0, i), e[0] = e[0].substring(0, l).trim(), e[3] = "";
        }
      }
      let r = e[2], n = "";
      if (this.options.pedantic) {
        let i = this.rules.other.pedanticHrefTitle.exec(r);
        i && (r = i[1], n = i[3]);
      } else n = e[3] ? e[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(t) ? r = r.slice(1) : r = r.slice(1, -1)), Tn(e, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: n && n.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(s, e) {
    let t;
    if ((t = this.rules.inline.reflink.exec(s)) || (t = this.rules.inline.nolink.exec(s))) {
      let r = (t[2] || t[1]).replace(this.rules.other.multipleSpaceGlobal, " "), n = e[r.toLowerCase()];
      if (!n) {
        let i = t[0].charAt(0);
        return { type: "text", raw: i, text: i };
      }
      return Tn(t, n, t[0], this.lexer, this.rules);
    }
  }
  emStrong(s, e, t = "") {
    let r = this.rules.inline.emStrongLDelim.exec(s);
    if (!(!r || r[3] && t.match(this.rules.other.unicodeAlphaNumeric)) && (!(r[1] || r[2]) || !t || this.rules.inline.punctuation.exec(t))) {
      let n = [...r[0]].length - 1, i, l, c = n, o = 0, p = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, e = e.slice(-1 * s.length + n); (r = p.exec(e)) != null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
        if (l = [...i].length, r[3] || r[4]) {
          c += l;
          continue;
        } else if ((r[5] || r[6]) && n % 3 && !((n + l) % 3)) {
          o += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c + o);
        let h = [...r[0]][0].length, d = s.slice(0, n + r.index + h + l);
        if (Math.min(n, l) % 2) {
          let w = d.slice(1, -1);
          return { type: "em", raw: d, text: w, tokens: this.lexer.inlineTokens(w) };
        }
        let m = d.slice(2, -2);
        return { type: "strong", raw: d, text: m, tokens: this.lexer.inlineTokens(m) };
      }
    }
  }
  codespan(s) {
    let e = this.rules.inline.code.exec(s);
    if (e) {
      let t = e[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(t), n = this.rules.other.startingSpaceChar.test(t) && this.rules.other.endingSpaceChar.test(t);
      return r && n && (t = t.substring(1, t.length - 1)), { type: "codespan", raw: e[0], text: t };
    }
  }
  br(s) {
    let e = this.rules.inline.br.exec(s);
    if (e) return { type: "br", raw: e[0] };
  }
  del(s, e, t = "") {
    let r = this.rules.inline.delLDelim.exec(s);
    if (r && (!r[1] || !t || this.rules.inline.punctuation.exec(t))) {
      let n = [...r[0]].length - 1, i, l, c = n, o = this.rules.inline.delRDelim;
      for (o.lastIndex = 0, e = e.slice(-1 * s.length + n); (r = o.exec(e)) != null; ) {
        if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i || (l = [...i].length, l !== n)) continue;
        if (r[3] || r[4]) {
          c += l;
          continue;
        }
        if (c -= l, c > 0) continue;
        l = Math.min(l, l + c);
        let p = [...r[0]][0].length, h = s.slice(0, n + r.index + p + l), d = h.slice(n, -n);
        return { type: "del", raw: h, text: d, tokens: this.lexer.inlineTokens(d) };
      }
    }
  }
  autolink(s) {
    let e = this.rules.inline.autolink.exec(s);
    if (e) {
      let t, r;
      return e[2] === "@" ? (t = e[1], r = "mailto:" + t) : (t = e[1], r = t), { type: "link", raw: e[0], text: t, href: r, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  url(s) {
    let e;
    if (e = this.rules.inline.url.exec(s)) {
      let t, r;
      if (e[2] === "@") t = e[0], r = "mailto:" + t;
      else {
        let n;
        do
          n = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (n !== e[0]);
        t = e[0], e[1] === "www." ? r = "http://" + e[0] : r = e[0];
      }
      return { type: "link", raw: e[0], text: t, href: r, tokens: [{ type: "text", raw: t, text: t }] };
    }
  }
  inlineText(s) {
    let e = this.rules.inline.text.exec(s);
    if (e) {
      let t = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: t };
    }
  }
}, K = class Ct {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || ke, this.options.tokenizer = this.options.tokenizer || new et(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: F, block: Ve.normal, inline: Le.normal };
    this.options.pedantic ? (t.block = Ve.pedantic, t.inline = Le.pedantic) : this.options.gfm && (t.block = Ve.gfm, this.options.breaks ? t.inline = Le.breaks : t.inline = Le.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: Ve, inline: Le };
  }
  static lex(e, t) {
    return new Ct(t).lex(e);
  }
  static lexInline(e, t) {
    return new Ct(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(F.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    for (this.options.pedantic && (e = e.replace(F.tabCharGlobal, "    ").replace(F.spaceLine, "")); e; ) {
      let n;
      if (this.options.extensions?.block?.some((l) => (n = l.call({ lexer: this }, e, t)) ? (e = e.substring(n.raw.length), t.push(n), !0) : !1)) continue;
      if (n = this.tokenizer.space(e)) {
        e = e.substring(n.raw.length);
        let l = t.at(-1);
        n.raw.length === 1 && l !== void 0 ? l.raw += `
` : t.push(n);
        continue;
      }
      if (n = this.tokenizer.code(e)) {
        e = e.substring(n.raw.length);
        let l = t.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + n.raw, l.text += `
` + n.text, this.inlineQueue.at(-1).src = l.text) : t.push(n);
        continue;
      }
      if (n = this.tokenizer.fences(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.heading(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.hr(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.blockquote(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.list(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.html(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.def(e)) {
        e = e.substring(n.raw.length);
        let l = t.at(-1);
        l?.type === "paragraph" || l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + n.raw, l.text += `
` + n.raw, this.inlineQueue.at(-1).src = l.text) : this.tokens.links[n.tag] || (this.tokens.links[n.tag] = { href: n.href, title: n.title }, t.push(n));
        continue;
      }
      if (n = this.tokenizer.table(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      if (n = this.tokenizer.lheading(e)) {
        e = e.substring(n.raw.length), t.push(n);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let l = 1 / 0, c = e.slice(1), o;
        this.options.extensions.startBlock.forEach((p) => {
          o = p.call({ lexer: this }, c), typeof o == "number" && o >= 0 && (l = Math.min(l, o));
        }), l < 1 / 0 && l >= 0 && (i = e.substring(0, l + 1));
      }
      if (this.state.top && (n = this.tokenizer.paragraph(i))) {
        let l = t.at(-1);
        r && l?.type === "paragraph" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + n.raw, l.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(n), r = i.length !== e.length, e = e.substring(n.raw.length);
        continue;
      }
      if (n = this.tokenizer.text(e)) {
        e = e.substring(n.raw.length);
        let l = t.at(-1);
        l?.type === "text" ? (l.raw += (l.raw.endsWith(`
`) ? "" : `
`) + n.raw, l.text += `
` + n.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = l.text) : t.push(n);
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
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    let r = e, n = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0) for (; (n = this.tokenizer.rules.inline.reflinkSearch.exec(r)) != null; ) o.includes(n[0].slice(n[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, n.index) + "[" + "a".repeat(n[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (n = this.tokenizer.rules.inline.anyPunctuation.exec(r)) != null; ) r = r.slice(0, n.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let i;
    for (; (n = this.tokenizer.rules.inline.blockSkip.exec(r)) != null; ) i = n[2] ? n[2].length : 0, r = r.slice(0, n.index + i) + "[" + "a".repeat(n[0].length - i - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let l = !1, c = "";
    for (; e; ) {
      l || (c = ""), l = !1;
      let o;
      if (this.options.extensions?.inline?.some((h) => (o = h.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1)) continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let h = t.at(-1);
        o.type === "text" && h?.type === "text" ? (h.raw += o.raw, h.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, r, c)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e, r, c)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let p = e;
      if (this.options.extensions?.startInline) {
        let h = 1 / 0, d = e.slice(1), m;
        this.options.extensions.startInline.forEach((w) => {
          m = w.call({ lexer: this }, d), typeof m == "number" && m >= 0 && (h = Math.min(h, m));
        }), h < 1 / 0 && h >= 0 && (p = e.substring(0, h + 1));
      }
      if (o = this.tokenizer.inlineText(p)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (c = o.raw.slice(-1)), l = !0;
        let h = t.at(-1);
        h?.type === "text" ? (h.raw += o.raw, h.text += o.text) : t.push(o);
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
    return t;
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
  code({ text: s, lang: e, escaped: t }) {
    let r = (e || "").match(F.notSpaceStart)?.[0], n = s.replace(F.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + ne(r) + '">' + (t ? n : ne(n, !0)) + `</code></pre>
` : "<pre><code>" + (t ? n : ne(n, !0)) + `</code></pre>
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
    let e = s.ordered, t = s.start, r = "";
    for (let l = 0; l < s.items.length; l++) {
      let c = s.items[l];
      r += this.listitem(c);
    }
    let n = e ? "ol" : "ul", i = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + n + i + `>
` + r + "</" + n + `>
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
    let e = "", t = "";
    for (let n = 0; n < s.header.length; n++) t += this.tablecell(s.header[n]);
    e += this.tablerow({ text: t });
    let r = "";
    for (let n = 0; n < s.rows.length; n++) {
      let i = s.rows[n];
      t = "";
      for (let l = 0; l < i.length; l++) t += this.tablecell(i[l]);
      r += this.tablerow({ text: t });
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
    let e = this.parser.parseInline(s.tokens), t = s.header ? "th" : "td";
    return (s.align ? `<${t} align="${s.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  strong({ tokens: s }) {
    return `<strong>${this.parser.parseInline(s)}</strong>`;
  }
  em({ tokens: s }) {
    return `<em>${this.parser.parseInline(s)}</em>`;
  }
  codespan({ text: s }) {
    return `<code>${ne(s, !0)}</code>`;
  }
  br(s) {
    return "<br>";
  }
  del({ tokens: s }) {
    return `<del>${this.parser.parseInline(s)}</del>`;
  }
  link({ href: s, title: e, tokens: t }) {
    let r = this.parser.parseInline(t), n = xn(s);
    if (n === null) return r;
    s = n;
    let i = '<a href="' + s + '"';
    return e && (i += ' title="' + ne(e) + '"'), i += ">" + r + "</a>", i;
  }
  image({ href: s, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    let n = xn(s);
    if (n === null) return ne(t);
    s = n;
    let i = `<img src="${s}" alt="${ne(t)}"`;
    return e && (i += ` title="${ne(e)}"`), i += ">", i;
  }
  text(s) {
    return "tokens" in s && s.tokens ? this.parser.parseInline(s.tokens) : "escaped" in s && s.escaped ? s.text : ne(s.text);
  }
}, Wt = class {
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
    this.options = e || ke, this.options.renderer = this.options.renderer || new tt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Wt();
  }
  static parse(e, t) {
    return new It(t).parse(e);
  }
  static parseInline(e, t) {
    return new It(t).parseInline(e);
  }
  parse(e) {
    let t = "";
    for (let r = 0; r < e.length; r++) {
      let n = e[r];
      if (this.options.extensions?.renderers?.[n.type]) {
        let l = n, c = this.options.extensions.renderers[l.type].call({ parser: this }, l);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(l.type)) {
          t += c || "";
          continue;
        }
      }
      let i = n;
      switch (i.type) {
        case "space": {
          t += this.renderer.space(i);
          break;
        }
        case "hr": {
          t += this.renderer.hr(i);
          break;
        }
        case "heading": {
          t += this.renderer.heading(i);
          break;
        }
        case "code": {
          t += this.renderer.code(i);
          break;
        }
        case "table": {
          t += this.renderer.table(i);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(i);
          break;
        }
        case "list": {
          t += this.renderer.list(i);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(i);
          break;
        }
        case "html": {
          t += this.renderer.html(i);
          break;
        }
        case "def": {
          t += this.renderer.def(i);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(i);
          break;
        }
        case "text": {
          t += this.renderer.text(i);
          break;
        }
        default: {
          let l = 'Token with "' + i.type + '" type was not found.';
          if (this.options.silent) return console.error(l), "";
          throw new Error(l);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    let r = "";
    for (let n = 0; n < e.length; n++) {
      let i = e[n];
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
          r += t.text(l);
          break;
        }
        case "html": {
          r += t.html(l);
          break;
        }
        case "link": {
          r += t.link(l);
          break;
        }
        case "image": {
          r += t.image(l);
          break;
        }
        case "checkbox": {
          r += t.checkbox(l);
          break;
        }
        case "strong": {
          r += t.strong(l);
          break;
        }
        case "em": {
          r += t.em(l);
          break;
        }
        case "codespan": {
          r += t.codespan(l);
          break;
        }
        case "br": {
          r += t.br(l);
          break;
        }
        case "del": {
          r += t.del(l);
          break;
        }
        case "text": {
          r += t.text(l);
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
}, ze = class {
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
  defaults = $t();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = J;
  Renderer = tt;
  TextRenderer = Wt;
  Lexer = K;
  Tokenizer = et;
  Hooks = ze;
  constructor(...s) {
    this.use(...s);
  }
  walkTokens(s, e) {
    let t = [];
    for (let r of s) switch (t = t.concat(e.call(this, r)), r.type) {
      case "table": {
        let n = r;
        for (let i of n.header) t = t.concat(this.walkTokens(i.tokens, e));
        for (let i of n.rows) for (let l of i) t = t.concat(this.walkTokens(l.tokens, e));
        break;
      }
      case "list": {
        let n = r;
        t = t.concat(this.walkTokens(n.items, e));
        break;
      }
      default: {
        let n = r;
        this.defaults.extensions?.childTokens?.[n.type] ? this.defaults.extensions.childTokens[n.type].forEach((i) => {
          let l = n[i].flat(1 / 0);
          t = t.concat(this.walkTokens(l, e));
        }) : n.tokens && (t = t.concat(this.walkTokens(n.tokens, e)));
      }
    }
    return t;
  }
  use(...s) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return s.forEach((t) => {
      let r = { ...t };
      if (r.async = this.defaults.async || r.async || !1, t.extensions && (t.extensions.forEach((n) => {
        if (!n.name) throw new Error("extension name required");
        if ("renderer" in n) {
          let i = e.renderers[n.name];
          i ? e.renderers[n.name] = function(...l) {
            let c = n.renderer.apply(this, l);
            return c === !1 && (c = i.apply(this, l)), c;
          } : e.renderers[n.name] = n.renderer;
        }
        if ("tokenizer" in n) {
          if (!n.level || n.level !== "block" && n.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let i = e[n.level];
          i ? i.unshift(n.tokenizer) : e[n.level] = [n.tokenizer], n.start && (n.level === "block" ? e.startBlock ? e.startBlock.push(n.start) : e.startBlock = [n.start] : n.level === "inline" && (e.startInline ? e.startInline.push(n.start) : e.startInline = [n.start]));
        }
        "childTokens" in n && n.childTokens && (e.childTokens[n.name] = n.childTokens);
      }), r.extensions = e), t.renderer) {
        let n = this.defaults.renderer || new tt(this.defaults);
        for (let i in t.renderer) {
          if (!(i in n)) throw new Error(`renderer '${i}' does not exist`);
          if (["options", "parser"].includes(i)) continue;
          let l = i, c = t.renderer[l], o = n[l];
          n[l] = (...p) => {
            let h = c.apply(n, p);
            return h === !1 && (h = o.apply(n, p)), h || "";
          };
        }
        r.renderer = n;
      }
      if (t.tokenizer) {
        let n = this.defaults.tokenizer || new et(this.defaults);
        for (let i in t.tokenizer) {
          if (!(i in n)) throw new Error(`tokenizer '${i}' does not exist`);
          if (["options", "rules", "lexer"].includes(i)) continue;
          let l = i, c = t.tokenizer[l], o = n[l];
          n[l] = (...p) => {
            let h = c.apply(n, p);
            return h === !1 && (h = o.apply(n, p)), h;
          };
        }
        r.tokenizer = n;
      }
      if (t.hooks) {
        let n = this.defaults.hooks || new ze();
        for (let i in t.hooks) {
          if (!(i in n)) throw new Error(`hook '${i}' does not exist`);
          if (["options", "block"].includes(i)) continue;
          let l = i, c = t.hooks[l], o = n[l];
          ze.passThroughHooks.has(i) ? n[l] = (p) => {
            if (this.defaults.async && ze.passThroughHooksRespectAsync.has(i)) return (async () => {
              let d = await c.call(n, p);
              return o.call(n, d);
            })();
            let h = c.call(n, p);
            return o.call(n, h);
          } : n[l] = (...p) => {
            if (this.defaults.async) return (async () => {
              let d = await c.apply(n, p);
              return d === !1 && (d = await o.apply(n, p)), d;
            })();
            let h = c.apply(n, p);
            return h === !1 && (h = o.apply(n, p)), h;
          };
        }
        r.hooks = n;
      }
      if (t.walkTokens) {
        let n = this.defaults.walkTokens, i = t.walkTokens;
        r.walkTokens = function(l) {
          let c = [];
          return c.push(i.call(this, l)), n && (c = c.concat(n.call(this, l))), c;
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
    return (e, t) => {
      let r = { ...t }, n = { ...this.defaults, ...r }, i = this.onError(!!n.silent, !!n.async);
      if (this.defaults.async === !0 && r.async === !1) return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return i(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return i(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (n.hooks && (n.hooks.options = n, n.hooks.block = s), n.async) return (async () => {
        let l = n.hooks ? await n.hooks.preprocess(e) : e, c = await (n.hooks ? await n.hooks.provideLexer() : s ? K.lex : K.lexInline)(l, n), o = n.hooks ? await n.hooks.processAllTokens(c) : c;
        n.walkTokens && await Promise.all(this.walkTokens(o, n.walkTokens));
        let p = await (n.hooks ? await n.hooks.provideParser() : s ? J.parse : J.parseInline)(o, n);
        return n.hooks ? await n.hooks.postprocess(p) : p;
      })().catch(i);
      try {
        n.hooks && (e = n.hooks.preprocess(e));
        let l = (n.hooks ? n.hooks.provideLexer() : s ? K.lex : K.lexInline)(e, n);
        n.hooks && (l = n.hooks.processAllTokens(l)), n.walkTokens && this.walkTokens(l, n.walkTokens);
        let c = (n.hooks ? n.hooks.provideParser() : s ? J.parse : J.parseInline)(l, n);
        return n.hooks && (c = n.hooks.postprocess(c)), c;
      } catch (l) {
        return i(l);
      }
    };
  }
  onError(s, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, s) {
        let r = "<p>An error occurred:</p><pre>" + ne(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, me = new Sr();
function x(s, e) {
  return me.parse(s, e);
}
x.options = x.setOptions = function(s) {
  return me.setOptions(s), x.defaults = me.defaults, Mn(x.defaults), x;
};
x.getDefaults = $t;
x.defaults = ke;
x.use = function(...s) {
  return me.use(...s), x.defaults = me.defaults, Mn(x.defaults), x;
};
x.walkTokens = function(s, e) {
  return me.walkTokens(s, e);
};
x.parseInline = me.parseInline;
x.Parser = J;
x.parser = J.parse;
x.Renderer = tt;
x.TextRenderer = Wt;
x.Lexer = K;
x.lexer = K.lex;
x.Tokenizer = et;
x.Hooks = ze;
x.parse = x;
x.options;
x.setOptions;
x.use;
x.walkTokens;
x.parseInline;
J.parse;
K.lex;
const {
  entries: Yn,
  setPrototypeOf: vn,
  isFrozen: Ar,
  getPrototypeOf: Er,
  getOwnPropertyDescriptor: Rr
} = Object;
let {
  freeze: U,
  seal: V,
  create: Lt
} = Object, {
  apply: Ot,
  construct: Dt
} = typeof Reflect < "u" && Reflect;
U || (U = function(e) {
  return e;
});
V || (V = function(e) {
  return e;
});
Ot || (Ot = function(e, t) {
  for (var r = arguments.length, n = new Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
    n[i - 2] = arguments[i];
  return e.apply(t, n);
});
Dt || (Dt = function(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
    r[n - 1] = arguments[n];
  return new e(...r);
});
const Xe = H(Array.prototype.forEach), Cr = H(Array.prototype.lastIndexOf), yn = H(Array.prototype.pop), De = H(Array.prototype.push), Ir = H(Array.prototype.splice), Ke = H(String.prototype.toLowerCase), Tt = H(String.prototype.toString), vt = H(String.prototype.match), Me = H(String.prototype.replace), Lr = H(String.prototype.indexOf), Or = H(String.prototype.trim), X = H(Object.prototype.hasOwnProperty), B = H(RegExp.prototype.test), Ne = Dr(TypeError);
function H(s) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
      r[n - 1] = arguments[n];
    return Ot(s, e, r);
  };
}
function Dr(s) {
  return function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    return Dt(s, t);
  };
}
function k(s, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ke;
  vn && vn(s, null);
  let r = e.length;
  for (; r--; ) {
    let n = e[r];
    if (typeof n == "string") {
      const i = t(n);
      i !== n && (Ar(e) || (e[r] = i), n = i);
    }
    s[n] = !0;
  }
  return s;
}
function Mr(s) {
  for (let e = 0; e < s.length; e++)
    X(s, e) || (s[e] = null);
  return s;
}
function se(s) {
  const e = Lt(null);
  for (const [t, r] of Yn(s))
    X(s, t) && (Array.isArray(r) ? e[t] = Mr(r) : r && typeof r == "object" && r.constructor === Object ? e[t] = se(r) : e[t] = r);
  return e;
}
function $e(s, e) {
  for (; s !== null; ) {
    const r = Rr(s, e);
    if (r) {
      if (r.get)
        return H(r.get);
      if (typeof r.value == "function")
        return H(r.value);
    }
    s = Er(s);
  }
  function t() {
    return null;
  }
  return t;
}
const Sn = U(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), yt = U(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), St = U(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Nr = U(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), At = U(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), $r = U(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), An = U(["#text"]), En = U(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Et = U(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Rn = U(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Qe = U(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Pr = V(/\{\{[\w\W]*|[\w\W]*\}\}/gm), zr = V(/<%[\w\W]*|[\w\W]*%>/gm), Br = V(/\$\{[\w\W]*/gm), Fr = V(/^data-[\-\w.\u00B7-\uFFFF]+$/), Ur = V(/^aria-[\-\w]+$/), Zn = V(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Hr = V(/^(?:\w+script|data):/i), Gr = V(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), jn = V(/^html$/i), Wr = V(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Cn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: Ur,
  ATTR_WHITESPACE: Gr,
  CUSTOM_ELEMENT: Wr,
  DATA_ATTR: Fr,
  DOCTYPE_NAME: jn,
  ERB_EXPR: zr,
  IS_ALLOWED_URI: Zn,
  IS_SCRIPT_OR_DATA: Hr,
  MUSTACHE_EXPR: Pr,
  TMPLIT_EXPR: Br
});
const Pe = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, qr = function() {
  return typeof window > "u" ? null : window;
}, Yr = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let r = null;
  const n = "data-tt-policy-suffix";
  t && t.hasAttribute(n) && (r = t.getAttribute(n));
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
function Vn() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : qr();
  const e = (g) => Vn(g);
  if (e.version = "3.3.1", e.removed = [], !s || !s.document || s.document.nodeType !== Pe.document || !s.Element)
    return e.isSupported = !1, e;
  let {
    document: t
  } = s;
  const r = t, n = r.currentScript, {
    DocumentFragment: i,
    HTMLTemplateElement: l,
    Node: c,
    Element: o,
    NodeFilter: p,
    NamedNodeMap: h = s.NamedNodeMap || s.MozNamedAttrMap,
    HTMLFormElement: d,
    DOMParser: m,
    trustedTypes: w
  } = s, _ = o.prototype, q = $e(_, "cloneNode"), C = $e(_, "remove"), $ = $e(_, "nextSibling"), re = $e(_, "childNodes"), T = $e(_, "parentNode");
  if (typeof l == "function") {
    const g = t.createElement("template");
    g.content && g.content.ownerDocument && (t = g.content.ownerDocument);
  }
  let v, P = "";
  const {
    implementation: I,
    createNodeIterator: Xn,
    createDocumentFragment: Qn,
    getElementsByTagName: Kn
  } = t, {
    importNode: Jn
  } = r;
  let z = In();
  e.isSupported = typeof Yn == "function" && typeof T == "function" && I && I.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: it,
    ERB_EXPR: lt,
    TMPLIT_EXPR: ot,
    DATA_ATTR: es,
    ARIA_ATTR: ts,
    IS_SCRIPT_OR_DATA: ns,
    ATTR_WHITESPACE: qt,
    CUSTOM_ELEMENT: ss
  } = Cn;
  let {
    IS_ALLOWED_URI: Yt
  } = Cn, L = null;
  const Zt = k({}, [...Sn, ...yt, ...St, ...At, ...An]);
  let O = null;
  const jt = k({}, [...En, ...Et, ...Rn, ...Qe]);
  let A = Object.seal(Lt(null, {
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
  })), Re = null, ct = null;
  const be = Object.seal(Lt(null, {
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
  let Vt = !0, ut = !0, Xt = !1, Qt = !0, _e = !1, He = !0, he = !1, pt = !1, ht = !1, xe = !1, Ge = !1, We = !1, Kt = !0, Jt = !1;
  const rs = "user-content-";
  let ft = !0, Ce = !1, we = {}, ee = null;
  const gt = k({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let en = null;
  const tn = k({}, ["audio", "video", "img", "source", "image", "track"]);
  let dt = null;
  const nn = k({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), qe = "http://www.w3.org/1998/Math/MathML", Ye = "http://www.w3.org/2000/svg", ae = "http://www.w3.org/1999/xhtml";
  let Te = ae, mt = !1, kt = null;
  const as = k({}, [qe, Ye, ae], Tt);
  let Ze = k({}, ["mi", "mo", "mn", "ms", "mtext"]), je = k({}, ["annotation-xml"]);
  const is = k({}, ["title", "style", "font", "a", "script"]);
  let Ie = null;
  const ls = ["application/xhtml+xml", "text/html"], os = "text/html";
  let R = null, ve = null;
  const cs = t.createElement("form"), sn = function(a) {
    return a instanceof RegExp || a instanceof Function;
  }, bt = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(ve && ve === a)) {
      if ((!a || typeof a != "object") && (a = {}), a = se(a), Ie = // eslint-disable-next-line unicorn/prefer-includes
      ls.indexOf(a.PARSER_MEDIA_TYPE) === -1 ? os : a.PARSER_MEDIA_TYPE, R = Ie === "application/xhtml+xml" ? Tt : Ke, L = X(a, "ALLOWED_TAGS") ? k({}, a.ALLOWED_TAGS, R) : Zt, O = X(a, "ALLOWED_ATTR") ? k({}, a.ALLOWED_ATTR, R) : jt, kt = X(a, "ALLOWED_NAMESPACES") ? k({}, a.ALLOWED_NAMESPACES, Tt) : as, dt = X(a, "ADD_URI_SAFE_ATTR") ? k(se(nn), a.ADD_URI_SAFE_ATTR, R) : nn, en = X(a, "ADD_DATA_URI_TAGS") ? k(se(tn), a.ADD_DATA_URI_TAGS, R) : tn, ee = X(a, "FORBID_CONTENTS") ? k({}, a.FORBID_CONTENTS, R) : gt, Re = X(a, "FORBID_TAGS") ? k({}, a.FORBID_TAGS, R) : se({}), ct = X(a, "FORBID_ATTR") ? k({}, a.FORBID_ATTR, R) : se({}), we = X(a, "USE_PROFILES") ? a.USE_PROFILES : !1, Vt = a.ALLOW_ARIA_ATTR !== !1, ut = a.ALLOW_DATA_ATTR !== !1, Xt = a.ALLOW_UNKNOWN_PROTOCOLS || !1, Qt = a.ALLOW_SELF_CLOSE_IN_ATTR !== !1, _e = a.SAFE_FOR_TEMPLATES || !1, He = a.SAFE_FOR_XML !== !1, he = a.WHOLE_DOCUMENT || !1, xe = a.RETURN_DOM || !1, Ge = a.RETURN_DOM_FRAGMENT || !1, We = a.RETURN_TRUSTED_TYPE || !1, ht = a.FORCE_BODY || !1, Kt = a.SANITIZE_DOM !== !1, Jt = a.SANITIZE_NAMED_PROPS || !1, ft = a.KEEP_CONTENT !== !1, Ce = a.IN_PLACE || !1, Yt = a.ALLOWED_URI_REGEXP || Zn, Te = a.NAMESPACE || ae, Ze = a.MATHML_TEXT_INTEGRATION_POINTS || Ze, je = a.HTML_INTEGRATION_POINTS || je, A = a.CUSTOM_ELEMENT_HANDLING || {}, a.CUSTOM_ELEMENT_HANDLING && sn(a.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (A.tagNameCheck = a.CUSTOM_ELEMENT_HANDLING.tagNameCheck), a.CUSTOM_ELEMENT_HANDLING && sn(a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (A.attributeNameCheck = a.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), a.CUSTOM_ELEMENT_HANDLING && typeof a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (A.allowCustomizedBuiltInElements = a.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), _e && (ut = !1), Ge && (xe = !0), we && (L = k({}, An), O = [], we.html === !0 && (k(L, Sn), k(O, En)), we.svg === !0 && (k(L, yt), k(O, Et), k(O, Qe)), we.svgFilters === !0 && (k(L, St), k(O, Et), k(O, Qe)), we.mathMl === !0 && (k(L, At), k(O, Rn), k(O, Qe))), a.ADD_TAGS && (typeof a.ADD_TAGS == "function" ? be.tagCheck = a.ADD_TAGS : (L === Zt && (L = se(L)), k(L, a.ADD_TAGS, R))), a.ADD_ATTR && (typeof a.ADD_ATTR == "function" ? be.attributeCheck = a.ADD_ATTR : (O === jt && (O = se(O)), k(O, a.ADD_ATTR, R))), a.ADD_URI_SAFE_ATTR && k(dt, a.ADD_URI_SAFE_ATTR, R), a.FORBID_CONTENTS && (ee === gt && (ee = se(ee)), k(ee, a.FORBID_CONTENTS, R)), a.ADD_FORBID_CONTENTS && (ee === gt && (ee = se(ee)), k(ee, a.ADD_FORBID_CONTENTS, R)), ft && (L["#text"] = !0), he && k(L, ["html", "head", "body"]), L.table && (k(L, ["tbody"]), delete Re.tbody), a.TRUSTED_TYPES_POLICY) {
        if (typeof a.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Ne('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof a.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Ne('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        v = a.TRUSTED_TYPES_POLICY, P = v.createHTML("");
      } else
        v === void 0 && (v = Yr(w, n)), v !== null && typeof P == "string" && (P = v.createHTML(""));
      U && U(a), ve = a;
    }
  }, rn = k({}, [...yt, ...St, ...Nr]), an = k({}, [...At, ...$r]), us = function(a) {
    let u = T(a);
    (!u || !u.tagName) && (u = {
      namespaceURI: Te,
      tagName: "template"
    });
    const f = Ke(a.tagName), S = Ke(u.tagName);
    return kt[a.namespaceURI] ? a.namespaceURI === Ye ? u.namespaceURI === ae ? f === "svg" : u.namespaceURI === qe ? f === "svg" && (S === "annotation-xml" || Ze[S]) : !!rn[f] : a.namespaceURI === qe ? u.namespaceURI === ae ? f === "math" : u.namespaceURI === Ye ? f === "math" && je[S] : !!an[f] : a.namespaceURI === ae ? u.namespaceURI === Ye && !je[S] || u.namespaceURI === qe && !Ze[S] ? !1 : !an[f] && (is[f] || !rn[f]) : !!(Ie === "application/xhtml+xml" && kt[a.namespaceURI]) : !1;
  }, te = function(a) {
    De(e.removed, {
      element: a
    });
    try {
      T(a).removeChild(a);
    } catch {
      C(a);
    }
  }, fe = function(a, u) {
    try {
      De(e.removed, {
        attribute: u.getAttributeNode(a),
        from: u
      });
    } catch {
      De(e.removed, {
        attribute: null,
        from: u
      });
    }
    if (u.removeAttribute(a), a === "is")
      if (xe || Ge)
        try {
          te(u);
        } catch {
        }
      else
        try {
          u.setAttribute(a, "");
        } catch {
        }
  }, ln = function(a) {
    let u = null, f = null;
    if (ht)
      a = "<remove></remove>" + a;
    else {
      const E = vt(a, /^[\r\n\t ]+/);
      f = E && E[0];
    }
    Ie === "application/xhtml+xml" && Te === ae && (a = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + a + "</body></html>");
    const S = v ? v.createHTML(a) : a;
    if (Te === ae)
      try {
        u = new m().parseFromString(S, Ie);
      } catch {
      }
    if (!u || !u.documentElement) {
      u = I.createDocument(Te, "template", null);
      try {
        u.documentElement.innerHTML = mt ? P : S;
      } catch {
      }
    }
    const N = u.body || u.documentElement;
    return a && f && N.insertBefore(t.createTextNode(f), N.childNodes[0] || null), Te === ae ? Kn.call(u, he ? "html" : "body")[0] : he ? u.documentElement : N;
  }, on = function(a) {
    return Xn.call(
      a.ownerDocument || a,
      a,
      // eslint-disable-next-line no-bitwise
      p.SHOW_ELEMENT | p.SHOW_COMMENT | p.SHOW_TEXT | p.SHOW_PROCESSING_INSTRUCTION | p.SHOW_CDATA_SECTION,
      null
    );
  }, _t = function(a) {
    return a instanceof d && (typeof a.nodeName != "string" || typeof a.textContent != "string" || typeof a.removeChild != "function" || !(a.attributes instanceof h) || typeof a.removeAttribute != "function" || typeof a.setAttribute != "function" || typeof a.namespaceURI != "string" || typeof a.insertBefore != "function" || typeof a.hasChildNodes != "function");
  }, cn = function(a) {
    return typeof c == "function" && a instanceof c;
  };
  function ie(g, a, u) {
    Xe(g, (f) => {
      f.call(e, a, u, ve);
    });
  }
  const un = function(a) {
    let u = null;
    if (ie(z.beforeSanitizeElements, a, null), _t(a))
      return te(a), !0;
    const f = R(a.nodeName);
    if (ie(z.uponSanitizeElement, a, {
      tagName: f,
      allowedTags: L
    }), He && a.hasChildNodes() && !cn(a.firstElementChild) && B(/<[/\w!]/g, a.innerHTML) && B(/<[/\w!]/g, a.textContent) || a.nodeType === Pe.progressingInstruction || He && a.nodeType === Pe.comment && B(/<[/\w]/g, a.data))
      return te(a), !0;
    if (!(be.tagCheck instanceof Function && be.tagCheck(f)) && (!L[f] || Re[f])) {
      if (!Re[f] && hn(f) && (A.tagNameCheck instanceof RegExp && B(A.tagNameCheck, f) || A.tagNameCheck instanceof Function && A.tagNameCheck(f)))
        return !1;
      if (ft && !ee[f]) {
        const S = T(a) || a.parentNode, N = re(a) || a.childNodes;
        if (N && S) {
          const E = N.length;
          for (let G = E - 1; G >= 0; --G) {
            const le = q(N[G], !0);
            le.__removalCount = (a.__removalCount || 0) + 1, S.insertBefore(le, $(a));
          }
        }
      }
      return te(a), !0;
    }
    return a instanceof o && !us(a) || (f === "noscript" || f === "noembed" || f === "noframes") && B(/<\/no(script|embed|frames)/i, a.innerHTML) ? (te(a), !0) : (_e && a.nodeType === Pe.text && (u = a.textContent, Xe([it, lt, ot], (S) => {
      u = Me(u, S, " ");
    }), a.textContent !== u && (De(e.removed, {
      element: a.cloneNode()
    }), a.textContent = u)), ie(z.afterSanitizeElements, a, null), !1);
  }, pn = function(a, u, f) {
    if (Kt && (u === "id" || u === "name") && (f in t || f in cs))
      return !1;
    if (!(ut && !ct[u] && B(es, u))) {
      if (!(Vt && B(ts, u))) {
        if (!(be.attributeCheck instanceof Function && be.attributeCheck(u, a))) {
          if (!O[u] || ct[u]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(hn(a) && (A.tagNameCheck instanceof RegExp && B(A.tagNameCheck, a) || A.tagNameCheck instanceof Function && A.tagNameCheck(a)) && (A.attributeNameCheck instanceof RegExp && B(A.attributeNameCheck, u) || A.attributeNameCheck instanceof Function && A.attributeNameCheck(u, a)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              u === "is" && A.allowCustomizedBuiltInElements && (A.tagNameCheck instanceof RegExp && B(A.tagNameCheck, f) || A.tagNameCheck instanceof Function && A.tagNameCheck(f)))
            ) return !1;
          } else if (!dt[u]) {
            if (!B(Yt, Me(f, qt, ""))) {
              if (!((u === "src" || u === "xlink:href" || u === "href") && a !== "script" && Lr(f, "data:") === 0 && en[a])) {
                if (!(Xt && !B(ns, Me(f, qt, "")))) {
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
  }, hn = function(a) {
    return a !== "annotation-xml" && vt(a, ss);
  }, fn = function(a) {
    ie(z.beforeSanitizeAttributes, a, null);
    const {
      attributes: u
    } = a;
    if (!u || _t(a))
      return;
    const f = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: O,
      forceKeepAttr: void 0
    };
    let S = u.length;
    for (; S--; ) {
      const N = u[S], {
        name: E,
        namespaceURI: G,
        value: le
      } = N, ye = R(E), xt = le;
      let D = E === "value" ? xt : Or(xt);
      if (f.attrName = ye, f.attrValue = D, f.keepAttr = !0, f.forceKeepAttr = void 0, ie(z.uponSanitizeAttribute, a, f), D = f.attrValue, Jt && (ye === "id" || ye === "name") && (fe(E, a), D = rs + D), He && B(/((--!?|])>)|<\/(style|title|textarea)/i, D)) {
        fe(E, a);
        continue;
      }
      if (ye === "attributename" && vt(D, "href")) {
        fe(E, a);
        continue;
      }
      if (f.forceKeepAttr)
        continue;
      if (!f.keepAttr) {
        fe(E, a);
        continue;
      }
      if (!Qt && B(/\/>/i, D)) {
        fe(E, a);
        continue;
      }
      _e && Xe([it, lt, ot], (dn) => {
        D = Me(D, dn, " ");
      });
      const gn = R(a.nodeName);
      if (!pn(gn, ye, D)) {
        fe(E, a);
        continue;
      }
      if (v && typeof w == "object" && typeof w.getAttributeType == "function" && !G)
        switch (w.getAttributeType(gn, ye)) {
          case "TrustedHTML": {
            D = v.createHTML(D);
            break;
          }
          case "TrustedScriptURL": {
            D = v.createScriptURL(D);
            break;
          }
        }
      if (D !== xt)
        try {
          G ? a.setAttributeNS(G, E, D) : a.setAttribute(E, D), _t(a) ? te(a) : yn(e.removed);
        } catch {
          fe(E, a);
        }
    }
    ie(z.afterSanitizeAttributes, a, null);
  }, ps = function g(a) {
    let u = null;
    const f = on(a);
    for (ie(z.beforeSanitizeShadowDOM, a, null); u = f.nextNode(); )
      ie(z.uponSanitizeShadowNode, u, null), un(u), fn(u), u.content instanceof i && g(u.content);
    ie(z.afterSanitizeShadowDOM, a, null);
  };
  return e.sanitize = function(g) {
    let a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, f = null, S = null, N = null;
    if (mt = !g, mt && (g = "<!-->"), typeof g != "string" && !cn(g))
      if (typeof g.toString == "function") {
        if (g = g.toString(), typeof g != "string")
          throw Ne("dirty is not a string, aborting");
      } else
        throw Ne("toString is not a function");
    if (!e.isSupported)
      return g;
    if (pt || bt(a), e.removed = [], typeof g == "string" && (Ce = !1), Ce) {
      if (g.nodeName) {
        const le = R(g.nodeName);
        if (!L[le] || Re[le])
          throw Ne("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (g instanceof c)
      u = ln("<!---->"), f = u.ownerDocument.importNode(g, !0), f.nodeType === Pe.element && f.nodeName === "BODY" || f.nodeName === "HTML" ? u = f : u.appendChild(f);
    else {
      if (!xe && !_e && !he && // eslint-disable-next-line unicorn/prefer-includes
      g.indexOf("<") === -1)
        return v && We ? v.createHTML(g) : g;
      if (u = ln(g), !u)
        return xe ? null : We ? P : "";
    }
    u && ht && te(u.firstChild);
    const E = on(Ce ? g : u);
    for (; S = E.nextNode(); )
      un(S), fn(S), S.content instanceof i && ps(S.content);
    if (Ce)
      return g;
    if (xe) {
      if (Ge)
        for (N = Qn.call(u.ownerDocument); u.firstChild; )
          N.appendChild(u.firstChild);
      else
        N = u;
      return (O.shadowroot || O.shadowrootmode) && (N = Jn.call(r, N, !0)), N;
    }
    let G = he ? u.outerHTML : u.innerHTML;
    return he && L["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && B(jn, u.ownerDocument.doctype.name) && (G = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + G), _e && Xe([it, lt, ot], (le) => {
      G = Me(G, le, " ");
    }), v && We ? v.createHTML(G) : G;
  }, e.setConfig = function() {
    let g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    bt(g), pt = !0;
  }, e.clearConfig = function() {
    ve = null, pt = !1;
  }, e.isValidAttribute = function(g, a, u) {
    ve || bt({});
    const f = R(g), S = R(a);
    return pn(f, S, u);
  }, e.addHook = function(g, a) {
    typeof a == "function" && De(z[g], a);
  }, e.removeHook = function(g, a) {
    if (a !== void 0) {
      const u = Cr(z[g], a);
      return u === -1 ? void 0 : Ir(z[g], u, 1)[0];
    }
    return yn(z[g]);
  }, e.removeHooks = function(g) {
    z[g] = [];
  }, e.removeAllHooks = function() {
    z = In();
  }, e;
}
var Zr = Vn();
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
  return y(), M("svg", Vr, [...e[0] || (e[0] = [
    j("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" }, null, -1)
  ])]);
}
const Qr = /* @__PURE__ */ Z(jr, [["render", Xr]]), Kr = {}, Jr = {
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
    j("path", { d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" }, null, -1)
  ])]);
}
const ta = /* @__PURE__ */ Z(Kr, [["render", ea]]), na = ["aria-label"], sa = { class: "nc-message-bubble__header" }, ra = {
  key: 0,
  class: "nc-message-bubble__label"
}, aa = { class: "nc-message-bubble__bubble" }, ia = {
  key: 0,
  class: "nc-message-bubble__content"
}, la = ["innerHTML"], oa = ["aria-label"], ca = /* @__PURE__ */ pe({
  __name: "MessageBubble",
  props: {
    message: {}
  },
  setup(s) {
    const e = s, t = W(() => e.message.role === "user"), r = W(
      () => e.message.status === "failed" || e.message.id.startsWith("error-")
    ), n = W(() => e.message.status === "sending"), i = W(() => e.message.role === "assistant" && !r.value), l = W(() => {
      if (e.message.role !== "assistant" || r.value) return null;
      const d = x.parse(e.message.content);
      return Zr.sanitize(d);
    }), c = W(() => r.value ? "Error message" : t.value ? "Message from you" : "Message from AI Assistant"), o = Q(!1);
    let p = null;
    async function h() {
      try {
        await navigator.clipboard.writeText(e.message.content), o.value = !0, p && clearTimeout(p), p = setTimeout(() => {
          o.value = !1;
        }, 1500);
      } catch {
      }
    }
    return On(() => {
      p && clearTimeout(p);
    }), (d, m) => (y(), M("li", {
      role: "listitem",
      "aria-label": c.value,
      class: Mt(["nc-message-bubble", {
        "nc-message-bubble--user": t.value,
        "nc-message-bubble--assistant": i.value,
        "nc-message-bubble--error": r.value,
        "nc-message-bubble--sending": n.value
      }])
    }, [
      j("div", sa, [
        t.value ? (y(), M("span", ra, "You")) : (y(), M(Dn, { key: 1 }, [
          Y(Nt, { class: "nc-message-bubble__star" }),
          m[0] || (m[0] = j("span", { class: "nc-message-bubble__label" }, "AI Assistant", -1))
        ], 64))
      ]),
      j("div", aa, [
        t.value || r.value ? (y(), M("div", ia, Ln(s.message.content), 1)) : (y(), M("div", {
          key: 1,
          class: "nc-message-bubble__content",
          innerHTML: l.value
        }, null, 8, la))
      ]),
      i.value ? (y(), M("button", {
        key: 0,
        class: "nc-message-bubble__copy",
        "aria-label": o.value ? "Message copied" : "Copy message",
        onClick: h
      }, [
        o.value ? (y(), ce(ta, { key: 0 })) : (y(), ce(Qr, { key: 1 }))
      ], 8, oa)) : hs("", !0)
    ], 10, na));
  }
}), ua = /* @__PURE__ */ Z(ca, [["__scopeId", "data-v-865393c4"]]), pa = 50, ha = /* @__PURE__ */ pe({
  __name: "MessageList",
  setup(s) {
    const e = ue(Ee), t = nt("listRef"), r = Q(!0);
    function n() {
      const c = t.value;
      if (!c) return;
      const { scrollTop: o, scrollHeight: p, clientHeight: h } = c;
      r.value = p - o - h <= pa;
    }
    function i() {
      const c = t.value;
      c && (c.scrollTop = c.scrollHeight);
    }
    function l() {
      n();
    }
    return Ae(
      () => e.messages.value,
      () => {
        r.value && Be(i);
      }
    ), fs(() => {
      e.messages.value.length > 0 && Be(i), t.value?.addEventListener("scroll", l, { passive: !0 });
    }), On(() => {
      t.value?.removeEventListener("scroll", l);
    }), (c, o) => (y(), M("ul", {
      ref_key: "listRef",
      ref: t,
      role: "list",
      "aria-live": "polite",
      class: "nc-message-list"
    }, [
      (y(!0), M(Dn, null, gs(de(e).messages.value, (p) => (y(), ce(ua, {
        key: p.id,
        message: p
      }, null, 8, ["message"]))), 128))
    ], 512));
  }
}), fa = /* @__PURE__ */ Z(ha, [["__scopeId", "data-v-95366653"]]), ga = {}, da = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "1em",
  height: "1em",
  fill: "currentColor",
  "aria-hidden": "true",
  focusable: "false"
};
function ma(s, e) {
  return y(), M("svg", da, [...e[0] || (e[0] = [
    j("path", { d: "M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91Z" }, null, -1)
  ])]);
}
const ka = /* @__PURE__ */ Z(ga, [["render", ma]]), ba = { class: "nc-chat-input" }, _a = /* @__PURE__ */ pe({
  __name: "ChatInput",
  setup(s) {
    const e = ue(Ee), t = Q(""), r = nt("textareaRef"), n = W(() => t.value.trim().length > 0 && !e.isSending.value);
    async function i() {
      const c = t.value.trim();
      if (!(!c || e.isSending.value)) {
        t.value = "";
        try {
          await e.sendMessage(c);
        } catch {
        }
      }
    }
    function l(c) {
      c.key === "Enter" && !c.shiftKey && (c.preventDefault(), i());
    }
    return Ae(
      () => e.failedMessageText.value,
      (c) => {
        c && (t.value = c);
      }
    ), Ae(
      () => e.isOpen.value,
      (c) => {
        c && Be(() => {
          r.value?.focus();
        });
      }
    ), Ae(
      () => e.isSending.value,
      (c, o) => {
        o && !c && Be(() => {
          r.value?.focus();
        });
      }
    ), (c, o) => {
      const p = oe("v-textarea"), h = oe("v-btn");
      return y(), M("div", ba, [
        Y(p, {
          ref_key: "textareaRef",
          ref: r,
          modelValue: t.value,
          "onUpdate:modelValue": o[0] || (o[0] = (d) => t.value = d),
          "auto-grow": "",
          rows: 1,
          "max-rows": 6,
          "no-resize": "",
          "hide-details": "",
          variant: "outlined",
          density: "compact",
          placeholder: "Type a message",
          "aria-label": "Type a message",
          disabled: de(e).isSending.value,
          class: "nc-chat-input__textarea",
          onKeydown: l
        }, null, 8, ["modelValue", "disabled"]),
        Y(h, {
          icon: "",
          variant: "flat",
          color: "secondary",
          size: "small",
          disabled: !n.value,
          "aria-label": "Send message",
          class: "nc-chat-input__send-btn",
          onClick: i
        }, {
          default: Fe(() => [
            Y(ka)
          ]),
          _: 1
        }, 8, ["disabled"])
      ]);
    };
  }
}), xa = /* @__PURE__ */ Z(_a, [["__scopeId", "data-v-ca6398c4"]]), wa = { class: "nc-chat-panel__body" }, Ta = /* @__PURE__ */ pe({
  __name: "ChatPanel",
  setup(s) {
    const e = ue(Ee), t = W({
      get: () => e.isOpen.value,
      set: () => {
      }
    }), r = ue(st), n = W(() => r?.welcomeMessage), i = ks(), l = W(() => i.width.value < 768), c = W(() => l.value ? "100%" : 400), o = (p) => {
      p.key === "Escape" && e.isOpen.value && e.close();
    };
    return Ae(
      () => e.isOpen.value,
      (p) => {
        p ? window.addEventListener("keydown", o) : window.removeEventListener("keydown", o);
      },
      { immediate: !0 }
    ), ds(() => {
      window.removeEventListener("keydown", o);
    }), (p, h) => {
      const d = oe("v-progress-circular"), m = oe("v-navigation-drawer");
      return y(), ce(m, {
        modelValue: t.value,
        "onUpdate:modelValue": h[0] || (h[0] = (w) => t.value = w),
        location: "right",
        temporary: "",
        scrim: !1,
        width: c.value,
        role: "complementary",
        "aria-label": "Chat with AI Assistant",
        class: Mt(["nc-chat-panel", { "nc-chat-panel--mobile": l.value }])
      }, {
        default: Fe(() => [
          Y(Os),
          j("div", wa, [
            de(e).isLoading.value && de(e).messages.value.length === 0 ? (y(), ce(d, {
              key: 0,
              indeterminate: "",
              size: "24",
              class: "nc-chat-panel__loader"
            })) : de(e).messages.value.length === 0 && !de(e).isSending.value ? (y(), ce($s, {
              key: 1,
              message: n.value
            }, null, 8, ["message"])) : (y(), ce(fa, { key: 2 }))
          ]),
          Y(xa)
        ]),
        _: 1
      }, 8, ["modelValue", "width", "class"]);
    };
  }
}), va = /* @__PURE__ */ Z(Ta, [["__scopeId", "data-v-c922c155"]]), ya = /* @__PURE__ */ pe({
  __name: "NativeChatWidget",
  setup(s) {
    const e = bs();
    if (!e.themes.value.nativeChat) {
      const i = e.themes.value.light;
      e.themes.value.nativeChat = {
        ...i,
        ...wt,
        colors: {
          ...i.colors,
          ...wt.colors
        },
        variables: {
          ...i.variables,
          ...wt.variables
        }
      };
    }
    const t = ue(st), r = _s(t.apiClient, t);
    ms(Ee, r);
    const n = nt("floatingButtonRef");
    return Ae(
      () => r.isOpen.value,
      (i) => {
        i || Be(() => {
          n.value?.focus();
        });
      }
    ), (i, l) => {
      const c = oe("v-theme-provider");
      return y(), ce(c, { theme: "nativeChat" }, {
        default: Fe(() => [
          Y(ys, {
            ref_key: "floatingButtonRef",
            ref: n
          }, null, 512),
          Y(va)
        ]),
        _: 1
      });
    };
  }
}), Sa = /* @__PURE__ */ Z(ya, [["__scopeId", "data-v-492f08ed"]]), Ra = {
  install(s, e) {
    if (!e?.apiClient) {
      console.warn(
        "[NativeChatPlugin] Missing required option: apiClient. Plugin registration skipped."
      );
      return;
    }
    s.provide(st, e), s.component("NativeChatWidget", Sa);
  }
};
function Ca(s) {
  const { baseUrl: e, getAccessToken: t } = s;
  async function r(n, i = {}) {
    const c = {
      Authorization: `Bearer ${await t()}`
    };
    i.body && (c["Content-Type"] = "application/json");
    const o = await fetch(n, { ...i, headers: c });
    if (!o.ok) {
      const p = new Error(`HTTP ${o.status}: ${o.statusText}`);
      throw p.statusCode = o.status, p;
    }
    return o.json();
  }
  return {
    createConversation() {
      return r(`${e}/conversations`, { method: "POST" });
    },
    getConversations(n, i) {
      return r(`${e}/conversations?offset=${n}&limit=${i}`);
    },
    getMessages(n, i, l) {
      return r(
        `${e}/conversations/${encodeURIComponent(n)}/messages?offset=${i}&limit=${l}`
      );
    },
    sendMessage(n, i) {
      return r(`${e}/conversations/${encodeURIComponent(n)}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: i })
      });
    }
  };
}
export {
  Ra as NativeChatPlugin,
  Sa as NativeChatWidget,
  Ca as createNativeChatApiClient,
  Ra as default
};
