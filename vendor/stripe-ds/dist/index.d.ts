import { CSSProperties } from 'react';
import { ElementType } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { JSX as JSX_2 } from 'react';
import { ReactNode } from 'react';
import { RefAttributes } from 'react';

/**
 * Button — the outlined / filled mono action control of stripe.dev
 * ("More posts", "Read more"). Frame (interactive) + Mono caps label.
 */
export declare function Button({ children, variant, href, as, className, ...rest }: ButtonProps): JSX_2.Element;

export declare interface ButtonProps {
    children: ReactNode;
    /** "default" = dotted outline; "primary" = solid ink fill. */
    variant?: "default" | "primary";
    /** Render as a link. */
    href?: string;
    /** Polymorphic tag — defaults to "a" when href is set, else "button". */
    as?: ElementType;
    onClick?: () => void;
    className?: string;
    [key: string]: unknown;
}

/**
 * Card — a dotted-bordered content tile from the stripe.dev feed grid: an
 * optional media slot, a mono title, body copy, and an optional footer.
 * Composes Frame + Mono.
 */
export declare function Card({ title, children, media, footer, href, className }: CardProps): JSX_2.Element;

export declare interface CardProps {
    /** Card heading. */
    title: ReactNode;
    /** Body copy. */
    children?: ReactNode;
    /** Optional media slot (thumbnail / generative art) shown on top. */
    media?: ReactNode;
    /** Optional footer slot (Button, Tag, meta…). */
    footer?: ReactNode;
    /** Makes the whole card a link. */
    href?: string;
    className?: string;
}

/**
 * DisplayHeading — the big light-weight headings of stripe.dev ("Welcome to
 * Stripe Dot Dev", "Feed", "Get help"), with an optional superscript Marker.
 */
export declare function DisplayHeading({ children, level, marker, mono, as, className, }: DisplayHeadingProps): JSX_2.Element;

export declare interface DisplayHeadingProps {
    children: ReactNode;
    /** "hero" = oversized clamp; "display" = section heading. */
    level?: "hero" | "display";
    /** Optional superscript marker (rendered via Marker). */
    marker?: ReactNode;
    /** Use the mono face instead of the default light sans. */
    mono?: boolean;
    /** Heading tag. */
    as?: ElementType;
    className?: string;
}

/**
 * FeedRow — one line of the stripe.dev "Feed" list: an optional index, a mono
 * title, and trailing meta (date), separated by a dotted baseline rule.
 */
export declare function FeedRow({ title, index, meta, href, className }: FeedRowProps): JSX_2.Element;

export declare interface FeedRowProps {
    /** Row title / primary text. */
    title: ReactNode;
    /** Optional leading index or marker (e.g. "01"). */
    index?: ReactNode;
    /** Trailing meta — a date, tag, or count. */
    meta?: ReactNode;
    /** Makes the row a link. */
    href?: string;
    className?: string;
}

/**
 * Frame — the container primitive of stripe.dev's vocabulary: a hairline
 * (usually dotted) bordered box on an 8px grid. Cards, buttons, tags and
 * panels are all Frames with different border/radius/content.
 */
export declare const Frame: ForwardRefExoticComponent<Omit<FrameProps, "ref"> & RefAttributes<HTMLElement>>;

export declare interface FrameProps {
    children?: ReactNode;
    /** Border treatment. "dotted" is the stripe.dev signature. */
    variant?: "dotted" | "solid" | "none";
    /** Corner radius. */
    radius?: "sm" | "pill" | "none";
    /** Inner padding in grid modules (8px each). */
    pad?: number;
    /** Subtle inset fill (the faint grey panel look). */
    filled?: boolean;
    /** Hover/active affordances (cursor + invert). */
    interactive?: boolean;
    /** Persistent selected/active (inverted) state. */
    active?: boolean;
    /** Polymorphic tag — "div" (default), "a", "button", "li"… */
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
}

/**
 * HairlineRule — the dotted 1px divider that segments the whole stripe.dev
 * layout. Horizontal by default; `vertical` for column gutters.
 */
export declare function HairlineRule({ vertical, solid, className, style, }: HairlineRuleProps): JSX_2.Element;

export declare interface HairlineRuleProps {
    /** Orientation. */
    vertical?: boolean;
    /** Solid instead of the default dotted. */
    solid?: boolean;
    className?: string;
    style?: CSSProperties;
}

/**
 * Marker — the small raised mono glyph stripe.dev sets beside headings and
 * labels (e.g. the superscript count after "Feed"). Composes Mono at micro.
 */
export declare function Marker({ children, className }: MarkerProps): JSX_2.Element;

export declare interface MarkerProps {
    /** Superscript content — a footnote number, count, or short label. */
    children: ReactNode;
    className?: string;
}

/**
 * Mono — the text primitive. Söhne-Mono-style monospace with tight negative
 * tracking. Every textual element on stripe.dev is one of these at a handful
 * of sizes; composites (Tag, Button, FeedRow) render their text through it.
 */
export declare const Mono: ForwardRefExoticComponent<Omit<MonoProps, "ref"> & RefAttributes<HTMLElement>>;

export declare interface MonoProps {
    children?: ReactNode;
    /** Type scale step. */
    size?: "micro" | "mono" | "body" | "title";
    /** Foreground tone. "inherit" keeps the parent's color (e.g. inside an inverted Frame). */
    tone?: "ink" | "muted" | "inherit";
    /** Weight. */
    weight?: "light" | "medium";
    /** Uppercase + wider tracking (the label look). */
    caps?: boolean;
    /** Polymorphic tag — "span" (default), "p", "a", "label"… */
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
}

/**
 * Tag — a small pill label. Frame (pill radius) + Mono micro. The little
 * category / status chips scattered across stripe.dev.
 */
export declare function Tag({ children, solid, className }: TagProps): JSX_2.Element;

export declare interface TagProps {
    children: ReactNode;
    /** Filled (inverted ink) instead of outlined. */
    solid?: boolean;
    className?: string;
}

export { }
