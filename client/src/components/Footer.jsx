import { Github, Linkedin, Brain } from "lucide-react";

const Footer = () => {
const currentYear = new Date().getFullYear();

return ( <footer className="relative mt-20 border-t border-white/5 bg-bg-darker/50 backdrop-blur-xl"> <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-indigo/50 to-transparent" />

  <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">

    {/* Top Section */}
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">

      {/* Brand */}
      <div className="max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-violet shadow-lg shadow-brand-indigo/20">
            <Brain className="w-5 h-5 text-white" />
          </div>

          <h3 className="font-display text-xl font-bold text-white">
            EduMind
            <span className="text-brand-violet"> AI</span>
          </h3>
        </div>

        <p className="text-zinc-400 leading-relaxed text-sm">
          Transform educational videos into summaries,
          notes, flashcards and quizzes using AI-powered learning tools.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <a
          href="#"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          Features
        </a>

        <a
          href="#"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          Privacy
        </a>

        <a
          href="#"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          Terms
        </a>

        <a
          href="#"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          Support
        </a>
      </div>

      {/* Social */}
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/miyuranga-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-xl glass-panel glass-panel-hover flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <Github className="w-5 h-5" />
        </a>

        <a
          href="https://www.linkedin.com/in/miyuranga-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-xl glass-panel glass-panel-hover flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
    </div>

    {/* Divider */}
    <div className="border-t border-white/5 my-8" />

    {/* Bottom */}
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">

      <p className="text-zinc-500 text-center md:text-left">
        © {currentYear} EduMind AI. All rights reserved.
      </p>

      <div className="flex items-center gap-2 text-zinc-500">
        <span>Developed by</span>

        <span className="font-semibold bg-gradient-to-r from-brand-indigo to-brand-violet bg-clip-text text-transparent">
          Miyuranga
        </span>
      </div>
    </div>

  </div>
</footer>


);
};

export default Footer;
