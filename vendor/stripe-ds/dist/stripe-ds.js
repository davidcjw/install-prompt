import { jsx as o, jsxs as c } from "react/jsx-runtime";
import { forwardRef as _ } from "react";
const p = _(function({
  children: e,
  variant: s = "dotted",
  radius: a = "sm",
  pad: n,
  filled: t = !1,
  interactive: l = !1,
  active: r = !1,
  as: m,
  className: u = "",
  style: f,
  ...h
}, N) {
  const g = m ?? "div", j = [
    "sd-frame",
    `sd-frame--${s}`,
    `sd-frame--radius-${a}`,
    t && "sd-frame--filled",
    l && "sd-frame--interactive",
    r && "sd-frame--active",
    u
  ].filter(Boolean).join(" "), v = { ...f ?? {} };
  return n != null && (v["--sd-frame-pad"] = `calc(${n} * var(--sd-module))`), /* @__PURE__ */ o(g, { ref: N, className: j, style: v, ...h, children: e });
}), d = _(function({
  children: e,
  size: s = "mono",
  tone: a = "ink",
  weight: n = "light",
  caps: t = !1,
  as: l,
  className: r = "",
  style: m,
  ...u
}, f) {
  const h = l ?? "span", N = [
    "sd-mono",
    `sd-mono--${s}`,
    `sd-mono--${a}`,
    `sd-mono--${n}`,
    t && "sd-mono--caps",
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o(h, { ref: f, className: N, style: m, ...u, children: e });
});
function z({
  vertical: i = !1,
  solid: e = !1,
  className: s = "",
  style: a
}) {
  const n = [
    "sd-rule",
    i ? "sd-rule--v" : "sd-rule--h",
    e && "sd-rule--solid",
    s
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ o("span", { role: "separator", className: n, style: a });
}
function B({ children: i, className: e = "" }) {
  return /* @__PURE__ */ o(
    d,
    {
      as: "sup",
      size: "micro",
      tone: "muted",
      className: ["sd-marker", e].filter(Boolean).join(" "),
      children: i
    }
  );
}
function T({
  children: i,
  level: e = "display",
  marker: s,
  mono: a = !1,
  as: n,
  className: t = ""
}) {
  const l = n ?? (e === "hero" ? "h1" : "h2"), r = [
    "sd-heading",
    `sd-heading--${e}`,
    a && "sd-heading--mono",
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ c(l, { className: r, children: [
    i,
    s != null && /* @__PURE__ */ o(B, { children: s })
  ] });
}
function $({ children: i, solid: e = !1, className: s = "" }) {
  return /* @__PURE__ */ o(
    p,
    {
      variant: e ? "none" : "dotted",
      radius: "pill",
      active: e,
      className: ["sd-tag", s].filter(Boolean).join(" "),
      children: /* @__PURE__ */ o(d, { size: "micro", caps: !0, tone: e ? "inherit" : "muted", children: i })
    }
  );
}
function b({
  children: i,
  variant: e = "default",
  href: s,
  as: a,
  className: n = "",
  ...t
}) {
  const l = a ?? (s ? "a" : "button"), r = e === "primary";
  return /* @__PURE__ */ o(
    p,
    {
      as: l,
      href: s,
      variant: r ? "none" : "dotted",
      radius: "sm",
      interactive: !0,
      active: r,
      className: ["sd-button", n].filter(Boolean).join(" "),
      ...t,
      children: /* @__PURE__ */ o(d, { size: "mono", caps: !0, tone: r ? "inherit" : "ink", children: i })
    }
  );
}
function k({ title: i, children: e, media: s, footer: a, href: n, className: t = "" }) {
  return /* @__PURE__ */ c(
    p,
    {
      as: n ? "a" : "div",
      href: n,
      variant: "dotted",
      radius: "sm",
      interactive: n != null,
      className: ["sd-card", t].filter(Boolean).join(" "),
      children: [
        s != null && /* @__PURE__ */ o("div", { className: "sd-card__media", children: s }),
        /* @__PURE__ */ c("div", { className: "sd-card__body", children: [
          /* @__PURE__ */ o(d, { as: "h3", size: "body", weight: "medium", className: "sd-card__title", children: i }),
          e != null && /* @__PURE__ */ o(d, { as: "p", size: "mono", tone: "muted", className: "sd-card__text", children: e })
        ] }),
        a != null && /* @__PURE__ */ o("div", { className: "sd-card__footer", children: a })
      ]
    }
  );
}
function x({ title: i, index: e, meta: s, href: a, className: n = "" }) {
  return /* @__PURE__ */ c(
    a ? "a" : "div",
    {
      ...a ? { href: a } : {},
      className: ["sd-feedrow", a && "sd-feedrow--link", n].filter(Boolean).join(" "),
      children: [
        e != null && /* @__PURE__ */ o(d, { size: "micro", tone: "muted", className: "sd-feedrow__index", children: e }),
        /* @__PURE__ */ o(d, { size: "mono", className: "sd-feedrow__title", children: i }),
        s != null && /* @__PURE__ */ o(d, { size: "micro", tone: "muted", className: "sd-feedrow__meta", children: s })
      ]
    }
  );
}
export {
  b as Button,
  k as Card,
  T as DisplayHeading,
  x as FeedRow,
  p as Frame,
  z as HairlineRule,
  B as Marker,
  d as Mono,
  $ as Tag
};
