import { Card, CardContent } from "@/components/ui/card";
import { BASE_PATH } from "@/lib/base-path";

/** Public URL (with `basePath`); do not import the mp4 as a module. */
const VIDEO_SRC = `${BASE_PATH}/assets/intro.mp4`;

export function IntroVideoSection() {
  return (
    <section className="space-y-4" aria-labelledby="intro-video-heading">
      <div className="space-y-2">
        <h2 id="intro-video-heading" className="text-3xl font-extrabold text-ufuq-text">
          فيديو تعريفي
        </h2>
        <p className="text-ufuq-muted">تعرّف على المنصة في دقائق قصيرة قبل أن تبدأ التعلم.</p>
      </div>

      <Card className="overflow-hidden rounded-card border border-border/60 bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-hidden rounded-lg bg-zinc-950 ring-1 ring-black/30">
            <div className="mx-auto flex aspect-video w-full max-h-[240px] max-w-full items-center justify-center md:max-h-[420px]">
              <video
                className="block h-full w-full object-contain"
                controls
                preload="metadata"
                playsInline
                src={VIDEO_SRC}
              >
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
