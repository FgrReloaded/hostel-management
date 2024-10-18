
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex items-center justify-center h-full">
        {children}
      </div>
    </div>
  );
}
