export default function GitHubWrapped({
  params,
}: {
  params: { username: string };
}) {
  return (
    <div className="m-8">
      <h1 className="text-white text-4xl font-bold">
        {params.username} GitHub Wrapped
      </h1>
    </div>
  );
}
