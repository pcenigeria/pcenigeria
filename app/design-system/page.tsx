export const metadata = {
    robots: { index: false, follow: false },
};

export default function Page() {
    return (
        <div className="p-8 text-center">
            <h1 className="text-xl font-bold">Design System (Disabled)</h1>
            <p className="text-muted-foreground mt-2">
                The component showcase that used to live here was removed as unused code during a codebase cleanup.
            </p>
        </div>
    );
}
