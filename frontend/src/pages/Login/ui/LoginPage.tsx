import { FormularioLogin } from "@features/login";

export function LoginPage() {
  return (
    <div className="relative grid min-h-screen overflow-hidden bg-white lg:grid-cols-2">
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[#204af4] [clip-path:polygon(97.5%_0,100%_0,100%_100%,56%_100%)] lg:block"
      />

      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-10">
        <img
          src="/logo.png"
          alt="Newe Logística Integrada"
          className="mb-10 h-auto w-40 lg:hidden"
        />
        <FormularioLogin />
      </main>

      <aside className="relative z-10 hidden flex-col items-center justify-center px-8 lg:flex">
        <img
          src="/logo.png"
          alt="Newe Logística Integrada"
          className="mb-4 h-auto w-44"
        />
        <img
          src="/login-ilustracao.png"
          alt=""
          className="h-auto w-full max-w-[480px]"
        />
      </aside>
    </div>
  );
}
