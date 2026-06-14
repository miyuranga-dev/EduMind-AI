import { Link } from "react-router-dom";
import {
Brain,
Sparkles,
BookOpen,
Video,
CheckCircle2,
ArrowRight,
ShieldCheck,
Zap,
} from "lucide-react";

const Home = () => {
return ( <div className="relative min-h-screen overflow-hidden bg-[#070B14] text-white">


  {/* Background Effects */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_40%)]" />
  <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-brand-indigo/10 blur-[140px] rounded-full" />
  <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-pink/10 blur-[140px] rounded-full" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

    {/* HERO */}
    <section className="pt-24 pb-20">

      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
          <Sparkles className="w-4 h-4 text-brand-pink" />
          AI-powered learning workspace
        </div>
      </div>

      <div className="mt-8 text-center max-w-5xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          Turn Any Video Into
          <span className="block bg-gradient-to-r from-brand-indigo via-brand-violet to-brand-pink bg-clip-text text-transparent">
            Smart Study Materials
          </span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-8">
          Upload lectures, tutorials, or educational videos and instantly
          generate summaries, flashcards, quizzes, and a searchable study library.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-indigo to-brand-violet px-8 py-4 font-semibold text-white shadow-xl shadow-brand-indigo/20 hover:scale-[1.02] transition-all"
          >
            Start Learning Free
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-semibold text-zinc-200 hover:bg-white/10 transition-all"
          >
            Log In
          </Link>
        </div>
      </div>

      {/* AI Workspace Mockup */}
      <div className="mt-20 relative">

        <div className="absolute inset-0 bg-gradient-to-r from-brand-indigo/20 via-brand-violet/20 to-brand-pink/20 blur-3xl" />

        <div className="relative rounded-[2rem] border border-white/10 bg-[#0D1220]/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl">

          <div className="flex items-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-6">

            <div className="rounded-3xl bg-white/5 p-5 border border-white/10">
              <p className="text-xs tracking-widest text-zinc-500 mb-4">
                VIDEO LIBRARY
              </p>

              <div className="space-y-3">
                <div className="rounded-2xl bg-brand-indigo/15 p-4 text-sm text-white border border-brand-indigo/20">
                  Machine Learning Basics
                </div>

                <div className="rounded-2xl bg-white/5 p-4 text-sm text-zinc-400">
                  Database Systems
                </div>

                <div className="rounded-2xl bg-white/5 p-4 text-sm text-zinc-400">
                  Data Structures
                </div>

                <div className="rounded-2xl bg-white/5 p-4 text-sm text-zinc-400">
                  Operating Systems
                </div>
              </div>
            </div>

            <div className="space-y-5">

              <div className="rounded-3xl border border-brand-indigo/20 bg-brand-indigo/10 p-6">
                <p className="text-xs tracking-widest text-brand-indigo mb-3">
                  AI SUMMARY
                </p>

                <p className="text-zinc-300 leading-7">
                  Machine learning enables systems to learn patterns from
                  data and improve predictions without explicit programming.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                  <p className="text-xs tracking-widest text-zinc-500 mb-3">
                    FLASHCARD
                  </p>

                  <p className="text-white font-medium">
                    What is supervised learning?
                  </p>

                  <p className="mt-4 text-zinc-400 text-sm">
                    Learning using labeled training data.
                  </p>
                </div>

                <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                  <p className="text-xs tracking-widest text-zinc-500 mb-3">
                    QUIZ SCORE
                  </p>

                  <p className="text-5xl font-bold bg-gradient-to-r from-brand-pink to-brand-violet bg-clip-text text-transparent">
                    92%
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

    {/* STATS */}

    <section className="py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="text-center">
          <div className="text-4xl font-bold">1 Min</div>
          <p className="text-zinc-500 mt-2">
            Processing Time
          </p>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold">24/7</div>
          <p className="text-zinc-500 mt-2">
            AI Assistance
          </p>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold">100%</div>
          <p className="text-zinc-500 mt-2">
            Cloud Access
          </p>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold">∞</div>
          <p className="text-zinc-500 mt-2">
            Study Sessions
          </p>
        </div>

      </div>
    </section>

    {/* FEATURES */}

    <section className="py-24">

      <div className="text-center mb-16">
        <p className="uppercase tracking-[0.3em] text-brand-indigo/70 text-sm">
          Features
        </p>

        <h2 className="mt-4 text-4xl md:text-5xl font-bold">
          Everything You Need To Learn Faster
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <Video className="w-8 h-8 text-brand-indigo mb-5" />
          <h3 className="text-2xl font-semibold">
            Video To Notes
          </h3>
          <p className="mt-4 text-zinc-400 leading-7">
            Instantly convert long lectures into concise study notes and key insights.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <BookOpen className="w-8 h-8 text-brand-pink mb-5" />
          <h3 className="text-2xl font-semibold">
            Flashcards
          </h3>
          <p className="mt-4 text-zinc-400">
            AI-generated flashcards for efficient revision.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <CheckCircle2 className="w-8 h-8 text-brand-violet mb-5" />
          <h3 className="text-2xl font-semibold">
            Smart Quizzes
          </h3>
          <p className="mt-4 text-zinc-400">
            Test understanding with automatic quiz generation.
          </p>
        </div>

        <div className="lg:col-span-2 rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <ShieldCheck className="w-8 h-8 text-brand-cyan mb-5" />
          <h3 className="text-2xl font-semibold">
            Personal Study Library
          </h3>
          <p className="mt-4 text-zinc-400">
            Save all notes, flashcards, quizzes and study progress in one place.
          </p>
        </div>

      </div>

    </section>

    {/* HOW IT WORKS */}

    <section className="py-20">

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold">
          Learn In Three Steps
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="text-center">
          <div className="text-6xl font-bold text-brand-indigo mb-4">
            01
          </div>
          <h3 className="text-xl font-semibold">
            Upload Video
          </h3>
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold text-brand-pink mb-4">
            02
          </div>
          <h3 className="text-xl font-semibold">
            AI Processes Content
          </h3>
        </div>

        <div className="text-center">
          <div className="text-6xl font-bold text-brand-cyan mb-4">
            03
          </div>
          <h3 className="text-xl font-semibold">
            Start Studying
          </h3>
        </div>

      </div>

    </section>

    {/* CTA */}

    <section className="pb-24">

      <div className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-brand-indigo/20 via-brand-violet/20 to-brand-pink/20 p-12 md:p-16 text-center">

        <Zap className="w-10 h-10 mx-auto text-brand-pink mb-6" />

        <h2 className="text-4xl md:text-5xl font-bold">
          Ready To Study Smarter?
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-zinc-300 text-lg">
          Transform educational videos into notes, flashcards and quizzes in seconds.
        </p>

        <Link
          to="/register"
          className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white text-black px-8 py-4 font-semibold hover:scale-[1.03] transition-all"
        >
          Get Started Free
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>

    </section>

  </div>
</div>


);
};

export default Home;
