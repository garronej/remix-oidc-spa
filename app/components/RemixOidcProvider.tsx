import { Suspense, lazy } from "react";
import { useLoaderData } from "react-router";

const OidcProvider = lazy(() =>
  import("../oidc.client").then((mod) => ({ default: mod.OidcProvider }))
);

export async function clientLoader() {
  const { handleOidcCallback } = await import("oidc-spa/handleOidcCallback");

  const { isHandled } = handleOidcCallback();

  if (isHandled) {
    await new Promise<never>(() => {});
  }
}

function Fallback() {
  return <p>Loading OIDC...</p>;
}

export function HydrateFallback() {
  return <Fallback />;
}

export default function RemixOidcProvider(props: {
  children: React.ReactNode;
}) {
  const { children } = props;

  useLoaderData();

  return (
    <Suspense fallback={<Fallback />}>
      <OidcProvider fallback={<Fallback />}>{children}</OidcProvider>
    </Suspense>
  );
}
