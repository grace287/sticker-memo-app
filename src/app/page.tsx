import { MemoList } from "@/components/MemoList";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-muted/20 min-w-0">
      <header className="sticky top-0 z-10 border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-sm safe-area-inset-top">
        <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                스티커 메모
              </h1>
              <ThemeToggle />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md">
              포스트잇처럼 메모를 추가·고정·검색하고, 드래그로 순서를 바꿀 수 있습니다. 브라우저에 자동 저장됩니다.
            </p>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-3 sm:px-6 py-5 sm:py-8 max-w-5xl min-w-0">
        <MemoList />
      </main>
    </div>
  );
}
