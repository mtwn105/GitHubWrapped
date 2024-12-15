export default function Footer() {
  return (
    <div className="p-8 text-center bg-black">
      <p className="text-sm md:text-base text-white/80">
        Created by{" "}
        <a href="https://x.com/mtwn105" className="text-white hover:underline">
          Amit Wani
        </a>{" "}
        (
        <a href="https://x.com/mtwn105" className="text-white hover:underline">
          X
        </a>
        {" / "}
        <a
          href="https://github.com/mtwn105"
          className="text-white hover:underline"
        >
          GitHub
        </a>
        )
      </p>
    </div>
  );
}
