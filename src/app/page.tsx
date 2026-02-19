import { MemoList } from "@/components/MemoList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">스티커 메모</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            메모를 추가하고 수정·삭제할 수 있습니다. 브라우저에 저장됩니다.
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <MemoList />
      </main>
    </div>
  );
}
