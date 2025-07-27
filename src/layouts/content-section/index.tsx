type TProps = {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export default function ContentSection({ children, className, id }: TProps) {
  return (
    <section
      id={id}
      style={{
        background: "url('/images/bg-destination.webp')",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        width: "100%",
        padding: "100px 0",
      }}
      className={className}>
      {children}
    </section>
  )
}
