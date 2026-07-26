import { PortableTextReactResolvers } from "@kontent-ai/rich-text-resolver/utils/react";

/*
 * Rich-text styling for body copy. Colors use semantic tokens (text-primary / text-accent) and
 * headings use font-serif (the site's display font), so the output adheres to whichever site
 * theme is active. Body text stays a readable neutral; the site's body font is inherited from
 * <body> (see src/index.css).
 */
export const defaultPortableRichTextResolvers: PortableTextReactResolvers = {
  marks: {
    link: ({ children, value }) => {
      const href = (value as { href?: string } | undefined)?.href;
      const external = !!href && /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-accent underline underline-offset-2 hover:opacity-80"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="text-lg text-gray-700 list-disc ml-6 flex flex-col gap-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="text-lg text-gray-700 list-decimal ml-6 flex flex-col gap-2">{children}</ol>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="font-serif text-primary text-4xl md:text-5xl font-bold">{children}</h1>,
    h2: ({ children }) => <h2 className="font-serif text-primary text-3xl md:text-4xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="font-serif text-primary text-2xl font-semibold">{children}</h3>,
    normal: ({ children }) => <p className="text-lg leading-relaxed text-gray-700">{children}</p>,
  },
};
