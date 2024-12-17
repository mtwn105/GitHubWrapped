const metadata = {
  title: "About",
  description: "About GitHub Wrapped",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
